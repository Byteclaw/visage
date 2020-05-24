import * as DSScope from '@byteclaw/visage';
import * as Core from '@byteclaw/visage-core';
import * as Themes from '@byteclaw/visage-themes';
import * as Utilities from '@byteclaw/visage-utils';
import { PageProps } from 'gatsby';
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
import { Moon, Sun, Volume, Volume1, Volume2, VolumeX } from 'react-feather';
import { LivePreview as Preview, LiveError, LiveProvider } from 'react-live';
import { ThemeTogglerContext } from '../theme';

const { Box, createComponent } = DSScope;

const EditorError = createComponent(LiveError, {
  styles: {
    backgroundColor: 'red',
    color: 'white',
    m: 0,
    p: 1,
  },
});

const Scope = {
  MoonIcon: Moon,
  SunIcon: Sun,
  VolumeIcon: Volume,
  Volume1Icon: Volume1,
  Volume2Icon: Volume2,
  VolumeXIcon: VolumeX,
  Fragment,
  ...Core,
  ...DSScope,
  ...Themes,
  ...Utilities,
  useState,
  useContext,
  useReducer,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  theme: Themes.createDocsTheme(),
};

export default function LivePreview(props: PageProps & { '*': string }) {
  const { isDark, useDark } = useContext(ThemeTogglerContext);
  // eslint-disable-next-line react/destructuring-assignment
  const [code, setCode] = useState(decodeURIComponent(props['*']));
  const themeModeRef = useRef(
    (typeof window !== 'undefined'
      ? window.frameElement.getAttribute('data-theme')
      : null) || 'light',
  );
  const noInline =
    typeof window !== 'undefined'
      ? window.frameElement.getAttribute('data-noinline') === 'true'
      : false;

  if (!isDark && themeModeRef.current === 'dark') {
    useDark(false);
  }

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      setCode(e.data);
    };

    window.addEventListener('message', onMessage, false);

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  return (
    <Box styles={{ p: 1 }}>
      <LiveProvider code={code} noInline={noInline} scope={Scope}>
        <EditorError />
        <Preview />
      </LiveProvider>
    </Box>
  );
}
