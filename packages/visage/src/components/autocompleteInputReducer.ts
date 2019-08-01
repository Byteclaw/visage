export interface AutocompleteInputState<TValue> {
  focused: boolean;
  expanded: boolean;
  options: any[];
  selectedOption: number | undefined | null;
  status: 'IDLE' | 'LOADING_OPTIONS';
  value: TValue;
}

interface AutocompleteFocusAction {
  type: 'FOCUS';
}

interface AutocompleteBlurAction {
  type: 'BLUR';
  /**
   * If mode is automatic, will select selected option automatically on blur
   */
  mode: 'automatic' | 'manual';
}

interface AutocompleteResetAction<TValue> {
  type: 'RESET';
  value: TValue;
}

interface AutocompleteFocusPreviousOption {
  type: 'FOCUS_PREVIOUS_OPTION';
}

interface AutocompleteFocusNextOption {
  type: 'FOCUS_NEXT_OPTION';
}

interface AutocompleteSelectOption {
  type: 'SELECT_OPTION';
  index?: number;
}

interface AutocompleteChangeAction<TValue> {
  type: 'CHANGE';
  value: TValue;
}

interface AutocompleteChangeDoneAction {
  type: 'CHANGE_DONE';
}

interface AutocompleteLoadOptionsAction {
  type: 'LOAD_OPTIONS';
}

interface AutocompleteLoadOptionsDoneAction<TValue> {
  type: 'LOAD_OPTIONS_DONE';
  options: TValue[];
}

interface AutocompleteLoadOptionsFailedAction {
  type: 'LOAD_OPTIONS_FAILED';
}

export type AutocompleteActions<TValue> =
  | AutocompleteFocusAction
  | AutocompleteBlurAction
  | AutocompleteResetAction<TValue>
  | AutocompleteFocusPreviousOption
  | AutocompleteFocusNextOption
  | AutocompleteSelectOption
  | AutocompleteChangeAction<TValue>
  | AutocompleteChangeDoneAction
  | AutocompleteLoadOptionsAction
  | AutocompleteLoadOptionsDoneAction<TValue>
  | AutocompleteLoadOptionsFailedAction;

export function autocompleteInputReducer<TValue>(
  state: AutocompleteInputState<TValue>,
  action: AutocompleteActions<TValue>,
): AutocompleteInputState<TValue> {
  switch (action.type) {
    case 'FOCUS': {
      return {
        ...state,
        focused: true,
        // automatically load initial options on focus
        status: state.status === 'IDLE' ? 'LOADING_OPTIONS' : state.status,
      };
    }
    case 'BLUR': {
      return {
        ...state,
        focused: false,
        expanded: false,
        // automatically choose selected option if automatic mode
        value:
          action.mode === 'automatic' &&
          state.selectedOption != null &&
          state.options[state.selectedOption]
            ? state.options[state.selectedOption]
            : state.value,
      };
    }
    case 'RESET': {
      return {
        ...state,
        expanded: false,
        options: [],
        selectedOption: null,
        value: action.value,
      };
    }
    case 'CHANGE': {
      // change is valid only in idle state
      if (state.status !== 'IDLE') {
        return state;
      }

      return {
        ...state,
        value: action.value,
      };
    }
    case 'CHANGE_DONE': {
      // if value is not empty, load options
      if (state.status !== 'IDLE') {
        return state;
      }

      return {
        ...state,
        status: 'LOADING_OPTIONS',
      };
    }
    case 'FOCUS_NEXT_OPTION': {
      if (
        state.status !== 'IDLE' ||
        state.options.length === 0 ||
        state.selectedOption == null
      ) {
        return state;
      }

      return {
        ...state,
        selectedOption:
          state.selectedOption === state.options.length - 1
            ? 0
            : state.selectedOption + 1,
      };
    }
    case 'FOCUS_PREVIOUS_OPTION': {
      if (
        state.status !== 'IDLE' ||
        state.options.length === 0 ||
        state.selectedOption == null
      ) {
        return state;
      }

      return {
        ...state,
        selectedOption:
          state.selectedOption === 0
            ? state.options.length - 1
            : state.selectedOption - 1,
      };
    }
    case 'SELECT_OPTION': {
      if (state.status !== 'IDLE') {
        return state;
      }

      const index = action.index != null ? action.index : state.selectedOption;

      if (index == null || state.options[index] == null) {
        return state;
      }

      return {
        ...state,
        expanded: false,
        options: [], // reset options, they'll be loaded when users starts changing input
        selectedOption: null,
        value: state.options[index],
      };
    }
    case 'LOAD_OPTIONS': {
      if (state.status !== 'IDLE') {
        return state;
      }

      return {
        ...state,
        status: 'LOADING_OPTIONS',
      };
    }
    case 'LOAD_OPTIONS_DONE': {
      if (state.status !== 'LOADING_OPTIONS') {
        return state;
      }

      return {
        ...state,
        expanded: true,
        status: 'IDLE',
        options: action.options,
        selectedOption: action.options.length > 0 ? 0 : null,
      };
    }
    case 'LOAD_OPTIONS_FAILED': {
      if (state.status !== 'LOADING_OPTIONS') {
        return state;
      }

      return {
        ...state,
        status: 'IDLE',
        selectedOption: null,
      };
    }
    default:
      return state;
  }
}
