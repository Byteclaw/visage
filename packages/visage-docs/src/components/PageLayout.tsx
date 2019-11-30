import { Box, Link } from '@byteclaw/visage';
import React, { ReactNode } from 'react';
import { SEO } from './SEO';

interface PageLayoutProps {
  children: ReactNode;
  pageContext: {
    frontmatter: {
      title?: string;
    };
  };
  path: string;
  uri: string;
}

export function PageLayout({
  children,
  pageContext,
  path,
  uri,
}: PageLayoutProps) {
  const { frontmatter } = pageContext;

  return (
    <>
      <SEO {...frontmatter} pathname={path} />
      {children}
      <Box>
        <Link
          href={`https://github.com/Byteclaw/visage/edit/master/packages/visage-docs/src/pages${uri}${
            uri === '/' ? 'index.mdx' : '.mdx'
          }`}
        >
          Edit on GitHub
        </Link>
      </Box>
    </>
  );
}

export default PageLayout;
