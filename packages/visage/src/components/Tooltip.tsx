import React, {
  Children,
  ReactElement,
  ReactNode,
  useCallback,
  useState,
  Ref,
  useRef,
  useEffect,
  MouseEventHandler,
  FocusEventHandler,
} from 'react';
import { Placement, PlacementWithAnchorOrigin } from './shared';
import { Popover } from './Popover';
import { useDebouncedCallback } from '../hooks';

interface TooltipProvidedProps {
  /** Ref is necessary because it's used as an anchor for tooltip */
  ref?: Ref<any>;
  onMouseEnter: MouseEventHandler;
  onMouseLeave: MouseEventHandler;
  onFocus: FocusEventHandler;
  onBlur: FocusEventHandler;
}

interface TooltipProps {
  /**
   * An element that will receive onBlur, onFocus, onMouseEnter, onMouseLeave handlers.
   *
   * Must be only one element.
   */
  children: ReactElement<TooltipProvidedProps>;
  /**
   * Tooltip's content
   */
  content: ReactNode;
  /**
   * Delay after which tooltip will show up. Default is 500ms
   */
  delay: number;
}

const tooltipPlacements: PlacementWithAnchorOrigin[] = [
  [Placement.topCenter, { horizontal: 'center', vertical: 'bottom' }],
  [Placement.centerLeft, { horizontal: 'right', vertical: 'center' }],
  [Placement.bottomCenter, { horizontal: 'center', vertical: 'top' }],
  [Placement.centerRight, { horizontal: 'left', vertical: 'center' }],
];

/**
 * Tooltip component
 *
 * Simple popup that shows extra information if an element received keyboard focus
 * mouse hovers over it.
 *
 * https://www.w3.org/TR/wai-aria-practices-1.1/#tooltip
 *
 */
export function Tooltip({ children, content, delay = 500 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const anchorRef = useRef<HTMLElement | null>(null);
  const [
    debouncedVisibleChanger,
    cancelDebouncedVisibleChanger,
  ] = useDebouncedCallback(
    (isVisible: boolean) => {
      setVisible(isVisible);
    },
    delay,
    [setVisible],
  );
  const onKeyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        // should we add prevent default? For example if you have Dialog and there is a close button
        // with tooltip, then when you press escape it will not only close the tooltip but the dialog too
        // I think thats correct
        cancelDebouncedVisibleChanger();
        setVisible(false);
      }
    },
    [cancelDebouncedVisibleChanger, visible, setVisible],
  );
  const onBlur = useCallback(() => {
    setVisible(false);
    cancelDebouncedVisibleChanger();
  }, [debouncedVisibleChanger]);
  const onFocus = useCallback(() => {
    debouncedVisibleChanger(true);
  }, [debouncedVisibleChanger]);

  useEffect(() => {
    return () => {
      cancelDebouncedVisibleChanger();
    };
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', onKeyDownHandler);

      return () => {
        document.removeEventListener('keydown', onKeyDownHandler);
      };
    }
  }, [onKeyDownHandler]);

  return (
    <>
      {React.cloneElement(Children.only(children), {
        ref: anchorRef,
        onBlur,
        onFocus,
        onMouseLeave: onBlur,
        onMouseEnter: onFocus,
      })}
      <Popover
        allowScrolling
        anchor={anchorRef}
        autoFocus={false}
        aria-hidden={!visible}
        open={visible}
        placement={tooltipPlacements}
        role="tooltip"
      >
        {content}
      </Popover>
    </>
  );
}
