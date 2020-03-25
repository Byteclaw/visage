// @ts-ignore
import { MDXProvider } from '@mdx-js/react';
import * as visage from '@byteclaw/visage';
import React from 'react';
import Helmet from 'react-helmet';
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard';
// @ts-ignore
import { ReactComponent } from './assets/link.svg';
import { CodeBlock, DesignSystem, Layout } from './components';
import { slugify } from './utils';

const mdxComponents: { [key: string]: React.ReactNode } = {
  ...visage,
  a: visage.Link,
  code: CodeBlock,
  inlineCode: (props: any) => (
    <visage.Text
      styles={{ backgroundColor: 'rgba(0,0,0,0.1)', px: 0.5 }}
      {...props}
    />
  ),
  em: visage.EmphasizedText,
  ...Array(6)
    .fill(null)
    .reduce(
      (acc, _, index) => ({
        ...acc,
        [`h${index + 1}`]: ({ children, ...restProps }: any) => {
          const slug = slugify(children);

          return (
            <CopyToClipboard
              text={`${window.location.href
                .replace(window.location.search, '')
                .replace(window.location.hash, '')}#${slug}`}
            >
              <visage.Heading
                id={slug}
                {...restProps}
                level={index + 1}
                styles={{
                  cursor: 'pointer',
                  '&:hover a': { display: 'inline' },
                }}
              >
                {children}
                <visage.Link
                  href={`#${slug}`}
                  styles={{
                    color: 'inherit',
                    ml: 2,
                    display: 'none',
                    textDecoration: 'none',
                  }}
                >
                  <visage.SvgIcon
                    icon={ReactComponent}
                    styles={{
                      fontSize: '70%',
                      lineHeight: 'inherit',
                      verticalAlign: 'top',
                    }}
                  />
                </visage.Link>
              </visage.Heading>
            </CopyToClipboard>
          );
        },
      }),
      {},
    ),
  hr: visage.Divider,
  p: visage.Paragraph,
  pre: (props: any) => props.children,
  strong: visage.StrongText,
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
