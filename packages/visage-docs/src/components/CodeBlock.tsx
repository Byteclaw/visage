/* eslint-disable react/no-array-index-key */
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import duotoneLight from 'prism-react-renderer/themes/duotoneLight';
import duotoneDark from 'prism-react-renderer/themes/duotoneDark';
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';
import * as DSScope from '@byteclaw/visage';
import * as Core from '@byteclaw/visage-core';
import * as Utilities from '@byteclaw/visage-utils';
import { ThemeTogglerContext } from '../theme';
import { WithRef } from './WithRef';
import { WithState } from './WithState';

const { Box, Flex, Button, createComponent } = DSScope;
const Scope = {
  Fragment,
  ...Core,
  ...DSScope,
  ...Utilities,
  useState,
  useContext,
  useReducer,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  WithRef,
  WithState,
};

const EditorError = createComponent(LiveError, {
  styles: {
    backgroundColor: 'red',
    color: 'white',
    m: 0,
    p: 1,
  },
});

interface CodeBlockProps {
  className: string;
  children: string;
  live?: boolean;
  noInline?: boolean;
  expanded?: boolean;
  stringify?: boolean;
  transpile?: boolean | 'false' | 'true';
}

export function CodeBlock({
  children,
  className: baseClassName,
  live,
  expanded,
  noInline,
  stringify,
  transpile = true,
}: CodeBlockProps) {
  const { isDark } = useContext(ThemeTogglerContext);
  const [isExpanded, setExpanded] = useState(expanded);
  const language: Language = baseClassName.replace(/language-/, '') as Language;
  const shouldTranspile = transpile !== 'false' && transpile !== false;

  return (
    <Box styles={{ mb: 2 }}>
      {shouldTranspile ? (
        <LiveProvider
          code={children.trim()}
          disabled={!live}
          language={language}
          transformCode={stringify ? code => `'' + ${code}` : undefined}
          noInline={noInline}
          scope={Scope}
          theme={duotoneLight}
        >
          <Box styles={{ mb: 2, width: '100%' }}>
            <LivePreview />
          </Box>
          <Flex styles={{ width: '100%' }}>
            <Button onClick={() => setExpanded(!isExpanded)} type="button">
              {live
                ? !isExpanded
                  ? 'Show editor'
                  : 'Hide editor'
                : !isExpanded
                ? 'Show code'
                : 'Hide code'}
            </Button>
          </Flex>
          {isExpanded ? (
            <Box styles={{ backgroundColor: 'black', width: '100%' }}>
              <LiveEditor />
              <EditorError />
            </Box>
          ) : null}
        </LiveProvider>
      ) : (
        <Highlight
          {...defaultProps}
          code={children.trim()}
          language={language}
          theme={isDark ? duotoneDark : duotoneLight}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={{ ...style, padding: '10px' }}>
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
      )}
    </Box>
  );
}
