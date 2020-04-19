import { Dispatch, useCallback, useReducer, useRef } from 'react';
import { getNextIndexFromCycle } from '../shared';

export type SelectorAction<TValue extends any> =
  | { type: 'Unknown' }
  | { type: 'InputChange'; value: string }
  | { type: 'Blur' }
  | { type: 'Focus' }
  | { type: 'MenuOpen' }
  | { type: 'MenuClose' }
  | { type: 'MenuToggle' }
  | { type: 'SetBusy'; isBusy: boolean; forInputValue: string | null }
  | { type: 'SetCurrentFocusedOption' }
  | { type: 'SetOptionFocusByOffset'; offset: number }
  | { type: 'SetOptionFocusByIndex'; index: number }
  | { type: 'SetOptionFocusToFirstOption' }
  | { type: 'SetOptionFocusToLastOption' }
  | { type: 'SetOptions'; options: TValue[]; forInputValue: string | null }
  | { type: 'Reset' }
  | { type: 'SetValue'; value: TValue | null }
  | { type: 'SetValueByIndex'; index: number };

export interface SelectorState<TValue extends any> {
  defaultValue: TValue | null;
  focusedIndex: number;
  inputValue: string;
  isBusy: boolean;
  isFocused: boolean;
  isOpen: boolean;
  options: any[];
  optionToString: (option: TValue) => string;
  valueToString: (option: TValue) => string;
  value: TValue | null;
  invokedBy: SelectorAction<TValue>;
}

interface InitSelectReducerOptions<TValue extends any> {
  defaultValue?: TValue;
  optionToString?: (option: TValue) => string;
  valueToString?: (option: TValue) => string;
  value?: TValue;
}

function initSelectorReducer({
  defaultValue = null,
  optionToString,
  valueToString,
  value = null,
}: InitSelectReducerOptions<any>): SelectorState<any> {
  const val = value || defaultValue;
  const optToString = optionToString || (option => `${option}`);

  return {
    defaultValue,
    focusedIndex: -1,
    inputValue: val == null ? '' : optToString(val),
    isBusy: false,
    isFocused: false,
    isOpen: false,
    options: [],
    optionToString: optToString,
    valueToString: valueToString || optToString,
    value: val,
    invokedBy: { type: 'Unknown' },
  };
}

function selectorReducer(
  state: SelectorState<any>,
  action: SelectorAction<any>,
): SelectorState<any> {
  let changes: Partial<SelectorState<any>> = {
    invokedBy: action,
  };

  // following are possible only if menu is open
  if (state.isOpen) {
    switch (action.type) {
      case 'SetOptionFocusByIndex': {
        const optionsSize = state.options.length;

        if (
          optionsSize > 0 &&
          action.index < optionsSize &&
          action.index >= 0
        ) {
          changes = { ...changes, focusedIndex: action.index };
        }
        break;
      }
      case 'SetOptionFocusByOffset': {
        const lastIndex = state.options.length - 1;

        changes = {
          ...changes,
          focusedIndex: getNextIndexFromCycle(
            state.focusedIndex,
            action.offset,
            lastIndex,
          ),
        };

        break;
      }
      case 'SetOptionFocusToFirstOption': {
        if (state.options.length > 0) {
          changes = { ...changes, focusedIndex: 0 };
        }
        break;
      }
      case 'SetOptionFocusToLastOption': {
        if (state.options.length > 0) {
          changes = { ...changes, focusedIndex: state.options.length - 1 };
        }
        break;
      }
    }
  }

  switch (action.type) {
    case 'Blur':
    case 'Focus': {
      changes = {
        ...changes,
        isFocused: action.type !== 'Blur',
      };
      break;
    }
    case 'InputChange': {
      changes = {
        ...changes,
        inputValue: action.value,
      };
      break;
    }
    case 'MenuToggle':
    case 'MenuClose':
    case 'MenuOpen': {
      changes = {
        ...changes,
        isOpen:
          action.type === 'MenuToggle'
            ? !state.isOpen
            : action.type === 'MenuOpen',
        focusedIndex: -1,
      };
      break;
    }
    case 'Reset': {
      changes = {
        ...changes,
        isBusy: false,
        isOpen: false,
        focusedIndex: -1,
        options: [],
        inputValue: state.defaultValue
          ? state.valueToString(state.defaultValue)
          : '',
        value: state.defaultValue,
      };
      break;
    }
    case 'SetBusy': {
      // turn off busy state only if input matches
      if (action.isBusy || action.forInputValue === state.inputValue) {
        changes = { ...changes, isBusy: action.isBusy };
      }

      break;
    }
    case 'SetOptions': {
      // set options only if input value matches
      if (action.forInputValue === state.inputValue) {
        changes = { ...changes, focusedIndex: -1, options: action.options };
      }

      break;
    }
    case 'SetCurrentFocusedOption': {
      if (
        state.focusedIndex > -1 &&
        state.options.length > state.focusedIndex
      ) {
        const value = state.options[state.focusedIndex];

        changes = { ...changes, inputValue: state.valueToString(value), value };
      }
      break;
    }
    case 'SetValueByIndex': {
      if (action.index >= 0 && state.options.length > action.index) {
        const value = state.options[action.index];

        changes = {
          ...changes,
          inputValue: state.valueToString(value),
          value,
        };
      }

      break;
    }
    case 'SetValue': {
      changes = {
        ...changes,
        inputValue:
          action.value == null ? '' : state.valueToString(action.value),
        value: action.value,
      };
      break;
    }
  }

  return {
    ...state,
    ...changes,
  };
}

export type SelectorReducerEnhancer<TValue extends any> = (
  currentState: SelectorState<TValue>,
  nextState: SelectorState<TValue>,
) => SelectorState<TValue>;

export type SelectorStateChangeListener<TValue extends any> = (
  previousState: SelectorState<TValue>,
  currentState: SelectorState<TValue>,
  dispatch: Dispatch<SelectorAction<TValue>>,
) => void;

export interface SelectorOptions<TValue extends any> {
  defaultValue?: TValue;
  enhanceReducer?: SelectorReducerEnhancer<TValue>;
  onChange?: (option: any | null) => void;
  onInputValueChange?: (inputValue: string) => void;
  onStateChange?: SelectorStateChangeListener<TValue>;
  optionToString?: (option: any) => string;
  value?: any;
  valueToString?: (option: any) => string;
}

export function useSelector<TValue extends any = string>({
  defaultValue,
  enhanceReducer,
  onInputValueChange,
  onChange,
  onStateChange,
  optionToString,
  value,
  valueToString,
}: SelectorOptions<TValue>): [
  SelectorState<TValue>,
  Dispatch<SelectorAction<TValue>>,
] {
  const reducer = useCallback(
    (
      state: SelectorState<TValue>,
      action: SelectorAction<TValue>,
    ): SelectorState<TValue> => {
      const nextState = selectorReducer(state, action);

      return enhanceReducer ? enhanceReducer(state, nextState) : nextState;
    },
    [enhanceReducer],
  );
  const [state, dispatch] = useReducer(
    reducer,
    { defaultValue, optionToString, value, valueToString },
    initSelectorReducer,
  );
  const previousState = useRef(state);
  const previousOuterValue = useRef(value);

  if (previousState.current !== state) {
    // call on state change if state has changed
    if (onStateChange) {
      onStateChange(previousState.current, state, dispatch);
    }

    // call onInputValueChange if inputValue changed
    if (previousState.current.inputValue !== state.inputValue) {
      if (onInputValueChange) {
        onInputValueChange(state.inputValue);
      }
    }

    // call onChange if value changed
    if (
      previousState.current.value !== state.value &&
      state.value !== value &&
      onChange
    ) {
      onChange(state.value);
    }

    previousState.current = state;
  } else if (previousOuterValue.current !== value) {
    // if outer value changed (controlled component), set the value to this value
    dispatch({ type: 'SetValue', value });
  }

  return [state, dispatch];
}
