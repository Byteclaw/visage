/* eslint-disable react/no-array-index-key, jsx-a11y/anchor-is-valid, no-constant-condition */
import { useUniqueId } from '@byteclaw/use-unique-id';
import React, {
  Children,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useCallback,
  useRef,
  useState,
  useMemo,
  FocusEvent,
  cloneElement,
} from 'react';
import { ExtractVisageComponentProps } from '@byteclaw/visage-core';
import { createComponent } from '../core';
import { Box } from './Box';
import { Flex } from './Flex';

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
    boxShadow: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    m: 0,
    p: 0,
  },
});

const TabNavigatonButton = createComponent('button', {
  displayName: 'TabNavigatonButton',
  styles: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 0,
    borderBottomWidth: 2,
    fontFamily: 'body',
    color: 'shadesText',
    cursor: 'pointer',
    fontSize: 1,
    lineHeight: 1,
    outline: 'none',
    py: 1,
    pl: 0,
    pr: 2,
    mr: 1,
    textDecoration: 'none',
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

interface TabProps {
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

interface TabsProps {
  children: ReactElement<TabProps & BoxProps>[];
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
  const idTemplate = useUniqueId();
  const id = useMemo(() => {
    return outerId || idTemplate;
  }, [outerId, idTemplate]);
  const childrenArray = Children.toArray(children) as ReactElement<
    TabProps & BoxProps
  >[];
  const tabsLabel = childrenArray.map(c => c.props.label);

  const selectedRef = useRef(selected);
  const focusedTabRef = useRef<HTMLButtonElement | null>(null);
  const [selectedTab, selectTab] = useState(selected);
  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(e => {
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
  }, []);
  const onTabFocus = useCallback((e: FocusEvent<HTMLButtonElement>) => {
    focusedTabRef.current = e.currentTarget;
  }, []);
  const onKeyDown: KeyboardEventHandler<HTMLButtonElement> = useCallback(e => {
    const index = Number(e.currentTarget.dataset.index);

    if (e.currentTarget.disabled) {
      return;
    }

    switch (e.key) {
      case 'Enter': {
        if (childrenArray[index]!.props.onKeyDown) {
          e.persist();

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
  }, []);

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
            <TabNavigatonButton
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
            </TabNavigatonButton>
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
