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
import React from 'react';
import Helmet from 'react-helmet';
import { GridDebugTogglerButton } from '../components';
// @ts-ignore
import { ReactComponent as VisageLogo } from '../../static/logo.svg';

const theme = createNPointTheme(
  {
    baseFontSize: 16,
    baseLineHeightRatio: 1.6,
    baselineGridSize: 8,
    fontScaleRatio: ratios.goldenSection,
    colors: {
      bodyText: '#444',
      primary: 'black',
      primaryText: 'white',
    },
    fontFamilies: {
      body: 'Lato,serif',
      heading: 'Raleway,sans-serif',
    },
  },
  {
    color: 'colors',
    backgroundColor: 'colors',
    borderColor: 'colors',
    fontFamily: 'fontFamilies',
  },
);

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
          paddingLeft: 3,
          paddingRight: 3,
          width: '100vw',
        }}
      >
        <Box styles={{ height: '100%', textAlign: 'center', width: '100%' }}>
          <Svg
            as={VisageLogo}
            styles={{
              fontSize: 6,
              height: 6,
              width: 6,
            }}
          />
          <Heading>Visage</Heading>
          <Text as="p" styles={{ fontSize: 1, lineHeight: 1, marginTop: 1 }}>
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
