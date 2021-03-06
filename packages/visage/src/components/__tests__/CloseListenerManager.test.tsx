/* eslint-disable no-shadow */
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import React, { useState, ReactElement, useRef } from 'react';
import {
  CloseListenerManager,
  OnCloseHandler,
  useCloseListenerManager,
} from '../CloseListenerManager';
import { useOnRenderEffect } from '../../hooks';

function RenderClosable({
  children,
  delay,
  id,
  isFullscreen,
  onClose,
}: {
  children?: (onClose: () => void | Promise<void>) => ReactElement;
  delay?: number;
  id: string;
  isFullscreen?: boolean;
  onClose: OnCloseHandler;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(true);
  const closeListenerManager = useCloseListenerManager();

  useOnRenderEffect(() => {
    const unregisterEscape =
      closeListenerManager.registerEscapeKeyUpListener(onClose);
    const unregisterClick = closeListenerManager.registerClickAwayListener(
      [divRef],
      onClose,
      isFullscreen,
    );

    return () => {
      unregisterEscape();
      unregisterClick();
    };
  }, [closeListenerManager]);

  return (
    <div ref={divRef}>
      <>
        <div data-testid={id} />
        {open && children
          ? children(
              delay != null
                ? async () => {
                    await new Promise(r => {
                      setTimeout(r, delay);
                    });

                    setOpen(false);
                  }
                : () => {
                    setOpen(false);
                  },
            )
          : null}
      </>
    </div>
  );
}

function RootCloser({
  children,
  delay,
}: {
  delay?: number;
  children: (onClose: () => void | Promise<void>) => ReactElement;
}) {
  const [open, setOpen] = useState(true);

  return open
    ? children(
        delay != null
          ? async () => {
              await new Promise(r => {
                setTimeout(r, delay);
              });

              setOpen(false);
            }
          : () => setOpen(false),
      )
    : null;
}

describe('CloseListenerManager', () => {
  describe('escape key down', () => {
    it('registers escape key down handler', async () => {
      // close listener always closes latest mounted component
      // because we work with an assumption that the latest mounted component is the one which is visible
      const { getByTestId } = render(
        <CloseListenerManager>
          <RootCloser>
            {onRootClose => (
              <RenderClosable id="1" onClose={onRootClose}>
                {onClose => (
                  <RenderClosable id="2" onClose={onClose}>
                    {onClose1 => <RenderClosable id="3" onClose={onClose1} />}
                  </RenderClosable>
                )}
              </RenderClosable>
            )}
          </RootCloser>
          <RootCloser>
            {onRootClose => (
              <RenderClosable id="1-1" onClose={onRootClose}>
                {onClose => (
                  <RenderClosable id="2-2" onClose={onClose}>
                    {onClose1 => <RenderClosable id="3-3" onClose={onClose1} />}
                  </RenderClosable>
                )}
              </RenderClosable>
            )}
          </RootCloser>
        </CloseListenerManager>,
      );

      expect(getByTestId('3-3')).toBeDefined();
      expect(getByTestId('2-2')).toBeDefined();
      expect(getByTestId('1-1')).toBeDefined();
      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      // fire escape keyDown
      await act(async () => fireEvent.keyUp(document, { key: 'Escape' }));

      expect(() => getByTestId('3-3')).toThrow();
      expect(getByTestId('2-2')).toBeDefined();
      expect(getByTestId('1-1')).toBeDefined();
      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      await act(async () => fireEvent.keyUp(document, { key: 'Escape' }));

      expect(() => getByTestId('2-2')).toThrow();
      expect(getByTestId('1-1')).toBeDefined();
      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      await act(async () => fireEvent.keyUp(document, { key: 'Escape' }));

      expect(() => getByTestId('1-1')).toThrow();
      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      await act(async () => fireEvent.keyUp(document, { key: 'Escape' }));

      expect(() => getByTestId('3')).toThrow();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      await act(async () => fireEvent.keyUp(document, { key: 'Escape' }));

      expect(() => getByTestId('2')).toThrow();
      expect(getByTestId('1')).toBeDefined();

      await act(async () => fireEvent.keyUp(document, { key: 'Escape' }));

      expect(() => getByTestId('1')).toThrow();

      await act(async () => fireEvent.keyUp(document, { key: 'Escape' }));
    });

    it('does not call onClose if onClose is already being resolved', async () => {
      let onClose1Mock = jest.fn();
      /* eslint-disable no-return-assign */
      const { getByTestId } = render(
        <CloseListenerManager>
          <RootCloser>
            {onRootClose => (
              <RenderClosable id="1" onClose={onRootClose}>
                {onClose => (
                  <RenderClosable id="2" delay={50} onClose={onClose}>
                    {onClose1 => (
                      <RenderClosable
                        id="3"
                        onClose={(onClose1Mock = jest.fn(onClose1))}
                      />
                    )}
                  </RenderClosable>
                )}
              </RenderClosable>
            )}
          </RootCloser>
        </CloseListenerManager>,
      );
      /* eslint-enable no-return-assign */

      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      // fire escape keyDown
      fireEvent.keyUp(document, { key: 'Escape' });
      fireEvent.keyUp(document, { key: 'Escape' });
      fireEvent.keyUp(document, { key: 'Escape' });

      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      // wait
      await waitFor(() => {
        expect(() => getByTestId('3')).toThrow();
      });

      expect(onClose1Mock).toHaveBeenCalledTimes(1);
    });
  });

  describe('click away', () => {
    beforeEach(() => {
      window.getSelection = jest.fn().mockReturnValue('');
    });

    it('registers as fullscreen by default (prevents bubbling to shallower layers)', async () => {
      // close listener always closes latest mounted component
      // because we work with an assumption that the latest mounted component is the one which is visible
      const { getByTestId } = render(
        <CloseListenerManager>
          <RootCloser>
            {onRootClose => (
              <RenderClosable id="1" onClose={onRootClose}>
                {onClose => (
                  <RenderClosable id="2" onClose={onClose}>
                    {onClose1 => <RenderClosable id="3" onClose={onClose1} />}
                  </RenderClosable>
                )}
              </RenderClosable>
            )}
          </RootCloser>
          <RootCloser>
            {onRootClose => (
              <RenderClosable id="1-1" onClose={onRootClose}>
                {onClose => (
                  <RenderClosable id="2-2" onClose={onClose}>
                    {onClose1 => <RenderClosable id="3-3" onClose={onClose1} />}
                  </RenderClosable>
                )}
              </RenderClosable>
            )}
          </RootCloser>
        </CloseListenerManager>,
      );

      expect(getByTestId('3-3')).toBeDefined();
      expect(getByTestId('2-2')).toBeDefined();
      expect(getByTestId('1-1')).toBeDefined();
      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      // fire click away (closes only fullscreen layer and doesn't go further)
      await act(async () => fireEvent.click(document));

      expect(() => getByTestId('3-3')).toThrow();
      expect(getByTestId('2-2')).toBeDefined();
      expect(getByTestId('1-1')).toBeDefined();
      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      await act(async () => fireEvent.click(document));

      expect(() => getByTestId('2-2')).toThrow();
      expect(getByTestId('1-1')).toBeDefined();
      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      await act(async () => fireEvent.click(document));

      expect(() => getByTestId('1-1')).toThrow();
      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      await act(async () => fireEvent.click(document));

      expect(() => getByTestId('3')).toThrow();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      await act(async () => fireEvent.click(document));

      expect(() => getByTestId('2')).toThrow();
      expect(getByTestId('1')).toBeDefined();

      await act(async () => fireEvent.click(document));

      expect(() => getByTestId('1')).toThrow();
    });

    it('allows to define layers as not fullscreen (bubble to shallower levels)', async () => {
      // close listener always closes latest mounted component
      // because we work with an assumption that the latest mounted component is the one which is visible
      const { getByTestId } = render(
        <CloseListenerManager>
          <RootCloser>
            {onRootClose => (
              <RenderClosable id="1" onClose={onRootClose}>
                {onClose => (
                  <RenderClosable id="2" onClose={onClose}>
                    {onClose1 => (
                      <RenderClosable
                        id="3"
                        isFullscreen={false}
                        onClose={onClose1}
                      />
                    )}
                  </RenderClosable>
                )}
              </RenderClosable>
            )}
          </RootCloser>
          <RootCloser>
            {onRootClose => (
              <RenderClosable id="1-1" onClose={onRootClose}>
                {onClose => (
                  <RenderClosable id="2-2" onClose={onClose}>
                    {onClose1 => (
                      <RenderClosable
                        id="3-3"
                        isFullscreen={false}
                        onClose={onClose1}
                      />
                    )}
                  </RenderClosable>
                )}
              </RenderClosable>
            )}
          </RootCloser>
        </CloseListenerManager>,
      );

      expect(getByTestId('3-3')).toBeDefined();
      expect(getByTestId('2-2')).toBeDefined();
      expect(getByTestId('1-1')).toBeDefined();
      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      // fire click away layer 3 and 2 are not fullscreen so on close bubbles to layer 1 inclusive
      await act(async () => fireEvent.click(document));

      expect(() => getByTestId('3-3')).toThrow();
      expect(() => getByTestId('2-2')).toThrow();
      expect(getByTestId('1-1')).toBeDefined();
      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      await act(async () => fireEvent.click(document));

      expect(() => getByTestId('1-1')).toThrow();

      // fire click away layer 3 and 2 are not fullscreen so on close bubbles to layer 1 inclusive
      await act(async () => fireEvent.click(document));

      expect(() => getByTestId('3')).toThrow();
      expect(() => getByTestId('2')).toThrow();
      expect(getByTestId('1')).toBeDefined();

      await act(async () => fireEvent.click(document));

      expect(() => getByTestId('1')).toThrow();
    });

    it('allows bubbling to be prevented', async () => {
      const onRootClose = jest.fn();
      let close4 = 0;
      const { getByTestId } = render(
        <CloseListenerManager>
          <RenderClosable id="1" onClose={onRootClose}>
            {onClose => (
              <RenderClosable id="2" onClose={onClose}>
                {onClose1 => (
                  <RenderClosable
                    id="3"
                    isFullscreen={false}
                    onClose={onClose1}
                  >
                    {onClose2 => (
                      <RenderClosable
                        id="4"
                        isFullscreen={false}
                        onClose={e => {
                          if (close4 === 0) {
                            e.preventDefault();
                            close4++;
                          } else {
                            onClose2();
                          }
                        }}
                      />
                    )}
                  </RenderClosable>
                )}
              </RenderClosable>
            )}
          </RenderClosable>
        </CloseListenerManager>,
      );

      expect(getByTestId('4')).toBeDefined();
      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      // first click away is prevented so nothing happens
      await act(async () => fireEvent.click(document));

      expect(getByTestId('4')).toBeDefined();

      // fire click away layer 4 and 3 are not fullscreen so on close bubbles to layer 2 inclusive
      await act(async () => fireEvent.click(document));

      expect(() => getByTestId('4')).toThrow();
      expect(() => getByTestId('3')).toThrow();
      expect(() => getByTestId('2')).toThrow();
      expect(getByTestId('1')).toBeDefined();

      expect(onRootClose).not.toHaveBeenCalled();

      await act(async () => fireEvent.click(document));

      expect(onRootClose).toHaveBeenCalledTimes(1);
    });

    it('ignores click away if selection is being made', async () => {
      window.getSelection = jest.fn().mockReturnValue('Selection');
      // close listener always closes latest mounted component
      // because we work with an assumption that the latest mounted component is the one which is visible
      const { getByTestId } = render(
        <CloseListenerManager>
          <RootCloser>
            {onRootClose => (
              <RenderClosable id="1" onClose={onRootClose}>
                {onClose => (
                  <RenderClosable id="2" onClose={onClose}>
                    {onClose1 => (
                      <RenderClosable
                        id="3"
                        isFullscreen={false}
                        onClose={onClose1}
                      />
                    )}
                  </RenderClosable>
                )}
              </RenderClosable>
            )}
          </RootCloser>
          <RootCloser>
            {onRootClose => (
              <RenderClosable id="1-1" onClose={onRootClose}>
                {onClose => (
                  <RenderClosable id="2-2" onClose={onClose}>
                    {onClose1 => (
                      <RenderClosable
                        id="3-3"
                        isFullscreen={false}
                        onClose={onClose1}
                      />
                    )}
                  </RenderClosable>
                )}
              </RenderClosable>
            )}
          </RootCloser>
        </CloseListenerManager>,
      );

      expect(getByTestId('3-3')).toBeDefined();
      expect(getByTestId('2-2')).toBeDefined();
      expect(getByTestId('1-1')).toBeDefined();
      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      await act(async () => fireEvent.click(document));

      expect(getByTestId('3-3')).toBeDefined();
      expect(getByTestId('2-2')).toBeDefined();
      expect(getByTestId('1-1')).toBeDefined();
      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();
    });

    it('does not call onClose if onClose is already being resolved', async () => {
      let onClose1Mock = jest.fn();
      /* eslint-disable no-return-assign */
      const { getByTestId } = render(
        <CloseListenerManager>
          <RootCloser>
            {onRootClose => (
              <RenderClosable id="1" onClose={onRootClose}>
                {onClose => (
                  <RenderClosable id="2" delay={50} onClose={onClose}>
                    {onClose1 => (
                      <RenderClosable
                        id="3"
                        onClose={(onClose1Mock = jest.fn(onClose1))}
                      />
                    )}
                  </RenderClosable>
                )}
              </RenderClosable>
            )}
          </RootCloser>
        </CloseListenerManager>,
      );
      /* eslint-enable no-return-assign */

      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      // fire click away (closes only fullscreen layer and doesn't go further)
      fireEvent.click(document);
      fireEvent.click(document);
      fireEvent.click(document);

      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();
      expect(onClose1Mock).toHaveBeenCalledTimes(1);

      // wait
      await waitFor(() => {
        expect(() => getByTestId('3')).toThrow();
      });
    });
  });
});
