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

export function PageLayout({ children, pageContext, path }: PageLayoutProps) {
  const { frontmatter } = pageContext;

  return (
    <>
      <SEO {...frontmatter} pathname={path} />
      {children}
    </>
  );
}

export default PageLayout;
