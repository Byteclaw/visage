import { Column, Container, Header, SvgIcon, Text } from '@byteclaw/visage';
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
        <SvgIcon icon={LogoSvg} styles={{ iconSize: 2 }} />{' '}
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
    </Fragment>
  );
}
