import { Column, Container, Drawer, Header, Svg, Text } from '@byteclaw/visage';
import React, { Fragment, ReactNode } from 'react';
// @ts-ignore
import { ReactComponent as LogoSvg } from '../../static/logo.svg';
import { Sidebar } from './Sidebar';

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <Fragment>
      <Header>
        <Svg as={LogoSvg} styles={{ fontSize: 2, linedHeight: 2 }} />{' '}
        <Text styles={{ fontSize: 2, lineHeight: 2 }}>Visage</Text>
      </Header>
      <Container>
        <Column as="nav" styles={{ width: '16rem' }}>
          <Sidebar />
        </Column>
        <Column styles={{ width: '100%', '& > div': { width: '100%' } }}>
          {children}
        </Column>
      </Container>
      <Drawer
        open
        overlayed
        side="right"
        styles={{
          width: '30%',
          backgroundColor: 'white',
          boxShadow: '1px 2px 5px 2px rgba(0,0,0,0.5)',
        }}
      >
        f
      </Drawer>
    </Fragment>
  );
}
