/* eslint-disable react/no-array-index-key */
import {
  ExtractVisageComponentProps,
  OmittableProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import React, {
  ChangeEventHandler,
  Fragment,
  useCallback,
  useMemo,
  useRef,
  FocusEventHandler,
  MouseEventHandler,
  KeyboardEventHandler,
  Dispatch,
} from 'react';
import {
  SelectorOptions,
  SelectorReducerEnhancer,
  SelectorStateChangeListener,
  useSelector,
  SelectorAction,
} from './hooks/useSelector';
import { useGenerateId, useDebouncedCallback } from '../hooks';
import { Menu, MenuItem } from './Menu';
import { TextInput } from './TextInput';

import { normalizeKeyboardEventKey } from './shared';

type RawTextInputProps = ExtractVisageComponentProps<typeof TextInput>;

interface BaseTextInputProps
  extends Pick<
    RawTextInputProps,
    Exclude<keyof RawTextInputProps, 'defaultValue' | 'onChange' | 'value'>
  > {}

const listboxId = (id: string): string => `${id}-listbox`;

const optionId = (id: string, index: number): string | undefined => {
  return index === -1 ? undefined : `${id}-listbox-option-${index}`;
};

interface AutocompleteInputProps<TValue extends any>
  extends BaseTextInputProps,
    SelectorOptions<TValue> {
  debounceDelay?: number;
  expandOnClick?: boolean;
  id?: string;
  menuProps?: OmittableProps<ExtractVisageComponentProps<typeof Menu>>;
  options?: (inputValue: string) => Promise<TValue[]>;
  /** Set focused option as value on blur */
  selectOnBlur?: boolean;
}

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

export function AutocompleteInput<TValue extends any = string>({
  debounceDelay = 500,
  defaultValue,
  enhanceReducer,
  expandOnClick,
  id: outerId,
  onChange,
  onInputValueChange,
  onStateChange,
  options,
  optionToString,
  menuProps,
  readOnly,
  selectOnBlur,
  value,
  valueToString,
  ...restProps
}: AutocompleteInputProps<TValue>) {
  const idTemplate = useGenerateId();
  const id = useMemo(() => {
    return `autocomplete-${outerId || idTemplate}`;
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
          // automatic mode
          if (selectOnBlur) {
            if (lastArrowPressed.current === 'ArrowUp') {
              dispatch({ type: 'SetOptionFocusToLastOption' });
            } else {
              dispatch({ type: 'SetOptionFocusToFirstOption' });
            }
          }

          // reset last arrow pressed
          lastArrowPressed.current = null;
        });
    },
    [options, selectOnBlur],
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
    [onStateChange, selectOnBlur],
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
  const inputContainerRef = useRef<HTMLDivElement | null>(null);
  const inputEventHandlers: InputEventHandlers = useMemo(
    () => ({
      onBlur() {
        if (selectOnBlur) {
          dispatch({ type: 'SetCurrentFocusedOption' });
        }

        dispatch({ type: 'MenuClose' });
      },
      onChange(e) {
        dispatch({ type: 'InputChange', value: e.currentTarget.value });
      },
      onClick() {
        if (expandOnClick && !state.isOpen) {
          dispatch({ type: 'MenuOpen' });
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
        }
      },
    }),
    [state.isOpen, expandOnClick, selectOnBlur],
  );
  const optionEventHandlers: OptionEventHandlers = useMemo(
    () => ({
      onClick(e) {
        e.preventDefault();

        dispatch({
          type: 'SetValueByIndex',
          index: Number(e.currentTarget.dataset.optionIndex),
        });
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
          role: 'combobox',
          ref: inputContainerRef,
        }}
        id={id}
        {...inputEventHandlers}
        readOnly={readOnly}
        value={state.inputValue}
      />
      <Menu
        anchor={inputContainerRef}
        disableEvents
        id={listboxId(id)}
        keepAnchorWidth
        open={state.isOpen}
        role="listbox"
        tabIndex={-1}
        {...menuProps}
      >
        {state.isOpen
          ? state.options.map((option, index) => (
              <MenuItem
                aria-selected={index === state.focusedIndex}
                data-option-index={index}
                key={optionId(id, index)}
                id={optionId(id, index)}
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

markAsVisageComponent(AutocompleteInput as any);
