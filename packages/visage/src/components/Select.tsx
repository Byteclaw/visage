/* eslint-disable react/no-array-index-key */
import {
  ExtractVisageComponentProps,
  OmittableProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import React, {
  Fragment,
  useRef,
  FocusEventHandler,
  ChangeEventHandler,
  MouseEventHandler,
  KeyboardEventHandler,
  useMemo,
  useCallback,
  Dispatch,
} from 'react';
import {
  SelectorOptions,
  useSelector,
  SelectorStateChangeListener,
  SelectorAction,
  SelectorReducerEnhancer,
} from './hooks/useSelector';
import { UnfoldLessIcon, UnfoldMoreIcon } from '../assets';
import { useDebouncedCallback, useGenerateId } from '../hooks';
import { Menu, MenuItem } from './Menu';
import { SvgIcon } from './SvgIcon';
import { TextInput } from './TextInput';
import { normalizeKeyboardEventKey } from './shared';

const listboxId = (id: string): string => `${id}-listbox`;

const optionId = (id: string, index: number): string | undefined => {
  return index === -1 ? undefined : `${id}-listbox-option-${index}`;
};

interface InputEventHandlers {
  onBlur: FocusEventHandler<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClick: MouseEventHandler<HTMLInputElement>;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
}

interface OptionEventHandlers {
  onClick: MouseEventHandler<HTMLElement>;
  onMouseDown: MouseEventHandler<HTMLElement>;
}

type RawTextInputProps = ExtractVisageComponentProps<typeof TextInput>;

interface BaseTextInputProps
  extends Pick<
    RawTextInputProps,
    Exclude<keyof RawTextInputProps, 'defaultValue' | 'onChange' | 'value'>
  > {}

interface SelectProps<TValue extends any = string>
  extends BaseTextInputProps,
    SelectorOptions<TValue> {
  debounceDelay?: number;
  id?: string;
  menuProps?: OmittableProps<ExtractVisageComponentProps<typeof Menu>>;
  options?: (inputValue: string) => Promise<TValue[]>;
  searchable?: boolean;
}

export function Select<TValue extends any = string>({
  debounceDelay = 500,
  defaultValue,
  children,
  id: outerId,
  enhanceReducer,
  onChange,
  onInputValueChange,
  onSelect,
  onStateChange,
  optionToString,
  options,
  menuProps,
  readOnly,
  searchable,
  value,
  valueToString,
  ...restProps
}: SelectProps<TValue>) {
  const idTemplate = useGenerateId();
  const id = useMemo(() => {
    return outerId || `select-${idTemplate}`;
  }, [outerId, idTemplate]);
  // last arrow pressed is used to automatically focus an option if automatic mode is turn on
  // and is reset to null when options are loaded
  const lastArrowPressed = useRef<string | null>(null);
  const loadOptions = useCallback(
    (inputValue: string, dispatch: Dispatch<SelectorAction<TValue>>) => {
      if (!options) {
        return;
      }

      // open menu
      dispatch({ type: 'MenuOpen' });
      // load options sets the input as busy
      dispatch({ type: 'SetBusy', isBusy: true, forInputValue: inputValue });

      // and then on resolution sets options and not busy
      options(inputValue)
        .then(newOptions =>
          dispatch({
            type: 'SetOptions',
            options: newOptions,
            forInputValue: inputValue,
          }),
        )
        .finally(() => {
          dispatch({
            type: 'SetBusy',
            isBusy: false,
            forInputValue: inputValue,
          });

          if (lastArrowPressed.current === 'ArrowUp') {
            dispatch({ type: 'SetOptionFocusToLastOption' });
          } else {
            dispatch({ type: 'SetOptionFocusToFirstOption' });
          }

          // reset last arrow pressed
          lastArrowPressed.current = null;
        });
    },
    [options],
  );
  const [
    debouncedLoadOptions,
    cancelDebouncedLoadOptions,
  ] = useDebouncedCallback(loadOptions, debounceDelay, [loadOptions]);
  const enhancedReducer: SelectorReducerEnhancer<TValue> = useCallback(
    (currentState, nextState) => {
      // allow only to set value from outside if read only
      if (readOnly && nextState.invokedBy.type !== 'SetValue') {
        return currentState;
      }

      // if value changed, close the popup
      if (currentState.value !== nextState.value) {
        // eslint-disable-next-line no-param-reassign
        nextState.isOpen = false;
      }

      // if the action is MenuClose, reset input value if value is empty
      if (nextState.invokedBy.type === 'MenuClose' && nextState.value == null) {
        // eslint-disable-next-line no-param-reassign
        nextState.inputValue = '';
      }

      return enhanceReducer
        ? enhanceReducer(currentState, nextState)
        : nextState;
    },
    [enhanceReducer, readOnly],
  );
  const enhancedOnStateChange: SelectorStateChangeListener<
    TValue
  > = useCallback(
    (previousState, currentState, dispatch) => {
      // eslint-disable-next-line no-unused-expressions
      onStateChange && onStateChange(previousState, currentState, dispatch);

      // if input value has changed because of InputChanged action
      // load options debounced
      if (
        currentState.invokedBy.type === 'InputChange' &&
        previousState.inputValue !== currentState.inputValue
      ) {
        debouncedLoadOptions(currentState.inputValue, dispatch);
      }

      // if input has opened cancel debounced load options and load options directly
      // only if it was not open by InputChange action
      if (
        previousState.invokedBy.type !== 'InputChange' &&
        previousState.isOpen !== currentState.isOpen &&
        currentState.isOpen
      ) {
        cancelDebouncedLoadOptions();

        if (currentState.options.length === 0) {
          loadOptions(currentState.inputValue, dispatch);
        }
      }
    },
    [onStateChange],
  );
  const [state, dispatch] = useSelector({
    defaultValue,
    enhanceReducer: enhancedReducer,
    onChange,
    onInputValueChange,
    optionToString,
    onStateChange: enhancedOnStateChange,
    value,
    valueToString,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputContainerRef = useRef<HTMLInputElement | null>(null);
  const onToggleClick = useCallback(() => {
    if (!readOnly) {
      dispatch({ type: 'MenuToggle' });
      // eslint-disable-next-line no-unused-expressions
      inputRef.current && inputRef.current.focus();
    }
  }, [readOnly]);
  const inputEventHandlers: InputEventHandlers = useMemo(
    () => ({
      onBlur() {
        dispatch({ type: 'MenuClose' });
      },
      onChange(e) {
        dispatch({ type: 'InputChange', value: e.currentTarget.value });
      },
      onClick() {
        if (!state.isOpen) {
          dispatch({ type: 'MenuOpen' });
          dispatch({ type: 'SetOptionFocusToFirstOption' });
        }
      },
      onKeyDown(e) {
        const key = normalizeKeyboardEventKey(e);

        switch (key) {
          case 'ArrowUp': {
            e.preventDefault();
            lastArrowPressed.current = key;

            if (state.isOpen) {
              dispatch({ type: 'SetOptionFocusByOffset', offset: -1 });
            } else {
              dispatch({ type: 'MenuOpen' });
              dispatch({ type: 'SetOptionFocusToLastOption' });
            }
            break;
          }
          case 'ArrowDown': {
            e.preventDefault();
            lastArrowPressed.current = key;

            if (state.isOpen) {
              dispatch({ type: 'SetOptionFocusByOffset', offset: 1 });
            } else {
              dispatch({ type: 'MenuOpen' });
              dispatch({ type: 'SetOptionFocusToFirstOption' });
            }
            break;
          }
          case 'End': {
            e.preventDefault();
            dispatch({ type: 'SetOptionFocusToLastOption' });
            break;
          }
          case 'Enter': {
            e.preventDefault();
            dispatch({ type: 'SetCurrentFocusedOption' });
            break;
          }
          case 'Escape': {
            e.preventDefault();

            // close menu if open, or reset the input
            if (state.isOpen) {
              dispatch({ type: 'MenuClose' });
            } else {
              dispatch({ type: 'Reset' });
            }

            break;
          }
          case 'Home': {
            e.preventDefault();
            dispatch({ type: 'SetOptionFocusToFirstOption' });
            break;
          }
          case ' ': {
            if (state.isOpen) {
              e.preventDefault();
              dispatch({ type: 'SetCurrentFocusedOption' });
            }
            break;
          }
        }
      },
    }),
    [state.isOpen, searchable],
  );
  const optionEventHandlers: OptionEventHandlers = useMemo(
    () => ({
      onClick(e) {
        e.preventDefault();

        dispatch({
          type: 'SetValueByIndex',
          index: Number(e.currentTarget.dataset.optionIndex),
        });
        dispatch({ type: 'MenuClose' });
      },
      onMouseDown(e) {
        // prevent changing body activeElement and blur on input
        e.preventDefault();
      },
    }),
    [],
  );

  return (
    <Fragment>
      <TextInput
        {...restProps}
        aria-activedescendant={
          state.isOpen ? optionId(id, state.focusedIndex) : undefined
        }
        aria-autocomplete="list"
        aria-controls={listboxId(id)}
        autoComplete="off"
        baseProps={{
          ...restProps.baseProps,
          'aria-busy': state.isBusy,
          'aria-expanded': state.isOpen,
          'aria-owns': listboxId(id),
          ref: inputContainerRef,
          role: 'combobox',
        }}
        id={id}
        readOnly={readOnly || !searchable}
        ref={inputRef}
        suffix={
          state.isOpen ? (
            <SvgIcon
              aria-hidden
              icon={UnfoldLessIcon}
              onClick={readOnly ? onToggleClick : undefined}
              tabIndex={-1}
            />
          ) : (
            <SvgIcon
              aria-hidden
              icon={UnfoldMoreIcon}
              onClick={!readOnly ? onToggleClick : undefined}
              tabIndex={-1}
            />
          )
        }
        value={state.inputValue}
        {...inputEventHandlers}
      />
      <Menu
        anchor={inputContainerRef}
        disableEvents
        keepAnchorWidth
        id={listboxId(id)}
        open={state.isOpen}
        role="listbox"
        tabIndex={-1}
        {...menuProps}
      >
        {state.isOpen
          ? state.options.map((option, index) => (
              <MenuItem
                aria-selected={state.focusedIndex === index}
                data-option-index={index}
                id={optionId(id, index)}
                key={optionId(id, index)}
                role="option"
                {...optionEventHandlers}
              >
                {state.optionToString(option)}
              </MenuItem>
            ))
          : null}
      </Menu>
    </Fragment>
  );
}

markAsVisageComponent(Select as any);
