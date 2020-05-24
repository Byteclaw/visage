/* eslint-disable react/no-array-index-key */
import {
  Box,
  Flex,
  IconButton,
  Tooltip,
  useDebouncedCallback,
} from '@byteclaw/visage';
import { Language } from 'prism-react-renderer';
import duotoneLight from 'prism-react-renderer/themes/duotoneLight';
import duotoneDark from 'prism-react-renderer/themes/duotoneDark';
import React, {
  useCallback,
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CheckCircle, Code, Codesandbox, Copy } from 'react-feather';
import { Editor } from 'react-live';
import { ThemeTogglerContext } from '../theme';

interface CodeBlockProps {
  className: string;
  codesandbox?: string;
  children: string;
  live?: boolean;
  noInline?: boolean;
  expanded?: boolean;
  transpile?: boolean | 'false' | 'true';
}

export function CodeBlock({
  children,
  className: baseClassName,
  codesandbox,
  live,
  expanded,
  noInline,
  transpile = true,
}: CodeBlockProps) {
  const [code, setCode] = useState(children.trim());
  const [src, setSrc] = useState<string | undefined>();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { isDark } = useContext(ThemeTogglerContext);
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setExpanded] = useState(expanded);
  const theme = isDark ? duotoneDark : duotoneLight;
  const language: Language = baseClassName.replace(/language-/, '') as Language;
  const shouldTranspile = transpile !== 'false' && transpile !== false;
  const editCodeLabel = isExpanded
    ? 'Hide the source code'
    : 'Show the source code';

  const [onDebouncedChange, cancelChange] = useDebouncedCallback(
    (newCode: string) => {
      iframeRef.current?.contentWindow?.postMessage(
        newCode,
        window.location.origin,
      );
    },
    500,
    [],
  );

  const onChange = useCallback(
    (newCode: string) => {
      setCode(newCode);

      onDebouncedChange(newCode);
    },
    [onDebouncedChange],
  );

  const onCopy = useCallback(() => {
    setIsCopied(true);

    window.setTimeout(() => setIsCopied(false), 500);
  }, []);

  useEffect(() => {
    return () => {
      cancelChange();
    };
  }, [cancelChange]);

  useEffect(() => {
    // load iframe on mount
    setSrc(`/live-preview/${encodeURIComponent(children.trim())}`);
  }, []);

  return (
    <Box styles={{ my: 4 }}>
      <Box
        styles={{
          borderColor:
            'color(shades if(isDark color(shades tint(10%)) color(shades shade(10%))))',
          borderRadius: 'controlBorderRadius',
          borderStyle: 'solid',
          borderWidth: 1,
          mb: 1,
          p: shouldTranspile ? 1 : 0,
          width: '100%',
        }}
      >
        {shouldTranspile ? (
          <iframe
            data-noinline={noInline}
            key={isDark ? 'dark' : 'light'}
            data-theme={isDark ? 'dark' : 'light'}
            ref={iframeRef}
            src={src}
            frameBorder="0"
            sandbox="allow-same-origin allow-scripts"
            style={{
              height: '100%',
              width: '100%',
            }}
            title="Live preview"
          />
        ) : (
          <Editor
            code={code}
            disabled={!live}
            language={language}
            theme={theme}
          />
        )}
      </Box>
      <Flex
        styles={{
          fontSize: 1,
          lineHeight: 1,
          justifyContent: 'flex-end',
          mb: 1,
        }}
      >
        {codesandbox ? (
          <Tooltip content="Edit on Codesandbox">
            <IconButton
              as="a"
              icon={Codesandbox}
              label="Edit on Codesandbox"
              href={`https://codesandbox.io/s/${codesandbox}`}
              styles={{ mr: 1 }}
              stroked
              target="_blank"
              rel="noopener noreferrer"
            />
          </Tooltip>
        ) : null}
        {shouldTranspile ? (
          <Tooltip content={editCodeLabel}>
            <IconButton
              icon={Code}
              label={editCodeLabel}
              onClick={() => setExpanded(!isExpanded)}
              stroked
              styles={{ mr: 1 }}
              type="button"
            />
          </Tooltip>
        ) : null}
        <CopyToClipboard onCopy={onCopy} text={children.trim()}>
          <Tooltip content="Copy the source code">
            <IconButton
              icon={isCopied ? CheckCircle : Copy}
              label="Copy the source code"
              monochromatic
              styles={{ color: isCopied ? 'success' : 'inherit' }}
              stroked
              type="button"
            />
          </Tooltip>
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
            maxHeight: 400,
            overflow: 'auto',
            width: '100%',
          }}
        >
          <Editor
            code={code}
            disabled={!live}
            language={language}
            onChange={onChange}
            theme={theme}
          />
        </Box>
      ) : null}
    </Box>
  );
}
