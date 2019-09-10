import React, { ReactNode, RefObject, KeyboardEvent, MouseEvent } from 'react';
import { createComponent, createBooleanVariant } from '../core';
import {
  ElementRect,
  getOffsetTop,
  getOffsetLeft,
  getTransformOriginValue,
  TransformOriginSettings,
  TransformVerticalPosition,
} from './shared';
import { Modal } from './Modal';

function getAnchorNode(
  anchor: HTMLElement | RefObject<HTMLElement>,
): HTMLElement | null {
  return anchor instanceof Element ? anchor : anchor.current;
}

const openPopoverVariant = createBooleanVariant('open', {
  onStyles: {
    visibility: 'hidden',
    opacity: 0,
  },
  offStyles: {
    visibility: 'hidden',
    opacity: 0,
  },
});

export const BasePopover = openPopoverVariant(
  createComponent('div', {
    displayName: 'Popover',
    defaultStyles: {
      position: 'absolute',
      overflowY: 'auto',
      overflowX: 'hidden',
      minWidth: '1rem',
      minHeight: '1rem',
      maxWidth: 'calc(100% - 1rem)',
      maxHeight: 'calc(100% - 1rem)',
      outline: 'none',
    },
  }),
);

export type PopoverProps = {
  allowScrolling?: boolean;
  anchor?: null | HTMLElement | RefObject<HTMLElement>;
  anchorOrigin?: TransformOriginSettings;
  anchorPosition?: { top: number; left: number };
  anchorReference?: 'anchor' | 'anchorPosition' | 'none';
  autoFocus?: boolean;
  backdrop?: boolean;
  children: ReactNode;
  keepAnchorWidth?: boolean;
  marginThreshold?: number;
  onClose?: (e: KeyboardEvent | MouseEvent) => void;
  open: boolean;
  transformOrigin?: TransformOriginSettings;
};

const defaultOrigin: TransformOriginSettings = {
  horizontal: 'left',
  vertical: 'top',
};

export function Popover({
  allowScrolling = false,
  autoFocus = true,
  children,
  anchor,
  anchorOrigin = defaultOrigin,
  anchorPosition,
  anchorReference = 'anchor',
  backdrop = true,
  keepAnchorWidth = false,
  marginThreshold = 16,
  open = true,
  transformOrigin = defaultOrigin,
  onClose = () => {},
}: PopoverProps) {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const handleResizeRef = React.useRef(() => {});

  const getAnchorOffset = React.useCallback(
    (
      contentAnchorOffset: number,
    ): {
      top: number;
      left: number;
      width?: number;
    } => {
      if (anchorReference === 'anchorPosition') {
        return anchorPosition!;
      }

      if (anchor == null) {
        throw new Error('Anchor must be defined');
      }

      const resolvedAnchorEl = getAnchorNode(anchor);
      const anchorElement =
        resolvedAnchorEl instanceof Element ? resolvedAnchorEl : document.body;
      const anchorRect = anchorElement.getBoundingClientRect();
      const anchorVertical: TransformVerticalPosition =
        contentAnchorOffset === 0 ? anchorOrigin.vertical : 'center';

      return {
        top:
          anchorRect.top +
          window.scrollY +
          getOffsetTop(anchorRect, anchorVertical),
        left:
          anchorRect.left + getOffsetLeft(anchorRect, anchorOrigin.horizontal),
        width: anchorRect.width,
      };
    },
    [
      anchor,
      anchorOrigin.horizontal,
      anchorOrigin.vertical,
      anchorPosition,
      anchorReference,
    ],
  );

  const getTransformOrigin = React.useCallback(
    (
      elemRect: ElementRect,
      contentAnchorOffset: number = 0,
    ): { vertical: number; horizontal: number } => {
      return {
        vertical:
          getOffsetTop(elemRect, transformOrigin.vertical) +
          contentAnchorOffset,
        horizontal: getOffsetLeft(elemRect, transformOrigin.horizontal),
      };
    },
    [transformOrigin.horizontal, transformOrigin.vertical],
  );

  const getPositioningStyle = React.useCallback(
    (
      element: HTMLElement,
    ): {
      left: null | string;
      top: null | string;
      transformOrigin: string;
      width?: string;
    } => {
      const contentAnchorOffset = 0;
      const elemRect = {
        width: element.offsetWidth,
        height: element.offsetHeight,
      };

      const elemTransformOrigin = getTransformOrigin(
        elemRect,
        contentAnchorOffset,
      );

      if (anchorReference === 'none') {
        return {
          left: null,
          top: null,
          transformOrigin: getTransformOriginValue(elemTransformOrigin),
        };
      }

      const anchorOffset = getAnchorOffset(contentAnchorOffset);

      const top = anchorOffset.top - elemTransformOrigin.vertical;
      const left = anchorOffset.left - elemTransformOrigin.horizontal;
      const width = anchorOffset.width ? `${anchorOffset.width}px` : undefined;
      // const bottom = top + elemRect.height;
      // const right = left + elemRect.width;

      // const containerWindow = window;

      // margin box around inside the window
      // const heightThreshold = containerWindow.innerHeight - marginThreshold;
      // const widthThreshold = containerWindow.innerWidth - marginThreshold;

      // transform if too close
      /*
      if ((top) < marginThreshold) {
        console.log('too close to top!');
        const diff = top - marginThreshold;
        top -= diff;
        elemTransformOrigin.vertical += diff;
      } else if (bottom > heightThreshold) {
        console.log('bottom', bottom);
        console.log('top', top);
        console.log('scroll', window.scrollY);
        console.log('too close to bottom!');
        const diff = bottom - heightThreshold;
        top -= diff;
        elemTransformOrigin.vertical += diff;
      }
      */

      // transform horizontal if too close
      /*
      if (left < marginThreshold) {
        const diff = left - marginThreshold;
        left -= diff;
        elemTransformOrigin.horizontal += diff;
      } else if (right > widthThreshold) {
        const diff = right - widthThreshold;
        left -= diff;
        elemTransformOrigin.horizontal += diff;
      }
      */

      return {
        top: `${top}px`,
        left: `${left}px`,
        transformOrigin: getTransformOriginValue(elemTransformOrigin),
        width,
      };
    },
    [
      anchor,
      anchorReference,
      getAnchorOffset,
      getTransformOrigin,
      marginThreshold,
    ],
  );

  /**
  const onDocumentFocus: EventListener = React.useCallback(e => {
    e.preventDefault();

    if (contentRef.current) {
      contentRef.current.focus();
    }
  }, []);

  // focus trap
  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('focus', onDocumentFocus, true);

      return () => {
        document.removeEventListener('focus', onDocumentFocus, true);
      };
    }
  }, []);
  */

  const setPositioningStyles = React.useCallback(
    (element: HTMLElement) => {
      const positioning = getPositioningStyle(element);

      if (keepAnchorWidth && positioning.width) {
        // eslint-disable-next-line no-param-reassign
        element.style.width = positioning.width;
      }

      if (positioning.top !== null) {
        // eslint-disable-next-line no-param-reassign
        element.style.top = positioning.top;
      }
      if (positioning.left !== null) {
        // eslint-disable-next-line no-param-reassign
        element.style.left = positioning.left;
      }
      // eslint-disable-next-line no-param-reassign
      element.style.transformOrigin = positioning.transformOrigin;
      // eslint-disable-next-line no-param-reassign
      element.style.opacity = '1';
      // eslint-disable-next-line no-param-reassign
      element.style.visibility = 'visible';
    },
    [getPositioningStyle, keepAnchorWidth],
  );

  React.useEffect(() => {
    if (open && contentRef.current) {
      const el = contentRef.current;

      setPositioningStyles(el);

      handleResizeRef.current = () => setPositioningStyles(el);
      window.addEventListener('resize', handleResizeRef.current);
    }
    return () => {
      window.removeEventListener('resize', handleResizeRef.current);
    };
  }, [open, contentRef.current, setPositioningStyles]);

  // focus popover content on mount
  React.useEffect(() => {
    if (contentRef.current && open && autoFocus) {
      contentRef.current.focus();
    }
  }, [open, contentRef.current, autoFocus]);

  return (
    <Modal
      backdrop={open && backdrop}
      backdropStyles={{ backgroundColor: 'transparent' }}
      allowScrolling={allowScrolling}
      fixed={false}
      id="popover-modal-container"
      onClose={onClose}
      open={open}
    >
      <BasePopover tabIndex={-1} open={open} ref={contentRef}>
        {children}
      </BasePopover>
    </Modal>
  );
}
