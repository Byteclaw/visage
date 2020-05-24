import {
  Box,
  Flex,
  Heading,
  Text,
  createComponent,
  useDesignSystem,
  Tooltip,
} from '@byteclaw/visage';
import { isScaleValue } from '@byteclaw/visage-utils';
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard';
import React from 'react';

const ColorWrapper = createComponent(Flex, {
  styles: {
    alignItems: 'center',
    my: 2,
    overflowX: 'auto',
  },
});

export function ColorBox({
  color,
  selected,
  offset,
}: {
  color: string;
  offset: number;
  selected?: boolean;
}) {
  const size = selected ? 80 : 60;
  const name = selected ? color : `${color}.${offset}`;

  return (
    <ColorWrapper>
      <Tooltip content={name}>
        <Box styles={{ textAlign: 'center' }}>
          <CopyToClipboard text={name}>
            <Box
              styles={{
                backgroundColor: `${color}.${offset}`,
                cursor: 'pointer',
                width: size,
                height: size,
              }}
            />
          </CopyToClipboard>
          <Text
            styles={{
              fontFamily: 'monospace',
              fontSize: -2,
              lineHeight: -2,
            }}
          >
            {offset === 0 ? color : offset}
          </Text>
        </Box>
      </Tooltip>
    </ColorWrapper>
  );
}

export function ColorScale({ color: name }: { color: string }) {
  const { theme } = useDesignSystem();
  const color = theme.colors[name];

  if (color == null) {
    throw new Error(`Invalid color ${name}`);
  }

  if (!isScaleValue(color)) {
    throw new Error(`Color ${name} is not a scale`);
  }

  return (
    <ColorWrapper>
      {color.values.map((_, i) => (
        <ColorBox
          color={name}
          // eslint-disable-next-line react/no-array-index-key
          key={`${name}${i}`}
          offset={i - color.offset}
          selected={i - color.offset === 0}
        />
      ))}
    </ColorWrapper>
  );
}

function ColorPaletteColor({ color: name }: { color: string }) {
  const { theme } = useDesignSystem();
  const color = theme.colors[name];

  return (
    <>
      <Heading level={2}>{name}</Heading>
      {isScaleValue(color) ? (
        <ColorScale color={name} />
      ) : (
        <ColorBox color={name} selected offset={0} />
      )}
    </>
  );
}

export function ColorPalette() {
  const { theme } = useDesignSystem();

  return (
    <>
      {Object.keys(theme.colors).map(color => {
        return <ColorPaletteColor key={color} color={color} />;
      })}
    </>
  );
}
