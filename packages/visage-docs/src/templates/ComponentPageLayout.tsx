import { Box, Flex, IsBreakpoint } from '@byteclaw/visage';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { graphql } from 'gatsby';
import React from 'react';
import {
  ComponentsInformationMap,
  ComponentInformationMap,
  PageTableOfContents,
  SEO,
} from '../components';

interface ComponentPageLayoutProps {
  data: {
    mdx: {
      id: string;
      excerpt: string;
      body: string;
      headings: { depth: number; value: string }[];
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
  const { body, fields, frontmatter, headings } = data.mdx;

  return (
    <ComponentInformationMap information={pageContext.componentInformationMap}>
      <SEO {...frontmatter} pathname={path} />
      <Flex
        styles={{
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Box styles={{ maxWidth: 850, width: '100%', minWidth: 400 }}>
          <MDXRenderer>{body}</MDXRenderer>
        </Box>
        <IsBreakpoint gte={2}>
          <PageTableOfContents
            headings={headings}
            githubEditLink={fields.githubEditLink}
          />
        </IsBreakpoint>
      </Flex>
    </ComponentInformationMap>
  );
}

export default ComponentPageLayout;
