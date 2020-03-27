/* eslint-disable no-shadow */
import { act, fireEvent, render } from '@testing-library/react';
import React, { useContext, useState, ReactElement, useRef } from 'react';
import {
  CloseListenerManager,
  CloseListenerManagerContext,
} from '../CloseListenerManager';
import { useOnRenderEffect } from '../hooks';

function RenderClosable({
  children,
  id,
  isFullscreen,
  onClose,
}: {
  children?: (onClose: () => void) => ReactElement;
  id: string;
  isFullscreen?: boolean;
  onClose(e: Event): void;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(true);
  const closeListenerManager = useContext(CloseListenerManagerContext);

  useOnRenderEffect(() => {
    const unregisterEscape = closeListenerManager.registerEscapeKeyDownListener(
      onClose,
    );
    const unregisterClick = closeListenerManager.registerClickAwayListener(
      divRef,
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
      <React.Fragment>
        <div data-testid={id} />
        {open && children ? children(() => setOpen(false)) : null}
      </React.Fragment>
    </div>
  );
}

jest.setTimeout(10000);

describe('CloseListenerManager', () => {
  describe('escape key down', () => {
    it('registers escape key down handler', () => {
      // close listener manager must be used in nested way and not as siblings otherwise
      // it will behave incorrectly
      const onRootClose = jest.fn();
      const { getByTestId } = render(
        <CloseListenerManager>
          <RenderClosable id="1" onClose={onRootClose}>
            {onClose => (
              <RenderClosable id="2" onClose={onClose}>
                {onClose => (
                  <RenderClosable id="3" onClose={onClose}>
                    {onClose => <RenderClosable id="4" onClose={onClose} />}
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

      // fire escape keydown
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(() => getByTestId('4')).toThrow();
      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(() => getByTestId('3')).toThrow();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(() => getByTestId('2')).toThrow();
      expect(getByTestId('1')).toBeDefined();

      expect(onRootClose).not.toHaveBeenCalled();

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onRootClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('click away', () => {
    it('registers as fullscreen by default (prevents bubbling to shallower layers)', async () => {
      // close listener manager must be used in nested way and not as siblings otherwise
      // it will behave incorrectly
      const onRootClose = jest.fn();
      const { getByTestId } = render(
        <CloseListenerManager>
          <RenderClosable id="1" onClose={onRootClose}>
            {onClose => (
              <RenderClosable id="2" onClose={onClose}>
                {onClose => (
                  <RenderClosable id="3" onClose={onClose}>
                    {onClose => <RenderClosable id="4" onClose={onClose} />}
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

      // fire click away (closes only fullscreen layer and doesn't go further)
      fireEvent.click(document);

      expect(() => getByTestId('4')).toThrow();
      expect(getByTestId('3')).toBeDefined();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      fireEvent.click(document);

      expect(() => getByTestId('3')).toThrow();
      expect(getByTestId('2')).toBeDefined();
      expect(getByTestId('1')).toBeDefined();

      fireEvent.click(document);

      expect(() => getByTestId('2')).toThrow();
      expect(getByTestId('1')).toBeDefined();

      expect(onRootClose).not.toHaveBeenCalled();

      fireEvent.click(document);

      expect(onRootClose).toHaveBeenCalledTimes(1);
    });

    it('allows to define layers as not fullscreen (bubble to shallower levels)', async () => {
      // close listener manager must be used in nested way and not as siblings otherwise
      // it will behave incorrectly
      const onRootClose = jest.fn();
      const { getByTestId } = render(
        <CloseListenerManager>
          <RenderClosable id="1" onClose={onRootClose}>
            {onClose => (
              <RenderClosable id="2" onClose={onClose}>
                {onClose => (
                  <RenderClosable id="3" isFullscreen={false} onClose={onClose}>
                    {onClose => (
                      <RenderClosable
                        id="4"
                        isFullscreen={false}
                        onClose={onClose}
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

      // fire click away layer 4 and 3 are not fullscreen so on close bubbles to layer 2 inclusive
      await act(async () => fireEvent.click(document));

      expect(() => getByTestId('4')).toThrow();
      expect(() => getByTestId('3')).toThrow();
      expect(() => getByTestId('2')).toThrow();
      expect(getByTestId('1')).toBeDefined();

      expect(onRootClose).not.toHaveBeenCalled();

      fireEvent.click(document);

      expect(onRootClose).toHaveBeenCalledTimes(1);
    });

    it('allows bubbling to be prevented', async () => {
      // close listener manager must be used in nested way and not as siblings otherwise
      // it will behave incorrectly
      const onRootClose = jest.fn();
      let close4 = 0;
      const { getByTestId } = render(
        <CloseListenerManager>
          <RenderClosable id="1" onClose={onRootClose}>
            {onClose => (
              <RenderClosable id="2" onClose={onClose}>
                {onClose => (
                  <RenderClosable id="3" isFullscreen={false} onClose={onClose}>
                    {onClose => (
                      <RenderClosable
                        id="4"
                        isFullscreen={false}
                        onClose={e => {
                          if (close4 === 0) {
                            e.preventDefault();
                            close4++;
                          } else {
                            onClose();
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
      fireEvent.click(document);

      expect(getByTestId('4')).toBeDefined();

      // fire click away layer 4 and 3 are not fullscreen so on close bubbles to layer 2 inclusive
      await act(async () => fireEvent.click(document));

      expect(() => getByTestId('4')).toThrow();
      expect(() => getByTestId('3')).toThrow();
      expect(() => getByTestId('2')).toThrow();
      expect(getByTestId('1')).toBeDefined();

      expect(onRootClose).not.toHaveBeenCalled();

      fireEvent.click(document);

      expect(onRootClose).toHaveBeenCalledTimes(1);
    });
  });
});
