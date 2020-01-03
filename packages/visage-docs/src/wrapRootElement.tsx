// @ts-ignore
import { MDXProvider } from '@mdx-js/react';
import {
  Divider,
  EmphasizedText,
  Heading,
  Link,
  Paragraph,
  StrongText,
  Text,
} from '@byteclaw/visage';
import React from 'react';
import Helmet from 'react-helmet';
import { CodeBlock, DesignSystem, Layout } from './components';
import { slugify } from './utils';

const mdxComponents: { [key: string]: React.ReactNode } = {
  a: Link,
  code: CodeBlock,
  inlineCode: (props: any) => (
    <Text styles={{ backgroundColor: 'rgba(0,0,0,0.1)', px: 1 }} {...props} />
  ),
  em: EmphasizedText,
  ...Array(6)
    .fill(null)
    .reduce(
      (acc, _, index) => ({
        ...acc,
        [`h${index + 1}`]: ({ children, ...restProps }: any) => (
          <Heading id={slugify(children)} {...restProps} level={index + 1}>
            <Link
              href={`#${slugify(children)}`}
              styles={{ color: 'inherit', textDecoration: 'none' }}
            >
              {children}
            </Link>
          </Heading>
        ),
      }),
      {},
    ),
  hr: Divider,
  p: Paragraph,
  pre: (props: any) => props.children,
  strong: StrongText,
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
            href="https://fonts.googleapis.com/css?family=Nunito+Sans:300,400,400i,600,700,700i&display=swap&subset=latin-ext"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,400i,600,700&display=swap&subset=latin-ext"
            rel="stylesheet"
          />
        </Helmet>
        <Layout {...props}>{element}</Layout>
      </MDXProvider>
    </DesignSystem>
  );
};
