/* eslint-disable react/no-array-index-key */
import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  createComponent,
  StyleProps,
} from '@byteclaw/visage-core';
import React, {
  ChangeEventHandler,
  useCallback,
  useRef,
  FocusEventHandler,
  MouseEventHandler,
  KeyboardEventHandler,
  Dispatch,
  RefObject,
  MouseEvent,
} from 'react';
import {
  SelectorOptions,
  SelectorReducerEnhancer,
  SelectorStateChangeListener,
  useSelector,
  SelectorAction,
} from './hooks/useSelector';
import {
  useDebouncedCallback,
  useHandlerRef,
  useStaticEffect,
  useUniqueId,
} from '../hooks';
import { scrollAriaSelectedElementToView } from './effects';
import { Menu, MenuItem } from './Menu';
import { TextInput } from './TextInput';
import { normalizeKeyboardEventKey } from './shared';

type RawTextInputProps = ExtractVisageComponentProps<typeof TextInput>;

interface TextInputProps
  extends Omit<RawTextInputProps, 'defaultValue' | 'onChange' | 'value'> {}

const optionId = (id: string, index: number): string | undefined => {
  return index === -1 ? undefined : `${id}-listbox-option-${index}`;
};

interface AutocompleteInputMenuProps extends StyleProps {
  focusedIndex: number;
  id: string;
  /**
   * A ref to TextInput wrapper, can be used as an anchor for Menu
   */
  inputContainerRef: RefObject<HTMLDivElement>;
  listboxId: string;
  onSelect: (optionIndex: number) => void;
  open: boolean;
  options: any[];
  optionToString: (option: any) => string;
}

const AutocompleteInputMenu = createComponent(
  markAsVisageComponent(
    ({
      focusedIndex,
      id,
      inputContainerRef,
      listboxId,
      open,
      options,
      optionToString,
      onSelect,
    }: AutocompleteInputMenuProps) => {
      const menuBaseRef = useRef(null);
      const onOptionClick = useHandlerRef((e: MouseEvent<HTMLLIElement>) => {
        onSelect(Number(e.currentTarget.dataset.optionIndex));
      });
      const onOptionMouseDown = useHandlerRef(
        (e: MouseEvent<HTMLLIElement>) => {
          // prevent changing body activeElement and blur on input
          e.preventDefault();
        },
      );

      // scroll focused item into view
      useStaticEffect(
        scrollAriaSelectedElementToView,
        menuBaseRef,
        focusedIndex,
      );

      return (
        <Menu
          anchor={inputContainerRef}
          baseRef={menuBaseRef}
          disableEvents
          keepAnchorWidth
          id={listboxId}
          open={open}
          role="listbox"
          tabIndex={-1}
        >
          {open
            ? options.map((option, index) => (
                <MenuItem
                  aria-selected={focusedIndex === index}
                  data-option-index={index}
                  id={optionId(id, index)}
                  key={optionId(id, index)}
                  role="option"
                  onClick={onOptionClick}
                  onMouseDown={onOptionMouseDown}
                >
                  {optionToString(option)}
                </MenuItem>
              ))
            : null}
        </Menu>
      );
    },
  ),
  {
    displayName: 'AutocompleteInputMenu',
  },
);

interface AutocompleteInputProps<TValue extends any>
  extends SelectorOptions<TValue>,
    StyleProps {
  debounceDelay?: number;
  expandOnClick?: boolean;
  id?: string;
  menu?: React.ComponentType<AutocompleteInputMenuProps>;
  options?: TValue[] | ((inputValue: string) => Promise<TValue[]>);
  /** Set focused option as value on blur */
  selectOnBlur?: boolean;
}

export function AutocompleteInput<TValue extends any = string>({
  $$variants,
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
  menu: DropdownMenu = AutocompleteInputMenu,
  readOnly,
  parentStyles,
  selectOnBlur,
  styles,
  value,
  valueToString,
  ...restProps
}: AutocompleteInputProps<TValue> & TextInputProps) {
  const id = useUniqueId(outerId, 'autocomplete');
  const listboxId = useUniqueId(null, 'listbox');

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
      (Array.isArray(options) ? Promise.resolve(options) : options(inputValue))
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
  const enhancedReducer: SelectorReducerEnhancer<TValue> = useHandlerRef(
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
  );
  const enhancedOnStateChange: SelectorStateChangeListener<TValue> = useHandlerRef(
    (previousState, currentState, dispatch) => {
      if (onStateChange) {
        onStateChange(previousState, currentState, dispatch);
      }

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
  const onInputBlur: FocusEventHandler<HTMLInputElement> = useHandlerRef(() => {
    if (selectOnBlur) {
      dispatch({ type: 'SetCurrentFocusedOption' });
    }

    dispatch({ type: 'MenuClose' });
  });
  const onInputChange: ChangeEventHandler<HTMLInputElement> = useHandlerRef(
    e => {
      dispatch({ type: 'InputChange', value: e.currentTarget.value });
    },
  );
  const onInputClick: MouseEventHandler<HTMLInputElement> = useHandlerRef(
    () => {
      if (expandOnClick && !state.isOpen) {
        dispatch({ type: 'MenuOpen' });
      }
    },
  );
  const onInputKeyDown: KeyboardEventHandler<HTMLInputElement> = useHandlerRef(
    e => {
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
  );
  const onOptionSelect = useHandlerRef((optionIndex: number) => {
    dispatch({ type: 'SetValueByIndex', index: optionIndex });
  });

  return (
    <React.Fragment>
      <TextInput
        {...restProps}
        aria-activedescendant={
          state.isOpen ? optionId(id, state.focusedIndex) : undefined
        }
        aria-autocomplete="list"
        aria-controls={listboxId}
        autoComplete="off"
        baseProps={{
          ...restProps.baseProps,
          'aria-busy': state.isBusy,
          'aria-expanded': state.isOpen,
          'aria-owns': listboxId,
          role: 'combobox',
          ref: inputContainerRef,
        }}
        id={id}
        onBlur={onInputBlur}
        onChange={onInputChange}
        onClick={onInputClick}
        onKeyDown={onInputKeyDown}
        readOnly={readOnly}
        parentStyles={parentStyles}
        styles={styles}
        value={state.inputValue}
        $$variants={$$variants}
      />
      <DropdownMenu
        focusedIndex={state.focusedIndex}
        inputContainerRef={inputContainerRef}
        id={id}
        listboxId={listboxId}
        onSelect={onOptionSelect}
        open={state.isOpen}
        options={state.options}
        optionToString={state.optionToString}
      />
    </React.Fragment>
  );
}

markAsVisageComponent(AutocompleteInput as any);
