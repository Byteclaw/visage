import { Box, Link } from '@byteclaw/visage';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { graphql } from 'gatsby';
import React from 'react';
import {
  ComponentsInformationMap,
  ComponentInformationMap,
  SEO,
} from '../components';

interface ComponentPageLayoutProps {
  data: {
    mdx: {
      id: string;
      excerpt: string;
      body: string;
      fields: {
        githubEditLink: string;
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
    componentInformationMap: ComponentsInformationMap;
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
  pageContext,
}: ComponentPageLayoutProps) {
  const { body, fields, frontmatter } = data.mdx;

  return (
    <ComponentInformationMap information={pageContext.componentInformationMap}>
      <SEO {...frontmatter} pathname={path} />
      <MDXRenderer>{body}</MDXRenderer>
      <Box>
        <Link href={fields.githubEditLink}>Edit on GitHub</Link>
      </Box>
    </ComponentInformationMap>
  );
}

export default ComponentPageLayout;
