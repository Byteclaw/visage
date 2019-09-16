import {
  createComponent,
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
  useDesignSystem,
} from '@byteclaw/visage-core';
import { getResponsiveValue } from '@byteclaw/visage-utils';
import React, {
  Children,
  cloneElement,
  ReactNode,
  MouseEvent,
  KeyboardEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  KeyboardEventHandler,
  forwardRef,
  RefObject,
  useMemo,
} from 'react';

import { StyleProps } from '../createNPointTheme';
import {
  findNextFocusableElement,
  findPreviousFocusableElement,
  isFocusableElement,
  TransformOriginSettings,
} from './shared';
import { List, ListItem } from './List';
import { Popover } from './Popover';
import { createBooleanVariant } from '../core';

const fullscreenMenuVariant = createBooleanVariant('isFullscreen', {
  onStyles: {
    width: '100vw',
    height: '100vh',
  },
});

const MenuBase = fullscreenMenuVariant(
  createComponent(List, {
    displayName: 'Menu',
    defaultStyles: {
      maxHeight: ['100vh', 'calc(100vh - 32px)'],
      maxWidth: ['100vw', 'calc(100vw - 32px)'],
      overflowY: 'scroll',
      backgroundColor: 'white',
    },
  }),
);

const MenuItemBase = createComponent(ListItem, {
  displayName: 'MenuItem',
  defaultStyles: {
    '&:hover, &:focus, &[aria-selected="true"]': {
      outline: 'none',
      backgroundColor: 'primary.1',
      color: 'primaryText.1',
      cursor: 'pointer',
      userSelect: 'none',
    },
  },
});

interface MenuProps extends ExtractVisageComponentProps<typeof MenuBase> {
  anchor?: null | HTMLElement | RefObject<HTMLElement>;
  anchorOrigin?: TransformOriginSettings;
  children?: ReactNode;
  /**
   * Use only if you are managing focus outside of this component
   */
  disableEvents?: boolean;
  keepAnchorWidth?: boolean;
  onClose?: (e: KeyboardEvent | MouseEvent) => void;
  open: boolean;
}

interface MenuItemProps
  extends ExtractVisageComponentProps<typeof MenuItemBase> {
  children?: ReactNode;
}

const defaultAnchorOrigin: TransformOriginSettings = {
  vertical: 'bottom',
  horizontal: 'left',
};

export function Menu({
  anchor,
  anchorOrigin = defaultAnchorOrigin,
  children,
  disableEvents,
  fullscreen = [true, false],
  keepAnchorWidth,
  onClose,
  open,
  role = 'menu',
  onKeyDown: outerOnKeyDown,
  ...restProps
}: MenuProps) {
  const visage = useDesignSystem();
  const isFullscreen = useMemo(
    () => getResponsiveValue(visage.breakpoint, fullscreen),
    [visage.breakpoint, fullscreen],
  );

  const firstItemRef = useRef<HTMLElement | null>(null);
  const lastItemRef = useRef<HTMLElement | null>(null);
  const onKeyDown: KeyboardEventHandler = useCallback(
    e => {
      if (outerOnKeyDown) {
        outerOnKeyDown(e);
      }

      // if menu is managed from outside, ignore events
      if (disableEvents) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp': {
          // find previous focusable element, if none is found, find the last one
          const previousFocusableElement = findPreviousFocusableElement(
            e.currentTarget as HTMLElement,
          );

          if (previousFocusableElement) {
            previousFocusableElement.focus();
            return;
          }

          if (lastItemRef.current) {
            const focusableElement = isFocusableElement(lastItemRef.current)
              ? lastItemRef.current
              : findNextFocusableElement(lastItemRef.current);

            if (focusableElement && focusableElement !== e.currentTarget) {
              focusableElement.focus();
            }
          }

          return;
        }
        case 'ArrowDown': {
          // find next focusable element, if none is found, find the first one
          const nextFocusableElement = findNextFocusableElement(
            e.currentTarget as HTMLElement,
          );

          if (nextFocusableElement) {
            nextFocusableElement.focus();
            return;
          }

          if (firstItemRef.current) {
            const focusableElement = isFocusableElement(firstItemRef.current)
              ? firstItemRef.current
              : findNextFocusableElement(firstItemRef.current);

            if (focusableElement && focusableElement !== e.currentTarget) {
              focusableElement.focus();
            }
          }

          return;
        }
        case 'Escape': {
          if (onClose) {
            onClose(e);
          }
        }
      }
    },
    [disableEvents, outerOnKeyDown, onClose],
  );

  // manage autofocus of first item
  // if not managed from outside
  useLayoutEffect(() => {
    if (!open || disableEvents) {
      return;
    }

    if (firstItemRef.current) {
      const firstFocusable = isFocusableElement(firstItemRef.current)
        ? firstItemRef.current
        : findNextFocusableElement(firstItemRef.current);

      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [open, disableEvents]);

  return (
    <Popover
      allowScrolling={!isFullscreen}
      alwaysVisible
      anchor={anchor}
      anchorOrigin={anchorOrigin}
      autoFocus={isFullscreen}
      backdrop={false}
      fullscreen={isFullscreen}
      keepAnchorWidth={keepAnchorWidth}
      onClose={onClose}
      open={open}
      styles={{
        boxShadow: [
          'none',
          '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.60)',
        ],
      }}
    >
      <MenuBase
        isFullscreen={isFullscreen}
        role={role}
        {...restProps}
        tabIndex={-1}
      >
        {Children.map(children, (menuItem, i) => {
          return cloneElement(menuItem as any, {
            ref: i === 0 ? firstItemRef : lastItemRef,
            role: !open ? 'none' : (menuItem as any).props.role,
            onKeyDown,
          });
        })}
      </MenuBase>
    </Popover>
  );
}

export const MenuItem: VisageComponent<MenuItemProps, StyleProps> = forwardRef(
  ({ children, role = 'menuitem', ...restProps }: MenuItemProps, ref) => {
    return (
      <MenuItemBase
        tabIndex={role === 'menuitem' ? 0 : -1}
        role={role}
        ref={ref}
        {...restProps}
      >
        {children}
      </MenuItemBase>
    );
  },
);

MenuItem.displayName = 'MenuItem';

markAsVisageComponent(MenuItem);
