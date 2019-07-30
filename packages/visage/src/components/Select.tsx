/* eslint jsx-a11y/role-has-required-aria-props:warn */
import React, {
  Fragment,
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
  MouseEventHandler,
} from 'react';
import { useDebouncedCallback } from '../hooks/useDebouncedCallback';
import { TextInput } from './TextInput';
import { SelectState, selectReducer } from './selectReducer';

interface BaseProps {
  'aria-expanded': boolean;
  'aria-haspopup': 'listbox';
  'aria-labelledby'?: string;
  'aria-owns': string;
  children: ReactNode;
  role: 'combobox';
}

interface ValueProps {
  'aria-autocomplete': 'list';
  'aria-disabled'?: boolean;
  'aria-activedescendant'?: string;
  'aria-controls': string;
  'aria-readonly': boolean;
  'aria-placeholder'?: string;
  id: string;
  disabled?: boolean;
  invalid?: boolean;
  open: boolean;
  onBlur: FocusEventHandler<any>;
  onClick: MouseEventHandler<any>;
  onFocus: FocusEventHandler<any>;
  onChange: ChangeEventHandler<any>;
  onKeyDown: KeyboardEventHandler<any>;
  placeholder?: string;
  ref: MutableRefObject<any>;
  readOnly: boolean;
  value: any;
  [key: string]: any;
}

interface OptionProps {
  'aria-selected': boolean;
  'data-ai-option': number;
  id: string;
  key: any;
  onMouseDown: (e: MouseEvent<any>) => void;
  option: any;
  role: 'option';
}

interface OptionsProps {
  children: ReactNode;
  id: string;
  role: 'listbox';
}

type BaseRenderer = (props: BaseProps) => ReactNode;
type OptionRenderer = (props: OptionProps) => ReactNode;
type OptionsRenderer = (props: OptionsProps) => ReactNode;
type ValueRenderer = (props: ValueProps) => ReactNode;

const defaultOptionRenderer: OptionRenderer = ({ option, ...restProps }) => (
  <li {...restProps}>{option}</li>
);

const defaultOptionsRenderer: OptionsRenderer = props => <ul {...props} />;

const defaultValueRenderer: ValueRenderer = ({ open, ...restProps }) => (
  <TextInput
    {...restProps}
    append={<span>{open ? 'C' : 'O'}</span>}
    type="text"
  />
);

const defaultBaseRenderer: BaseRenderer = props => <div {...props} />;

interface SelectProps {
  defaultValue?: string;
  disabled?: boolean;
  id: string;
  invalid?: boolean;
  labelId?: string;
  filterable?: boolean;
  onChange?: (value: any) => void;
  options: any[] | ((search: string | null) => Promise<any[]>);
  placeholder?: string;
  /**
   * Select can be manipulated
   */
  readOnly?: boolean;
  renderBase?: BaseRenderer;
  renderOption?: OptionRenderer;
  renderOptions?: OptionsRenderer;
  renderValue?: ValueRenderer;
  value?: string;
}

export function Select({
  defaultValue,
  disabled,
  id,
  invalid,
  labelId,
  onChange,
  options,
  filterable,
  placeholder,
  readOnly,
  renderBase = defaultBaseRenderer,
  renderOption = defaultOptionRenderer,
  renderOptions = defaultOptionsRenderer,
  renderValue = defaultValueRenderer,
  value,
}: SelectProps) {
  const listBoxId = `${id}-listbox`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const loadOptions = useCallback(
    async (search: string | null): Promise<any[]> => {
      if (filterable) {
        if (Array.isArray(options)) {
          const term = (search || '').trim().toLowerCase();

          if (!search) {
            return options;
          }

          return options.filter(option => {
            if (typeof option === 'string') {
              return option.toLowerCase().startsWith(term);
            }

            if (typeof option === 'object' && option !== null) {
              return Object.keys(option).find(
                key =>
                  typeof option[key] === 'string' &&
                  option[key].toLowerCase().startsWith(term),
              );
            }

            return false;
          });
        }

        return options(search);
      }

      return Array.isArray(options) ? options : options('');
    },
    [options, filterable],
  );
  const [state, dispatch] = useReducer(selectReducer, {
    selectedValue: defaultValue || value || '',
    focused: false,
    expanded: false,
    selectedOption: null,
    options: Array.isArray(options) ? options : [],
    status: 'IDLE',
    value: defaultValue || value || '',
  });
  const outerValueRef = useRef(value);
  const previousState = useRef<SelectState>(state);
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

      if ((disabled, readOnly)) {
        return;
      }

      if (code === 38) {
        // up arrow
        dispatch({ type: 'FOCUS_PREVIOUS_OPTION' });

        e.preventDefault(); // prevent scroll
      } else if (code === 40) {
        // down arrow
        dispatch({ type: 'FOCUS_NEXT_OPTION' });

        e.preventDefault(); // prevent scroll
      } else if (code === 13) {
        // enter
        dispatch({ type: 'SELECT_OPTION' });
        e.preventDefault(); // prevent form submission
      } else if (code === 27) {
        // escape
        dispatch({ type: 'RESET', value: '' });
      }
    },
    [disabled, readOnly],
  );
  const onBlur = useCallback(() => {
    dispatch({ type: 'BLUR' });
  }, []);
  const onFocus = useCallback(() => {
    dispatch({ type: 'FOCUS', readOnly });
  }, [readOnly]);
  const onClick = useCallback(() => dispatch({ type: 'CLICK', readOnly }), [
    readOnly,
  ]);

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

    if (
      state.selectedValue !== previousState.current.selectedValue &&
      onChange
    ) {
      onChange(state.selectedValue);
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
          'aria-readonly': readOnly || !filterable,
          'aria-placeholder': placeholder,
          disabled,
          invalid,
          id,
          onBlur,
          onClick,
          onFocus,
          onChange: onInnerChange,
          onKeyDown,
          open: state.expanded && state.focused,
          placeholder,
          readOnly: readOnly || !filterable,
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
