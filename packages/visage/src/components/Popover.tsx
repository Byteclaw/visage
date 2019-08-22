import React, { ReactNode } from 'react';
import { createComponent, createBooleanVariant } from '../core';
import { getOffsetTop, getOffsetLeft, getTransformOriginValue } from './shared';
import { Modal } from './Modal';

function getAnchorNode(anchor: any) {
  return typeof anchor === 'function' ? anchor() : anchor;
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
    displayName: 'BasePopover',
    defaultStyles: {
      borderColor: 'primary',
      borderWidth: '1px',
      borderStyle: 'solid',
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
  anchor: any;
  anchorOrigin: any;
  autoFocus?: boolean;
  backdrop?: boolean;
  children: ReactNode;
  open: boolean;
  anchorReference?: any;
  marginThreshold?: any;
  transformOrigin?: any;
  anchorPosition?: any;
  getContentAnchorEl?: any;
  onClose?: any;
};

export function Popover({
  allowScrolling = false,
  autoFocus = true,
  children,
  anchor,
  anchorPosition,
  anchorOrigin = {
    vertical: 'top',
    horizontal: 'left',
  },
  backdrop = true,
  transformOrigin = {
    vertical: 'top',
    horizontal: 'left',
  },
  anchorReference = 'anchor',
  marginThreshold = 16,
  open = true,
  onClose = () => {},
}: PopoverProps) {
  const contentRef = React.useRef<HTMLDivElement>();
  const handleResizeRef = React.useRef(() => {});

  const getAnchorOffset = React.useCallback(
    contentAnchorOffset => {
      if (anchorReference === 'anchorPosition') {
        return anchorPosition;
      }

      const resolvedAnchorEl = getAnchorNode(anchor);
      const anchorElement =
        resolvedAnchorEl instanceof Element ? resolvedAnchorEl : document.body;
      const anchorRect = anchorElement.getBoundingClientRect();
      const anchorVertical =
        contentAnchorOffset === 0 ? anchorOrigin.vertical : 'center';

      return {
        top:
          anchorRect.top +
          window.scrollY +
          getOffsetTop(anchorRect, anchorVertical),
        left:
          anchorRect.left + getOffsetLeft(anchorRect, anchorOrigin.horizontal),
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
    (elemRect, contentAnchorOffset = 0) => {
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
    element => {
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
          top: null,
          left: null,
          transformOrigin: getTransformOriginValue(elemTransformOrigin),
        };
      }

      const anchorOffset = getAnchorOffset(contentAnchorOffset);

      const top = anchorOffset.top - elemTransformOrigin.vertical;
      const left = anchorOffset.left - elemTransformOrigin.horizontal;
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

  const getContentRef = React.useCallback(instance => {
    contentRef.current = instance;
  }, []);

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
    element => {
      const positioning = getPositioningStyle(element);

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
      element.style.opacity = 1;
      // eslint-disable-next-line no-param-reassign
      element.style.visibility = 'visible';
    },
    [getPositioningStyle],
  );

  React.useEffect(() => {
    if (open) {
      setPositioningStyles(contentRef.current);
      handleResizeRef.current = () => setPositioningStyles(contentRef.current);
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
      <BasePopover tabIndex={-1} open={open} ref={getContentRef}>
        {children}
      </BasePopover>
    </Modal>
  );
}
