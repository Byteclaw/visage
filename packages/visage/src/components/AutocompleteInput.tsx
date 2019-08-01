/* eslint jsx-a11y/role-has-required-aria-props:warn */
import React, {
  Fragment,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  FocusEventHandler,
  ChangeEventHandler,
  KeyboardEventHandler,
  MutableRefObject,
  Reducer,
} from 'react';
import { useDebouncedCallback } from '../hooks/useDebouncedCallback';
import { TextInput } from './TextInput';
import {
  AutocompleteActions,
  AutocompleteInputState,
  autocompleteInputReducer,
} from './autocompleteInputReducer';

interface BaseProps {
  'aria-expanded': boolean;
  'aria-haspopup': 'listbox';
  'aria-labelledby'?: string;
  'aria-owns': string;
  children: ReactNode;
  role: 'combobox';
}

interface ValueProps<TValue> {
  'aria-autocomplete': 'list';
  'aria-activedescendant'?: string;
  'aria-controls': string;
  'aria-disabled'?: boolean;
  'aria-readonly'?: boolean;
  disabled?: boolean;
  id: string;
  invalid?: boolean;
  onBlur: FocusEventHandler<any>;
  onFocus: FocusEventHandler<any>;
  onChange: ChangeEventHandler<any>;
  onKeyDown: KeyboardEventHandler<any>;
  ref: MutableRefObject<any>;
  readOnly?: boolean;
  value: TValue;
  [key: string]: any;
}

interface OptionProps<TOption> {
  'aria-selected': boolean;
  'data-ai-option': number;
  id: string;
  key: any;
  onMouseDown: (e: MouseEvent<any>) => void;
  option: TOption;
  role: 'option';
}

interface OptionsProps {
  children: ReactNode;
  id: string;
  role: 'listbox';
}

type BaseRenderer = (props: BaseProps) => ReactElement;
type OptionRenderer<TOption> = (props: OptionProps<TOption>) => ReactElement;
type OptionsRenderer = (props: OptionsProps) => ReactElement;
type ValueRenderer<TValue> = (props: ValueProps<TValue>) => ReactElement;

const defaultOptionRenderer: OptionRenderer<any> = ({
  option,
  ...restProps
}) => <li {...restProps}>{option}</li>;

const defaultOptionsRenderer: OptionsRenderer = props => <ul {...props} />;

const defaultValueRenderer: ValueRenderer<any> = props => (
  <TextInput autoComplete="off" {...props} type="text" />
);

const defaultBaseRenderer: BaseRenderer = props => <div {...props} />;

interface AutocompleteInputProps<TValue extends any> {
  defaultValue?: TValue;
  disabled?: boolean;
  id: string;
  invalid?: boolean;
  labelId?: string;
  mode?: 'automatic' | 'manual';
  onChange?: (value: TValue | undefined | string) => void;
  options:
    | TValue[]
    | ((search: TValue | undefined | string) => Promise<TValue[]>);
  readOnly?: boolean;
  renderBase?: BaseRenderer;
  renderOption?: OptionRenderer<TValue>;
  renderOptions?: OptionsRenderer;
  renderValue?: ValueRenderer<TValue | undefined | string>;
  value?: TValue;
}

export function AutocompleteInput<TValue = any>({
  defaultValue,
  disabled,
  id,
  invalid,
  labelId,
  mode = 'automatic',
  options,
  onChange,
  readOnly,
  renderBase = defaultBaseRenderer,
  renderOption = defaultOptionRenderer,
  renderOptions = defaultOptionsRenderer,
  renderValue = defaultValueRenderer,
  value,
}: AutocompleteInputProps<TValue>) {
  const listBoxId = `${id}-listbox`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const loadOptions = useCallback(
    async (search: string | undefined | TValue): Promise<TValue[]> => {
      if (Array.isArray(options)) {
        const term = typeof search === 'string' ? (search || '').trim() : '';

        if (!term) {
          return options;
        }

        return options.filter(option => {
          if (typeof option === 'string') {
            return option.toLowerCase().startsWith(term);
          }

          if (typeof option === 'object' && option !== null) {
            return Object.keys(option).find(
              key =>
                typeof (option as any)[key] === 'string' &&
                (option as any)[key].toLowerCase().startsWith(term),
            );
          }

          return false;
        });
      }

      return options(search);
    },
    [options],
  );
  const [state, dispatch] = useReducer<
    Reducer<
      AutocompleteInputState<TValue | undefined | string>,
      AutocompleteActions<TValue | undefined | string>
    >
  >(autocompleteInputReducer, {
    focused: false,
    expanded: false,
    selectedOption: null,
    options: Array.isArray(options) ? options : [],
    status: 'IDLE',
    value: defaultValue || value,
  });
  const outerValueRef = useRef(value);
  const previousState = useRef(state);
  const [notifyChange, cancelNotifyChange] = useDebouncedCallback(
    () => {
      dispatch({ type: 'CHANGE_DONE' });
    },
    300,
    [],
  );
  const onOptionMouseDown = useCallback((e: MouseEvent<HTMLElement>) => {
    e.preventDefault(); // keep focus on input

    dispatch({
      type: 'SELECT_OPTION',
      index: Number(e.currentTarget!.dataset.aiOption),
    });
  }, []);
  const onInnerChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: 'CHANGE', value: e.currentTarget.value });
      notifyChange();
    },
    [notifyChange],
  );
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const code = e.which || e.keyCode;

      if (readOnly || disabled) {
        return;
      }

      if (code === 38) {
        // up arrow
        dispatch({ type: 'FOCUS_PREVIOUS_OPTION' });
      } else if (code === 40) {
        // down arrow
        dispatch({ type: 'FOCUS_NEXT_OPTION' });
      } else if (code === 13) {
        // enter
        dispatch({ type: 'SELECT_OPTION' });
        e.preventDefault(); // prevent form submission
      } else if (code === 27) {
        // escape
        dispatch({ type: 'RESET', value: '' });
      }
    },
    [readOnly, disabled],
  );
  const onBlur = useCallback(() => {
    dispatch({ type: 'BLUR', mode });
  }, [mode]);
  const onFocus = useCallback(() => {
    if (!readOnly) {
      dispatch({ type: 'FOCUS' });
    }
  }, [readOnly]);

  // cancel debounced change on unmount
  useEffect(() => {
    return () => cancelNotifyChange();
  }, [cancelNotifyChange]);

  if (previousState.current !== state) {
    if (
      previousState.current.status !== state.status &&
      state.status === 'LOADING_OPTIONS'
    ) {
      loadOptions(state.value)
        .then(loadedOptions =>
          dispatch({ type: 'LOAD_OPTIONS_DONE', options: loadedOptions }),
        )
        .catch(() => dispatch({ type: 'LOAD_OPTIONS_FAILED' }));
    }

    if (state.value !== previousState.current.value && onChange) {
      onChange(state.value);
    }

    previousState.current = state;
  }

  // if outer value changes, reset input to outer value
  if (outerValueRef.current !== value) {
    outerValueRef.current = value;
    // reset input to outer value
    dispatch({ type: 'RESET', value });
  }

  return renderBase({
    'aria-expanded': state.expanded,
    'aria-haspopup': 'listbox',
    'aria-labelledby': labelId,
    'aria-owns': listBoxId,
    children: (
      <Fragment>
        {renderValue({
          'aria-autocomplete': 'list',
          'aria-activedescendant':
            state.selectedOption != null
              ? `${id}-item-${state.selectedOption}`
              : undefined,
          'aria-controls': listBoxId,
          'aria-disabled': disabled,
          'aria-multiline': false,
          'aria-readonly': readOnly,
          disabled,
          id,
          invalid,
          onBlur,
          onFocus,
          onChange: onInnerChange,
          onKeyDown,
          readOnly,
          ref: inputRef,
          value: state.value,
        })}
        {state.expanded && state.focused
          ? renderOptions({
              children: state.options.map((option, i) =>
                renderOption({
                  'aria-selected': state.selectedOption === i,
                  'data-ai-option': i,
                  id: `${id}-item-${id}`,
                  key: i,
                  onMouseDown: onOptionMouseDown,
                  option,
                  role: 'option',
                }),
              ),
              id: listBoxId,
              role: 'listbox',
            })
          : null}
      </Fragment>
    ),
    role: 'combobox',
  });
}
