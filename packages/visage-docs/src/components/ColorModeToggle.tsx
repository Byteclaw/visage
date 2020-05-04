import { IconButton, Tooltip } from '@byteclaw/visage';
import React, { useContext } from 'react';
import { Moon, Sun } from 'react-feather';
import { ThemeTogglerContext } from '../theme';

export function ColorModeToggle() {
  const { isDark, useDark } = useContext(ThemeTogglerContext);
  const label = isDark ? 'Activate light mode' : 'Activate dark mode';

  return (
    <Tooltip content={label}>
      <IconButton
        icon={isDark ? Sun : Moon}
        label={label}
        onClick={() => useDark(!isDark)}
        styles={{ mr: 1 }}
      />
    </Tooltip>
  );
}
