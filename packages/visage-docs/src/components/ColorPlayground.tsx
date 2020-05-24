import { createComponent, Box, Flex, TextInput } from '@byteclaw/visage';
import React, { useState } from 'react';

const ColorPlaygroundPreview = createComponent(Box, {
  styles: {
    borderColor:
      'color(shades if(isDark color(shades tint(10%)) color(shades shade(10%))))',
    borderStyle: 'solid',
    borderWidth: 1,
    height: 100,
    mb: 2,
    width: '100%',
    willChange: 'background-color',
    transition: 'background-color 250ms ease-out',
  },
});

const ColorPlaygroundWrapper = createComponent(Flex, {
  styles: {
    flexWrap: 'wrap',
    my: 2,
  },
});

interface ColorPlaygroundProps {
  color?: string;
}

export function ColorPlayground({ color: defaultColor }: ColorPlaygroundProps) {
  const [color, setColor] = useState(defaultColor || '');

  return (
    <ColorPlaygroundWrapper>
      <ColorPlaygroundPreview
        styles={{
          backgroundColor: color,
        }}
      />
      <TextInput
        baseProps={{ styles: { width: '100%' } }}
        onChange={e => setColor(e.currentTarget.value)}
        value={color}
      />
    </ColorPlaygroundWrapper>
  );
}
