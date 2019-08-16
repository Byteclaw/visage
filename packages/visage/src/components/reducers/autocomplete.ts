export type AutocompleteAction =
  | { type: 'ArrowDown' }
  | { type: 'ArrowUp' }
  | { type: 'Close' }
  | { type: 'Open' }
  | { type: 'Blur' }
  | { type: 'End' }
  | { type: 'Escape' }
  | { type: 'Focus' }
  | { type: 'FocusOption'; index: number }
  | { type: 'ChooseOption'; index: number }
  | { type: 'ChooseFocusedOption' }
  | { type: 'Home' }
  | { type: 'SetValue'; value: string }
  | { type: 'LoadingOptions' }
  | { type: 'LoadingOptionsDone'; options: any[] }
  | { type: 'LoadingOptionsFailed'; error: Error };

interface Option {
  id: string;
  index: number;
  value: any;
}

export interface AutocompleteState {
  activeId: string | null;
  busy: boolean;
  direction: 'upward' | 'downward';
  expanded: boolean;
  error: Error | null;
  focused: boolean;
  focusedOption: number;
  /** Controller component id */
  id: string;
  options: Option[];
  value: string;
}

function optionId(rootId: string, index: number): string {
  return `${rootId}-option-${index}`;
}

export function initAutocompleteReducer({
  id,
  value = '',
}: {
  id: string;
  value?: string;
}): AutocompleteState {
  return {
    activeId: null,
    busy: false,
    direction: 'downward',
    error: null,
    expanded: false,
    focused: false,
    focusedOption: -1,
    id,
    options: [],
    value,
  };
}

export function autocompleteReducer(
  state: AutocompleteState,
  action: AutocompleteAction,
): AutocompleteState {
  switch (action.type) {
    case 'Close':
    case 'Open': {
      return autocompleteReducer(
        state,
        action.type === 'Close' ? { type: 'Escape' } : { type: 'ArrowDown' },
      );
    }
    case 'SetValue': {
      if (state.busy) {
        return state;
      }

      return {
        ...state,
        value: action.value,
      };
    }
    case 'ArrowUp':
    case 'ArrowDown': {
      if (state.busy) {
        return state;
      }

      const nextState: AutocompleteState = {
        ...state,
        expanded: true,
        direction: action.type === 'ArrowUp' ? 'upward' : 'downward',
      };

      if (state.options.length === 0) {
        // trigger loading options
        return {
          ...nextState,
          busy: true,
        };
      }

      if (action.type === 'ArrowDown') {
        const nextIndex =
          state.focusedOption + 1 >= state.options.length
            ? 0
            : state.focusedOption + 1;

        return {
          ...nextState,
          activeId: optionId(state.id, nextIndex),
          focusedOption: nextIndex,
        };
      }

      if (state.focusedOption === -1) {
        return {
          ...nextState,
          activeId: optionId(state.id, state.options.length - 1),
          focusedOption: state.options.length - 1,
        };
      }

      const nextIndex =
        state.focusedOption - 1 < 0
          ? state.options.length - 1
          : state.focusedOption - 1;

      return {
        ...nextState,
        activeId: optionId(state.id, nextIndex),
        focusedOption: nextIndex,
      };
    }
    case 'Blur': {
      return {
        ...state,
        activeId: null,
        expanded: false,
        focused: false,
        focusedOption: -1,
      };
    }
    case 'ChooseOption': {
      if (
        state.busy ||
        !state.expanded ||
        state.options.length <= action.index ||
        action.index < 0
      ) {
        return state;
      }

      return {
        ...state,
        value: state.options[action.index].value,
      };
    }
    case 'ChooseFocusedOption': {
      if (state.busy || !state.expanded || state.focusedOption === -1) {
        return state;
      }

      return {
        ...state,
        value: state.options[state.focusedOption].value,
      };
    }
    case 'End': {
      if (!state.expanded || state.options.length === 0) {
        return state;
      }

      return {
        ...state,
        activeId: optionId(state.id, state.options.length - 1),
        focusedOption: state.options.length - 1,
      };
    }
    case 'Escape': {
      if (state.expanded) {
        return {
          ...state,
          activeId: null,
          expanded: false,
          focusedOption: -1,
        };
      }

      return state;
    }
    case 'Focus': {
      return {
        ...state,
        focused: true,
      };
    }
    case 'FocusOption': {
      if (
        state.busy ||
        !state.expanded ||
        state.options.length <= action.index ||
        action.index < 0
      ) {
        return state;
      }

      return {
        ...state,
        focusedOption: action.index,
      };
    }
    case 'Home': {
      if (!state.expanded || state.options.length === 0) {
        return state;
      }

      return {
        ...state,
        activeId: optionId(state.id, 0),
        focusedOption: 0,
      };
    }
    case 'LoadingOptions': {
      if (state.busy) {
        return state;
      }

      return {
        ...state,
        activeId: null,
        direction: 'downward',
        focusedOption: -1,
        busy: true,
        error: null,
      };
    }
    case 'LoadingOptionsDone': {
      if (!state.busy) {
        return state;
      }

      // select options based on current value or the first one
      const options = action.options.map((value, index) => ({
        id: optionId(state.id, index),
        index,
        value,
      }));

      // focus option based on direction (this is necessary because)
      // load options can be invoked by ArrowUp/ArrowDown
      // if not expanded, set as -1
      const focusedOption =
        options.length > 0 && state.expanded
          ? state.direction === 'upward'
            ? options.length - 1
            : 0
          : -1;

      return {
        ...state,
        activeId: optionId(state.id, focusedOption),
        busy: false,
        focusedOption,
        options,
      };
    }
    case 'LoadingOptionsFailed': {
      if (!state.busy) {
        return state;
      }

      return {
        ...state,
        busy: false,
        error: action.error,
        options: [],
      };
    }
    default: {
      return state;
    }
  }
}
