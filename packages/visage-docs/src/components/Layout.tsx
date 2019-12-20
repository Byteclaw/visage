import {
  Column,
  Container,
  Drawer,
  Flex,
  Header,
  SvgIcon,
  Toggle,
  Text,
  DrawerPosition,
} from '@byteclaw/visage';
import React, { ReactNode } from 'react';
// @ts-ignore
import { version as visageVersion } from '../../../visage/package.json';
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
    <>
      <Drawer
        styles={{
          width: '16rem',
          flexShrink: 0,
          height: '100vh',
          overflowY: 'scroll',
          boxShadow: 'inset -1px 0 0 0 neutral',
        }}
        open
        side={DrawerPosition.left}
      >
        <Flex styles={{ alignItems: 'center', py: 1, px: 1 }}>
          <SvgIcon icon={LogoSvg} styles={{ iconSize: 2, mr: 0 }} />{' '}
          <Text styles={{ fontSize: 2, lineHeight: 2, fontWeight: 'bold' }}>
            Visage
            <Text as="span" styles={{ fontSize: -2, fontWeight: 400 }}>
              &nbsp; v{visageVersion}
            </Text>
          </Text>
        </Flex>
        <Sidebar />
      </Drawer>
      <Flex styles={{ flexDirection: 'column', ml: '16rem' }}>
        <Header styles={{ py: 1 }}>
          <Container styles={{ px: 6, alignItems: 'center' }}>
            <Flex styles={{ flex: 1 }}>
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
          <Column
            styles={{
              pt: 4,
              pb: 6,
              width: '100%',
              '& > div': { width: '100%' },
            }}
          >
            {children}
          </Column>
        </Container>
      </Flex>
    </>
  );
}
