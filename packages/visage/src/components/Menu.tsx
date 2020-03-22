import {
  ExtractVisageComponentProps,
  OmittableProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import React, {
  Children,
  cloneElement,
  MouseEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  KeyboardEventHandler,
  forwardRef,
  RefObject,
  Ref,
} from 'react';
import {
  findNextFocusableElement,
  findPreviousFocusableElement,
  isFocusableElement,
  TransformOriginSettings,
} from './shared';
import { createComponent } from '../core';
import { List, ListItem } from './List';
import { Popover } from './Popover';

const MenuBase = createComponent(List, {
  displayName: 'Menu',
  styles: {
    backgroundColor: 'lightShades',
  },
});

const MenuItemBase = createComponent(ListItem, {
  displayName: 'MenuItem',
  styles: {
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
  /**
   * Use only if you are managing focus outside of this component
   */
  disableEvents?: boolean;
  keepAnchorWidth?: boolean;
  onClose?: (e: KeyboardEvent | MouseEvent) => void;
  open: boolean;
  popoverProps?: OmittableProps<ExtractVisageComponentProps<typeof Popover>>;
}

type MenuItemProps = ExtractVisageComponentProps<typeof MenuItemBase>;

const defaultAnchorOrigin: TransformOriginSettings = {
  vertical: 'bottom',
  horizontal: 'left',
};

const popoverStyles = {
  boxShadow: '0 0 0 1px rgba(63,63,68,.05), 0 1px 3px 0 rgba(63,63,68,.60)',
};

export function Menu({
  anchor,
  anchorOrigin = defaultAnchorOrigin,
  children,
  disableEvents,
  keepAnchorWidth,
  onClose,
  open,
  role = 'menu',
  onKeyDown: outerOnKeyDown,
  popoverProps,
  ...restProps
}: MenuProps) {
  const firstItemRef = useRef<HTMLElement | null>(null);
  const lastItemRef = useRef<HTMLElement | null>(null);
  const onKeyDown: KeyboardEventHandler<HTMLElement> = useCallback(
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
  useEffect(() => {
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
      alwaysVisible
      anchor={anchor}
      anchorOrigin={anchorOrigin}
      autoFocus={false}
      backdrop
      keepAnchorWidth={keepAnchorWidth}
      onClose={onClose}
      open={open}
      styles={popoverStyles}
      {...popoverProps}
    >
      <MenuBase role={role} {...restProps} tabIndex={-1}>
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

export const MenuItem: typeof MenuItemBase = forwardRef(
  (
    { children, role = 'menuitem', ...restProps }: MenuItemProps,
    ref: Ref<HTMLLIElement>,
  ) => {
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
) as any;

MenuItem.displayName = 'MenuItem';

markAsVisageComponent(MenuItem);
