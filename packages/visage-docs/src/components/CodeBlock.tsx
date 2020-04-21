/* eslint-disable react/no-array-index-key */
import * as DSScope from '@byteclaw/visage';
import * as Core from '@byteclaw/visage-core';
import { createDocsTheme } from '@byteclaw/visage-themes';
import * as Utilities from '@byteclaw/visage-utils';
import { Language } from 'prism-react-renderer';
import duotoneLight from 'prism-react-renderer/themes/duotoneLight';
import duotoneDark from 'prism-react-renderer/themes/duotoneDark';
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CheckCircle, Code, Copy, Moon, Sun } from 'react-feather';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';
import { ThemeTogglerContext } from '../theme';
import { WithRef } from './WithRef';
import { WithState } from './WithState';

const { Box, Flex, IconButton, createComponent } = DSScope;
const Scope = {
  MoonIcon: Moon,
  SunIcon: Sun,
  Fragment,
  ...Core,
  ...DSScope,
  ...Utilities,
  useState,
  useContext,
  useReducer,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  WithRef,
  WithState,
  theme: createDocsTheme(),
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
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setExpanded] = useState(expanded);
  const language: Language = baseClassName.replace(/language-/, '') as Language;
  const shouldTranspile = transpile !== 'false' && transpile !== false;
  const editCodeLabel = isExpanded ? 'Hide code editor' : 'Show code editor';

  const onCopy = useCallback(() => {
    setIsCopied(true);

    window.setTimeout(() => setIsCopied(false), 500);
  }, []);

  return (
    <Box styles={{ mb: 2 }}>
      <LiveProvider
        code={children.trim()}
        disabled={!live}
        language={language}
        noInline={noInline}
        scope={Scope}
        theme={isDark ? duotoneDark : duotoneLight}
        transformCode={stringify ? code => `'' + ${code}` : undefined}
      >
        <Box
          styles={{
            borderColor:
              'color(shades if(isDark color(shades tint(10%)) color(shades shade(10%))))',
            borderRadius: 'controlBorderRadius',
            borderStyle: 'solid',
            borderWidth: 1,
            mb: 1,
            p: 1,
            width: '100%',
          }}
        >
          {shouldTranspile ? <LivePreview /> : <LiveEditor />}
        </Box>
        <Flex
          styles={{
            fontSize: 1,
            lineHeight: 1,
            justifyContent: 'flex-end',
            mb: 1,
          }}
        >
          {shouldTranspile ? (
            <IconButton
              icon={Code}
              label={editCodeLabel}
              onClick={() => setExpanded(!isExpanded)}
              stroked
              styles={{ mr: 1 }}
              title={editCodeLabel}
              type="button"
            />
          ) : null}
          <CopyToClipboard onCopy={onCopy} text={children.trim()}>
            <IconButton
              icon={isCopied ? CheckCircle : Copy}
              label="Copy the source"
              monochromatic
              styles={{ color: isCopied ? 'success' : 'inherit' }}
              stroked
              title="Copy the source"
              type="button"
            />
          </CopyToClipboard>
        </Flex>
        {shouldTranspile && isExpanded ? (
          <Box
            styles={{
              borderColor:
                'color(shades if(isDark color(shades tint(10%)) color(shades shade(10%))))',
              borderRadius: 'controlBorderRadius',
              borderStyle: 'solid',
              borderWidth: 1,
              p: 1,
              width: '100%',
            }}
          >
            <LiveEditor />
            <EditorError />
          </Box>
        ) : null}
      </LiveProvider>
    </Box>
  );
}
