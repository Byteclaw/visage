import { initSelectReducer, selectReducer, SelectState } from '../select';

describe('Select reducer', () => {
  describe('Blur', () => {
    it('clears filter, options and closes popup', () => {
      let state: SelectState = initSelectReducer({ id: 'root' });

      state = {
        ...state,
        focused: true,
        searchValue: 'App',
      };

      state = selectReducer(state, { type: 'Blur' });

      expect(state).toMatchObject({
        focused: false,
        expanded: false,
        focusedOption: -1,
        options: [],
        value: [],
        searchValue: null,
      });
    });
  });

  describe('ArrowDown', () => {
    describe('closed popup, empty values', () => {
      let state = initSelectReducer({ id: 'root' });

      it('loads options if there are no options and focuses the first if available', () => {
        state = selectReducer(state, { type: 'Focus' });
        state = selectReducer(state, { type: 'ArrowDown' });

        expect(state).toMatchObject({
          activeId: null,
          busy: true,
          expanded: true,
          options: [],
        });

        state = selectReducer(state, {
          type: 'LoadingOptionsDone',
          options: ['a', 'b'],
        });

        expect(state).toMatchObject({
          activeId: 'root-option-0',
          busy: false,
          expanded: true,
          focusedOption: 0,
          options: [
            { id: 'root-option-0', index: 0, value: 'a' },
            { id: 'root-option-1', index: 1, value: 'b' },
          ],
        });

        // close popup
        state = selectReducer(state, { type: 'Blur' });

        expect(state).toMatchObject({
          activeId: null,
          focused: false,
          expanded: false,
          focusedOption: -1,
          options: [
            { id: 'root-option-0', index: 0, value: 'a' },
            { id: 'root-option-1', index: 1, value: 'b' },
          ],
        });
      });

      it('opens popup if options are available and focuses the first option', () => {
        state = selectReducer(state, { type: 'Focus' });
        state = selectReducer(state, { type: 'ArrowDown' });

        expect(state).toMatchObject({
          activeId: 'root-option-0',
          busy: false,
          expanded: true,
          focusedOption: 0,
          options: [
            { id: 'root-option-0', index: 0, value: 'a' },
            { id: 'root-option-1', index: 1, value: 'b' },
          ],
        });
      });
    });

    describe('closed popup, non empty values', () => {
      let state = initSelectReducer({ id: 'root', value: ['a'] });

      it('loads options if there are no options and focuses the first if available', () => {
        state = selectReducer(state, { type: 'Focus' });
        state = selectReducer(state, { type: 'ArrowDown' });

        expect(state).toMatchObject({
          activeId: null,
          busy: true,
          expanded: true,
          options: [],
        });

        state = selectReducer(state, {
          type: 'LoadingOptionsDone',
          options: ['a', 'b', 'c'],
        });

        expect(state).toMatchObject({
          activeId: 'root-option-0',
          busy: false,
          expanded: true,
          focusedOption: 0,
          options: [
            { id: 'root-option-0', index: 0, value: 'a' },
            { id: 'root-option-1', index: 1, value: 'b' },
            { id: 'root-option-2', index: 2, value: 'c' },
          ],
        });

        // close popup
        state = selectReducer(state, { type: 'Blur' });

        expect(state).toMatchObject({
          activeId: null,
          focused: false,
          expanded: false,
          focusedOption: -1,
          options: [
            { id: 'root-option-0', index: 0, value: 'a' },
            { id: 'root-option-1', index: 1, value: 'b' },
            { id: 'root-option-2', index: 2, value: 'c' },
          ],
        });
      });

      it('opens popup if options are available and focuses the first option', () => {
        state = selectReducer(state, { type: 'Focus' });
        state = selectReducer(state, { type: 'ArrowDown' });

        expect(state).toMatchObject({
          activeId: 'root-option-0',
          busy: false,
          expanded: true,
          focusedOption: 0,
          options: [
            { id: 'root-option-0', index: 0, value: 'a' },
            { id: 'root-option-1', index: 1, value: 'b' },
            { id: 'root-option-2', index: 2, value: 'c' },
          ],
        });
      });

      it('cycles through options in downward way', () => {
        state = selectReducer(state, { type: 'ArrowDown' });

        expect(state).toMatchObject({
          activeId: 'root-option-1',
          busy: false,
          expanded: true,
          focusedOption: 1,
          options: [
            { id: 'root-option-0', index: 0, value: 'a' },
            { id: 'root-option-1', index: 1, value: 'b' },
            { id: 'root-option-2', index: 2, value: 'c' },
          ],
        });

        state = selectReducer(state, { type: 'ArrowDown' });

        expect(state).toMatchObject({
          activeId: 'root-option-2',
          focusedOption: 2,
        });

        state = selectReducer(state, { type: 'ArrowDown' });

        expect(state).toMatchObject({
          activeId: 'root-option-0',
          focusedOption: 0,
        });
      });
    });
  });

  describe('ArrowUp', () => {
    describe('closed popup, empty values', () => {
      let state = initSelectReducer({ id: 'root' });

      it('loads options if there are no options and focuses the last if available', () => {
        state = selectReducer(state, { type: 'Focus' });
        state = selectReducer(state, { type: 'ArrowUp' });

        expect(state).toMatchObject({
          busy: true,
          expanded: true,
          options: [],
        });

        state = selectReducer(state, {
          type: 'LoadingOptionsDone',
          options: ['a', 'b'],
        });

        expect(state).toMatchObject({
          busy: false,
          expanded: true,
          focusedOption: 1,
          options: [
            { id: 'root-option-0', index: 0, value: 'a' },
            { id: 'root-option-1', index: 1, value: 'b' },
          ],
        });

        // close popup
        state = selectReducer(state, { type: 'Blur' });

        expect(state).toMatchObject({
          focused: false,
          expanded: false,
          focusedOption: -1,
          options: [
            { id: 'root-option-0', index: 0, value: 'a' },
            { id: 'root-option-1', index: 1, value: 'b' },
          ],
        });
      });

      it('opens popup if options are available and focuses the last option', () => {
        state = selectReducer(state, { type: 'Focus' });
        state = selectReducer(state, { type: 'ArrowUp' });

        expect(state).toMatchObject({
          busy: false,
          expanded: true,
          focusedOption: 1,
          options: [
            { id: 'root-option-0', index: 0, value: 'a' },
            { id: 'root-option-1', index: 1, value: 'b' },
          ],
        });
      });
    });

    describe('closed popup, non empty values', () => {
      let state = initSelectReducer({ id: 'root', value: ['a'] });

      it('loads options if there are no options and focuses the last if available', () => {
        state = selectReducer(state, { type: 'Focus' });
        state = selectReducer(state, { type: 'ArrowUp' });

        expect(state).toMatchObject({
          busy: true,
          expanded: true,
          options: [],
        });

        state = selectReducer(state, {
          type: 'LoadingOptionsDone',
          options: ['a', 'b', 'c'],
        });

        expect(state).toMatchObject({
          busy: false,
          expanded: true,
          focusedOption: 2,
          options: [
            { id: 'root-option-0', index: 0, value: 'a' },
            { id: 'root-option-1', index: 1, value: 'b' },
            { id: 'root-option-2', index: 2, value: 'c' },
          ],
        });

        // close popup
        state = selectReducer(state, { type: 'Blur' });

        expect(state).toMatchObject({
          focused: false,
          expanded: false,
          focusedOption: -1,
          options: [
            { id: 'root-option-0', index: 0, value: 'a' },
            { id: 'root-option-1', index: 1, value: 'b' },
            { id: 'root-option-2', index: 2, value: 'c' },
          ],
        });
      });

      it('opens popup if options are available and focuses the last option', () => {
        state = selectReducer(state, { type: 'Focus' });
        state = selectReducer(state, { type: 'ArrowUp' });

        expect(state).toMatchObject({
          busy: false,
          expanded: true,
          focusedOption: 2,
          options: [
            { id: 'root-option-0', index: 0, value: 'a' },
            { id: 'root-option-1', index: 1, value: 'b' },
            { id: 'root-option-2', index: 2, value: 'c' },
          ],
        });
      });

      it('cycles through options in upward way', () => {
        state = selectReducer(state, { type: 'ArrowUp' });

        expect(state).toMatchObject({
          busy: false,
          expanded: true,
          focusedOption: 1,
          options: [
            { id: 'root-option-0', index: 0, value: 'a' },
            { id: 'root-option-1', index: 1, value: 'b' },
            { id: 'root-option-2', index: 2, value: 'c' },
          ],
        });

        state = selectReducer(state, { type: 'ArrowUp' });

        expect(state).toMatchObject({
          focusedOption: 0,
        });

        state = selectReducer(state, { type: 'ArrowUp' });

        expect(state).toMatchObject({
          focusedOption: 2,
        });
      });
    });
  });

  describe('Escape', () => {
    let state = initSelectReducer({ id: 'root' });

    it('does nothing if popup is closed', () => {
      state = selectReducer(state, { type: 'Focus' });

      expect(selectReducer(state, { type: 'Escape' })).toEqual(state);
    });

    it('closes popup', () => {
      state = selectReducer(state, { type: 'ArrowDown' });

      state = selectReducer(state, {
        type: 'LoadingOptionsDone',
        options: ['a'],
      });

      expect(state).toMatchObject({ expanded: true, focusedOption: 0 });

      expect(selectReducer(state, { type: 'Escape' })).toMatchObject({
        expanded: false,
        focusedOption: -1,
      });
    });
  });

  describe('Focus', () => {
    it('focuses control', () => {
      const state = initSelectReducer({ id: 'root' });

      expect(selectReducer(state, { type: 'Focus' })).toMatchObject({
        focused: true,
        expanded: false,
      });
    });
  });

  describe('FocusOption', () => {
    let state = initSelectReducer({ id: 'root' });
    state = selectReducer(state, { type: 'Focus' });

    it('does nothing if select is busy', () => {
      state = selectReducer(state, { type: 'LoadingOptions' });

      expect(selectReducer(state, { type: 'FocusOption', index: 0 })).toBe(
        state,
      );

      state = selectReducer(state, {
        type: 'LoadingOptionsDone',
        options: [],
      });
    });

    it('does nothing if popup is closed', () => {
      expect(state.expanded).toBe(false);

      expect(selectReducer(state, { type: 'FocusOption', index: 0 })).toBe(
        state,
      );
    });

    it('does nothing if popup is empty', () => {
      state = selectReducer(state, { type: 'LoadingOptions' });

      state = selectReducer(state, {
        type: 'LoadingOptionsDone',
        options: [],
      });

      expect(selectReducer(state, { type: 'FocusOption', index: 0 })).toBe(
        state,
      );
    });

    it('does nothing if index is out of range', () => {
      state = selectReducer(state, { type: 'LoadingOptions' });

      state = selectReducer(state, {
        type: 'LoadingOptionsDone',
        options: ['a', 'b'],
      });

      expect(selectReducer(state, { type: 'FocusOption', index: 2 })).toBe(
        state,
      );
    });

    it('sets current focused option to given index', () => {
      state = selectReducer(state, { type: 'ArrowDown' });

      expect(
        selectReducer(state, { type: 'FocusOption', index: 1 }),
      ).toMatchObject({
        focusedOption: 1,
      });
    });
  });

  describe('ChooseOption', () => {
    let state = initSelectReducer({ id: 'root' });
    state = selectReducer(state, { type: 'Focus' });

    it('does nothing if select is busy', () => {
      state = selectReducer(state, { type: 'LoadingOptions' });

      expect(selectReducer(state, { type: 'ChooseOption', index: 0 })).toBe(
        state,
      );

      state = selectReducer(state, {
        type: 'LoadingOptionsDone',
        options: [],
      });
    });

    it('does nothing if popup is closed', () => {
      expect(state.expanded).toBe(false);

      expect(selectReducer(state, { type: 'ChooseOption', index: 0 })).toBe(
        state,
      );
    });

    it('does nothing if popup is empty', () => {
      state = selectReducer(state, { type: 'LoadingOptions' });

      state = selectReducer(state, {
        type: 'LoadingOptionsDone',
        options: [],
      });

      expect(selectReducer(state, { type: 'ChooseOption', index: 0 })).toBe(
        state,
      );
    });

    it('does nothing if index is out of range', () => {
      state = selectReducer(state, { type: 'LoadingOptions' });

      state = selectReducer(state, {
        type: 'LoadingOptionsDone',
        options: ['a', 'b'],
      });

      expect(selectReducer(state, { type: 'ChooseOption', index: 2 })).toBe(
        state,
      );
    });

    it('sets current focused option to given index', () => {
      state = selectReducer(state, { type: 'ArrowDown' });

      expect(
        selectReducer(state, { type: 'ChooseOption', index: 1 }),
      ).toMatchObject({
        focusedOption: 0,
        value: ['b'],
      });
    });
  });

  describe('ChooseFocusedOption', () => {
    let state = initSelectReducer({ id: 'root' });
    state = selectReducer(state, { type: 'Focus' });

    it('does nothing if select is busy', () => {
      state = selectReducer(state, { type: 'LoadingOptions' });

      expect(selectReducer(state, { type: 'ChooseFocusedOption' })).toBe(state);

      state = selectReducer(state, {
        type: 'LoadingOptionsDone',
        options: [],
      });
    });

    it('does nothing if popup is closed', () => {
      expect(state.expanded).toBe(false);

      expect(selectReducer(state, { type: 'ChooseFocusedOption' })).toBe(state);
    });

    it('does nothing if popup is empty', () => {
      state = selectReducer(state, { type: 'LoadingOptions' });

      state = selectReducer(state, {
        type: 'LoadingOptionsDone',
        options: [],
      });

      expect(selectReducer(state, { type: 'ChooseFocusedOption' })).toBe(state);
    });

    it('sets current focused option as a value', () => {
      state = selectReducer(state, { type: 'ArrowDown' });
      state = selectReducer(state, { type: 'LoadingOptions' });
      state = selectReducer(state, {
        type: 'LoadingOptionsDone',
        options: ['a', 'b'],
      });

      expect(
        selectReducer(state, { type: 'ChooseFocusedOption' }),
      ).toMatchObject({
        focusedOption: 0,
        value: ['a'],
      });
    });
  });

  describe('Home/End', () => {
    let state = initSelectReducer({ id: 'root' });

    it('does not do anything if popup is closed', () => {
      state = selectReducer(state, { type: 'Focus' });

      expect(selectReducer(state, { type: 'Home' })).toEqual(state);
      expect(selectReducer(state, { type: 'End' })).toEqual(state);
    });

    it('does not do anything if popup is empty', () => {
      state = selectReducer(state, { type: 'ArrowDown' });

      state = selectReducer(state, {
        type: 'LoadingOptionsDone',
        options: [],
      });

      expect(selectReducer(state, { type: 'Home' })).toEqual(state);
      expect(selectReducer(state, { type: 'End' })).toEqual(state);
    });

    it('focuses last available item in open popup if End is pressed', () => {
      state = selectReducer(state, { type: 'Blur' });
      state = selectReducer(state, { type: 'Focus' });
      state = selectReducer(state, { type: 'ArrowDown' });
      state = selectReducer(state, {
        type: 'LoadingOptionsDone',
        options: ['a', 'b', 'c'],
      });

      expect(state).toMatchObject({ focusedOption: 0 });
      state = selectReducer(state, { type: 'End' });

      expect(state).toMatchObject({
        activeId: 'root-option-2',
        busy: false,
        expanded: true,
        focusedOption: 2,
        options: [
          { id: 'root-option-0', index: 0, value: 'a' },
          { id: 'root-option-1', index: 1, value: 'b' },
          { id: 'root-option-2', index: 2, value: 'c' },
        ],
      });
    });

    it('focuses first available item in open popup if Home is pressed', () => {
      state = selectReducer(state, { type: 'Home' });

      expect(state).toMatchObject({
        activeId: 'root-option-0',
        busy: false,
        expanded: true,
        focusedOption: 0,
        options: [
          { id: 'root-option-0', index: 0, value: 'a' },
          { id: 'root-option-1', index: 1, value: 'b' },
          { id: 'root-option-2', index: 2, value: 'c' },
        ],
      });
    });
  });

  describe('ChangeSearchValue', () => {
    it('does nothing if select is busy', () => {
      let state = initSelectReducer({ id: 'root' });

      expect(state).toMatchObject({ searchValue: null });

      state = selectReducer(state, { type: 'LoadingOptions' });

      state = selectReducer(state, {
        type: 'ChangeSearchValue',
        value: 'string',
      });

      expect(state).toMatchObject({ searchValue: null });
    });

    it('changes the typed value (used in filterable selects', () => {
      let state = initSelectReducer({ id: 'root' });

      expect(state).toMatchObject({ searchValue: null });

      state = selectReducer(state, {
        type: 'ChangeSearchValue',
        value: 'string',
      });

      expect(state).toMatchObject({ searchValue: 'string' });
    });
  });

  describe('AddValue', () => {
    it('does nothing if select is busy', () => {
      let state = initSelectReducer({ id: 'root' });

      expect(state).toMatchObject({ value: [] });

      state = selectReducer(state, { type: 'LoadingOptions' });

      state = selectReducer(state, {
        type: 'AddValue',
        value: 'a',
      });

      expect(state).toMatchObject({ value: [] });
    });

    it('adds a value to selection', () => {
      let state = initSelectReducer({ id: 'root' });

      expect(state).toMatchObject({ value: [] });

      state = selectReducer(state, {
        type: 'AddValue',
        value: 'a',
      });

      expect(state).toMatchObject({ value: ['a'] });
    });
  });

  describe('RemoveValue', () => {
    it('does nothing if select is busy', () => {
      let state = initSelectReducer({ id: 'root', value: ['a'] });

      expect(state).toMatchObject({ value: ['a'] });

      state = selectReducer(state, { type: 'LoadingOptions' });

      state = selectReducer(state, {
        type: 'RemoveValue',
        index: 0,
      });

      expect(state).toMatchObject({ value: ['a'] });
    });

    it('removes a value to selection', () => {
      let state = initSelectReducer({ id: 'root', value: ['a', 'b'] });

      expect(state).toMatchObject({ value: ['a', 'b'] });

      state = selectReducer(state, {
        type: 'RemoveValue',
        index: 1,
      });

      expect(state).toMatchObject({ value: ['a'] });
    });
  });

  describe('SetValue', () => {
    it('does nothing if select is busy', () => {
      let state = initSelectReducer({ id: 'root', value: ['a'] });

      expect(state).toMatchObject({ value: ['a'] });

      state = selectReducer(state, { type: 'LoadingOptions' });

      state = selectReducer(state, {
        type: 'SetValue',
        value: ['c'],
      });

      expect(state).toMatchObject({ value: ['a'] });
    });

    it('overwrites selection', () => {
      let state = initSelectReducer({ id: 'root', value: ['a'] });

      expect(state).toMatchObject({ value: ['a'] });

      state = selectReducer(state, {
        type: 'SetValue',
        value: ['c'],
      });

      expect(state).toMatchObject({ value: ['c'] });
    });
  });

  describe('Open/Close', () => {
    let state = initSelectReducer({ id: 'root' });
    state = selectReducer(state, { type: 'Focus' });

    it('open behaves the same way as ArrowDown on focused closed control', () => {
      state = selectReducer(state, { type: 'Open' });

      expect(state).toMatchObject({
        busy: true,
        expanded: true,
      });

      state = selectReducer(state, {
        type: 'LoadingOptionsDone',
        options: ['a'],
      });
    });

    it('close behaves the same way as Escape on focused open control', () => {
      expect(state).toMatchObject({
        expanded: true,
        focusedOption: 0,
      });

      state = selectReducer(state, { type: 'Close' });

      expect(state).toMatchObject({
        expanded: false,
        focusedOption: -1,
      });
    });
  });

  describe('LoadingOptions', () => {
    let state = initSelectReducer({ id: 'root' });
    state = {
      ...state,
      focusedOption: 0,
    };

    it('sets state as busy and resets focused option', () => {
      state = selectReducer(state, { type: 'LoadingOptions' });

      expect(state).toMatchObject({ busy: true, focusedOption: -1 });
    });

    it('does nothing if state is already busy', () => {
      expect(selectReducer(state, { type: 'LoadingOptions' })).toBe(state);
    });
  });

  describe('LoadingOptionsDone', () => {
    let state = initSelectReducer({ id: 'root' });

    it('does nothing if state is not busy', () => {
      expect(
        selectReducer(state, { type: 'LoadingOptionsDone', options: [] }),
      ).toBe(state);
    });

    it('sets state as not busy and fills options but does not focus an option if not expanded', () => {
      state = selectReducer(state, { type: 'LoadingOptions' });

      state = selectReducer(state, {
        type: 'LoadingOptionsDone',
        options: ['a'],
      });

      expect(state).toMatchObject({
        busy: false,
        focusedOption: -1,
        options: [{ id: 'root-option-0', index: 0, value: 'a' }],
      });
    });

    it('sets state as not busy and fills options and focuses an option based on direction', () => {
      state = selectReducer(state, { type: 'Focus' });
      state = selectReducer(state, { type: 'LoadingOptions' });

      state = selectReducer(state, {
        type: 'LoadingOptionsDone',
        options: ['b'],
      });

      state = selectReducer(state, { type: 'ArrowDown' });

      expect(state).toMatchObject({
        busy: false,
        expanded: true,
        focusedOption: 0,
        options: [{ id: 'root-option-0', index: 0, value: 'b' }],
      });
    });
  });

  describe('LoadingOptionsFailed', () => {
    let state = initSelectReducer({ id: 'root' });

    it('does nothing if state is not busy', () => {
      expect(
        selectReducer(state, {
          type: 'LoadingOptionsFailed',
          error: new Error(),
        }),
      ).toBe(state);
    });

    it('sets state as not busy, clears options and sets error', () => {
      state = selectReducer(state, { type: 'LoadingOptions' });
      state = selectReducer(state, {
        type: 'LoadingOptionsDone',
        options: ['b'],
      });
      expect(state.options).toHaveLength(1);
      state = selectReducer(state, { type: 'LoadingOptions' });

      const error = new Error();

      state = selectReducer(state, {
        type: 'LoadingOptionsFailed',
        error,
      });

      expect(state).toMatchObject({
        busy: false,
        error,
        focusedOption: -1,
        options: [],
      });
    });
  });
});
