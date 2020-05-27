import React, { ReactNode } from 'react';

interface HTMLProps {
  htmlAttributes?: object;
  headComponents?: ReactNode;
  bodyAttributes?: object;
  preBodyComponents?: ReactNode;
  body: string;
  postBodyComponents: ReactNode;
}

export default function HTML({
  body,
  bodyAttributes,
  headComponents,
  htmlAttributes,
  preBodyComponents,
  postBodyComponents,
}: HTMLProps) {
  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, shrink-to-fit=no"
        />
        {headComponents}
      </head>
      <body {...bodyAttributes}>
        {preBodyComponents}
        <div
          key="body"
          id="___gatsby"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: body }}
        />
        {postBodyComponents}
      </body>
    </html>
  );
}
