/* eslint-disable react/no-array-index-key */
import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  createComponent,
  StyleProps,
} from '@byteclaw/visage-core';
import React, {
  ChangeEventHandler,
  ComponentType,
  useRef,
  FocusEventHandler,
  MouseEventHandler,
  KeyboardEventHandler,
  Dispatch,
  RefObject,
  MouseEvent,
  ReactElement,
  forwardRef,
  Ref,
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
  useComposedCallbackCreator,
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

export interface AutocompleteInputMenuProps extends StyleProps {
  focusedIndex: number;
  id: string;
  /**
   * A ref to TextInput wrapper, can be used as an anchor for Menu
   */
  inputContainerRef: RefObject<HTMLDivElement>;
  listboxId: string;
  menuProps?: ExtractVisageComponentProps<typeof Menu>;
  onSelect: (optionIndex: number) => void;
  open: boolean;
  options: any[];
  optionToString: (option: any) => string;
}

export interface AutocompleteInputMenuItemProps {
  'aria-selected': boolean;
  'data-option-index': number;
  id: string | undefined;
  role: string;
  onClick: (e: MouseEvent<any>) => void;
  onMouseDown: (e: MouseEvent<any>) => void;
}

interface CreateAutocompleteInputMenuOptions {
  /**
   * Default props used on Menu component, some of them are forced by Visage
   * to make it work correctly with internal logic
   */
  defaultProps?: Partial<AutocompleteInputMenuProps>;
  /**
   * Custom display name (default is AutocompleteInputMenu)
   *
   * You can use this name as a face to extend created Menu
   */
  displayName?: string;
  /**
   * Min height in pixels required to place menu in a given position
   */
  minHeight?: number;
  /**
   * Custom menu item component
   */
  menuItem?: ComponentType<AutocompleteInputMenuItemProps>;
}

/**
 * Creates AutocompleteInput menu component that can be used if you are happy
 * with default Menu
 */
export function createAutocompleteInputMenu({
  minHeight = 150,
  menuItem: AutocompleteMenuItem = MenuItem,
  ...restMenuOptions
}: CreateAutocompleteInputMenuOptions = {}) {
  return createComponent(
    markAsVisageComponent(
      ({
        focusedIndex,
        id,
        inputContainerRef,
        listboxId,
        menuProps,
        open,
        options,
        optionToString,
        onSelect,
        ...styleProps
      }: AutocompleteInputMenuProps) => {
        const popoverRef = useRef(null);
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
          popoverRef,
          focusedIndex,
        );

        return (
          <Menu
            {...menuProps}
            anchor={inputContainerRef}
            disableEvents
            keepAnchorWidth
            id={listboxId}
            open={open}
            popoverProps={{
              minHeight,
              ...menuProps?.popoverProps,
              popoverRef,
            }}
            role="listbox"
            tabIndex={-1}
            {...styleProps}
          >
            {open
              ? options.map((option, index) => (
                  <AutocompleteMenuItem
                    aria-selected={focusedIndex === index}
                    data-option-index={index}
                    id={optionId(id, index)}
                    key={optionId(id, index)}
                    role="option"
                    onClick={onOptionClick}
                    onMouseDown={onOptionMouseDown}
                  >
                    {optionToString(option)}
                  </AutocompleteMenuItem>
                ))
              : null}
          </Menu>
        );
      },
    ),
    {
      displayName: 'AutocompleteInputMenu',
      ...restMenuOptions,
    },
  );
}

export interface AutocompleteInputProps<TValue extends any>
  extends SelectorOptions<TValue>,
    StyleProps,
    TextInputProps {
  debounceDelay?: number;
  expandOnClick?: boolean;
  id?: string;
  menu?: React.ComponentType<AutocompleteInputMenuProps>;
  options?: TValue[] | ((inputValue: string) => Promise<TValue[]>);
  /** Set focused option as value on blur */
  selectOnBlur?: boolean;
}

const defaultMenu = createAutocompleteInputMenu();

declare function AutocompleteInputComp<TValue extends any = string>(
  props: AutocompleteInputProps<TValue>,
): ReactElement<any, any> | null;

export const AutocompleteInput: typeof AutocompleteInputComp = forwardRef(
  (
    {
      $$variants,
      debounceDelay = 500,
      defaultValue,
      enhanceReducer,
      expandOnClick,
      id: outerId,
      onBlur,
      onChange,
      onFocus,
      onInputValueChange,
      onKeyDown,
      onMouseDown,
      onStateChange,
      options,
      optionToString,
      menu: DropdownMenu = defaultMenu,
      readOnly,
      parentStyles,
      selectOnBlur,
      styles,
      value,
      valueToString,
      ...restProps
    }: AutocompleteInputProps<any> & TextInputProps,
    ref: Ref<HTMLInputElement>,
  ) => {
    const id = useUniqueId(outerId, 'autocomplete');
    const listboxId = useUniqueId(null, 'listbox');

    // last arrow pressed is used to automatically focus an option if automatic mode is turn on
    // and is reset to null when options are loaded
    const lastArrowPressed = useRef<string | null>(null);
    const loadOptions = useHandlerRef(
      (inputValue: string, dispatch: Dispatch<SelectorAction<any>>) => {
        if (!options) {
          return;
        }

        // open menu only if is input focused
        dispatch({ type: 'MenuOpen' });
        // load options sets the input as busy
        dispatch({ type: 'SetBusy', isBusy: true, forInputValue: inputValue });

        // and then on resolution sets options and not busy
        (Array.isArray(options)
          ? Promise.resolve(options)
          : options(inputValue)
        )
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
    );
    const [
      debouncedLoadOptions,
      cancelDebouncedLoadOptions,
    ] = useDebouncedCallback(loadOptions, debounceDelay, [loadOptions]);
    const enhancedReducer: SelectorReducerEnhancer<any> = useHandlerRef(
      (currentState, nextState) => {
        // allow to open only focused input or expand on click input
        if (
          nextState.invokedBy.type === 'MenuOpen' &&
          !nextState.isFocused &&
          !expandOnClick
        ) {
          return currentState;
        }

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
    const enhancedOnStateChange: SelectorStateChangeListener<any> = useHandlerRef(
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
    const onInnerBlur: FocusEventHandler<HTMLInputElement> = useHandlerRef(
      () => {
        if (selectOnBlur) {
          dispatch({ type: 'SetCurrentFocusedOption' });
        }

        dispatch({ type: 'MenuClose' });
        dispatch({ type: 'Blur' });
      },
    );
    const onInnerFocus: FocusEventHandler<HTMLInputElement> = useHandlerRef(
      () => dispatch({ type: 'Focus' }),
    );
    const onInputChange: ChangeEventHandler<HTMLInputElement> = useHandlerRef(
      e => {
        dispatch({ type: 'InputChange', value: e.currentTarget.value });
      },
    );
    const onInnerMouseDown: MouseEventHandler<HTMLInputElement> = useHandlerRef(
      e => {
        // react only on primary button
        if (e.button !== 0) {
          return;
        }

        if (expandOnClick && !state.isOpen) {
          dispatch({ type: 'MenuOpen' });
        }
      },
    );
    const onBlurHandler = useComposedCallbackCreator(onBlur, onInnerBlur);
    const onFocusHandler = useComposedCallbackCreator(onFocus, onInnerFocus);
    const onMouseDownHandler = useComposedCallbackCreator(
      onMouseDown,
      onInnerMouseDown,
    );
    const onInnerKeyDown: KeyboardEventHandler<HTMLInputElement> = useHandlerRef(
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
    const onKeyDownHandler = useComposedCallbackCreator(
      onKeyDown,
      onInnerKeyDown,
    );
    const onOptionSelect = useHandlerRef((optionIndex: number) => {
      dispatch({ type: 'SetValueByIndex', index: optionIndex });
    });

    return (
      <>
        <TextInput
          autoCorrect="off"
          autoCapitalize="none"
          autoComplete="new-password"
          spellCheck={false}
          {...restProps}
          aria-activedescendant={
            state.isOpen ? optionId(id, state.focusedIndex) : undefined
          }
          aria-autocomplete="list"
          aria-controls={listboxId}
          baseProps={{
            ...restProps.baseProps,
            'aria-busy': state.isBusy,
            'aria-expanded': state.isOpen,
            'aria-owns': listboxId,
            role: 'combobox',
            ref: inputContainerRef,
          }}
          id={id}
          onBlur={onBlurHandler}
          onChange={onInputChange}
          onFocus={onFocusHandler}
          onMouseDown={onMouseDownHandler}
          onKeyDown={onKeyDownHandler}
          readOnly={readOnly}
          parentStyles={parentStyles}
          ref={ref}
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
      </>
    );
  },
) as any;

markAsVisageComponent(AutocompleteInput as any);
