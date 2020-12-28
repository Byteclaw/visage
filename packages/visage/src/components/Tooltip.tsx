import React, {
  Children,
  ReactElement,
  useCallback,
  useState,
  Ref,
  useRef,
  MouseEventHandler,
  FocusEventHandler,
  ReactNode,
} from 'react';
import { createComponent } from '../core';
import { Placement, PlacementWithAnchorOrigin } from './shared';
import { Popper } from './Popper';
import { useDebouncedCallback, useStaticEffect, useUniqueId } from '../hooks';
import { variant, variantStyles } from '../variants';

const TooltipComponent = createComponent('div', {
  displayName: 'Tooltip',
  styles: {
    backgroundColor: `color(shadesText alpha(80%))`,
    borderColor:
      'color(shades if(isDark, color(shades tint(10%)), color(shades shade(10%))))',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 'controlBorderRadius',
    color: 'shades',
    fontSize: -1,
    lineHeight: '1rem',
    textAlign: 'center',
    m: 0.5,
    p: 0.5,
    ...variantStyles('status', {
      danger: {
        backgroundColor: 'danger',
        color: 'dangerText',
      },
      info: {
        backgroundColor: 'info',
        color: 'infoText',
      },
      success: {
        backgroundColor: 'success',
        color: 'successText',
      },
      warning: {
        backgroundColor: 'warning',
        color: 'warningText',
      },
      default: {
        backgroundColor: 'color(shadesText alpha(80%)',
        color: 'shades',
      },
    }),
  },
  variants: [
    variant('status', true, [
      'danger',
      'info',
      'success',
      'warning',
      'default',
    ] as const),
  ],
});

function bindEscapeKeyDownHandlers(
  onKeyDownHandler: (e: KeyboardEvent) => void,
) {
  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', onKeyDownHandler);

    return () => {
      document.removeEventListener('keydown', onKeyDownHandler);
    };
  }
}

function cancelDebouncedVisibilityChangeOnUnmount(
  cancelDebouncedVisibleChanger: () => void,
) {
  return () => cancelDebouncedVisibleChanger();
}

interface TooltipProvidedProps {
  /** And id of tooltip */
  'aria-describedby': string;
  /** Says where is tooltip rendered */
  'data-placement': Placement;
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
   * Id of an tooltip used to produce correct aria-describedby, if empty, unique id will be generated
   */
  id?: string;
  /**
   * Delay after which tooltip will show up. Default is 500ms
   */
  delay?: number;
  /**
   * Changes the look of tooltip component
   */
  status?: 'danger' | 'info' | 'success' | 'warning' | 'default';
}

const tooltipPlacements: PlacementWithAnchorOrigin[][] = [
  [
    {
      placement: Placement.topCenter,
      horizontal: 'center',
      vertical: 'bottom',
    },
    {
      placement: Placement.centerLeft,
      horizontal: 'right',
      vertical: 'center',
    },
    {
      placement: Placement.bottomCenter,
      horizontal: 'center',
      vertical: 'top',
    },
    {
      placement: Placement.centerRight,
      horizontal: 'left',
      vertical: 'center',
    },
  ],
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
export function Tooltip({
  children,
  content,
  delay = 500,
  id: outerId,
  status,
}: TooltipProps): React.ReactElement {
  const id = useUniqueId(outerId, 'tooltip');
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
  }, [cancelDebouncedVisibleChanger]);
  const onFocus = useCallback(() => {
    debouncedVisibleChanger(true);
  }, [debouncedVisibleChanger]);

  useStaticEffect(
    cancelDebouncedVisibilityChangeOnUnmount,
    cancelDebouncedVisibleChanger,
  );
  useStaticEffect(bindEscapeKeyDownHandlers, onKeyDownHandler);

  return (
    <>
      {React.cloneElement(Children.only(children), {
        'aria-describedby': id,
        ref: anchorRef,
        onBlur,
        onFocus,
        onMouseLeave: onBlur,
        onMouseEnter: onFocus,
      })}
      <Popper
        anchor={anchorRef}
        aria-hidden={!visible}
        id={id}
        open={visible}
        minHeight={50}
        minWidth={100}
        placement={tooltipPlacements}
        role="tooltip"
      >
        {() => <TooltipComponent status={status}>{content}</TooltipComponent>}
      </Popper>
    </>
  );
}
