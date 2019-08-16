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
import { useDebouncedCallback } from '../hooks';
import { initAutocompleteReducer, autocompleteReducer } from './reducers';
import { Menu, MenuItem } from './Menu';
import { TextInput } from './TextInput';

interface BaseAutocompleteInputProps
  extends ExtractVisageComponentProps<typeof TextInput> {
  onChange?: any;
}

interface AutocompleteInputProps extends BaseAutocompleteInputProps {
  defaultValue?: string;
  expandOnClick?: boolean;
  id: string;
  onChange?: (value: string) => void;
  options?: (value: string) => Promise<any[]>;
  value?: string;
}

const defaultOnLoadOptions = () => Promise.resolve([]);

export function AutocompleteInput({
  defaultValue,
  disabled,
  expandOnClick,
  id,
  onBlur,
  onChange,
  onClick,
  options: onLoadOptions = defaultOnLoadOptions,
  onFocus,
  onKeyDown,
  readOnly,
  required,
  value,
  ...restProps
}: AutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [state, dispatch] = useReducer(
    autocompleteReducer,
    { id, value: value || defaultValue ? value || defaultValue : '' },
    initAutocompleteReducer,
  );
  const previousStateRef = useRef(state);
  const previousOuterValueRef = useRef(value);
  const [loadOptions, cancelLoadOptions] = useDebouncedCallback(
    () => {
      dispatch({ type: 'Open' });
      dispatch({ type: 'LoadingOptions' });
    },
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
  const onInputClick: MouseEventHandler<HTMLInputElement> = useCallback(
    e => {
      if (onClick) onClick(e);

      if (expandOnClick && !readOnly && !disabled) dispatch({ type: 'Open' });
    },
    [expandOnClick, readOnly, disabled, onClick],
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
      if (readOnly) {
        return;
      }

      dispatch({ type: 'SetValue', value: e.currentTarget.value });

      loadOptions();
    },
    [readOnly, loadOptions, onChange],
  );
  const onInputKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    e => {
      if (!readOnly) {
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
          case 'Enter': {
            e.preventDefault();

            if (state.expanded) {
              dispatch({ type: 'ChooseFocusedOption' });
              dispatch({ type: 'Close' });
            }

            break;
          }
        }
      }

      if (onKeyDown) onKeyDown(e);
    },
    [onKeyDown, readOnly, state.expanded],
  );
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
      onLoadOptions(state.value)
        .then(options => {
          dispatch({ type: 'LoadingOptionsDone', options });
        })
        .catch(e => {
          dispatch({ type: 'LoadingOptionsFailed', error: e });
        });
    } else if (
      !readOnly &&
      onChange &&
      previousStateRef.current.value !== state.value &&
      previousOuterValueRef.current !== state.value
    ) {
      onChange(state.value);
    }

    previousStateRef.current = state;
  }

  // if value from outside has changed
  if (!state.busy && previousOuterValueRef.current !== value) {
    previousOuterValueRef.current = value;

    dispatch({ type: 'SetValue', value: value || '' });
  }

  return (
    <Fragment>
      <TextInput
        aria-activedescendant={state.activeId ? state.activeId : undefined}
        aria-autocomplete="list"
        aria-controls={`${id}-listbox-popup`}
        autoComplete="none"
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
        onClick={onInputClick}
        onFocus={onInputFocus}
        onKeyDown={onInputKeyDown}
        ref={inputRef}
        readOnly={readOnly}
        {...restProps}
        value={state.value}
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
              aria-selected={state.focusedOption === option.index}
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

markAsVisageComponent(AutocompleteInput as any);
