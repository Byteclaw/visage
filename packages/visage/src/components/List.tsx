import {
  ExtractVisageComponentProps,
  markAsVisageComponent,
  VisageComponent,
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
import { booleanVariant, booleanVariantStyles } from '../variants';

const ListDepthContext = createContext(0);

ListDepthContext.displayName = 'ListDepthContext';

export const ListContainer = createComponent('section', {
  displayName: 'ListContainer',
  styles: {
    display: 'flex',
    flexDirection: 'column',
    m: 0,
    p: 0,
    width: '100%',
  },
});
export const ListItemsContainer = createComponent('ul', {
  displayName: 'ListItemsContainer',
  styles: {
    display: 'block',
    listStyle: 'none',
    flexGrow: 1,
    flexShrink: 1,
    m: 0,
    p: 0,
    py: 1,
    width: 'auto',
    ...booleanVariantStyles('collapsed', {
      on: {
        maxHeight: 0,
        visibility: 'hidden',
        p: 0,
        m: 0,
      },
    }),
  },
  variants: [booleanVariant('collapsed', true)],
});

export const BaseListItem = createComponent('li', {
  displayName: 'ListItem',
  styles: {
    display: 'flex',
    border: 0,
    height: 'auto',
    m: 0,
    overflow: 'hidden',
    width: 'auto',
    '&[role="button"]:hover, &[role="button"]:focus': {
      outline: 'none',
      backgroundColor: 'accent',
      color: 'accentText',
      cursor: 'pointer',
      userSelect: 'none',
    },
    ...booleanVariantStyles('gutters', {
      on: { px: 2, py: 1 },
    }),
    ...booleanVariantStyles('active', {
      on: {
        color: 'primary',
        fontWeight: 'bolder',
      },
    }),
  },
  variants: [
    booleanVariant('active', true),
    booleanVariant('button', true), // just for the sake of typing
    booleanVariant('gutters', true),
  ],
});

const ListItemLinkBase = createComponent('a', {
  displayName: 'ListItemLink',
  styles: {
    color: 'shadesText',
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
      backgroundColor: 'accent',
      color: 'accentText',
      textDecoration: 'none',
    },
    '&:focus': {
      backgroundColor: 'accent',
      color: 'accentText',
    },
    ...booleanVariantStyles('active', {
      on: { color: 'primary', fontWeight: 'bolder' },
    }),
  },
  variants: [booleanVariant('active', true)],
});

type ListItemLinkProps = ExtractVisageComponentProps<typeof ListItemLinkBase>;

export const ListItemLink = markAsVisageComponent(
  forwardRef(({ styles, ...props }: ListItemLinkProps, ref: Ref<any>) => {
    const depth = useContext(ListDepthContext);

    return (
      <ListItemLinkBase
        {...props}
        styles={{ pl: (depth > 1 ? 2 : 3) * depth, ...styles }}
        ref={ref}
      />
    );
  }),
);

export const ListHeader = createComponent('h1', {
  displayName: 'ListHeader',
  styles: {
    fontSize: 'inherit',
    lineHeight: 'inherit',
    m: 0,
    p: 0,
    width: '100%',
  },
});

type ListItemProps = ExtractVisageComponentProps<typeof BaseListItem>;

export const ListItem = markAsVisageComponent(
  forwardRef(({ gutters, children, ...rest }: ListItemProps, ref: Ref<any>) => {
    return (
      <BaseListItem
        gutters={gutters != null ? gutters : typeof children === 'string'}
        ref={ref}
        {...rest}
      >
        {children}
      </BaseListItem>
    );
  }),
);

export interface ListProps
  extends ExtractVisageComponentProps<typeof ListContainer> {
  container?: ReactElement;
  heading?: ReactElement;
  itemsContainer?: ReactElement;
}

const defaultItemsContainer = <ListItemsContainer />;

export const List: VisageComponent<ListProps> = markAsVisageComponent(
  forwardRef(
    (
      {
        children,
        heading,
        itemsContainer = defaultItemsContainer,
        ...restProps
      }: ListProps,
      ref: Ref<any>,
    ) => {
      const depth = useContext(ListDepthContext);
      const listItems = cloneElement(itemsContainer, {
        children,
        ref,
        ...restProps,
      });

      return (
        <>
          {heading}
          <ListDepthContext.Provider value={depth + 1}>
            {listItems}
          </ListDepthContext.Provider>
        </>
      );
    },
  ),
);

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
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
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
    <>
      {renderHeading ? renderHeading() : null}
      {renderToggler ? renderToggler(collapsed, onToggle, onKeyDown) : null}
      <ListDepthContext.Provider value={depth + 1}>
        {renderItemsContainer(collapsed, children)}
      </ListDepthContext.Provider>
    </>,
    restProps,
  );
}
