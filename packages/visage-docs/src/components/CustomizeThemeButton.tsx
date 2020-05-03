import { IconButton, Tooltip } from '@byteclaw/visage';
import React, { useState } from 'react';
import { Sliders } from 'react-feather';
import { ThemeEditor } from './ThemeEditor';

const label = 'Customize theme';

export function CustomizeThemeButton() {
  const [isEditorOpen, setEditorOpen] = useState(false);

  return (
    <>
      <Tooltip content={label}>
        <IconButton
          icon={Sliders}
          label={label}
          onClick={() => setEditorOpen(true)}
          type="button"
        />
      </Tooltip>
      <ThemeEditor onClose={() => setEditorOpen(false)} open={isEditorOpen} />
    </>
  );
}
