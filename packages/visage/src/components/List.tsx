import { StyleProps as VisageStyleProps } from '@byteclaw/visage-core';
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
  useMemo,
  KeyboardEventHandler,
} from 'react';
import { createComponent, createBooleanVariant } from '../core';
import { StyleProps } from '../createNPointTheme';

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
    p: 0,
    m: 0,
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
      py: 1,
      width: 'auto',
    },
  }),
);

const activeItemVariant = createBooleanVariant('active', {
  onStyles: {
    backgroundColor: 'primary.1',
    color: 'primaryText.1',
  },
});

export const BaseListItem = createBooleanVariant('gutters', {
  onStyles: {
    px: 2,
    py: 1,
  },
})(
  activeItemVariant(
    createComponent('li', {
      displayName: 'ListItem',
      defaultStyles: {
        display: 'flex',
        border: 0,
        height: 'auto',
        m: 0,
        overflow: 'hidden',
        width: 'auto',
        '&[role="button"]:hover, &[role="button"]:focus': {
          outline: 'none',
          backgroundColor: 'primary.1',
          color: 'primaryText.1',
          cursor: 'pointer',
          userSelect: 'none',
        },
      },
    }),
  ),
);

const ListItemLinkBase = createComponent('a', {
  displayName: 'ListItemLink',
  defaultStyles: {
    color: 'bodyText',
    cursor: 'pointer',
    display: 'flex',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    m: 0,
    px: 2,
    py: 1,
    textDecoration: 'none',
    width: '100%',
    '&:hover, &:focus': {
      outline: 'none',
      backgroundColor: 'primary.1',
      color: 'primaryText.1',
      userSelect: 'none',
    },
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
  navigation?: boolean;
}

interface ListItemProps extends VisageStyleProps<StyleProps> {
  button?: boolean;
  gutters?: boolean;
  children: ReactNode;
}

const defaultContainer = <ListContainer />;
const defaultItemsContainer = <ListItemsContainer />;

export function ListItem({
  button = false,
  children,
  gutters,
  ...rest
}: ListItemProps) {
  const guttersValue = useMemo(() => {
    if (gutters != null) {
      return gutters;
    }
    return typeof children === 'string';
  }, [gutters, children]);
  return (
    <BaseListItem
      role={button === true ? 'button' : undefined}
      gutters={guttersValue}
      {...rest}
    >
      {children}
    </BaseListItem>
  );
}

export function List({
  children,
  container = defaultContainer,
  heading,
  itemsContainer = defaultItemsContainer,
  navigation = false,
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
    role: navigation === true ? 'navigation' : undefined,
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
  const onKeyDown: KeyboardEventHandler<HTMLLabelElement> = useCallback(
    e => {
      if (e.key === 'Enter') {
        setCollapsed(!collapsed);
      }
    },
    [collapsed],
  );
  const toggle = cloneElement(toggler, {
    collapsed,
    onClick: onToggle,
    onKeyDown,
  });
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
