import { ListItemLink } from '@byteclaw/visage';
import { Link } from 'gatsby';
import { Match } from '@reach/router';
import React, { ReactNode } from 'react';

interface ListItemRouteLink {
  children: ReactNode;
  to: string;
}

export function ListItemRouteLink({ to, ...restProps }: ListItemRouteLink) {
  return (
    <Match path={to}>
      {({ match }) => (
        <ListItemLink
          aria-current={match ? 'page' : undefined}
          active={!!match}
          as={Link}
          to={to}
          {...restProps}
        />
      )}
    </Match>
  );
}
