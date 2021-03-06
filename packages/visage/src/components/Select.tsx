/* eslint-disable react/no-array-index-key */
import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  StyleProps,
} from '@byteclaw/visage-core';
import React, {
  ComponentType,
  forwardRef,
  useRef,
  FocusEventHandler,
  ChangeEventHandler,
  MouseEventHandler,
  KeyboardEventHandler,
  Dispatch,
  RefObject,
  MouseEvent,
  Ref,
  ReactElement,
} from 'react';
import {
  SelectorOptions,
  useSelector,
  SelectorStateChangeListener,
  SelectorAction,
  SelectorReducerEnhancer,
} from './hooks/useSelector';
import { UnfoldLessIcon, UnfoldMoreIcon } from '../assets';
import { createComponent } from '../core';
import { scrollAriaSelectedElementToView } from './effects';
import {
  useDebouncedCallback,
  useHandlerRef,
  useStaticEffect,
  useUniqueId,
  useCombinedRef,
  useComposedCallbackCreator,
} from '../hooks';
import { Menu, MenuItem } from './Menu';
import { SvgIcon } from './SvgIcon';
import { TextInput } from './TextInput';
import { normalizeKeyboardEventKey } from './shared';

const optionId = (id: string, index: number): string | undefined => {
  return index === -1 ? undefined : `${id}-listbox-option-${index}`;
};

export interface SelectMenuItemProps {
  'aria-selected': boolean;
  'data-option-index': number;
  id: string | undefined;
  role: string;
  onClick: (e: MouseEvent<any>) => void;
  onMouseDown: (e: MouseEvent<any>) => void;
}

export interface SelectMenuProps extends StyleProps {
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

interface CreateSelectMenuOptions {
  /**
   * Default props used on Menu component, some of them are forced by Visage
   * to make it work correctly with internal logic
   */
  defaultProps?: Partial<SelectMenuProps>;
  /**
   * Custom display name (default is AutocompleteInputMenu)
   *
   * You can use this name as a face to extend created Menu
   */
  displayName?: string;
  /**
   * Min height in pixels required to place menu in a given placement
   */
  minHeight?: number;
  /**
   * Custom menu item component
   */
  menuItem?: ComponentType<SelectMenuItemProps>;
}

/**
 * Creates Select menu component that can be used if you are happy
 * with default Menu
 */
export function createSelectMenu({
  minHeight = 150,
  menuItem: SelectMenuItem = MenuItem,
  ...restMenuOptions
}: CreateSelectMenuOptions = {}) {
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
      }: SelectMenuProps) => {
        // ref to popover base because we can scroll only scrollable div
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
            {...styleProps}
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
          >
            {open
              ? options.map((option, index) => (
                  <SelectMenuItem
                    aria-selected={focusedIndex === index}
                    data-option-index={index}
                    id={optionId(id, index)}
                    key={optionId(id, index)}
                    role="option"
                    onClick={onOptionClick}
                    onMouseDown={onOptionMouseDown}
                  >
                    {optionToString(option)}
                  </SelectMenuItem>
                ))
              : null}
          </Menu>
        );
      },
    ),
    {
      displayName: 'SelectMenu',
      ...restMenuOptions,
    },
  );
}

export interface SelectTogglerProps {
  // class name is provided by visage
  className?: string;
  onClick: () => void;
  open: boolean;
}

const SelectToggler = createComponent(
  ({ className, onClick, open }: SelectTogglerProps) => {
    return (
      <SvgIcon
        className={className}
        icon={open ? UnfoldLessIcon : UnfoldMoreIcon}
        onClick={onClick}
        role="button"
        tabIndex={-1}
      />
    );
  },
  {
    displayName: 'SelectToggler',
  },
);

type RawTextInputProps = ExtractVisageComponentProps<typeof TextInput>;

interface TextInputProps
  extends Omit<RawTextInputProps, 'defaultValue' | 'onChange' | 'value'> {}

export interface SelectProps<TValue extends any = string>
  extends SelectorOptions<TValue>,
    StyleProps,
    TextInputProps {
  debounceDelay?: number;
  id?: string;
  options?: TValue[] | ((inputValue: string) => Promise<TValue[]>);
  /**
   * Select menu component
   */
  menu?: React.ComponentType<SelectMenuProps>;
  searchable?: boolean;
  /**
   * Toggler component
   */
  toggler?: React.ComponentType<SelectTogglerProps>;
}

const defaultMenu = createSelectMenu();

declare function SelectComp<TValue extends any = string>(
  props: SelectProps<TValue>,
): ReactElement<any, any> | null;

export const Select: typeof SelectComp = markAsVisageComponent(
  forwardRef(
    (
      {
        $$variants,
        debounceDelay = 500,
        defaultValue,
        disabled,
        children,
        id: outerId,
        enhanceReducer,
        menu: DropdownMenu = defaultMenu,
        onBlur,
        onChange,
        onFocus,
        onInputValueChange,
        onMouseDown,
        onKeyDown,
        onKeyUp,
        onSelect,
        onStateChange,
        optionToString,
        options,
        parentStyles,
        readOnly,
        searchable,
        styles,
        toggler: Toggler = SelectToggler,
        value,
        valueToString,
        ...restProps
      }: SelectProps<any> & TextInputProps,
      ref: Ref<HTMLInputElement>,
    ) => {
      const id = useUniqueId(outerId, 'select');
      const listboxId = useUniqueId(null, 'listbox');
      // last arrow pressed is used to automatically focus an option if automatic mode is turn on
      // and is reset to null when options are loaded
      const lastArrowPressed = useRef<string | null>(null);
      // const menuBaseRef = useRef<HTMLDivElement>(null);
      const loadOptions = useHandlerRef(
        (inputValue: string, dispatch: Dispatch<SelectorAction<any>>) => {
          if (!options) {
            return;
          }

          // load options sets the input as busy
          dispatch({
            type: 'SetBusy',
            isBusy: true,
            forInputValue: inputValue,
          });

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

              if (lastArrowPressed.current === 'ArrowUp') {
                dispatch({ type: 'SetOptionFocusToLastOption' });
              } else {
                dispatch({ type: 'SetOptionFocusToFirstOption' });
              }

              // reset last arrow pressed
              lastArrowPressed.current = null;
            });
        },
      );
      const [debouncedLoadOptions, cancelDebouncedLoadOptions] =
        useDebouncedCallback(loadOptions, debounceDelay, [loadOptions]);
      const enhancedReducer: SelectorReducerEnhancer<any> = useHandlerRef(
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

          // if the action is MenuClose, reset input value if value is empty and reset options too
          if (
            nextState.invokedBy.type === 'MenuClose' &&
            nextState.value == null
          ) {
            // eslint-disable-next-line no-param-reassign
            nextState.inputValue = '';
            // eslint-disable-next-line no-param-reassign
            nextState.options = [];
          }

          return enhanceReducer
            ? enhanceReducer(currentState, nextState)
            : nextState;
        },
      );
      const enhancedOnStateChange: SelectorStateChangeListener<any> =
        useHandlerRef((previousState, currentState, dispatch) => {
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
        });
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
      const inputRef = useRef<HTMLInputElement>(null);
      const inputRefCallback = useCombinedRef<HTMLInputElement>(inputRef, ref);
      const inputContainerRef = useRef<HTMLInputElement | null>(null);
      const onToggleClick = useHandlerRef(() => {
        if (!readOnly || disabled) {
          dispatch({ type: 'MenuToggle' });

          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
      });
      const onInnerBlur: FocusEventHandler<HTMLInputElement> = useHandlerRef(
        () => {
          dispatch({ type: 'MenuClose' });
          dispatch({ type: 'Blur' });
        },
      );
      const onInnerFocus: FocusEventHandler<HTMLInputElement> = useHandlerRef(
        () => dispatch({ type: 'Focus' }),
      );
      const onInputChange: ChangeEventHandler<HTMLInputElement> = useHandlerRef(
        e => dispatch({ type: 'InputChange', value: e.currentTarget.value }),
      );
      const onInnerMouseDown: MouseEventHandler<HTMLInputElement> =
        useHandlerRef(e => {
          // react only on primary button
          if (e.button !== 0) {
            return;
          }

          if (!state.isOpen) {
            dispatch({ type: 'MenuOpen' });
            dispatch({ type: 'SetOptionFocusToFirstOption' });
          }
        });
      const onInnerKeyUp: KeyboardEventHandler<HTMLInputElement> =
        useHandlerRef(e => {
          const key = normalizeKeyboardEventKey(e);

          if (key === 'Escape') {
            e.preventDefault();

            // close menu if open, or reset the input
            if (state.isOpen) {
              dispatch({ type: 'MenuClose' });
            } else {
              dispatch({ type: 'Reset' });
            }
          }
        });
      const onInnerKeyDown: KeyboardEventHandler<HTMLInputElement> =
        useHandlerRef(e => {
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
            case 'Home': {
              e.preventDefault();
              dispatch({ type: 'SetOptionFocusToFirstOption' });
              break;
            }
            case ' ': {
              if (state.isOpen && !searchable) {
                e.preventDefault();
                dispatch({ type: 'SetCurrentFocusedOption' });
              }
              break;
            }
          }
        });
      const onBlurHandler = useComposedCallbackCreator(onBlur, onInnerBlur);
      const onFocusHandler = useComposedCallbackCreator(onFocus, onInnerFocus);
      const onKeyUpHandler = useComposedCallbackCreator(onKeyUp, onInnerKeyUp);
      const onKeyDownHandler = useComposedCallbackCreator(
        onKeyDown,
        onInnerKeyDown,
      );
      const onMouseDownHandler = useComposedCallbackCreator(
        onMouseDown,
        onInnerMouseDown,
      );
      const onOptionSelect = useHandlerRef((optionIndex: number) => {
        dispatch({ type: 'SetValueByIndex', index: optionIndex });
        dispatch({ type: 'MenuClose' });
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
              ref: inputContainerRef,
              role: 'combobox',
            }}
            disabled={disabled}
            id={id}
            readOnly={readOnly || !searchable}
            ref={inputRefCallback}
            onBlur={onBlurHandler}
            onChange={onInputChange}
            onFocus={onFocusHandler}
            onMouseDown={onMouseDownHandler}
            onKeyUp={onKeyUpHandler}
            onKeyDown={onKeyDownHandler}
            parentStyles={parentStyles}
            styles={styles}
            suffix={<Toggler open={state.isOpen} onClick={onToggleClick} />}
            $$variants={$$variants}
            value={state.inputValue}
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
  ),
);
