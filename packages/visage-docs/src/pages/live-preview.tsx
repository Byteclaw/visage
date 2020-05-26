import * as DSScope from '@byteclaw/visage';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { LivePreview as Preview } from '../components';
import { ThemeTogglerContext } from '../theme';

const { Box } = DSScope;

export default function LivePreview() {
  const { isDark, useDark } = useContext(ThemeTogglerContext);
  // eslint-disable-next-line react/destructuring-assignment
  const [code, setCode] = useState(
    decodeURIComponent(
      typeof window !== 'undefined'
        ? window.location.search.replace('?code=', '')
        : '',
    ),
  );
  const themeModeRef = useRef(
    (typeof window !== 'undefined' && window.frameElement != null
      ? window.frameElement.getAttribute('data-theme')
      : null) || 'light',
  );
  const noInline =
    typeof window !== 'undefined' && window.frameElement != null
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
      {!code ? null : <Preview code={code} noInline={noInline} />}
    </Box>
  );
}
