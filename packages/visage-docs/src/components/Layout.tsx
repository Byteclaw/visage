import {
  Column,
  Container,
  Drawer,
  Flex,
  Header,
  IconButton,
  SvgIcon,
  Text,
  DrawerPosition,
  useBreakpoint,
} from '@byteclaw/visage';
import React, { ReactNode, useState } from 'react';
import { Menu } from 'react-feather';
// @ts-ignore
import { version as visageVersion } from '../../../visage/package.json';
import { ReactComponent as LogoSvg } from '../../static/logo.svg';
import { CustomizeThemeButton } from './CustomizeThemeButton';
import { ColorModeToggle } from './ColorModeToggle';
import { Sidebar } from './Sidebar';
import { Search } from './Search';

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  const isMobile = useBreakpoint({ lte: 1 });
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Drawer
        backdrop={isMobile}
        styles={{
          width: '16rem',
          flexShrink: 0,
          height: '100vh',
          overflowY: 'scroll',
          boxShadow:
            'inset -1px 0 0 0 color(shades if(isDark, color(shades tint(10%)), color(shades shade(10%))))',
        }}
        onClose={() => setMenuOpen(false)}
        open={isMobile ? isMenuOpen : true}
        side={DrawerPosition.left}
      >
        <Flex styles={{ alignItems: 'center', py: 2, px: 2 }}>
          <SvgIcon icon={LogoSvg} styles={{ iconSize: 2, mr: 0 }} />{' '}
          <Text styles={{ fontSize: 1, lineHeight: 1, fontWeight: 'bold' }}>
            Visage
            <Text as="span" styles={{ fontSize: -2, fontWeight: 400 }}>
              &nbsp; v{visageVersion}
            </Text>
          </Text>
        </Flex>
        <Sidebar />
      </Drawer>
      <Flex styles={{ flexDirection: 'column', ml: [null, null, '16rem'] }}>
        <Header styles={{ py: 2 }}>
          <Container
            styles={{
              alignItems: 'center',
              position: 'relative',
              justifyContent: ['space-between', undefined, 'flex-start'],
              px: 2,
            }}
          >
            <IconButton
              icon={Menu}
              label="Open navigation"
              onClick={() => setMenuOpen(true)}
              styles={{ fontSize: 1, lineHeight: 1 }}
              title="Open navigation"
            />
            <Flex
              styles={{
                maxWidth: 840,
                mx: 'auto',
                px: 3,
                flex: 1,
                display: ['none', 'flex'],
              }}
            >
              <Search />
            </Flex>
            <Flex
              styles={{
                flexShrink: 0,
                fontSize: 1,
                lineHeight: 1,
                right: 0,
                ml: 2,
              }}
            >
              <ColorModeToggle />
              <CustomizeThemeButton />
            </Flex>
          </Container>
        </Header>
        <Container styles={{ maxWidth: 840, mx: 'auto', px: 3 }}>
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
