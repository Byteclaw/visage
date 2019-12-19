import { Box, Link } from '@byteclaw/visage';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { graphql } from 'gatsby';
import React from 'react';
import { SEO } from '../components/SEO';

interface ComponentPageLayoutProps {
  data: {
    mdx: {
      id: string;
      excerpt: string;
      body: string;
      fields: {
        githubEditLink: string;
        twitterDiscussLink: string;
      };
      frontmatter: {
        date: string;
        description: string;
        slug: string;
        tags?: string[];
        title: string;
      };
      timeToRead: number;
    };
    site: {
      siteMetadata: {
        title: string;
      };
    };
  };
  pageContext: {
    componentPathName: string;
  };
  path: string;
  uri: string;
}

export const pageQuery = graphql`
  query ComponentPageByPath($componentPathName: String!) {
    site {
      siteMetadata {
        title
      }
    }
    mdx(fields: { componentPathName: { eq: $componentPathName } }) {
      id
      excerpt(pruneLength: 160)
      headings {
        depth
        value
      }
      body
      fields {
        githubEditLink
      }
      frontmatter {
        title
      }
      timeToRead
    }
  }
`;

export function ComponentPageLayout({
  data,
  path,
  uri,
}: ComponentPageLayoutProps) {
  const { body, frontmatter } = data.mdx;

  return (
    <>
      <SEO {...frontmatter} pathname={path} />
      <MDXRenderer>{body}</MDXRenderer>
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

export default ComponentPageLayout;
