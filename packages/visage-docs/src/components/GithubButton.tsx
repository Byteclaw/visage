import { IconButton, Tooltip } from '@byteclaw/visage';
import React from 'react';
import { GitHub } from 'react-feather';

export function GithubButton() {
  return (
    <Tooltip content="GitHub">
      <IconButton
        as="a"
        icon={GitHub}
        href="https://github.com/Byteclaw/visage"
        label="GitHub"
        stroked
        styles={{ mr: 1 }}
      />
    </Tooltip>
  );
}
