import {
  CollapsibleList,
  Divider,
  List,
  ListItem,
  ListItemLink,
} from '@byteclaw/visage';
import { Link, Match } from '@reach/router';
import React, { ReactNode } from 'react';

interface ListItemRouteLink {
  children: ReactNode;
  to: string;
}

function ListItemRouteLink({ to, ...restProps }: ListItemRouteLink) {
  return (
    <Match path={to}>
      {({ match }) => (
        <ListItemLink active={!!match} as={Link} to={to} {...restProps} />
      )}
    </Match>
  );
}

export function Sidebar() {
  return (
    <List>
      <ListItem>
        <ListItemRouteLink to="/">Introduction</ListItemRouteLink>
      </ListItem>
      <ListItem>
        <ListItemRouteLink to="/">Getting started</ListItemRouteLink>
      </ListItem>
      <ListItem>
        <ListItemRouteLink to="/typography">Typography</ListItemRouteLink>
      </ListItem>
      <ListItem>
        <Match path="/components/*">
          {({ match }) => (
            <CollapsibleList
              collapsed={match == null}
              toggler={<ListItemLink>Components</ListItemLink>}
            >
              <ListItem>
                <ListItemRouteLink to="/components/overview">
                  Overview
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/box">Box</ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/checkbox">
                  Checkbox
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/modal">
                  Modal
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/radio">
                  Radio
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/tabs">
                  Tabs
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/text-input">
                  TextInput
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleList>
          )}
        </Match>
      </ListItem>
      <ListItem>
        <ListItemRouteLink to="/">Core</ListItemRouteLink>
      </ListItem>
      <ListItem>
        <ListItemRouteLink to="/utilities">Utilities</ListItemRouteLink>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemRouteLink to="https://github.com/byteclaw/visage">
          Github
        </ListItemRouteLink>
      </ListItem>
    </List>
  );
}
