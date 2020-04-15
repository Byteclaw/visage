/* eslint-disable react/no-array-index-key */
import {
  ColorPalette,
  createComponent,
  Box,
  CloseButton,
  Drawer,
  DrawerPosition,
  Flex,
  Heading,
  Label,
  Popover,
} from '@byteclaw/visage';
import { isScaleValue, ScaleValue } from '@byteclaw/visage-utils';
import React, {
  useContext,
  useRef,
  useReducer,
  useState,
  Reducer,
  Dispatch,
} from 'react';
import { SketchPicker } from 'react-color';
import { ThemeTogglerContext } from '../theme';

interface NamedColor {
  color: string;
  title: string;
}

interface ColorPaletteState {
  allColors: NamedColor[];
  colors: ColorPalette;
}

type ColorPaletteAction =
  | {
      type: 'SET_COLOR';
      color: keyof ColorPalette;
      value: string;
    }
  | { type: 'SET'; palette: ColorPalette };

function extractAllColorsFromPalette(palette: ColorPalette): NamedColor[] {
  return ([] as NamedColor[]).concat(
    ...Object.keys(palette).map(colorName => {
      const color = palette[colorName];

      if (isScaleValue(color)) {
        return color.values.map((shade, i) => ({
          color: shade,
          title: `${colorName}.${i - color.offset}`,
        })) as NamedColor[];
      }

      return [{ title: colorName, color }] as NamedColor[];
    }),
  );
}

function colorPaletteReducer(
  state: ColorPaletteState,
  action: ColorPaletteAction,
): ColorPaletteState {
  switch (action.type) {
    case 'SET_COLOR': {
      const colors = { ...state.colors };

      colors[action.color] = action.value;

      return {
        colors,
        allColors: extractAllColorsFromPalette(colors),
      };
    }
    case 'SET': {
      return {
        colors: action.palette,
        allColors: extractAllColorsFromPalette(action.palette),
      };
    }
    default: {
      return state;
    }
  }
}

function initColorPaletteReducer(colors: ColorPalette): ColorPaletteState {
  return {
    colors,
    allColors: extractAllColorsFromPalette(colors),
  };
}

const ColorBoxButton = createComponent(Box, {
  displayName: 'ColorBoxButton',
  defaultProps: {
    role: 'button',
  },
  styles: {
    borderRadius: 4,
    borderColor: 'rgba(0,0,0,0.5)',
    borderStyle: 'solid',
    borderWidth: 1,
    cursor: 'pointer',
    height: 40,
    mr: 1,
    my: 1,
    width: 40,
  },
});

interface ColorSwatchProps {
  allColors: NamedColor[];
  color: undefined | string | ScaleValue<string>;
  onColorSet: (hex: string) => void;
  title: string;
}

const ColorSwatch = createComponent(
  ({ allColors, color, onColorSet, title }: ColorSwatchProps) => {
    const [open, setOpen] = useState(false);
    const togglerRef = useRef<HTMLDivElement | null>(null);
    const baseColor = isScaleValue(color) ? color.values[color.offset] : color;

    return (
      <Flex styles={{ flexWrap: 'wrap', width: '100%' }}>
        <Flex styles={{ alignItems: 'center', minWidth: 200, width: '100%' }}>
          <ColorBoxButton
            onClick={() => setOpen(!open)}
            ref={togglerRef}
            styles={{ backgroundColor: baseColor }}
            title={title}
          />
          <Label styles={{ mb: 0 }}>{title}</Label>
          <Popover
            anchor={togglerRef}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            backdrop={false}
            open={open}
            onClose={() => setOpen(false)}
          >
            <SketchPicker
              color={baseColor}
              onChangeComplete={e => onColorSet(e.hex)}
              presetColors={allColors}
            />
          </Popover>
        </Flex>
        {isScaleValue(color)
          ? color.values.map((shade, i) => (
              <Box
                key={`${shade}${i}`}
                styles={{
                  borderBottomWidth: 2,
                  borderBottomStyle: 'solid',
                  borderBottomColor:
                    i === color.offset ? 'salmon' : 'transparent',
                  backgroundColor: shade,
                  height: 20,
                  width: 20,
                }}
                title={`${title}.${i - color.offset}`}
              />
            ))
          : null}
      </Flex>
    );
  },
  {
    displayName: 'ColorSwatch',
  },
);

interface ColorWithTextProps {
  colorDispatch: Dispatch<ColorPaletteAction>;
  palette: ColorPaletteState;
  title: string;
}

function ColorWithText({ colorDispatch, palette, title }: ColorWithTextProps) {
  const textColorName = `${title}Text`;

  return (
    <Flex>
      <ColorSwatch
        allColors={palette.allColors}
        color={palette.colors[title]}
        onColorSet={value =>
          colorDispatch({ type: 'SET_COLOR', color: title, value })
        }
        title={title}
      />
      <ColorSwatch
        allColors={palette.allColors}
        color={palette.colors[textColorName]}
        onColorSet={value =>
          colorDispatch({ type: 'SET_COLOR', color: textColorName, value })
        }
        title={textColorName}
      />
    </Flex>
  );
}

const colorNamesWithText: (keyof ColorPalette)[] = [
  'primary',
  'accent',
  'shades',
  'darkAccent',
  'darkShades',
  'danger',
  'info',
  'neutral',
  'success',
  'warning',
];

const colorNamesWithoutText: (keyof ColorPalette)[] = [];

interface ThemeEditorProps {
  onClose: () => void;
  open: boolean;
}

export function ThemeEditor({ onClose, open }: ThemeEditorProps) {
  const { colorPalette, setColorPalette } = useContext(ThemeTogglerContext);
  const [palette, dispatch] = useReducer<
    Reducer<ColorPaletteState, ColorPaletteAction>,
    ColorPalette
  >(colorPaletteReducer, colorPalette, initColorPaletteReducer);
  const paletteRef = useRef(palette.colors);
  const outerPaletteRef = useRef(colorPalette);

  if (paletteRef.current !== palette.colors) {
    paletteRef.current = palette.colors;

    setColorPalette(palette.colors);
  }

  if (outerPaletteRef.current !== colorPalette) {
    outerPaletteRef.current = colorPalette;
    paletteRef.current = colorPalette;

    dispatch({ type: 'SET', palette: colorPalette });
  }

  return (
    <Drawer
      backdrop={false}
      inPortal
      open={open}
      onClose={onClose}
      side={DrawerPosition.right}
      styles={{ px: 2 }}
    >
      <Flex styles={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Heading>Theme editor</Heading>
        <CloseButton onClick={onClose} />
      </Flex>
      {colorNamesWithText.map(colorName => (
        <ColorWithText
          colorDispatch={dispatch}
          palette={palette}
          key={colorName}
          title={colorName.toString()}
        />
      ))}
      {colorNamesWithoutText.map(colorName => (
        <ColorSwatch
          allColors={palette.allColors}
          color={palette.colors[colorName]}
          key={colorName}
          onColorSet={value =>
            dispatch({ type: 'SET_COLOR', color: colorName, value })
          }
          title={colorName.toString()}
        />
      ))}
    </Drawer>
  );
}
