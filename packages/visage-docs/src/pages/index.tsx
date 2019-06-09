import {
  Box,
  Button,
  Flex,
  Heading,
  ratios,
  createNPointTheme,
  ResponsiveDesignSystem,
  Svg,
  Text,
} from '@byteclaw/visage';
import color from 'color';
import React from 'react';
import Helmet from 'react-helmet';
import { GridDebugTogglerButton } from '../components';
// @ts-ignore
import { ReactComponent as VisageLogo } from '../../static/logo.svg';

const theme = createNPointTheme({
  baseFontSize: 16,
  baseLineHeightRatio: 1.6,
  baselineGridSize: 8,
  fontScaleRatio: ratios.goldenSection,
  colors: {
    bodyText: '#444',
    primary: {
      values: [
        '#000000',
        color('#000000')
          .fade(0.1)
          .hex()
          .toString(),
        color('#000000')
          .fade(0.2)
          .hex()
          .toString(),
        color('#000000')
          .fade(0.3)
          .rgb()
          .string(),
      ],
      offset: 0,
    },
    primaryText: 'white',
  },
  fontFamilies: {
    body: 'Lato,serif',
    heading: 'Raleway,sans-serif',
  },
});

export default () => {
  return (
    <ResponsiveDesignSystem theme={theme}>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css?family=Lato:400,700|Raleway:400,700&display=swap&subset=latin-ext"
          rel="stylesheet"
        />
      </Helmet>
      <Flex
        styles={{
          alignItems: 'center',
          alignContent: 'center',
          flexWrap: 'wrap',
          height: '100vh',
          pl: 3,
          pr: 3,
          width: '100vw',
        }}
      >
        <Box styles={{ height: '100%', textAlign: 'center', width: '100%' }}>
          <Svg
            as={VisageLogo}
            styles={{
              flexGrow: 0,
              height: 250,
              width: 250,
            }}
          />
          <Heading level={1}>Visage</Heading>
          <Text as="p" styles={{ fontSize: 1, lineHeight: 1, mt: 1 }}>
            Ready-to-use React component library with minimalist approach
          </Text>
          <Button as="a" href="/" variant="primary">
            Documentation
          </Button>
          <Button as="a" href="/" styles={{ borderWidth: 1 }}>
            Github
          </Button>
          <GridDebugTogglerButton />
        </Box>
      </Flex>
    </ResponsiveDesignSystem>
  );
};
