// @ts-ignore
import { MDXProvider } from '@mdx-js/react';
import * as visage from '@byteclaw/visage';
import { Link, PageProps } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ReactComponent } from './assets/link.svg';
import {
  CodeBlock,
  ColorPalette,
  ColorPlayground,
  ColorScale,
  DesignSystem,
  Layout,
  Paginator,
  PaginatorButton,
  PropTypes,
} from './components';
import { slugify } from './utils';

function createHeadingUrl(slug: string): string {
  if (typeof window === 'undefined') {
    return `#${slug}`;
  }

  return `${window.location.href
    .replace(window.location.search, '')
    .replace(window.location.hash, '')}#${slug}`;
}

const mdxComponents: { [key: string]: React.ReactNode } = {
  ...visage,
  CodeBlock,
  ColorPalette,
  ColorPlayground,
  ColorScale,
  a: ({ href, ...restProps }: any) => {
    if (href.startsWith('http')) {
      return (
        <visage.Link
          {...restProps}
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        />
      );
    }

    return <visage.Link {...restProps} as={Link} to={href} />;
  },
  code: CodeBlock,
  inlineCode: visage.Code,
  em: visage.EmphasizedText,
  ...Array(6)
    .fill(null)
    .reduce(
      (acc, _, index) => ({
        ...acc,
        [`h${index + 1}`]: ({ children, ...restProps }: any) => {
          const slug = slugify(children);

          return (
            <CopyToClipboard text={createHeadingUrl(slug)}>
              <visage.Heading
                id={slug}
                {...restProps}
                level={index + 1}
                styles={{
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
                      fill: 'currentColor',
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
  wrapper: ({ children }: any) => <>{children}</>,
  PropTypes,
  Paginator,
  PaginatorButton,
};

interface RootProps {
  element: React.ReactNode;
  props: PageProps;
}

export const wrapRootElement = ({ element }: RootProps) => {
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
        {element}
      </MDXProvider>
    </DesignSystem>
  );
};

export const wrapPageElement = ({ element, props }: RootProps) => {
  const { path } = props;

  if (path === '/live-preview/') {
    return element;
  }

  return <Layout {...props}>{element}</Layout>;
};
