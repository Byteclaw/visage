export type MenuAction =
  | { type: 'ArrowUp' }
  | { type: 'ArrowDown' }
  | { type: 'Escape' }
  | { type: 'Focus'; index: number };

export interface MenuState {
  focusedIndex: number;
  items: any[];
}

export function menu(state: MenuState, action: MenuAction): MenuState {
  switch (action.type) {
    case 'ArrowUp': {
      const focusedIndex =
        state.focusedIndex <= 0
          ? state.items.length - 1
          : state.focusedIndex - 1;

      return {
        ...state,
        focusedIndex,
      };
    }
    case 'ArrowDown': {
      const focusedIndex =
        state.focusedIndex === state.items.length ? 0 : state.focusedIndex + 1;

      return {
        ...state,
        focusedIndex,
      };
    }
    case 'Escape': {
      // this is reset basically
      return {
        ...state,
        focusedIndex: -1,
      };
    }
    case 'Focus': {
      if (action.index > state.items.length - 1) {
        return state;
      }

      return {
        ...state,
        focusedIndex: action.index,
      };
    }
    default:
      return state;
  }
}
