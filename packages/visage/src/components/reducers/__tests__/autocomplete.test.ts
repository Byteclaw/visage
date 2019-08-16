import { autocompleteReducer, initAutocompleteReducer } from '../autocomplete';

describe('Autocomplete reducer', () => {
  describe('Blur', () => {
    it('clears options and closes popup', () => {
      let state = initAutocompleteReducer({ id: 'root' });

      state = {
        ...state,
        focused: true,
        value: 'App',
      };

      state = autocompleteReducer(state, { type: 'Blur' });

      expect(state).toMatchObject({
        focused: false,
        expanded: false,
        focusedOption: -1,
        options: [],
        value: 'App',
      });
    });
  });

  describe('ArrowDown', () => {
    describe('closed popup, empty values', () => {
      let state = initAutocompleteReducer({ id: 'root' });

      it('loads options if there are no options and focuses the first if available', () => {
        state = autocompleteReducer(state, { type: 'Focus' });
        state = autocompleteReducer(state, { type: 'ArrowDown' });

        expect(state).toMatchObject({
          activeId: null,
          busy: true,
          expanded: true,
          options: [],
        });

        state = autocompleteReducer(state, {
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
        state = autocompleteReducer(state, { type: 'Blur' });

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
        state = autocompleteReducer(state, { type: 'Focus' });
        state = autocompleteReducer(state, { type: 'ArrowDown' });

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
      let state = initAutocompleteReducer({ id: 'root', value: 'a' });

      it('loads options if there are no options and focuses the first if available', () => {
        state = autocompleteReducer(state, { type: 'Focus' });
        state = autocompleteReducer(state, { type: 'ArrowDown' });

        expect(state).toMatchObject({
          activeId: null,
          busy: true,
          expanded: true,
          options: [],
        });

        state = autocompleteReducer(state, {
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
        state = autocompleteReducer(state, { type: 'Blur' });

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
        state = autocompleteReducer(state, { type: 'Focus' });
        state = autocompleteReducer(state, { type: 'ArrowDown' });

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
        state = autocompleteReducer(state, { type: 'ArrowDown' });

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

        state = autocompleteReducer(state, { type: 'ArrowDown' });

        expect(state).toMatchObject({
          activeId: 'root-option-2',
          focusedOption: 2,
        });

        state = autocompleteReducer(state, { type: 'ArrowDown' });

        expect(state).toMatchObject({
          activeId: 'root-option-0',
          focusedOption: 0,
        });
      });
    });
  });

  describe('ArrowUp', () => {
    describe('closed popup, empty values', () => {
      let state = initAutocompleteReducer({ id: 'root' });

      it('loads options if there are no options and focuses the last if available', () => {
        state = autocompleteReducer(state, { type: 'Focus' });
        state = autocompleteReducer(state, { type: 'ArrowUp' });

        expect(state).toMatchObject({
          busy: true,
          expanded: true,
          options: [],
        });

        state = autocompleteReducer(state, {
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
        state = autocompleteReducer(state, { type: 'Blur' });

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
        state = autocompleteReducer(state, { type: 'Focus' });
        state = autocompleteReducer(state, { type: 'ArrowUp' });

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
      let state = initAutocompleteReducer({ id: 'root', value: 'a' });

      it('loads options if there are no options and focuses the last if available', () => {
        state = autocompleteReducer(state, { type: 'Focus' });
        state = autocompleteReducer(state, { type: 'ArrowUp' });

        expect(state).toMatchObject({
          busy: true,
          expanded: true,
          options: [],
        });

        state = autocompleteReducer(state, {
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
        state = autocompleteReducer(state, { type: 'Blur' });

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
        state = autocompleteReducer(state, { type: 'Focus' });
        state = autocompleteReducer(state, { type: 'ArrowUp' });

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
        state = autocompleteReducer(state, { type: 'ArrowUp' });

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

        state = autocompleteReducer(state, { type: 'ArrowUp' });

        expect(state).toMatchObject({
          focusedOption: 0,
        });

        state = autocompleteReducer(state, { type: 'ArrowUp' });

        expect(state).toMatchObject({
          focusedOption: 2,
        });
      });
    });
  });

  describe('Escape', () => {
    let state = initAutocompleteReducer({ id: 'root' });

    it('does nothing if popup is closed', () => {
      state = autocompleteReducer(state, { type: 'Focus' });

      expect(autocompleteReducer(state, { type: 'Escape' })).toEqual(state);
    });

    it('closes popup', () => {
      state = autocompleteReducer(state, { type: 'ArrowDown' });

      state = autocompleteReducer(state, {
        type: 'LoadingOptionsDone',
        options: ['a'],
      });

      expect(state).toMatchObject({ expanded: true, focusedOption: 0 });

      expect(autocompleteReducer(state, { type: 'Escape' })).toMatchObject({
        expanded: false,
        focusedOption: -1,
      });
    });
  });

  describe('Focus', () => {
    it('focuses control', () => {
      const state = initAutocompleteReducer({ id: 'root' });

      expect(autocompleteReducer(state, { type: 'Focus' })).toMatchObject({
        focused: true,
        expanded: false,
      });
    });
  });

  describe('FocusOption', () => {
    let state = initAutocompleteReducer({ id: 'root' });
    state = autocompleteReducer(state, { type: 'Focus' });

    it('does nothing if select is busy', () => {
      state = autocompleteReducer(state, { type: 'LoadingOptions' });

      expect(
        autocompleteReducer(state, { type: 'FocusOption', index: 0 }),
      ).toBe(state);

      state = autocompleteReducer(state, {
        type: 'LoadingOptionsDone',
        options: [],
      });
    });

    it('does nothing if popup is closed', () => {
      expect(state.expanded).toBe(false);

      expect(
        autocompleteReducer(state, { type: 'FocusOption', index: 0 }),
      ).toBe(state);
    });

    it('does nothing if popup is empty', () => {
      state = autocompleteReducer(state, { type: 'LoadingOptions' });

      state = autocompleteReducer(state, {
        type: 'LoadingOptionsDone',
        options: [],
      });

      expect(
        autocompleteReducer(state, { type: 'FocusOption', index: 0 }),
      ).toBe(state);
    });

    it('does nothing if index is out of range', () => {
      state = autocompleteReducer(state, { type: 'LoadingOptions' });

      state = autocompleteReducer(state, {
        type: 'LoadingOptionsDone',
        options: ['a', 'b'],
      });

      expect(
        autocompleteReducer(state, { type: 'FocusOption', index: 2 }),
      ).toBe(state);
    });

    it('sets current focused option to given index', () => {
      state = autocompleteReducer(state, { type: 'ArrowDown' });

      expect(
        autocompleteReducer(state, { type: 'FocusOption', index: 1 }),
      ).toMatchObject({
        focusedOption: 1,
      });
    });
  });

  describe('ChooseOption', () => {
    let state = initAutocompleteReducer({ id: 'root' });
    state = autocompleteReducer(state, { type: 'Focus' });

    it('does nothing if select is busy', () => {
      state = autocompleteReducer(state, { type: 'LoadingOptions' });

      expect(
        autocompleteReducer(state, { type: 'ChooseOption', index: 0 }),
      ).toBe(state);

      state = autocompleteReducer(state, {
        type: 'LoadingOptionsDone',
        options: [],
      });
    });

    it('does nothing if popup is closed', () => {
      expect(state.expanded).toBe(false);

      expect(
        autocompleteReducer(state, { type: 'ChooseOption', index: 0 }),
      ).toBe(state);
    });

    it('does nothing if popup is empty', () => {
      state = autocompleteReducer(state, { type: 'LoadingOptions' });

      state = autocompleteReducer(state, {
        type: 'LoadingOptionsDone',
        options: [],
      });

      expect(
        autocompleteReducer(state, { type: 'ChooseOption', index: 0 }),
      ).toBe(state);
    });

    it('does nothing if index is out of range', () => {
      state = autocompleteReducer(state, { type: 'LoadingOptions' });

      state = autocompleteReducer(state, {
        type: 'LoadingOptionsDone',
        options: ['a', 'b'],
      });

      expect(
        autocompleteReducer(state, { type: 'ChooseOption', index: 2 }),
      ).toBe(state);
    });

    it('sets current focused option to given index', () => {
      state = autocompleteReducer(state, { type: 'ArrowDown' });

      expect(
        autocompleteReducer(state, { type: 'ChooseOption', index: 1 }),
      ).toMatchObject({
        focusedOption: 0,
        value: 'b',
      });
    });
  });

  describe('ChooseFocusedOption', () => {
    let state = initAutocompleteReducer({ id: 'root' });
    state = autocompleteReducer(state, { type: 'Focus' });

    it('does nothing if select is busy', () => {
      state = autocompleteReducer(state, { type: 'LoadingOptions' });

      expect(autocompleteReducer(state, { type: 'ChooseFocusedOption' })).toBe(
        state,
      );

      state = autocompleteReducer(state, {
        type: 'LoadingOptionsDone',
        options: [],
      });
    });

    it('does nothing if popup is closed', () => {
      expect(state.expanded).toBe(false);

      expect(autocompleteReducer(state, { type: 'ChooseFocusedOption' })).toBe(
        state,
      );
    });

    it('does nothing if popup is empty', () => {
      state = autocompleteReducer(state, { type: 'LoadingOptions' });

      state = autocompleteReducer(state, {
        type: 'LoadingOptionsDone',
        options: [],
      });

      expect(autocompleteReducer(state, { type: 'ChooseFocusedOption' })).toBe(
        state,
      );
    });

    it('sets current focused option as a value', () => {
      state = autocompleteReducer(state, { type: 'ArrowDown' });
      state = autocompleteReducer(state, { type: 'LoadingOptions' });
      state = autocompleteReducer(state, {
        type: 'LoadingOptionsDone',
        options: ['a', 'b'],
      });

      expect(
        autocompleteReducer(state, { type: 'ChooseFocusedOption' }),
      ).toMatchObject({
        focusedOption: 0,
        value: 'a',
      });
    });
  });

  describe('Home/End', () => {
    let state = initAutocompleteReducer({ id: 'root' });

    it('does not do anything if popup is closed', () => {
      state = autocompleteReducer(state, { type: 'Focus' });

      expect(autocompleteReducer(state, { type: 'Home' })).toEqual(state);
      expect(autocompleteReducer(state, { type: 'End' })).toEqual(state);
    });

    it('does not do anything if popup is empty', () => {
      state = autocompleteReducer(state, { type: 'ArrowDown' });

      state = autocompleteReducer(state, {
        type: 'LoadingOptionsDone',
        options: [],
      });

      expect(autocompleteReducer(state, { type: 'Home' })).toEqual(state);
      expect(autocompleteReducer(state, { type: 'End' })).toEqual(state);
    });

    it('focuses last available item in open popup if End is pressed', () => {
      state = autocompleteReducer(state, { type: 'Blur' });
      state = autocompleteReducer(state, { type: 'Focus' });
      state = autocompleteReducer(state, { type: 'ArrowDown' });
      state = autocompleteReducer(state, {
        type: 'LoadingOptionsDone',
        options: ['a', 'b', 'c'],
      });

      expect(state).toMatchObject({ focusedOption: 0 });
      state = autocompleteReducer(state, { type: 'End' });

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
      state = autocompleteReducer(state, { type: 'Home' });

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

  describe('SetValue', () => {
    it('does nothing if select is busy', () => {
      let state = initAutocompleteReducer({ id: 'root', value: 'a' });

      expect(state).toMatchObject({ value: 'a' });

      state = autocompleteReducer(state, { type: 'LoadingOptions' });

      state = autocompleteReducer(state, {
        type: 'SetValue',
        value: 'c',
      });

      expect(state).toMatchObject({ value: 'a' });
    });

    it('overwrites selection', () => {
      let state = initAutocompleteReducer({ id: 'root', value: 'a' });

      expect(state).toMatchObject({ value: 'a' });

      state = autocompleteReducer(state, {
        type: 'SetValue',
        value: 'c',
      });

      expect(state).toMatchObject({ value: 'c' });
    });
  });

  describe('Open/Close', () => {
    let state = initAutocompleteReducer({ id: 'root' });
    state = autocompleteReducer(state, { type: 'Focus' });

    it('open behaves the same way as ArrowDown on focused closed control', () => {
      state = autocompleteReducer(state, { type: 'Open' });

      expect(state).toMatchObject({
        busy: true,
        expanded: true,
      });

      state = autocompleteReducer(state, {
        type: 'LoadingOptionsDone',
        options: ['a'],
      });
    });

    it('close behaves the same way as Escape on focused open control', () => {
      expect(state).toMatchObject({
        expanded: true,
        focusedOption: 0,
      });

      state = autocompleteReducer(state, { type: 'Close' });

      expect(state).toMatchObject({
        expanded: false,
        focusedOption: -1,
      });
    });
  });

  describe('LoadingOptions', () => {
    let state = initAutocompleteReducer({ id: 'root' });
    state = {
      ...state,
      focusedOption: 0,
    };

    it('sets state as busy and resets focused option', () => {
      state = autocompleteReducer(state, { type: 'LoadingOptions' });

      expect(state).toMatchObject({ busy: true, focusedOption: -1 });
    });

    it('does nothing if state is already busy', () => {
      expect(autocompleteReducer(state, { type: 'LoadingOptions' })).toBe(
        state,
      );
    });
  });

  describe('LoadingOptionsDone', () => {
    let state = initAutocompleteReducer({ id: 'root' });

    it('does nothing if state is not busy', () => {
      expect(
        autocompleteReducer(state, { type: 'LoadingOptionsDone', options: [] }),
      ).toBe(state);
    });

    it('sets state as not busy and fills options but does not focus an option if not expanded', () => {
      state = autocompleteReducer(state, { type: 'LoadingOptions' });

      state = autocompleteReducer(state, {
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
      state = autocompleteReducer(state, { type: 'Focus' });
      state = autocompleteReducer(state, { type: 'LoadingOptions' });

      state = autocompleteReducer(state, {
        type: 'LoadingOptionsDone',
        options: ['b'],
      });

      state = autocompleteReducer(state, { type: 'ArrowDown' });

      expect(state).toMatchObject({
        busy: false,
        expanded: true,
        focusedOption: 0,
        options: [{ id: 'root-option-0', index: 0, value: 'b' }],
      });
    });
  });

  describe('LoadingOptionsFailed', () => {
    let state = initAutocompleteReducer({ id: 'root' });

    it('does nothing if state is not busy', () => {
      expect(
        autocompleteReducer(state, {
          type: 'LoadingOptionsFailed',
          error: new Error(),
        }),
      ).toBe(state);
    });

    it('sets state as not busy, clears options and sets error', () => {
      state = autocompleteReducer(state, { type: 'LoadingOptions' });
      state = autocompleteReducer(state, {
        type: 'LoadingOptionsDone',
        options: ['b'],
      });
      expect(state.options).toHaveLength(1);
      state = autocompleteReducer(state, { type: 'LoadingOptions' });

      const error = new Error();

      state = autocompleteReducer(state, {
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
