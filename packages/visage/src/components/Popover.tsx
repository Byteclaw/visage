import React, {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  useDesignSystem,
  ExtractVisageComponentProps,
} from '@byteclaw/visage-core';
import { getResponsiveValue } from '@byteclaw/visage-utils';
import { createComponent } from '../core';
import { booleanVariant } from '../variants';
import {
  getAnchorPositionAndDimensions,
  computePositioningStyles,
  AnchorPosition,
  AnchorOrigin,
  Placement,
  PlacementWithAnchorOrigin,
  getWindowScrollX,
  getWindowScrollY,
} from './shared';
import { Modal } from './Modal';
import {
  useAutofocusOnMount,
  useDebouncedCallback,
  useUniqueId,
  useCombinedRef,
} from '../hooks';
import { useLayerManager } from './LayerManager';

export const BasePopover = createComponent('div', {
  displayName: 'Popover',
  styles: {
    position: 'absolute',
    overflowY: 'auto',
    overflowX: 'hidden',
    outline: 'none',
    opacity: 0,
  },
  variants: [booleanVariant('open', true)],
});

interface PopoverProps extends ExtractVisageComponentProps<typeof BasePopover> {
  /**
   * Should scroll of underlying elements be possible?
   */
  allowScrolling?: boolean;
  anchor?: null | RefObject<HTMLElement> | AnchorPosition;
  /**
   * Disables close listener on Escape key down
   */
  disableOnEscapeClose?: boolean;
  /**
   * Disables close listener on click away
   */
  disableOnClickAwayClose?: boolean;
  /**
   * Should the content be automatically focused when Popover is open? Default is true
   */
  autoFocus?: boolean;
  /**
   * Enables/Disables backdrop
   *
   * With backdrop enabled there is an invisible layer that prevents clicking on underlying elements
   */
  backdrop?: boolean;
  children: ReactNode;
  /**
   * Should the popover be rendered as fullscreen?
   *
   * This prop is responsive
   */
  fullscreen?: boolean | boolean[];
  id?: string;
  /**
   * Should popover keep the width of an anchor? This props takes precedence over minWidth
   *
   * This works only if anchor is Ref to HTML element
   */
  keepAnchorWidth?: boolean;
  /**
   * Should we render Popover all the way to the edge or keep some space?
   */
  // marginThreshold?: number;
  /**
   * Minimum height in pixels required for placement
   */
  minHeight?: number;
  /**
   * Minimum width in pixels required for placement
   */
  minWidth?: number;
  onClose?: () => void;
  /**
   * Is Popover open?
   */
  open?: boolean;
  /**
   * Prioritized array of placement and anchor origin tuples
   *
   * Can be used to say how should popover behave in different scenarios
   *
   * Default is top left placement with top left anchor origin
   */
  placement?: PlacementWithAnchorOrigin[];
  /**
   * Ref to div that wraps the popover content
   */
  popoverRef?: RefObject<HTMLDivElement>;
}

function isAnchorPosition(anchor: any): anchor is AnchorPosition {
  return typeof anchor === 'object' && anchor != null && anchor.current == null;
}

function resolveAnchor(
  anchor: RefObject<HTMLElement> | AnchorPosition | null | undefined,
): HTMLElement | AnchorPosition | null | undefined {
  if (anchor == null) {
    return anchor;
  }

  return isAnchorPosition(anchor) ? anchor : anchor.current;
}

const defaultOrigin: AnchorOrigin = {
  horizontal: 'left',
  vertical: 'top',
};
const defaultPlacement: PlacementWithAnchorOrigin[] = [
  [Placement.topLeft, defaultOrigin],
];

export function Popover({
  allowScrolling = false,
  autoFocus = true,
  children,
  anchor,
  backdrop = true,
  disableOnClickAwayClose,
  disableOnEscapeClose,
  fullscreen = false,
  id: outerId,
  keepAnchorWidth = false,
  minHeight,
  minWidth,
  open = true,
  onClose = () => {},
  placement = defaultPlacement,
  popoverRef,
  ...restProps
}: PopoverProps) {
  const { breakpoint } = useDesignSystem();
  const id = useUniqueId(outerId, 'popover');
  const isFullscreen = useMemo(() => {
    if (!fullscreen) {
      return false;
    }

    return getResponsiveValue(breakpoint, fullscreen);
  }, [fullscreen, breakpoint]);

  const contentRef = useCombinedRef(popoverRef);
  const handleResizeRef = useRef(() => {});
  // @TODO check if refs are ok because dialog is being closed on Esc
  const preventCloseRefs = useRef(
    !anchor || isAnchorPosition(anchor) ? [] : [anchor],
  );
  const { zIndex } = useLayerManager();

  const setPositioningStyles = useCallback(
    (element: HTMLElement) => {
      if (isFullscreen) {
        /* eslint-disable no-param-reassign */
        element.style.width = `100vw`;
        element.style.height = `100vh`;
        element.style.top = `${getWindowScrollY()}px`;
        element.style.left = `${getWindowScrollX()}px`;
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        /* eslint-enable no-param-reassign */
        return;
      }

      const anchorElementOrPosition =
        resolveAnchor(anchor) ||
        (typeof document !== 'undefined' ? document.body : undefined);

      if (anchorElementOrPosition == null) {
        throw new Error('Could not resolve an anchor');
      }

      const anchorPositionAndDimensions = getAnchorPositionAndDimensions(
        anchorElementOrPosition,
      );
      const positioning = computePositioningStyles(window, element, {
        anchor: anchorElementOrPosition,
        placementAndOrigin: placement,
        minWidth: keepAnchorWidth
          ? anchorPositionAndDimensions.width
          : minWidth,
        minHeight,
      });

      /* eslint-disable no-param-reassign */
      element.style.width = `${
        keepAnchorWidth ? anchorPositionAndDimensions.width : positioning.width
      }px`;
      element.style.height = `${positioning.height}px`;
      element.style.top = `${positioning.top}px`;
      element.style.left = `${positioning.left}px`;
      element.style.opacity = '1';
      element.style.visibility = 'visible';
      /* eslint-enable no-param-reassign */
    },
    [
      children,
      keepAnchorWidth,
      isFullscreen,
      anchor,
      minWidth,
      minHeight,
      placement,
    ],
  );

  const [resizeHandler] = useDebouncedCallback(setPositioningStyles, 25, []);

  useEffect(() => {
    if (open && contentRef.current) {
      const el = contentRef.current;

      setPositioningStyles(el);

      handleResizeRef.current = () => resizeHandler(el);

      window.addEventListener('resize', handleResizeRef.current);
    }
    return () => {
      window.removeEventListener('resize', handleResizeRef.current);
    };
  }, [
    anchor,
    open,
    contentRef.current,
    children,
    setPositioningStyles,
    resizeHandler,
  ]);

  useAutofocusOnMount(autoFocus && open ? contentRef : undefined);

  return (
    <Modal
      backdrop={backdrop}
      disableOnEscapeClose={disableOnEscapeClose}
      disableOnClickAwayClose={disableOnClickAwayClose}
      unlockBodyScroll={allowScrolling}
      fixed={false}
      id={id}
      onClose={onClose}
      open={open}
      contentRef={contentRef}
      preventCloseRefs={preventCloseRefs.current}
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
