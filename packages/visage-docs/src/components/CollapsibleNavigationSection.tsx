import { CollapsibleList, ListItemLink } from '@byteclaw/visage';
import { Match } from '@reach/router';
import React, { ReactNode } from 'react';

interface CollapsibleNavigationSectionProps {
  children: ReactNode;
  path: string;
  title: string;
  openOnInit?: boolean;
}

export function CollapsibleNavigationSection({
  children,
  openOnInit = false,
  path,
  title,
}: CollapsibleNavigationSectionProps) {
  return (
    <Match path={path}>
      {({ match }) => (
        <CollapsibleList
          collapsed={match == null && !openOnInit}
          renderToggler={(collapsed, onClick, onKeyDown) => (
            <ListItemLink
              as="div" // firefox fix because it ignores anchors with role button
              onClick={onClick}
              onKeyDown={onKeyDown}
              role="button"
              tabIndex={0}
              styles={{
                justifyContent: 'space-between',
                fontWeight: 700,
                fontSize: 0,
              }}
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
