/* eslint-disable react/no-array-index-key */
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import React from 'react';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';
import * as DSScope from '@byteclaw/visage';
import * as Core from '@byteclaw/visage-core';
import * as Utilities from '@byteclaw/visage-utils';

const { Box, Heading } = DSScope;
const Scope = {
  ...DSScope,
  ...Core,
  ...Utilities,
};

interface CodeBlockProps {
  className: string;
  children: string;
  live?: boolean;
  stringify?: boolean;
}

export function CodeBlock({
  children,
  className: baseClassName,
  live,
  stringify,
}: CodeBlockProps) {
  const language: Language = baseClassName.replace(/language-/, '') as Language;

  if (live) {
    return (
      <Box styles={{ pb: 2 }}>
        <LiveProvider
          code={children.trim()}
          transformCode={stringify ? code => `'' + ${code}` : undefined}
          scope={Scope}
        >
          <Box styles={{ pb: 2 }}>
            <Heading level={5}>Preview</Heading>
            <LivePreview />
          </Box>
          <Box>
            <Heading level={5}>Code</Heading>
            <LiveEditor />
            <LiveError />
          </Box>
        </LiveProvider>
      </Box>
    );
  }

  return (
    <Box styles={{ py: 2 }}>
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
    </Box>
  );
}
