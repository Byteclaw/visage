/* eslint-disable react/no-array-index-key */
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import React from 'react';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';
import * as DSScope from '../../../visage/src';

interface CodeBlockProps {
  className: string;
  children: string;
  live?: boolean;
}

export function CodeBlock({
  children,
  className: baseClassName,
  live,
}: CodeBlockProps) {
  const language: Language = baseClassName.replace(/language-/, '') as Language;

  if (live) {
    return (
      <LiveProvider code={children.trim()} scope={DSScope}>
        <LivePreview />
        <LiveEditor />
        <LiveError />
      </LiveProvider>
    );
  }

  return (
    <Highlight {...defaultProps} code={children.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, padding: '20px' }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
