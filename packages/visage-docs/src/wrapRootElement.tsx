import React from 'react';
import Helmet from 'react-helmet';
// @ts-ignore
import { MDXProvider } from '@mdx-js/react';
import { Heading, Paragraph, Text } from '@byteclaw/visage';
import { CodeBlock, DesignSystem, Layout } from './components';

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
    <DesignSystem>
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
        </Helmet>
        <Layout {...props}>{element}</Layout>
      </MDXProvider>
    </DesignSystem>
  );
};
