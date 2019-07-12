/* eslint-disable react/no-array-index-key, jsx-a11y/anchor-is-valid */
import React, {
  Children,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import { createComponent } from '../core';
import { Box } from './Box';
import { Flex } from './Flex';

const TabNavigationList = createComponent('ul', {
  displayName: 'TabNavigationList',
  defaultStyles: {
    background: 'none',
    boxShadow: 'none',
    display: 'flex',
    listStyle: 'none',
    m: 0,
    p: 0,
  },
});

const TabNavigationListItem = createComponent('li', {
  displayName: 'TabNavigationListItem',
  defaultStyles: {
    cursor: 'pointer',
    m: 0,
    p: 0,
  },
});

const TabNavigationAnchor = createComponent('a', {
  displayName: 'TabNavigationAnchor',
  defaultStyles: {
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 1,
    outline: 'none',
    px: 2,
    textDecoration: 'none',
    '&[aria-disabled="true"]': {
      color: 'grey.1',
      cursor: 'not-allowed',
    },
    '&[aria-disabled="false"]:focus': {
      borderColor: 'blue',
    },
  },
});

interface TabProps {
  children?: ReactNode | (() => ReactNode);
  disabled?: boolean;
  label: string | ReactElement;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  onKeyDown?: KeyboardEventHandler<HTMLAnchorElement>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Tab(_: TabProps) {
  return null;
}

interface TabsProps {
  children: ReactElement<TabProps>[];
  /**
   * Unique id used to generate references between tabs (accessibility)
   */
  id: string;
  selected?: number;
}

export function Tabs({ children, id, selected = 0 }: TabsProps) {
  const childrenArray = Children.toArray(children);
  const tabsLabel = childrenArray.map(c => c.props.label);
  const tabs = childrenArray.map(c => c.props.children);
  const selectedRef = useRef(selected);
  const [selectedTab, selectTab] = useState(selected);
  const onClick: MouseEventHandler<HTMLAnchorElement> = useCallback(e => {
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
  const onKeyDown: KeyboardEventHandler<HTMLAnchorElement> = useCallback(e => {
    const index = Number(e.currentTarget.dataset.index);

    if (e.currentTarget.getAttribute('aria-disabled') === 'true') {
      return;
    }

    if (e.key === 'Enter') {
      if (childrenArray[index]!.props.onKeyDown) {
        e.persist();

        childrenArray[index]!.props.onKeyDown!(e);
      }

      if (e.defaultPrevented) {
        return;
      }

      e.preventDefault();

      selectTab(index);
    }
  }, []);

  if (selectedRef.current !== selected) {
    selectedRef.current = selected;
    selectTab(selected);
  }

  return (
    <Flex styles={{ flexDirection: 'column' }}>
      <Box role="navigation">
        <TabNavigationList role="tablist">
          {tabsLabel.map((tabLabel, i) => {
            const isSelected = selectedTab === i;
            const isDisabled = !!childrenArray[i]!.props.disabled;

            return (
              <TabNavigationListItem key={i} role="presentation" tabIndex={-1}>
                <TabNavigationAnchor
                  href="#"
                  role="tab"
                  id={`${id}-tab-label-${i}`}
                  aria-controls={`${id}-tab-panel-${i}`}
                  aria-disabled={isDisabled}
                  aria-selected={isSelected}
                  data-index={i}
                  onClick={onClick}
                  onKeyDown={onKeyDown}
                  tabIndex={isDisabled ? -1 : 0}
                >
                  {tabLabel}
                </TabNavigationAnchor>
              </TabNavigationListItem>
            );
          })}
        </TabNavigationList>
      </Box>
      <Box>
        {tabs.map((tab, i) => {
          const isSelected = selectedTab === i;

          return (
            <div
              id={`${id}-tab-panel-${i}`}
              key={i}
              role="tabpanel"
              hidden={!isSelected}
              aria-hidden={!isSelected}
              aria-labelledby={`${id}-tab-label-${i}`}
            >
              {typeof tab === 'function' && isSelected ? tab() : tab}
            </div>
          );
        })}
      </Box>
    </Flex>
  );
}
