import { createComponent, List, ListItem } from '@byteclaw/visage';
import React, { memo } from 'react';
import { CollapsibleNavigationSection } from './CollapsibleNavigationSection';
import { ListItemRouteLink } from './ListItemRouteLink';
import { NavigationTree, NavigationTreeNode } from '../types';

const NavigationList = createComponent(List, {
  styles: { fontSize: 0, fontFamily: 'heading' },
});

const RootListItem = createComponent(ListItem, {
  styles: { fontWeight: 700, fontSize: 0 },
});

const DirectoryListItem = memo(({ node }: { node: NavigationTreeNode }) => {
  return (
    <ListItem>
      <CollapsibleNavigationSection
        path={`${node.urlPath}*`}
        title={node.title}
      >
        {node.children.map(child => {
          if (child.children.length === 0) {
            return (
              <ListItem key={child.name}>
                <ListItemRouteLink to={child.urlPath}>
                  {child.title}
                </ListItemRouteLink>
              </ListItem>
            );
          }

          return <DirectoryListItem key={child.name} node={child} />;
        })}
      </CollapsibleNavigationSection>
    </ListItem>
  );
});

interface SidebarProps {
  tree: NavigationTree;
}

export function Sidebar({ tree }: SidebarProps) {
  return (
    <NavigationList role="navigation">
      {tree.map(node => {
        if (node.children.length === 0) {
          return (
            <RootListItem key={node.name}>
              <ListItemRouteLink to={node.urlPath}>
                {node.title}
              </ListItemRouteLink>
            </RootListItem>
          );
        }

        return <DirectoryListItem key={node.name} node={node} />;
      })}
    </NavigationList>
  );
}
