import { CollapsibleList, ListItemLink } from '@byteclaw/visage';
import { Match } from '@reach/router';
import React, { ReactNode } from 'react';

interface CollapsibleNavigationSectionProps {
  children: ReactNode;
  path: string;
  title: string;
}

export function CollapsibleNavigationSection({
  children,
  path,
  title,
}: CollapsibleNavigationSectionProps) {
  return (
    <Match path={path}>
      {({ match }) => (
        <CollapsibleList
          collapsed={match == null}
          renderToggler={(collapsed, onClick, onKeyDown) => (
            <ListItemLink
              active={!collapsed}
              onClick={onClick}
              onKeyDown={onKeyDown}
              tabIndex={0}
            >
              {title}
            </ListItemLink>
          )}
        >
          {children}
        </CollapsibleList>
      )}
    </Match>
  );
}
