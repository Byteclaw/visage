export interface SelectState {
  focused: boolean;
  expanded: boolean;
  options: any[];
  selectedOption: number | undefined | null;
  selectedValue: any;
  status: 'IDLE' | 'LOADING_OPTIONS';
  value: string;
}

interface SelectFocusAction {
  type: 'FOCUS';
  /**
   * If select is read only, we can't load options because we can't manipulate it
   */
  readOnly?: boolean;
}

interface SelectClickAction {
  type: 'CLICK';
  /**
   * If select is read only, we can't load options because we can't manipulate it
   */
  readOnly?: boolean;
}

interface SelectBlurAction {
  type: 'BLUR';
}

interface SelectResetAction {
  type: 'RESET';
  value: any;
}

interface SelectFocusPreviousOption {
  type: 'FOCUS_PREVIOUS_OPTION';
}

interface SelectFocusNextOption {
  type: 'FOCUS_NEXT_OPTION';
}

interface SelectSelectOption {
  type: 'SELECT_OPTION';
  index?: number;
}

interface SelectChangeAction {
  type: 'CHANGE';
  value: string;
}

interface SelectChangeDoneAction {
  type: 'CHANGE_DONE';
}

interface SelectLoadOptionsAction {
  type: 'LOAD_OPTIONS';
}

interface SelectLoadOptionsDoneAction {
  type: 'LOAD_OPTIONS_DONE';
  options: any[];
}

interface SelectLoadOptionsFailedAction {
  type: 'LOAD_OPTIONS_FAILED';
}

export type SelectActions =
  | SelectFocusAction
  | SelectClickAction
  | SelectBlurAction
  | SelectResetAction
  | SelectFocusPreviousOption
  | SelectFocusNextOption
  | SelectSelectOption
  | SelectChangeAction
  | SelectChangeDoneAction
  | SelectLoadOptionsAction
  | SelectLoadOptionsDoneAction
  | SelectLoadOptionsFailedAction;

export function selectReducer(
  state: SelectState,
  action: SelectActions,
): SelectState {
  switch (action.type) {
    case 'FOCUS': {
      return {
        ...state,
        focused: true,
        // automatically load initial options on focus if input is not readOnly
        status:
          state.status === 'IDLE' && !action.readOnly
            ? 'LOADING_OPTIONS'
            : state.status,
      };
    }
    case 'BLUR': {
      // is selectedValue is ot the same as value look if we have selectedOption and set if we have
      if (state.value !== state.selectedValue && state.selectedOption != null) {
        if (state.options[state.selectedOption] != null) {
          return {
            ...state,
            options: [],
            focused: false,
            expanded: false,
            selectedOption: null,
            selectedValue: state.options[state.selectedOption],
            value: state.options[state.selectedOption],
          };
        }
      }
      return {
        ...state,
        focused: false,
        expanded: false,
        options: [],
        selectedOption: null,
      };
    }
    case 'CLICK': {
      if (state.expanded || action.readOnly) {
        return state;
      }

      return {
        ...state,
        expanded: true,
        selectedOption:
          state.selectedOption == null && state.options.length > 0 ? 0 : null,
      };
    }
    case 'RESET': {
      return {
        ...state,
        expanded: false,
        selectedOption: null,
        selectedValue: action.value,
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
      // open options (ARROW DOWN)
      if (!state.expanded && state.options.length > 0) {
        return {
          ...state,
          expanded: true,
          selectedOption: 0,
        };
      }

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
        selectedOption: null,
        selectedValue: state.options[index],
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
