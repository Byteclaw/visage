import {
  Box,
  Chip,
  Divider,
  Flex,
  Heading,
  IsBreakpoint,
} from '@byteclaw/visage';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { graphql } from 'gatsby';
import React from 'react';
import {
  ComponentsInformationMap,
  ComponentInformationMap,
  PageTableOfContents,
  SEO,
  Paginator,
  PaginatorButton,
} from '../components';
import { NavigationTree } from '../types';

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
    nextPage?: { title: string; urlPath: string };
    previousPage?: { title: string; urlPath: string };
    urlPath: string;
    navigationTree: NavigationTree;
  };
  path: string;
  uri: string;
}

export const pageQuery = graphql`
  query ComponentPageByPath($urlPath: String!) {
    site {
      siteMetadata {
        title
      }
    }
    mdx(fields: { urlPath: { eq: $urlPath } }) {
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
        tags
        title
      }
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
        as="article"
        styles={{
          alignItems: 'flex-start',
          justifyContent: 'center',
          px: 4,
          pt: 4,
          pb: 6,
          width: '100%',
        }}
      >
        <Box styles={{ mx: 'auto', maxWidth: 1100, width: '100%' }}>
          <Heading>{frontmatter.title}</Heading>
          {frontmatter.tags ? (
            <Flex styles={{ mb: 3 }}>
              {frontmatter.tags.map(tag => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </Flex>
          ) : null}
          <Divider />
          <Flex styles={{ alignItems: 'flex-start' }}>
            <Box styles={{ maxWidth: 850, width: '100%' }}>
              <MDXRenderer>{body}</MDXRenderer>
              <Paginator>
                {pageContext.previousPage ? (
                  <PaginatorButton
                    direction="prev"
                    to={pageContext.previousPage.urlPath}
                  >
                    {pageContext.previousPage.title}
                  </PaginatorButton>
                ) : null}

                {pageContext.nextPage ? (
                  <PaginatorButton
                    direction="next"
                    to={pageContext.nextPage.urlPath}
                  >
                    {pageContext.nextPage.title}
                  </PaginatorButton>
                ) : null}
              </Paginator>
            </Box>
            <IsBreakpoint gte={2}>
              <PageTableOfContents
                headings={headings}
                githubEditLink={fields.githubEditLink}
                title={frontmatter.title}
              />
            </IsBreakpoint>
          </Flex>
        </Box>
      </Flex>
    </ComponentInformationMap>
  );
}

export default ComponentPageLayout;
