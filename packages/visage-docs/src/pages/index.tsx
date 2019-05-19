import { Theme } from '@byteclaw/visage-core';
import {
  createTheme,
  createComponent,
  ResponsiveDesignSystem,
} from '@byteclaw/visage';
import { Global } from '@emotion/core';
import React, { ComponentProps, useMemo } from 'react';
import Helmet from 'react-helmet';
// @ts-ignore
import { ReactComponent as VisageLogo } from '../../static/logo.svg';

const Box = createComponent('div');
const ButtonLinkBase = createComponent('a', {
  displayName: 'ButtonLinkBase',
  defaultProps: {
    styles: {
      borderColor: 'transparent',
      borderStyle: 'solid',
      borderRadius: 3,
      borderWidth: 1,
      color: 'primary',
      display: 'inline-block',
      margin: 2,
      padding: 4,
      fontWeight: 'bold',
      textDecoration: 'none',
    },
  },
});

function ButtonLink({
  variant,
  ...restProps
}: ComponentProps<typeof ButtonLinkBase> & { variant?: 'primary' }) {
  const variantStyleProps = useMemo(() => {
    if (variant === 'primary') {
      return {
        styles: {
          backgroundColor: 'primary',
          borderColor: 'primary',
          color: 'primaryText',
        },
      };
    }

    return {};
  }, [variant]);

  return <ButtonLinkBase {...restProps} {...variantStyleProps} />;
}

const Flex = createComponent('div', {
  defaultProps: {
    styles: {
      display: 'flex',
    },
  },
});
const Logo = createComponent(VisageLogo, {
  defaultProps: {
    styles: {
      display: 'inline',
      fontSize: 0,
      height: '1em',
      width: '1em',
    },
  },
  extraStylers: {
    color: (theme: Theme, color: any): any => {
      // @ts-ignore
      return {
        fill: theme.resolve('color', color),
        'path:last-child': {
          fill: theme.resolve('color', color),
        },
      };
    },
    // override font size to so we can use larger size
    fontSize: (theme: Theme, fontSize: any) => fontSize,
  },
});
const LogoTitle = createComponent('h1', {
  defaultProps: {
    styles: {
      color: 'text',
      fontSize: 4,
      lineHeight: 4,
      fontFamily: 'title',
      margin: 0,
    },
  },
});
const Paragraph = createComponent('p', {
  defaultProps: {
    styles: {
      color: 'text',
      padding: 2,
      margin: 2,
    },
  },
});

const theme = createTheme(
  {
    colors: {
      primary: 'black',
      primaryText: 'white',
      text: '#444',
    },
    fontFamilies: {
      body: 'Lora,serif',
      title: 'Varela Round,sans-serif',
    },
    fontSizes: {
      values: [16, 18, 22, 30, 46, 78],
      offset: 0,
    },
    lineHeights: {
      values: ['20px', '22px', '26px', '34px', '50px', '82px'],
      offset: 0,
    },
    spacings: {
      values: [0, 2, 4, 8, 16, 32, 64],
      offset: 0,
    },
  },
  {
    color: 'colors',
    backgroundColor: 'colors',
    borderColor: 'colors',
    borderRadius: 'spacings',
    fontFamily: 'fontFamilies',
    fontSize: 'fontSizes',
    lineHeight: 'lineHeights',
    margin: 'spacings',
    marginBottom: 'spacings',
    marginLeft: 'spacings',
    marginRight: 'spacings',
    marginTop: 'spacings',
    padding: 'spacings',
    paddingBottom: 'spacings',
    paddingLeft: 'spacings',
    paddingRight: 'spacings',
    paddingTop: 'spacings',
  },
);

export default () => {
  return (
    <ResponsiveDesignSystem theme={theme}>
      <Global
        styles={{
          '*': {
            boxSizing: 'border-box',
          },
          body: {
            color: '#444',
            fontFamily: 'Lora,serif',
            fontWeight: 400,
          },
          html: {
            fontSize: 16,
            lineHeight: '20px',
          },
        }}
      />
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css?family=Lato|Varela+Round&display=swap"
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
        <Box styles={{ textAlign: 'center', width: '100%' }}>
          <Logo styles={{ fontSize: 200 }} />
          <LogoTitle>Visage</LogoTitle>
          <Paragraph>
            Ready-to-use React component library with minimalist approach
          </Paragraph>
          <ButtonLink href="/" variant="primary">
            Documentation
          </ButtonLink>
          <ButtonLink href="/">Github</ButtonLink>
        </Box>
      </Flex>
    </ResponsiveDesignSystem>
  );
};
