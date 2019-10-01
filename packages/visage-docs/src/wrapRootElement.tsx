import React from 'react';
import Helmet from 'react-helmet';
// @ts-ignore
import { MDXProvider } from '@mdx-js/react';
import {
  ResponsiveDesignSystem,
  Heading,
  Paragraph,
  Text,
} from '@byteclaw/visage';
import { CodeBlock, Layout } from './components';
import { theme } from './theme';
import { visageDocsFaces } from './visageDocsFaces';

const mdxComponents: { [key: string]: React.ReactNode } = {
  code: (props: any) => <CodeBlock {...props} />,
  inlineCode: (props: any) => (
    <Text styles={{ backgroundColor: 'rgba(0,0,0,0.1)', px: 1 }} {...props} />
  ),
  h1: (props: any) => <Heading {...props} level={1} />,
  h2: (props: any) => <Heading {...props} level={2} />,
  h3: (props: any) => <Heading {...props} level={3} />,
  h4: (props: any) => <Heading {...props} level={4} />,
  h5: (props: any) => <Heading {...props} level={5} />,
  h6: (props: any) => <Heading {...props} level={6} />,
  p: (props: any) => <Paragraph {...props} />,
  pre: (props: any) => props.children,
  wrapper: ({ children }: any) => <React.Fragment>{children}</React.Fragment>,
};

interface RootProps {
  element: React.ReactNode;
  props: any;
}

export const wrapRootElement = ({ element, props }: RootProps) => {
  return (
    <ResponsiveDesignSystem theme={theme} faces={visageDocsFaces}>
      <MDXProvider components={mdxComponents}>
        <Helmet>
          <link
            href="https://fonts.googleapis.com/css?family=Nunito+Sans:300,400,400i,700,700i&display=swap&subset=latin-ext"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,400i,700&display=swap&subset=latin-ext"
            rel="stylesheet"
          />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:height" content="1080" />
          <meta property="og:image:width" content="1080" />
          <meta property="og:title" content="Visage" />
          <meta property="og:description" content="Visage" />
          <meta
            property="og:url"
            content="https://visage-design-system.netlify.com"
          />
          <meta property="og:type" content="website" />
        </Helmet>
        <Layout {...props}>{element}</Layout>
      </MDXProvider>
    </ResponsiveDesignSystem>
  );
};
