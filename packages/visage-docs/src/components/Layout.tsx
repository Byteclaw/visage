import {
  Column,
  Container,
  Flex,
  Header,
  SvgIcon,
  Toggle,
  Text,
} from '@byteclaw/visage';
import React, { Fragment, ReactNode } from 'react';
// @ts-ignore
import { ReactComponent as LogoSvg } from '../../static/logo.svg';
import { ThemeTogglerContext } from '../theme';
import { GeneratePaletteButton } from './GeneratePaletteButton';
import { Sidebar } from './Sidebar';
import { Search } from './Search';

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <Fragment>
      <Header styles={{ py: 1 }}>
        <Container styles={{ px: 6, alignItems: 'center' }}>
          <Flex styles={{ width: '20rem', flexShrink: 0, px: 3 }}>
            <SvgIcon icon={LogoSvg} styles={{ iconSize: 2, mr: 0 }} />{' '}
            <Text styles={{ fontSize: 2, lineHeight: 2, fontWeight: 'bold' }}>
              Visage
            </Text>
          </Flex>
          <Flex styles={{ flex: 1, pl: 6 }}>
            <Search />
            <ThemeTogglerContext.Consumer>
              {value => (
                <>
                  <Toggle
                    label="Use dark theme"
                    hiddenLabel
                    onChange={e => value.useDark(e.currentTarget.checked)}
                    checked={value.isDark}
                    styles={{ mx: 2 }}
                  />
                  <GeneratePaletteButton onSuccess={value.setColors} />
                </>
              )}
            </ThemeTogglerContext.Consumer>
          </Flex>
        </Container>
      </Header>
      <Container styles={{ px: 6 }}>
        <Column as="nav" styles={{ width: '20rem', flexShrink: 0, px: 2 }}>
          <Sidebar />
        </Column>
        <Column
          styles={{
            pl: 6,
            pt: 4,
            pb: 6,
            width: '100%',
            '& > div': { width: '100%' },
          }}
        >
          {children}
        </Column>
      </Container>
    </Fragment>
  );
}
