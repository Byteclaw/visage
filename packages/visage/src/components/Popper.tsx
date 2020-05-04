import React, {
  ReactElement,
  useRef,
  useState,
  Children,
  RefObject,
  useMemo,
} from 'react';
import {
  Placement,
  PlacementConstraints,
  PositioningStyles,
  PlacementWithAnchorOrigin,
  AnchorPosition,
  computePositioningStyles,
} from './shared';
import { useDebouncedCallback, useUniqueId, useStaticEffect } from '../hooks';
import { Portal } from './Portal';
import { LayerManager, useLayerManager } from './LayerManager';

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

interface PositioningParams extends PlacementConstraints {
  anchor: RefObject<HTMLElement> | AnchorPosition | null | undefined;
  content: RefObject<HTMLElement>;
  open: boolean;
  placementAndOrigin: PlacementWithAnchorOrigin[];
  setPosition(position: PositioningStyles): void;
  marginThreshold?: number;
  zIndex: number;
}

function positionContent({
  anchor,
  content,
  placementAndOrigin,
  setPosition,
  zIndex,
  ...constraints
}: PositioningParams) {
  const { current: contentEl } = content;

  if (contentEl == null) {
    return;
  }

  const resolvedAnchor = resolveAnchor(anchor);

  if (resolvedAnchor == null) {
    throw new Error('Anchor must be an HTMLElement or AnchorPosition');
  }

  // reset styles so we can compute right dimensions
  /* eslint-disable no-param-reassign */
  contentEl.style.height = 'auto';
  contentEl.style.width = 'auto';
  /* eslint-enable no-param-reassign */

  const position = computePositioningStyles(window, contentEl, {
    anchor: resolvedAnchor,
    placementAndOrigin,
    ...constraints,
  });

  /* eslint-disable no-param-reassign */
  contentEl.style.zIndex = `${zIndex}`;
  contentEl.style.opacity = '1';
  // following lines causes blurry render if fractions are computed, so we round them
  // https://stackoverflow.com/questions/6411361/webkit-based-blurry-distorted-text-post-animation-via-translate3d
  contentEl.style.transform = `translate3d(${Math.round(
    position.left,
  )}px, ${Math.round(position.top)}px, 0px)`;
  contentEl.style.width = `${position.width}px`;
  contentEl.style.height = `${position.height}px`;
  contentEl.style.visibility = 'visible';
  /* eslint-enable no-param-reassign */

  setPosition(position);
}

function positionContentAndBindResizeListeners(
  params: PositioningParams,
  positionFn: typeof positionContent,
) {
  if (
    !params.open ||
    !params.content.current ||
    typeof window === 'undefined'
  ) {
    return;
  }

  const resizeHandler = () => positionFn(params);

  window.addEventListener('resize', resizeHandler);

  // position content
  positionFn(params);

  return () => {
    window.removeEventListener('resize', resizeHandler);
  };
}

function cancelPositionFnOnUnmount(cancelPositionFn: Function) {
  return () => {
    cancelPositionFn();
  };
}

interface PopperRendererProps {
  /**
   * Placement used to render
   *
   * On initial render can be empty because we don't know the position unless we render the content.
   */
  placement?: Placement | null;
}

interface PopperProvidedProps {
  /**
   * Placement used to render
   *
   * On initial render can be empty because we don't know the position unless we render the content.
   */
  'data-placement'?: PopperRendererProps['placement'];
}

type PopperRenderer = (renderProps: PopperRendererProps) => ReactElement;

type DivProps = JSX.IntrinsicElements['div'];

interface PopperProps extends DivProps, PlacementConstraints {
  anchor: RefObject<HTMLElement> | AnchorPosition;
  /**
   * Children renderer or element that will receive props
   *
   * By default on initial render it doesn't have any placement matched.
   * It's recommended not to change content dimensions in response to matched placement.
   */
  children: PopperRenderer | ReactElement<PopperProvidedProps>;
  /**
   * Is Popper open?
   */
  open?: boolean;
  /**
   * Prioritized array of placement to anchor origin tuples
   */
  placement: PlacementWithAnchorOrigin[];
}

const baseStyle: React.CSSProperties = {
  willChange: 'transform',
  position: 'absolute',
  opacity: 0,
  overflow: 'auto',
  top: 0,
  left: 0,
  visibility: 'hidden',
};

/**
 * Popper
 *
 * Display a content placed near an element.
 *
 * This component can be used to create tooltips, etc.
 */
export function Popper({
  anchor,
  children,
  id: outerId,
  marginThreshold = 16,
  minHeight,
  minWidth,
  open = false,
  placement,
  ...restProps
}: PopperProps) {
  const portalId = useUniqueId(outerId, 'popper');
  const contentRef = useRef<HTMLDivElement | null>(null);
  const openRef = useRef(open);
  const { zIndex } = useLayerManager();
  const [position, setPosition] = useState<PositioningStyles | null>(null);
  const params: PositioningParams = useMemo(
    () => ({
      anchor,
      content: contentRef,
      setPosition,
      marginThreshold,
      minHeight,
      minWidth,
      open,
      placementAndOrigin: placement,
      zIndex,
    }),
    [
      anchor,
      contentRef,
      marginThreshold,
      minHeight,
      minWidth,
      open,
      placement,
      setPosition,
      zIndex,
    ],
  );
  const [positionFn, cancelPositionFn] = useDebouncedCallback(
    positionContent,
    10,
    [],
  );

  useStaticEffect(positionContentAndBindResizeListeners, params, positionFn);
  useStaticEffect(cancelPositionFnOnUnmount, cancelPositionFn);

  if (openRef.current !== open && !open) {
    openRef.current = open;

    setPosition(null);
  }

  if (!open || typeof document === 'undefined') {
    return null;
  }

  const renderedPlacement: Placement | undefined = position
    ? position.placement
    : undefined;

  return (
    <Portal containerId={portalId}>
      <LayerManager>
        <div {...restProps} id={outerId} ref={contentRef} style={baseStyle}>
          {typeof children === 'function'
            ? children({ placement: renderedPlacement })
            : React.cloneElement(Children.only(children), {
                'data-placement': renderedPlacement,
              })}
        </div>
      </LayerManager>
    </Portal>
  );
}
