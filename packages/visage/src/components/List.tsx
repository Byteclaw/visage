import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
} from '@byteclaw/visage-core';
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
  forwardRef,
  MouseEventHandler,
} from 'react';
import { createComponent, createBooleanVariant } from '../core';
import { StyleProps } from '../createNPointTheme';

const ListDepthContext = createContext(0);

ListDepthContext.displayName = 'ListDepthContext';

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
    color: 'salmon',
    fontWeight: 'bolder',
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

const ListItemLinkBase = activeItemVariant(
  createComponent('a', {
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
        userSelect: 'none',
      },
      '&:hover': {
        backgroundColor: 'neutral.-1',
      },
      '&:focus': {
        backgroundColor: 'neutral.-3',
      },
    },
  }),
);

export const ListItemLink: typeof ListItemLinkBase = ({
  styles,
  ...props
}: any) => {
  const depth = useContext(ListDepthContext);

  return <ListItemLinkBase {...props} styles={{ pl: 2 * depth, ...styles }} />;
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

interface ListProps extends ExtractVisageComponentProps<typeof ListContainer> {
  children: ReactNode;
  container?: ReactElement;
  heading?: ReactElement;
  itemsContainer?: ReactElement;
}

interface ListItemProps
  extends ExtractVisageComponentProps<typeof BaseListItem> {
  button?: boolean;
  gutters?: boolean;
  children: ReactNode;
}

const defaultContainer = <ListContainer />;
const defaultItemsContainer = <ListItemsContainer />;

export const ListItem: VisageComponent<ListItemProps, StyleProps> = forwardRef(
  ({ button = false, children, gutters, ...rest }: ListItemProps, ref) => {
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
        ref={ref as any}
        {...rest}
      >
        {children}
      </BaseListItem>
    );
  },
) as any;

markAsVisageComponent(ListItem as any);

export function List({
  children,
  container = defaultContainer,
  heading,
  itemsContainer = defaultItemsContainer,
  tabIndex = -1,
  ...restProps
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
    tabIndex,
    ...restProps,
  });
}

markAsVisageComponent(List as any);

const defaultContainerRenderer = (
  children: ReactNode,
  props: any,
): ReactElement => <ListContainer {...props}>{children}</ListContainer>;
const defaultItemsContainerRenderer = (
  collapsed: boolean,
  children: ReactNode,
): ReactNode => (collapsed ? null : children);

interface CollapsibleListProps
  extends ExtractVisageComponentProps<typeof ListContainer> {
  children: ReactNode;
  collapsed?: boolean;
  renderContainer?: (
    children: ReactNode,
    props: {
      [extra: string]: any;
    },
  ) => ReactElement | null;
  renderHeading?: () => ReactElement | null;
  renderItemsContainer?: (collapsed: boolean, children: ReactNode) => ReactNode;
  renderToggler?: (
    collapsed: boolean,
    onClick: MouseEventHandler,
    onKeyDown: KeyboardEventHandler,
  ) => ReactElement | null;
}

export function CollapsibleList({
  collapsed: isCollapsed = true,
  children,
  renderContainer = defaultContainerRenderer,
  renderHeading,
  renderItemsContainer = defaultItemsContainerRenderer,
  renderToggler,
  ...restProps
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

  if (collapsedRef.current !== isCollapsed) {
    collapsedRef.current = isCollapsed;
    setCollapsed(isCollapsed);
  }

  return renderContainer(
    <Fragment>
      {renderHeading ? renderHeading() : null}
      {renderToggler ? renderToggler(collapsed, onToggle, onKeyDown) : null}
      <ListDepthContext.Provider value={depth + 1}>
        {renderItemsContainer(collapsed, children)}
      </ListDepthContext.Provider>
    </Fragment>,
    restProps,
  );
}
