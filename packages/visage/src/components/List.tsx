import React, {
  createContext,
  cloneElement,
  Fragment,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { createComponent, createBooleanVariant } from '../core';

const ListDepthContext = createContext(0);

export const ListContainer = createComponent('section', {
  displayName: 'ListContainer',
  defaultStyles: {
    display: 'flex',
    flexDirection: 'column',
    m: 0,
    p: 0,
    width: '100%',
  },
});
export const ListItemsContainer = createBooleanVariant('collapsed', {
  onStyles: {
    maxHeight: 0,
    visibility: 'hidden',
  },
})(
  createComponent('ul', {
    displayName: 'ListItemsContainer',
    defaultStyles: {
      display: 'block',
      listStyle: 'none',
      flexGrow: 1,
      flexShrink: 1,
      overflowY: 'auto',
      m: 0,
      p: 0,
      width: 'auto',
    },
  }),
);
export const ListItem = createComponent('li', {
  displayName: 'ListItem',
  defaultStyles: {
    border: 0,
    height: 'auto',
    m: 0,
    p: 0,
    overflow: 'hidden',
    width: 'auto',
  },
});
const ListItemLinkBase = createComponent('a', {
  displayName: 'ListItemLink',
  defaultStyles: {
    color: 'bodyText',
    cursor: 'pointer',
    display: 'flex',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    m: 0,
    p: 0,
    px: 2,
    textDecoration: 'none',
    width: '100%',
  },
});
export const ListItemLink: typeof ListItemLinkBase = (props: any) => {
  const depth = useContext(ListDepthContext);

  return <ListItemLinkBase {...props} styles={{ pl: 2 * depth }} />;
};
export const ListHeader = createComponent('h1', {
  displayName: 'ListHeader',
  defaultStyles: {
    fontSize: 0,
    lineHeight: 0,
    m: 0,
    p: 0,
    width: '100%',
  },
});

interface ListProps {
  children: ReactNode;
  container?: ReactElement;
  heading?: ReactElement;
  itemsContainer?: ReactElement;
}

const defaultContainer = <ListContainer />;
const defaultItemsContainer = <ListItemsContainer />;

export function List({
  children,
  container = defaultContainer,
  heading,
  itemsContainer = defaultItemsContainer,
}: ListProps) {
  const depth = useContext(ListDepthContext);
  const listItems = cloneElement(itemsContainer, {
    children,
  });

  return cloneElement(container, {
    children: (
      <Fragment>
        {heading}
        <ListDepthContext.Provider value={depth + 1}>
          {listItems}
        </ListDepthContext.Provider>
      </Fragment>
    ),
  });
}

interface CollapsibleListProps {
  children: ReactNode;
  collapsed?: boolean;
  container?: ReactElement;
  heading?: ReactElement;
  itemsContainer?: ReactElement;
  toggler: ReactElement;
}

export function CollapsibleList({
  collapsed: isCollapsed = true,
  children,
  container = defaultContainer,
  heading,
  itemsContainer = defaultItemsContainer,
  toggler,
}: CollapsibleListProps) {
  const depth = useContext(ListDepthContext);
  const collapsedRef = useRef(isCollapsed);
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const onToggle = useCallback(() => setCollapsed(!collapsed), [collapsed]);
  const toggle = cloneElement(toggler, { collapsed, onClick: onToggle });
  const listItems = cloneElement(itemsContainer, {
    children,
    collapsed,
  });

  if (collapsedRef.current !== isCollapsed) {
    collapsedRef.current = isCollapsed;
    setCollapsed(isCollapsed);
  }

  return cloneElement(container, {
    children: (
      <Fragment>
        {heading}
        {toggle}
        <ListDepthContext.Provider value={depth + 1}>
          {listItems}
        </ListDepthContext.Provider>
      </Fragment>
    ),
  });
}
