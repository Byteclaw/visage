import {
  markAsVisageComponent,
  ExtractVisageComponentProps,
} from '@byteclaw/visage-core';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  KeyboardEventHandler,
} from 'react';
import { UnfoldLessIcon, UnfoldMoreIcon } from '../assets';
import { useDebouncedCallback } from '../hooks';
import { initSelectReducer, selectReducer } from './reducers';
import { Menu, MenuItem } from './Menu';
import { SvgIcon } from './SvgIcon';
import { TextInput } from './TextInput';

interface SelectProps<TValue extends any = 'string'> {
  defaultValue?: TValue;
  id: string;
  options?: (searchValue: string) => Promise<any[]>;
  searchable?: boolean;
  value?: TValue;
}

const defaultOnLoadOptions = () => Promise.resolve([]);

export function Select<TValue extends any>({
  defaultValue,
  disabled,
  id,
  onBlur,
  onChange,
  options: onLoadOptions = defaultOnLoadOptions,
  onFocus,
  onKeyDown,
  readOnly,
  required,
  searchable = false,
  value,
  ...restProps
}: SelectProps<TValue> & ExtractVisageComponentProps<typeof TextInput>) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [state, dispatch] = useReducer(
    selectReducer,
    { id, value: value || defaultValue ? [value || defaultValue] : [] },
    initSelectReducer,
  );
  const previousStateRef = useRef(state);
  const previousOuterValueRef = useRef(value);
  const [loadOptions, cancelLoadOptions] = useDebouncedCallback(
    () => dispatch({ type: 'LoadingOptions' }),
    300,
    [],
  );
  const onInputBlur: FocusEventHandler<HTMLInputElement> = useCallback(
    e => {
      dispatch({ type: 'Blur' });

      if (onBlur) onBlur(e);
    },
    [onBlur],
  );
  const onInputFocus: FocusEventHandler<HTMLInputElement> = useCallback(
    e => {
      dispatch({ type: 'Focus' });

      if (onFocus) onFocus(e);
    },
    [onFocus],
  );
  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      dispatch({ type: 'ChangeSearchValue', value: e.currentTarget.value });

      if (searchable) {
        loadOptions();
      }
    },
    [loadOptions, searchable],
  );
  const onInputKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    e => {
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          dispatch({ type: 'ArrowDown' });
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          dispatch({ type: 'ArrowUp' });
          break;
        }
        case 'End': {
          e.preventDefault();
          dispatch({ type: 'End' });
          break;
        }
        case 'Escape': {
          e.preventDefault();
          dispatch({ type: 'Escape' });
          break;
        }
        case 'Home': {
          e.preventDefault();
          dispatch({ type: 'Home' });
          break;
        }
        case ' ': {
          // space works only if not searchable
          if (!searchable) {
            e.preventDefault();

            if (state.expanded) {
              dispatch({ type: 'ChooseFocusedOption' });
              dispatch({ type: 'Close' });
            } else {
              dispatch({ type: 'Open' });
            }
          }

          break;
        }
        case 'Enter': {
          e.preventDefault();

          if (state.expanded) {
            dispatch({ type: 'ChooseFocusedOption' });
            dispatch({ type: 'Close' });
          }

          break;
        }
      }

      if (onKeyDown) onKeyDown(e);
    },
    [onKeyDown, searchable, state.expanded],
  );
  const onToggleClick: MouseEventHandler<HTMLInputElement> = useCallback(() => {
    if (state.expanded) {
      dispatch({ type: 'Close' });
    } else {
      dispatch({ type: 'Open' });

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [state.expanded]);
  const onOptionMouseDown: MouseEventHandler<HTMLElement> = useCallback(e => {
    e.preventDefault();
    dispatch({
      type: 'ChooseOption',
      index: Number(e.currentTarget.dataset.optionIndex),
    });
    dispatch({ type: 'Close' });
  }, []);

  // cancel debounced load options on unmount
  useEffect(() => {
    return () => cancelLoadOptions();
  }, []);

  if (previousStateRef.current !== state) {
    if (previousStateRef.current.busy !== state.busy && state.busy) {
      // load options
      onLoadOptions(state.searchValue || '')
        .then(options => {
          dispatch({ type: 'LoadingOptionsDone', options });
        })
        .catch(e => {
          dispatch({ type: 'LoadingOptionsFailed', error: e });
        });
    } else if (onChange && previousStateRef.current.value !== state.value) {
      // onChange is called only if it differs from outside value
      if (previousOuterValueRef.current !== state.value[0]) {
        onChange(state.value[0]);
      }
    }

    previousStateRef.current = state;
  }

  // if value from outside has changed
  if (!state.busy && previousOuterValueRef.current !== value) {
    previousOuterValueRef.current = value;

    dispatch({ type: 'SetValue', value: [value] });
  }

  return (
    <Fragment>
      <TextInput
        aria-activedescendant={state.activeId ? state.activeId : undefined}
        aria-autocomplete="list"
        aria-controls={`${id}-listbox-popup`}
        autoComplete="off"
        baseProps={{
          'aria-busy': state.busy,
          'aria-expanded': state.expanded,
          'aria-haspopup': 'listbox',
          'aria-owns': `${id}-listbox-popup`,
          'aria-required': required,
          'aria-readonly': readOnly,
          role: 'combobox',
        }}
        disabled={disabled}
        id={id}
        onBlur={onInputBlur}
        onChange={onInputChange}
        onClick={disabled ? undefined : onToggleClick}
        onFocus={onInputFocus}
        onKeyDown={onInputKeyDown}
        ref={inputRef}
        readOnly={readOnly || !searchable}
        suffix={
          state.expanded ? (
            <SvgIcon
              aria-hidden
              icon={UnfoldLessIcon}
              onClick={onToggleClick}
              tabIndex={-1}
            />
          ) : (
            <SvgIcon
              aria-hidden
              icon={UnfoldMoreIcon}
              onClick={onToggleClick}
              tabIndex={-1}
            />
          )
        }
        {...restProps}
        value={
          state.searchValue == null ? state.value[0] || '' : state.searchValue
        }
      />
      <Menu
        anchor={inputRef}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        disableEvents
        open={state.expanded}
        id={`${id}-listbox-popup`}
        role="listbox"
        tabIndex={-1}
      >
        {state.options.map(option => {
          return (
            <MenuItem
              aria-selected={
                state.value.includes(option.value) ||
                state.focusedOption === option.index
              }
              data-option-index={option.index}
              id={option.id}
              key={option.id}
              onMouseDown={onOptionMouseDown}
              role="option"
              tabIndex={-1}
            >
              {option.value}
            </MenuItem>
          );
        })}
      </Menu>
    </Fragment>
  );
}

markAsVisageComponent(Select as any);
