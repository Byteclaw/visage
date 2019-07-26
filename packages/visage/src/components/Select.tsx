import {
  markAsVisageComponent,
  ExtractVisageComponentProps,
} from '@byteclaw/visage-core';
import React, {
  KeyboardEvent,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useReducer,
  ChangeEvent,
  useState,
  FocusEvent,
  MouseEvent,
  FocusEventHandler,
  ChangeEventHandler,
  RefObject,
} from 'react';
import { createComponent } from '../core';
import { useDebouncedCallback } from '../hooks';
import { LayerManager, useLayerManager } from './LayerManager';
import { TextInput } from './TextInput';

const SelectBase = createComponent('div', {
  displayName: 'SelectBase',
  defaultStyles: {
    display: 'inline-flex',
    position: 'relative',
    outline: 'none',
  },
});

const SelectOptions = createComponent('div', {
  displayName: 'SelectOptions',
  defaultStyles: {
    position: 'absolute',
    width: '100%',
  },
});

interface SelectProps extends ExtractVisageComponentProps<typeof TextInput> {
  items: any[] | ((filterText?: string) => Promise<any[]>);
  onChange?: (item: any) => void;
  renderFilter?: (props: {
    ref: RefObject<any>;
    onBlur: FocusEventHandler;
    onFocus: FocusEventHandler;
    onChange: ChangeEventHandler;
    value?: string;
  }) => ReactNode;
  renderOption?: (
    item: any,
    key: any,
    currentValue: any,
    props: object,
  ) => ReactNode;
  renderPlaceholder?: (props: {
    focused: boolean;
    placeholder?: string;
    open: boolean;
    readOnly?: boolean;
  }) => ReactNode;
  renderValue?: (props: {
    focused: boolean;
    open: boolean;
    readOnly?: boolean;
    value: any;
  }) => ReactNode;
}

function defaultRenderFilter(props: {
  value?: string;
  onChange: (e: ChangeEvent<any>) => void;
}) {
  return <TextInput styles={{ width: '100%' }} {...props} />;
}

function defaultRenderPlaceholder({
  focused,
  open,
  ...restProps
}: {
  focused: boolean;
  open: boolean;
  placeholder?: string;
}) {
  return (
    <TextInput
      append={<span>{open ? 'C' : 'O'}</span>}
      data-focused={focused}
      role="presentation"
      tabIndex={-1}
      readOnly
      {...restProps}
    />
  );
}

function defaultRenderValue({
  focused,
  open,
  value,
}: {
  focused: boolean;
  open: boolean;
  value: any;
}) {
  return (
    <TextInput
      append={<span>{open ? 'C' : 'O'}</span>}
      data-focused={focused}
      role="presentation"
      defaultValue={value}
      tabIndex={-1}
      readOnly
    />
  );
}

function defaultRenderOption(
  item: string,
  key: any,
  selected: boolean,
  props: object,
) {
  return (
    <div key={key} {...props}>
      {item}
    </div>
  );
}

interface SelectState {
  itemsLoaded: boolean;
  focused: boolean;
  filterFocused: boolean;
  loading: boolean;
  open: boolean;
  items: any[];
  status: 'IDLE' | 'FILTERING' | 'LOADING_ITEMS';
  filter: string | undefined;
  value: any;
}

interface SelectBlurAction {
  type: 'BLUR';
}

interface SelectFocusAction {
  type: 'FOCUS';
}

interface SelectCloseAction {
  type: 'CLOSE';
}

interface SelectOpenAction {
  type: 'OPEN';
}

interface SelectFocusFilterAction {
  type: 'FOCUS_FILTER';
  filter?: any;
}

interface SelectBlurFilterAction {
  type: 'BLUR_FILTER';
}

interface SelectChangeAction {
  type: 'CHANGE';
  value: any;
}

interface SelectFilterAction {
  type: 'FILTER';
  value: string;
}

interface SelectFilterDoneAction {
  type: 'FILTER_DONE';
}

interface SelectItemsLoadingDoneAction {
  type: 'ITEMS_LOADING_DONE';
  items: any[];
}

interface SelectItemsLoadingFailedAction {
  type: 'ITEMS_LOADING_FAILED';
}

type SelectActions =
  | SelectFocusAction
  | SelectBlurAction
  | SelectFilterAction
  | SelectFilterDoneAction
  | SelectOpenAction
  | SelectCloseAction
  | SelectChangeAction
  | SelectItemsLoadingDoneAction
  | SelectItemsLoadingFailedAction
  | SelectFocusFilterAction
  | SelectBlurFilterAction;

function selectReducer(state: SelectState, action: SelectActions): SelectState {
  switch (action.type) {
    case 'BLUR': {
      return {
        ...state,
        open: false,
        focused: false,
      };
    }
    case 'FOCUS': {
      // if Select does not have itemsLoaded (it haven't loaded items yet), load them
      return {
        ...state,
        status: state.itemsLoaded ? state.status : 'LOADING_ITEMS',
        focused: true,
      };
    }
    case 'CLOSE': {
      return {
        ...state,
        open: false,
      };
    }
    case 'OPEN': {
      return {
        ...state,
        open: true,
      };
    }
    case 'BLUR_FILTER': {
      return {
        ...state,
        filterFocused: false,
      };
    }
    case 'FOCUS_FILTER': {
      return {
        ...state,
        filterFocused: true,
        filter: action.filter != null ? action.filter : state.filter,
      };
    }
    case 'CHANGE': {
      if (state.status !== 'IDLE') {
        return state;
      }

      return {
        ...state,
        filter: '',
        open: false,
        value: action.value,
      };
    }
    case 'FILTER': {
      if (state.status !== 'IDLE' && state.status !== 'FILTERING') {
        return state;
      }

      return {
        ...state,
        status: 'FILTERING',
        filter: action.value,
      };
    }
    case 'FILTER_DONE': {
      if (state.status !== 'FILTERING') {
        return state;
      }

      return {
        ...state,
        status: 'LOADING_ITEMS',
      };
    }
    case 'ITEMS_LOADING_DONE': {
      if (state.status !== 'LOADING_ITEMS') {
        return state;
      }

      return {
        ...state,
        itemsLoaded: true,
        status: 'IDLE',
        items: action.items,
      };
    }
    case 'ITEMS_LOADING_FAILED': {
      if (state.status !== 'LOADING_ITEMS') {
        return state;
      }

      return {
        ...state,
        status: 'IDLE',
      };
    }
    default:
      return state;
  }
}

export function Select({
  defaultValue,
  id,
  items,
  name,
  onChange,
  placeholder,
  readOnly,
  renderFilter = defaultRenderFilter,
  renderOption = defaultRenderOption,
  renderPlaceholder = defaultRenderPlaceholder,
  renderValue = defaultRenderValue,
  value: outerValue,
}: SelectProps) {
  const zIndex = useLayerManager();
  const hasFilter = !Array.isArray(items);
  const [state, dispatch] = useReducer(selectReducer, {
    itemsLoaded: !hasFilter,
    focused: false,
    filterFocused: false,
    filter: undefined,
    items: !hasFilter ? (items as any) : [],
    loading: false,
    open: false,
    status: 'IDLE',
    value: defaultValue || outerValue,
  });
  const valueRef = useRef(defaultValue || outerValue);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const firstOptionRef = useRef<HTMLElement | null>(null);
  const lastOptionRef = useRef<HTMLElement | null>(null);
  const selectedOptionRef = useRef<HTMLElement | null>(null);
  const focusedOptionRef = useRef<HTMLElement | null>(null);
  const previousState = useRef(state);
  const onFocus = useCallback(() => dispatch({ type: 'FOCUS' }), []);
  const [activeDescendantId, setActiveDescendantId] = useState<
    string | undefined
  >();
  const [notifyFilterFinished] = useDebouncedCallback(
    () => dispatch({ type: 'FILTER_DONE' }),
    300,
    [],
  );
  const onFilterInputBlur = useCallback(
    () => dispatch({ type: 'BLUR_FILTER' }),
    [],
  );
  const onFilterInputFocus = useCallback(
    () => dispatch({ type: 'FOCUS_FILTER' }),
    [],
  );
  const onFilterChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: 'FILTER', value: e.currentTarget.value });
      notifyFilterFinished();
    },
    [notifyFilterFinished],
  );
  const onBlurCapture = useCallback(
    (e: FocusEvent) => {
      if (state.open) {
        e.preventDefault();
      } else if (focusedOptionRef.current == null) {
        focusedOptionRef.current = null;
        dispatch({ type: 'BLUR' });
      }
    },
    [state.open],
  );
  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      if (e.button === 0 && !state.open && !readOnly) {
        dispatch({ type: 'OPEN' });
      }
    },
    [state.open, readOnly],
  );
  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (state.filterFocused || !hasFilter) {
        return;
      }

      // is character printable?
      // @TODO how to handle composition with accents? SHIFT + accent, C => Č
      if (e.key.length === 1) {
        dispatch({ type: 'FILTER', value: e.key });
        notifyFilterFinished();
      }
    },
    [state.filterFocused, notifyFilterFinished],
  );
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // blur
        dispatch({ type: 'CLOSE' });
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault(); // disable scroll

        // if filter is focused, filter the last option
        if (state.filterFocused && lastOptionRef.current) {
          lastOptionRef.current.focus();
        } else if (focusedOptionRef.current === firstOptionRef.current) {
          if (inputRef.current) {
            inputRef.current.focus();
          } else if (lastOptionRef.current) {
            lastOptionRef.current.focus();
          }
        } else if (
          focusedOptionRef.current &&
          focusedOptionRef.current.previousSibling
        ) {
          (focusedOptionRef.current.previousSibling as any).focus();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault(); // disable scroll

        // if filter is focused, filter the first option
        if (state.filterFocused) {
          if (firstOptionRef.current) {
            firstOptionRef.current.focus();
          }
        } else if (focusedOptionRef.current === lastOptionRef.current) {
          if (inputRef.current) {
            inputRef.current.focus();
          } else if (firstOptionRef.current) {
            firstOptionRef.current.focus();
          }
        } else if (
          focusedOptionRef.current &&
          focusedOptionRef.current.nextSibling
        ) {
          (focusedOptionRef.current.nextSibling as any).focus();
        }
      } else if (e.key === ' ' && !readOnly) {
        if (!state.open) {
          e.preventDefault();
          dispatch({ type: 'OPEN' });
        }

        // do nothing. space is handled by focused option
      } else if (e.key === 'Tab') {
        // prevent navigation with shift + tab and tab if select is open
        if (state.open) {
          e.preventDefault();
        }
      }
    },
    [state.filterFocused, state.open, readOnly],
  );

  // propagate change of value
  if (onChange) {
    if (valueRef.current !== state.value) {
      onChange(state.value);
    } else if (valueRef.current !== outerValue) {
      dispatch({ type: 'CHANGE', value: outerValue });
    }
  }

  // focus option management
  useLayoutEffect(() => {
    // if select is focused and not open, force focus
    if (state.focused && !state.open) {
      if (ref.current) {
        focusedOptionRef.current = null;
        ref.current.focus();
      }
    }

    // do not automatically select option if filter input is selected or there is already focused option
    if (state.filterFocused || focusedOptionRef.current) {
      return;
    }

    if (selectedOptionRef.current) {
      selectedOptionRef.current.focus();
    } else if (firstOptionRef.current) {
      firstOptionRef.current.focus();
    }
  }, [state.items, state.focused, state.open, state.filterFocused]);

  if (previousState.current !== state) {
    if (previousState.current.status !== state.status) {
      if (state.status === 'LOADING_ITEMS') {
        // start loading suggestions (this is possible only if items is a function)
        if (typeof items === 'function') {
          items(state.filter)
            .then(filteredItems =>
              dispatch({ type: 'ITEMS_LOADING_DONE', items: filteredItems }),
            )
            .catch(() => dispatch({ type: 'ITEMS_LOADING_FAILED' }));
        }
      } else if (state.status === 'FILTERING') {
        // focus filter input
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }

    // if we are not focused, clear out focusedOptionRef
    if (!state.focused && previousState.current.focused !== state.focused) {
      focusedOptionRef.current = null;
    }

    previousState.current = state;
  }

  return (
    <SelectBase
      aria-activedescendant={activeDescendantId || undefined}
      aria-readonly={readOnly}
      id={id}
      name={name}
      onBlurCapture={onBlurCapture}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onMouseUp={onMouseUp}
      ref={ref}
      role="listbox"
      tabIndex={0}
    >
      {state.value
        ? renderValue({
            focused: state.focused,
            open: state.open,
            readOnly,
            value: state.value,
          })
        : renderPlaceholder({
            focused: state.focused,
            open: state.open,
            readOnly,
            placeholder,
          })}
      {!state.open ? null : (
        <LayerManager>
          <SelectOptions
            styles={{
              top: ref.current!.clientHeight,
              zIndex,
            }}
          >
            {hasFilter
              ? renderFilter({
                  ref: inputRef,
                  onBlur: onFilterInputBlur,
                  onChange: onFilterChange,
                  onFocus: onFilterInputFocus,
                  value: state.filter || '',
                })
              : null}
            {!state.items || state.items.length === 0
              ? null
              : state.items.map((item, i, arr) => {
                  const selected = item === state.value;
                  const optionId = `${id || name}-${i}`;
                  const props = {
                    'aria-selected': selected,
                    tabIndex: -1,
                    role: 'option',
                    id: optionId,
                    onBlur: () => {
                      setActiveDescendantId(undefined);
                    },
                    onFocus: (e: FocusEvent) => {
                      focusedOptionRef.current = e.currentTarget as any;
                      setActiveDescendantId(id);
                    },
                    onClick: () => {
                      dispatch({ type: 'CHANGE', value: item });
                    },
                    onKeyDown: (e: KeyboardEvent) => {
                      if (e.key === ' ') {
                        e.preventDefault();
                        dispatch({ type: 'CHANGE', value: item });
                      }
                    },
                    ref: (el: HTMLElement) => {
                      if (i === 0) {
                        (firstOptionRef as any).current = el;
                      }

                      if (arr.length - 1 === i) {
                        (lastOptionRef as any).current = el;
                      }

                      if (selected) {
                        (selectedOptionRef as any).current = el;
                      }
                    },
                  };

                  return renderOption(item, optionId, selected, props);
                })}
          </SelectOptions>
        </LayerManager>
      )}
    </SelectBase>
  );
}

// @ts-ignore
markAsVisageComponent(Select);
