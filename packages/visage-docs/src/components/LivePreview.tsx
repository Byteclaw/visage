import * as DSScope from '@byteclaw/visage';
import * as Core from '@byteclaw/visage-core';
import * as Themes from '@byteclaw/visage-themes';
import * as Utilities from '@byteclaw/visage-utils';
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
import { LiveError, LiveProvider, LivePreview as Preview } from 'react-live';

const { createComponent } = DSScope;

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

interface LivePreviewProps {
  code: string;
  noInline?: boolean;
}

export function LivePreview(props: LivePreviewProps) {
  return (
    <LiveProvider scope={Scope} {...props}>
      <EditorError />
      <Preview />
    </LiveProvider>
  );
}
