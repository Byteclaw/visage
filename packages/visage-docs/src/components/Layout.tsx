import {
  Box,
  Container,
  Drawer,
  Flex,
  Header,
  IconButton,
  SvgIcon,
  Text,
  DrawerPosition,
  useBreakpoint,
  Tooltip,
} from '@byteclaw/visage';
import React, { ReactNode, useState } from 'react';
import { Menu } from 'react-feather';
// @ts-ignore
import { version as visageVersion } from '../../../visage/package.json';
import { ReactComponent as LogoSvg } from '../../static/logo.svg';
import { CustomizeThemeButton } from './CustomizeThemeButton';
import { ColorModeToggle } from './ColorModeToggle';
import { GithubButton } from './GithubButton';
import { Sidebar } from './Sidebar';
import { Search } from './Search';
import { NavigationTree } from '../types';

interface Props {
  children: ReactNode;
  pageContext: {
    navigationTree: NavigationTree;
  };
}

export function Layout({ children, pageContext }: Props) {
  const isMobile = useBreakpoint({ lte: 1 });
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Drawer
        as="aside"
        backdrop={isMobile}
        styles={{
          width: '16rem',
          flexShrink: 0,
          height: '100vh',
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
        <Sidebar tree={pageContext.navigationTree} />
      </Drawer>
      <Box
        as="main"
        styles={{
          display: 'block',
          ml: [null, null, '16rem'],
          minHeight: '100vh',
        }}
      >
        <Header
          styles={{
            backgroundColor: 'shades',
            py: 2,
            position: 'sticky',
            top: 0,
            zIndex: 2,
          }}
        >
          <Container
            styles={{
              alignItems: 'center',
              position: 'relative',
              justifyContent: ['space-between', undefined, 'flex-start'],
              px: 3,
            }}
          >
            <Tooltip content="Open navigation">
              <IconButton
                icon={Menu}
                label="Open navigation"
                onClick={() => setMenuOpen(true)}
                styles={{
                  display: ['inline-block', undefined, 'none'],
                  fontSize: 1,
                  lineHeight: 1,
                  mr: 2,
                }}
              />
            </Tooltip>
            <Flex
              styles={{
                maxWidth: 850,
                mx: 'auto',
                // flex: 1,
                width: '100%',
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
                // same as page table of contents
                maxWidth: 250,
                width: '100%',
                right: 0,
                ml: 2,
                justifyContent: 'flex-end',
              }}
            >
              <GithubButton />
              <ColorModeToggle />
              <CustomizeThemeButton />
            </Flex>
          </Container>
        </Header>
        {children}
      </Box>
    </>
  );
}
