import React, { Fragment, ReactNode } from 'react';
import { ReactComponent as LogoSvg } from '../../static/logo.svg';
import { Column, Container, Header, Svg, Text } from '../../../visage/src';
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
        <Column styles={{ minWidth: 150, maxWidth: 300 }}>
          <Sidebar />
        </Column>
        <Column styles={{ width: '100%', '& > div': { width: '100%' } }}>
          {children}
        </Column>
      </Container>
    </Fragment>
  );
}
