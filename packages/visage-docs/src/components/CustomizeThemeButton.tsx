import { IconButton } from '@byteclaw/visage';
import React, { useState } from 'react';
import { Sliders } from 'react-feather';
import { ThemeEditor } from './ThemeEditor';

export function CustomizeThemeButton() {
  const [isEditorOpen, setEditorOpen] = useState(false);

  return (
    <>
      <IconButton
        icon={Sliders}
        label="Customize theme"
        onClick={() => setEditorOpen(true)}
        type="button"
        title="Customize theme"
      />
      <ThemeEditor onClose={() => setEditorOpen(false)} open={isEditorOpen} />
    </>
  );
}
