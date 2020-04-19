import { Button } from '@byteclaw/visage';
import React, { useState } from 'react';
import { ThemeEditor } from './ThemeEditor';

export function CustomizeThemeButton() {
  const [isEditorOpen, setEditorOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setEditorOpen(true)} type="button">
        Customize theme
      </Button>
      <ThemeEditor onClose={() => setEditorOpen(false)} open={isEditorOpen} />
    </>
  );
}
