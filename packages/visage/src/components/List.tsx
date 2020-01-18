import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
} from '@byteclaw/visage-core';
import React, {
  createContext,
  cloneElement,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
  KeyboardEventHandler,
  forwardRef,
  MouseEventHandler,
  Ref,
} from 'react';
import { createComponent } from '../core';
import { booleanVariant } from '../variants';

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
export const ListItemsContainer = createComponent('ul', {
  displayName: 'ListItemsContainer',
  defaultStyles: props => ({
    display: 'block',
    listStyle: 'none',
    flexGrow: 1,
    flexShrink: 1,
    m: 0,
    p: 0,
    py: 1,
    width: 'auto',
    ...(props.collapsed
      ? { maxHeight: 0, visibility: 'hidden', p: 0, m: 0 }
      : {}),
  }),
  variants: [booleanVariant('collapsed', true)],
});

export const BaseListItem = createComponent('li', {
  displayName: 'ListItem',
  defaultStyles: props => ({
    display: 'flex',
    border: 0,
    height: 'auto',
    m: 0,
    overflow: 'hidden',
    width: 'auto',
    '&[role="button"]:hover, &[role="button"]:focus': {
      outline: 'none',
      backgroundColor: 'lightAccent',
      color: 'lightAccentText',
      cursor: 'pointer',
      userSelect: 'none',
    },
    ...(props.gutters ? { px: 2, py: 1 } : {}),
    ...(props.active ? { color: 'primary', fontWeight: 'bolder' } : {}),
  }),
  variants: [
    booleanVariant('active', true),
    booleanVariant('button', true), // just for the sake of typing
    booleanVariant('gutters', true),
  ],
});

const ListItemLinkBase = createComponent('a', {
  displayName: 'ListItemLink',
  defaultStyles: props => ({
    color: 'lightShadesText',
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
      backgroundColor: 'lightAccent',
      color: 'lightAccentText',
    },
    '&:focus': {
      backgroundColor: 'lightAccent',
      color: 'lightAccentText',
    },
    ...(props.active ? { color: 'primary', fontWeight: 'bolder' } : {}),
  }),
  variants: [booleanVariant('active', true)],
});

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
    fontSize: 'inherit',
    lineHeight: 'inherit',
    m: 0,
    p: 0,
    width: '100%',
  },
});

type ListItemProps = ExtractVisageComponentProps<typeof BaseListItem>;

export const ListItem: typeof BaseListItem = forwardRef(
  (
    { button = false, gutters, children, ...rest }: ListItemProps,
    ref: Ref<HTMLLIElement>,
  ) => {
    return (
      <BaseListItem
        role={button === true ? 'button' : undefined}
        gutters={gutters != null ? gutters : typeof children === 'string'}
        ref={ref}
        {...rest}
      >
        {children}
      </BaseListItem>
    );
  },
) as any;

markAsVisageComponent(ListItem);

export interface ListProps
  extends ExtractVisageComponentProps<typeof ListContainer> {
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
  tabIndex = -1,
  ...restProps
}: ListProps) {
  const depth = useContext(ListDepthContext);
  const listItems = cloneElement(itemsContainer, {
    children,
  });

  return cloneElement(container, {
    children: (
      <React.Fragment>
        {heading}
        <ListDepthContext.Provider value={depth + 1}>
          {listItems}
        </ListDepthContext.Provider>
      </React.Fragment>
    ),
    tabIndex,
    ...restProps,
  });
}

markAsVisageComponent(List);

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
    <React.Fragment>
      {renderHeading ? renderHeading() : null}
      {renderToggler ? renderToggler(collapsed, onToggle, onKeyDown) : null}
      <ListDepthContext.Provider value={depth + 1}>
        {renderItemsContainer(collapsed, children)}
      </ListDepthContext.Provider>
    </React.Fragment>,
    restProps,
  );
}
