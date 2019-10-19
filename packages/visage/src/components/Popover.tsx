import React, {
  ReactNode,
  RefObject,
  KeyboardEvent,
  MouseEvent,
  useMemo,
} from 'react';
import { StyleProps as VisageStyleProps } from '@byteclaw/visage-core';
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
import { StyleProps } from '../createNPointTheme';
import { useDebouncedCallback, useGenerateId } from '../hooks';

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
      maxWidth: ['100vw', 'calc(100% - 1rem)'],
      maxHeight: ['100vh', 'calc(100% - 1rem)'],
      outline: 'none',
    },
  }),
);

interface PopoverProps extends VisageStyleProps<StyleProps> {
  allowScrolling?: boolean;
  alwaysVisible?: boolean;
  anchor?: null | HTMLElement | RefObject<HTMLElement>;
  anchorOrigin?: TransformOriginSettings;
  anchorPosition?: { top: number; left: number };
  anchorReference?: 'anchor' | 'anchorPosition' | 'none';
  autoFocus?: boolean;
  backdrop?: boolean;
  children: ReactNode;
  fullscreen?: boolean;
  id?: string;
  keepAnchorWidth?: boolean;
  marginThreshold?: number;
  onClose?: (e: KeyboardEvent | MouseEvent) => void;
  open: boolean;
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';
  transformOrigin?: TransformOriginSettings;
}

const defaultOrigin: TransformOriginSettings = {
  horizontal: 'left',
  vertical: 'top',
};

export function Popover({
  allowScrolling = false,
  alwaysVisible = false,
  autoFocus = true,
  children,
  anchor,
  anchorOrigin = defaultOrigin,
  anchorPosition,
  anchorReference = 'anchor',
  backdrop = true,
  fullscreen = false,
  id: outerId,
  keepAnchorWidth = false,
  marginThreshold = 16,
  open = true,
  transformOrigin = defaultOrigin,
  onClose = () => {},
  placement = 'bottom',
  ...restProps
}: PopoverProps) {
  const idTemplate = useGenerateId();
  const id = useMemo(() => {
    return outerId || `popover-${idTemplate}`;
  }, [idTemplate, outerId]);

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
      height?: string;
      width?: string;
    } => {
      if (anchor == null) {
        throw new Error('Anchor must be defined');
      }

      const resolvedAnchor = getAnchorNode(anchor);
      const containerWindow = window;

      const contentAnchorOffset = 0;
      const elemRect = {
        width: element.offsetWidth,
        height: element.scrollHeight,
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

      if (fullscreen) {
        return {
          left: `${containerWindow.scrollX}px`,
          top: `${containerWindow.scrollY}px`,
          transformOrigin: getTransformOriginValue(elemTransformOrigin),
          height: '100vh',
          width: '100vw',
        };
      }

      const anchorOffset = getAnchorOffset(contentAnchorOffset);

      let top = anchorOffset.top - elemTransformOrigin.vertical;
      let left = anchorOffset.left - elemTransformOrigin.horizontal;
      let height;
      const width = anchorOffset.width ? `${anchorOffset.width}px` : undefined;

      // if placement is custom or Popover content is to be always completely in the viewport
      if (
        placement === 'top' ||
        placement === 'top-left' ||
        placement === 'top-right' ||
        (alwaysVisible &&
          top - containerWindow.scrollY + elemRect.height >
            containerWindow.innerHeight)
      ) {
        // look in which half of the screen (upper/lower) the anchor is
        if (
          anchorOffset.top -
            resolvedAnchor!.getBoundingClientRect().height / 2 -
            containerWindow.scrollY -
            marginThreshold <
          containerWindow.innerHeight / 2
        ) {
          // upper half of the screen - just cut the height at the end
          height =
            containerWindow.innerHeight -
            (anchorOffset.top -
              containerWindow.scrollY -
              elemTransformOrigin.vertical) -
            marginThreshold;
        } else {
          // lower part - it means we will open it bottom-top
          if (
            anchorOffset.top -
              elemTransformOrigin.vertical -
              containerWindow.scrollY -
              marginThreshold <
            elemRect.height
          ) {
            // first we will cut the top end if needed
            height =
              anchorOffset.top -
              resolvedAnchor!.getBoundingClientRect().height -
              containerWindow.scrollY -
              elemTransformOrigin.vertical -
              marginThreshold;
          }
          top =
            anchorOffset.top -
            resolvedAnchor!.offsetHeight -
            (height == null ? elemRect.height : height) -
            elemTransformOrigin.vertical;
        }
      }

      // if placement is custom or cropped by the viewport right edge, render it right-left
      if (
        placement === 'left' ||
        placement === 'top-left' ||
        placement === 'bottom-right' ||
        (alwaysVisible &&
          keepAnchorWidth === false &&
          left - containerWindow.scrollX + elemRect.width >
            containerWindow.innerWidth)
      ) {
        left =
          anchorOffset.left -
          (elemRect.width - resolvedAnchor!.offsetWidth) -
          elemTransformOrigin.horizontal;
      }

      return {
        top: `${top}px`,
        left: `${left}px`,
        transformOrigin: getTransformOriginValue(elemTransformOrigin),
        width,
        height: height ? `${height}px` : undefined,
      };
    },
    [
      alwaysVisible,
      anchor,
      anchorReference,
      fullscreen,
      getAnchorOffset,
      getTransformOrigin,
      marginThreshold,
      placement,
    ],
  );

  const setPositioningStyles = React.useCallback(
    (element: HTMLElement) => {
      const positioning = getPositioningStyle(element);

      if (keepAnchorWidth && positioning.width) {
        // eslint-disable-next-line no-param-reassign
        element.style.width = positioning.width;
      }

      if (positioning.height != null) {
        // eslint-disable-next-line no-param-reassign
        element.style.height = positioning.height;
      } else {
        // eslint-disable-next-line no-param-reassign
        element.style.height = 'auto';
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

  const [resizeHandler] = useDebouncedCallback(setPositioningStyles, 25, []);

  React.useEffect(() => {
    if (open && contentRef.current) {
      const el = contentRef.current;

      setPositioningStyles(el);

      handleResizeRef.current = () => resizeHandler(el);

      window.addEventListener('resize', handleResizeRef.current);
    }
    return () => {
      window.removeEventListener('resize', handleResizeRef.current);
    };
  }, [open, contentRef.current, children, setPositioningStyles]);

  // focus popover content on mount
  React.useEffect(() => {
    if (contentRef.current && open && autoFocus) {
      contentRef.current.focus();
    }
  }, [open, contentRef.current, autoFocus]);

  return (
    <Modal
      backdrop={open && backdrop}
      allowScrolling={allowScrolling}
      fixed={false}
      id={id}
      onClose={onClose}
      open={open}
      contentRef={contentRef}
    >
      <BasePopover {...restProps} tabIndex={-1} open={open} ref={contentRef}>
        {children}
      </BasePopover>
    </Modal>
  );
}
