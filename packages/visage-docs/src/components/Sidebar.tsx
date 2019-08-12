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
    <List navigation>
      <ListItem>
        <ListItemRouteLink to="/">Introduction</ListItemRouteLink>
      </ListItem>
      <ListItem>
        <ListItemRouteLink to="/">Getting started</ListItemRouteLink>
      </ListItem>
      <ListItem>
        <ListItemRouteLink to="/typography">Typography</ListItemRouteLink>
      </ListItem>
      <ListItem styles={{ p: 0 }}>
        <Match path="/components/*">
          {({ match }) => (
            <CollapsibleList
              collapsed={match == null}
              toggler={<ListItemLink tabIndex={0}>Components</ListItemLink>}
            >
              <ListItem>
                <ListItemRouteLink to="/components/overview">
                  Overview
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/autocomplete-input">
                  AutocompleteInput
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/box">Box</ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/button">
                  Button
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/checkbox">
                  Checkbox
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/chip">
                  Chip
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/divider">
                  Divider
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/file-input">
                  FileInput
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/label">
                  Label
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/list">
                  List
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/menu">
                  Menu
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
                <ListItemRouteLink to="/components/select">
                  Select
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/svg-icon">
                  SvgIcon
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/tabs">
                  Tabs
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/textarea">
                  TextArea
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/text-input">
                  TextInput
                </ListItemRouteLink>
              </ListItem>
              <ListItem>
                <ListItemRouteLink to="/components/toggle">
                  Toggle
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleList>
          )}
        </Match>
      </ListItem>
      <ListItem>
        <Match path="/core/*">
          {({ match }) => (
            <CollapsibleList
              collapsed={match == null}
              toggler={<ListItemLink tabIndex={0}>Core</ListItemLink>}
            >
              <ListItem>
                <ListItemRouteLink to="/core/is-breakpoint">
                  IsBreakpoint
                </ListItemRouteLink>
              </ListItem>
            </CollapsibleList>
          )}
        </Match>
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
