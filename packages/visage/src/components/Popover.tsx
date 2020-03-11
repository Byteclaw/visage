import { useUniqueId } from '@byteclaw/use-unique-id';
import React, {
  ReactNode,
  RefObject,
  KeyboardEvent,
  MouseEvent,
  useMemo,
} from 'react';
import {
  StyleProps as VisageStyleProps,
  useDesignSystem,
} from '@byteclaw/visage-core';
import { getResponsiveValue } from '@byteclaw/visage-utils';
import { createComponent } from '../core';
import { booleanVariant } from '../variants';
import {
  ElementRect,
  getOffsetTop,
  getOffsetLeft,
  getTransformOriginValue,
  TransformOriginSettings,
  TransformVerticalPosition,
} from './shared';
import { Modal } from './Modal';
import { useDebouncedCallback } from '../hooks';
import { useLayerManager } from './LayerManager';

function getAnchorNode(
  anchor: HTMLElement | RefObject<HTMLElement>,
): HTMLElement | null {
  return anchor instanceof Element ? anchor : anchor.current;
}

export const BasePopover = createComponent('div', {
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
    opacity: 0,
  },
  variants: [booleanVariant('open', true)],
});

interface PopoverProps extends VisageStyleProps {
  allowScrolling?: boolean;
  alwaysVisible?: boolean;
  anchor?: null | HTMLElement | RefObject<HTMLElement>;
  anchorOrigin?: TransformOriginSettings;
  anchorPosition?: { top: number; left: number };
  anchorReference?: 'anchor' | 'anchorPosition' | 'none';
  autoFocus?: boolean;
  backdrop?: boolean;
  children: ReactNode;
  /**
   * Should the popover be rendered as fullscreen?
   * This prop is responsive
   */
  fullscreen?: boolean | boolean[];
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

/**
 * IE 11 compatibility
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
 */
function getWindowScrollY() {
  return window.scrollY != null ? window.scrollY : window.pageYOffset;
}

function getWindowScrollX() {
  return window.scrollX != null ? window.scrollX : window.pageXOffset;
}

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
  const { breakpoint } = useDesignSystem();
  const idTemplate = useUniqueId();
  const id = useMemo(() => {
    return outerId || `popover-${idTemplate}`;
  }, [idTemplate, outerId]);
  const isFullscreen = useMemo(() => {
    if (!fullscreen) {
      return false;
    }

    return getResponsiveValue(breakpoint, fullscreen);
  }, [fullscreen, breakpoint]);

  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const handleResizeRef = React.useRef(() => {});
  const { zIndex } = useLayerManager();

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
          getWindowScrollY() +
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

      if (isFullscreen) {
        return {
          left: `${getWindowScrollX()}px`,
          top: `${getWindowScrollY()}px`,
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
      const scrollY = getWindowScrollY();
      const scrollX = getWindowScrollX();

      // if placement is custom or Popover content is to be always completely in the viewport
      if (
        placement === 'top' ||
        placement === 'top-left' ||
        placement === 'top-right' ||
        (alwaysVisible && top - scrollY + elemRect.height > window.innerHeight)
      ) {
        // look in which half of the screen (upper/lower) the anchor is
        if (
          anchorOffset.top -
            resolvedAnchor!.getBoundingClientRect().height / 2 -
            scrollY -
            marginThreshold <
          window.innerHeight / 2
        ) {
          // upper half of the screen - just cut the height at the end
          height =
            window.innerHeight -
            (anchorOffset.top - scrollY - elemTransformOrigin.vertical) -
            marginThreshold;
        } else {
          // lower part - it means we will open it bottom-top
          if (
            anchorOffset.top -
              elemTransformOrigin.vertical -
              scrollY -
              marginThreshold <
            elemRect.height
          ) {
            // first we will cut the top end if needed
            height =
              anchorOffset.top -
              resolvedAnchor!.getBoundingClientRect().height -
              scrollY -
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
          left - scrollX + elemRect.width > window.innerWidth)
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
      isFullscreen,
      getAnchorOffset,
      getTransformOrigin,
      marginThreshold,
      placement,
    ],
  );

  const setPositioningStyles = React.useCallback(
    (element: HTMLElement) => {
      const positioning = getPositioningStyle(element);

      if ((isFullscreen || keepAnchorWidth) && positioning.width) {
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
    [getPositioningStyle, keepAnchorWidth, isFullscreen],
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
      unlockBodyScroll={allowScrolling}
      fixed={false}
      id={id}
      onClose={onClose}
      open={open}
      contentRef={contentRef}
    >
      <BasePopover
        {...restProps}
        tabIndex={-1}
        open={open}
        ref={contentRef}
        styles={{ zIndex, ...restProps.styles }}
      >
        {children}
      </BasePopover>
    </Modal>
  );
}
