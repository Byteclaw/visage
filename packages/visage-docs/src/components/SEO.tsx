import React from 'react';
import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

const query = graphql`
  query GetSiteMetadata {
    site {
      siteMetadata {
        defaultTitle: title
        author
        defaultBanner: banner
        defaultDescription: description
        ogLanguage
        siteLanguage
        siteUrl: url
      }
    }
  }
`;

interface SEOProps {
  article?: any;
  banner?: string;
  description?: string | null;
  image?: string | null;
  lang?: string | null;
  meta?: any[];
  pathname?: string;
  slug?: string | null;
  title?: string;
}

export function SEO({
  article,
  banner,
  description,
  pathname,
  title,
}: SEOProps) {
  const {
    site: { siteMetadata },
  } = useStaticQuery(query);
  const seo = {
    description: description || siteMetadata.defaultDescription,
    image: `${siteMetadata.siteUrl}${banner || siteMetadata.defaultBanner}`,
    title: title || siteMetadata.defaultTitle,
    url: `${siteMetadata.siteUrl}${pathname || ''}`,
  };

  return (
    <Helmet title={seo.title} titleTemplate="%s - Visage Design System">
      <html lang={siteMetadata.siteLanguage} />
      <meta name="description" content={seo.description} />
      <meta name="og:locale" content={siteMetadata.ogLanguage} />
      <meta name="og:url" content={seo.url} />
      <meta name="og:type" content={article ? 'article' : 'website'} />
      <meta name="og:title" content={seo.title} />
      <meta name="og:description" content={seo.description} />
      {/* <meta name="og:image" content={seo.image} /> */}
    </Helmet>
  );
}
