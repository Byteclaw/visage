/* eslint-disable react/no-array-index-key */
import {
  Box,
  CloseButton,
  createComponent,
  Flex,
  IconButton,
  Popover,
  Tooltip,
  useDebouncedCallback,
  booleanVariant,
  booleanVariantStyles,
  useLayerManager,
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
  memo,
  RefObject,
} from 'react';
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  CheckCircle,
  Code,
  Codesandbox,
  Copy,
  Layout,
  Maximize,
} from 'react-feather';
import { Editor } from 'react-live';
import { LivePreview } from './LivePreview';
import { ThemeTogglerContext } from '../theme';

function CopySourceCodeButton({ code }: { code: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const onCopy = useCallback(() => {
    setIsCopied(true);

    window.setTimeout(() => setIsCopied(false), 500);
  }, []);

  const CopyButton = ({ onClick }: { onClick?: () => void }) => (
    <Tooltip content="Copy the source code">
      <IconButton
        icon={isCopied ? CheckCircle : Copy}
        label="Copy the source code"
        onClick={onClick}
        styles={{ color: isCopied ? 'success' : 'inherit' }}
        stroked
        type="button"
      />
    </Tooltip>
  );

  return (
    <CopyToClipboard onCopy={onCopy} text={code}>
      <CopyButton />
    </CopyToClipboard>
  );
}

const IFrame = createComponent('iframe', {
  displayName: 'IFrame',
  styles: booleanVariantStyles('fullscreen', {
    on: {
      height: '100%',
      width: '100%',
    },
  }),
  variants: [booleanVariant('fullscreen', true)],
});

const CodeBlockEditor = createComponent(Box, {
  displayName: 'CodeBlockEditor',
  styles: {
    borderColor:
      'color(shades if(isDark color(shades tint(10%)) color(shades shade(10%))))',
    borderRadius: 'controlBorderRadius',
    borderStyle: 'solid',
    borderWidth: 1,
    maxHeight: 400,
    overflow: 'auto',
    width: '100%',
  },
});

const CodeBlockPreview = createComponent(Box, {
  displayName: 'CodeBlockPreview',
  styles: {
    borderColor:
      'color(shades if(isDark color(shades tint(10%)) color(shades shade(10%))))',
    borderRadius: 'controlBorderRadius',
    borderStyle: 'solid',
    borderWidth: 1,
    mb: 1,
    width: '100%',
    ...booleanVariantStyles('padded', {
      on: {
        p: 1,
      },
    }),
  },
  variants: [booleanVariant('padded', true)],
});

const CodeBlockButtons = createComponent(Flex, {
  displayName: 'CodeBlockButtons',
  styles: {
    fontSize: 1,
    lineHeight: 1,
    justifyContent: 'flex-end',
    mb: 1,
    '& > button, & > a': {
      mr: [2, 1],
    },
    '& > button:last-of-type': {
      mr: 0,
    },
  },
});

interface PreviewIFrameProps {
  codeRef: RefObject<string>;
  iframeRef: RefObject<HTMLIFrameElement>;
  fullscreen?: boolean;
  noInline?: boolean;
  isDark: boolean;
}

const PreviewIFrame = memo(
  ({
    codeRef,
    isDark,
    fullscreen,
    iframeRef,
    noInline,
  }: PreviewIFrameProps) => {
    return (
      <IFrame
        fullscreen={fullscreen}
        data-noinline={noInline}
        key={isDark ? 'dark' : 'light'}
        data-theme={isDark ? 'dark' : 'light'}
        ref={iframeRef}
        src={`/live-preview/?code=${encodeURIComponent(codeRef.current || '')}`}
        frameBorder="0"
        sandbox="allow-same-origin allow-scripts"
        style={{
          height: '100%',
          width: '100%',
        }}
        title="Live preview"
      />
    );
  },
);

interface ExamplePreviewProps {
  code: string;
  isDark: boolean;
  /**
   * Should the frame be fullscreen?
   */
  isFullscreen: boolean;
  iframeRef: RefObject<HTMLIFrameElement>;
  onClose?: () => void;
  mode: 'scope' | 'frame';
  noInline?: boolean;
}

function ExamplePreview({
  code,
  isDark,
  iframeRef,
  isFullscreen,
  onClose,
  mode,
  noInline,
}: ExamplePreviewProps) {
  const { zIndex } = useLayerManager();
  const codeRef = useRef(code);

  if (mode === 'scope') {
    return <LivePreview code={code} noInline={noInline} />;
  }

  const frame = (
    <PreviewIFrame
      fullscreen={isFullscreen}
      codeRef={codeRef}
      noInline={noInline}
      isDark={isDark}
      iframeRef={iframeRef}
    />
  );

  if (isFullscreen) {
    return (
      <Popover
        fullscreen={isFullscreen}
        open
        styles={{
          backgroundColor: 'shades',
          display: 'flex',
          flexDirection: 'column',
          zIndex: zIndex + 10,
        }}
      >
        <CloseButton onClick={onClose} styles={{ mx: 2, my: 2, ml: 'auto' }} />
        {frame}
      </Popover>
    );
  }

  return frame;
}

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
  const codeRef = useRef(code);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { isDark } = useContext(ThemeTogglerContext);
  const [isExpanded, setExpanded] = useState(expanded);
  const [isFullscreen, setFullscreen] = useState(false);
  const [inDocsScope, setInDocsScope] = useState(
    process.env.NODE_ENV !== 'production',
  );
  const theme = isDark ? duotoneDark : duotoneLight;
  const language: Language = baseClassName.replace(/language-/, '') as Language;
  const shouldTranspile = transpile !== 'false' && transpile !== false;
  const editCodeLabel = isExpanded
    ? 'Hide the source code'
    : 'Show the source code';
  const runInDocumentationLabel = inDocsScope
    ? 'Run in frame scope'
    : 'Run in documentation scope';

  const [onDebouncedChange, cancelChange] = useDebouncedCallback(
    (newCode: string) => {
      iframeRef.current?.contentWindow?.postMessage(
        newCode,
        window.location.origin,
      );
      // this one ensures that if you change the theme mode
      // iframe will use the new code in URL
      codeRef.current = newCode;
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

  useEffect(() => {
    return () => {
      cancelChange();
    };
  }, [cancelChange]);

  return (
    <Box styles={{ my: 4 }}>
      <CodeBlockPreview padded={shouldTranspile}>
        {shouldTranspile ? (
          <ExamplePreview
            code={code}
            iframeRef={iframeRef}
            isDark={isDark}
            isFullscreen={isFullscreen}
            noInline={noInline}
            onClose={() => setFullscreen(false)}
            mode={inDocsScope ? 'scope' : 'frame'}
          />
        ) : (
          <Editor
            code={code}
            disabled={!live}
            language={language}
            theme={theme}
          />
        )}
      </CodeBlockPreview>
      <CodeBlockButtons>
        {codesandbox ? (
          <Tooltip content="Edit on Codesandbox">
            <IconButton
              as="a"
              icon={Codesandbox}
              label="Edit on Codesandbox"
              href={`https://codesandbox.io/s/${codesandbox}`}
              stroked
              target="_blank"
              rel="noopener noreferrer"
            />
          </Tooltip>
        ) : null}
        {shouldTranspile ? (
          <>
            <Tooltip content={editCodeLabel}>
              <IconButton
                icon={Code}
                label={editCodeLabel}
                onClick={() => setExpanded(!isExpanded)}
                stroked
                type="button"
              />
            </Tooltip>
            <Tooltip content="Open in fullscreen">
              <IconButton
                icon={Maximize}
                label="Open in fullscreen"
                onClick={() => {
                  setInDocsScope(false);
                  setFullscreen(true);
                }}
                stroked
                type="button"
              />
            </Tooltip>
            <Tooltip content={runInDocumentationLabel}>
              <IconButton
                icon={Layout}
                label={runInDocumentationLabel}
                onClick={() => setInDocsScope(!inDocsScope)}
                stroked
                type="button"
              />
            </Tooltip>
          </>
        ) : null}
        <CopySourceCodeButton code={code} />
      </CodeBlockButtons>
      {shouldTranspile && isExpanded ? (
        <CodeBlockEditor>
          <Editor
            code={code}
            disabled={!live}
            language={language}
            onChange={onChange}
            theme={theme}
          />
        </CodeBlockEditor>
      ) : null}
    </Box>
  );
}
