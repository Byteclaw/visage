/* eslint-disable react/no-array-index-key, jsx-a11y/anchor-is-valid, no-constant-condition */
import React, {
  Children,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useCallback,
  useRef,
  useState,
  FocusEvent,
  cloneElement,
} from 'react';
import { ExtractVisageComponentProps } from '@byteclaw/visage-core';
import { createComponent } from '../core';
import { Box } from './Box';
import { Flex } from './Flex';
import { useUniqueId, useHandlerRef } from '../hooks';

const TabsWrapper = createComponent(Flex, {
  displayName: 'Tabs',
  styles: {
    flexDirection: 'column',
    width: '100%',
  },
});

const TabList = createComponent('div', {
  displayName: 'TabList',
  styles: {
    borderBottomWidth: '1px',
    borderBottomColor:
      'color(shades if(isDark, color(shades tint(10%)), color(shades shade(10%))))',
    borderBottomStyle: 'solid',
    boxShadow: 'none',
    display: 'flex',
    m: 0,
    mb: 1,
    overflowX: 'auto',
    p: 0,
    width: '100%',
    // hide scrollbar
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

const TabNavigationButton = createComponent('button', {
  displayName: 'TabNavigationButton',
  styles: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 0,
    borderBottomWidth: 2,
    fontFamily: 'body',
    color: 'shadesText',
    cursor: 'pointer',
    flexShrink: 0,
    fontSize: 1,
    lineHeight: 1,
    outline: 'none',
    py: 1,
    pl: 0,
    pr: 2,
    m: 0,
    mr: 1,
    textDecoration: 'none',
    transition: 'border-color 150ms ease-out',
    willChange: 'border-color',
    '&[aria-selected="true"]': {
      color: 'primary',
      borderBottomColor: 'primary',
      fontWeight: 'bold',
    },
    '&:focus': {
      borderBottomColor: 'shadesText',
    },
    '&[disabled]': {
      cursor: 'default',
      opacity: 0.3,
    },
  },
});

interface FlexProps extends ExtractVisageComponentProps<typeof Flex> {}
interface TabListProps extends ExtractVisageComponentProps<typeof TabList> {}
interface BoxProps
  extends Omit<
    ExtractVisageComponentProps<typeof Box>,
    'children' | 'onKeyDown' | 'onClick'
  > {}

export interface TabProps {
  children?: ReactNode | (() => ReactNode);
  disabled?: boolean;
  label: string | ReactElement;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  selected?: boolean;
}

export function Tab({
  children,
  selected,
  label,
  onClick,
  onKeyDown,
  ...restProps
}: TabProps & BoxProps) {
  return (
    <Box {...restProps}>
      {typeof children === 'function'
        ? selected
          ? children()
          : null
        : children}
    </Box>
  );
}

export type TabElement = ReactElement<TabProps>;

interface TabsProps {
  children: TabElement | TabElement[];
  /**
   * Unique id used to generate references between tabs (accessibility)
   */
  id?: string;
  selected?: number;
  tabListProps?: TabListProps;
}

export function Tabs({
  children,
  id: outerId,
  selected = 0,
  tabListProps,
  ...restProps
}: TabsProps & FlexProps) {
  const id = useUniqueId(outerId, 'tabs');
  const childrenArray = Children.toArray(children) as ReactElement<
    TabProps & BoxProps
  >[];
  const tabsLabel = childrenArray.map(c => c.props.label);
  const selectedRef = useRef(selected);
  const focusedTabRef = useRef<HTMLButtonElement | null>(null);
  const [selectedTab, selectTab] = useState(selected);
  const onClick: MouseEventHandler<HTMLButtonElement> = useHandlerRef(e => {
    const index = Number(e.currentTarget.dataset.index);

    if (e.currentTarget.getAttribute('aria-disabled') === 'true') {
      return;
    }

    if (childrenArray[index]!.props.onClick) {
      e.persist();

      childrenArray[index]!.props.onClick!(e);
    }

    if (e.defaultPrevented) {
      return;
    }

    e.preventDefault();

    selectTab(index);
  });
  const onTabFocus = useCallback((e: FocusEvent<HTMLButtonElement>) => {
    focusedTabRef.current = e.currentTarget;
  }, []);
  const onKeyDown: KeyboardEventHandler<HTMLButtonElement> = useHandlerRef(
    e => {
      const index = Number(e.currentTarget.dataset.index);

      if (e.currentTarget.disabled) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'Enter': {
          if (childrenArray[index]!.props.onKeyDown) {
            childrenArray[index]!.props.onKeyDown!(e);
          }

          if (e.defaultPrevented) {
            return;
          }

          e.preventDefault();

          selectTab(index);
          break;
        }
        case 'ArrowLeft':
        case 'ArrowRight': {
          e.preventDefault();

          let tab: HTMLButtonElement | null = focusedTabRef.current![
            e.key === 'ArrowLeft'
              ? 'previousElementSibling'
              : 'nextElementSibling'
          ] as HTMLButtonElement | null;

          do {
            if (tab) {
              if (tab.disabled) {
                // go to next sibling
                tab = tab[
                  e.key === 'ArrowLeft'
                    ? 'previousElementSibling'
                    : 'nextElementSibling'
                ] as HTMLButtonElement | null;
              } else {
                break;
              }
            } else {
              // there is no next tab, find the first children of a parent
              tab = focusedTabRef.current!.parentElement![
                e.key === 'ArrowLeft' ? 'lastElementChild' : 'firstElementChild'
              ] as HTMLButtonElement | null;
            }
          } while (true);

          tab.focus();
          break;
        }
        case 'End':
        case 'Home': {
          e.preventDefault();

          let tab: HTMLButtonElement | null = focusedTabRef.current!
            .parentElement![
            e.key === 'End' ? 'lastElementChild' : 'firstElementChild'
          ] as HTMLButtonElement | null;

          do {
            if (tab) {
              if (tab.disabled) {
                tab = tab[
                  e.key === 'End'
                    ? 'previousElementSibling'
                    : 'nextElementSibling'
                ] as HTMLButtonElement | null;
              } else {
                break;
              }
            } else {
              tab = focusedTabRef.current!.parentElement!
                .firstElementChild as HTMLButtonElement | null;
            }
          } while (true);

          tab.focus();
          break;
        }
      }
    },
  );

  if (selectedRef.current !== selected) {
    selectedRef.current = selected;
    selectTab(selected);
  }

  return (
    <TabsWrapper {...restProps}>
      <TabList role="tablist" {...tabListProps}>
        {tabsLabel.map((tabLabel, i) => {
          const isSelected = selectedTab === i;
          const isDisabled = !!childrenArray[i]!.props.disabled;

          return (
            <TabNavigationButton
              id={`${id}-tab-label-${i}`}
              aria-controls={`${id}-tab-panel-${i}`}
              aria-selected={isSelected}
              disabled={isDisabled}
              data-index={i}
              key={i}
              onClick={onClick}
              onFocus={onTabFocus}
              onKeyDown={onKeyDown}
              role="tab"
              tabIndex={isSelected ? 0 : -1}
              type="button"
            >
              {tabLabel}
            </TabNavigationButton>
          );
        })}
      </TabList>
      {childrenArray.map((tab, i) =>
        cloneElement(tab, {
          'aria-labelledby': `${id}-tab-label-${i}`,
          id: `${id}-tab-panel-${i}`,
          hidden: selectedTab !== i,
          role: 'tabpanel',
          selected: selectedTab === i,
          tabIndex: 0,
        }),
      )}
    </TabsWrapper>
  );
}
