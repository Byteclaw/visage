import {
  Column,
  Container,
  Header,
  SvgIcon,
  Toggle,
  Text,
} from '@byteclaw/visage';
import React, { Fragment, ReactNode } from 'react';
// @ts-ignore
import { ReactComponent as LogoSvg } from '../../static/logo.svg';
import { ThemeTogglerContext } from '../theme';
import { Sidebar } from './Sidebar';
import { Search } from './Search';

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <Fragment>
      <Header styles={{ alignItems: 'center', pr: 1, py: 1 }}>
        <SvgIcon icon={LogoSvg} styles={{ iconSize: 2 }} />{' '}
        <Text styles={{ fontSize: 2, lineHeight: 2 }}>Visage</Text>
        <ThemeTogglerContext.Consumer>
          {value => (
            <Toggle
              label="Use dark theme"
              hiddenLabel
              onChange={e => value.useDark(e.currentTarget.checked)}
              checked={value.isDark}
              styles={{ ml: 2 }}
            />
          )}
        </ThemeTogglerContext.Consumer>
        <Search />
      </Header>
      <Container>
        <Column as="nav" styles={{ width: '16rem', flexShrink: 0 }}>
          <Sidebar />
        </Column>
        <Column styles={{ px: 2, width: '100%', '& > div': { width: '100%' } }}>
          {children}
        </Column>
      </Container>
    </Fragment>
  );
}
