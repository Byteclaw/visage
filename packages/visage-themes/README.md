# `@byteclaw/visage-themes`

Collection of themes for [Visage Design System](https://visage.design) and utilities to create custom themes.

## Themes

- [`createDocsTheme`](#docs-theme) - creates a theme that is used in documentation
- [`createNPointFontScaleTheme`](#n-point-and-font-scale-theme) - create base N-point theme with font scale typography
- [`createNPointModularScaleTheme`](#n-point-and-modular-scale-theme) - create base N-point theme with modular scale typography

## Usage

First decide what theme you want to use and then import it.

### Docs theme

Default theme used in Visage docs

### N-point and modular scale theme

Base theme that uses [N-point grid](https://spec.fm/specifics/8-pt-grid) and [Modular scale](modularscale.com) for typography. This theme creator should be used to create completely custom theme.

```
import { createNPointModularScaleTheme, modularScaleFontRatios } from '@byteclaw/visage-themes';

const theme = createNPointModularScaleTheme({
  baseFontSize: 16,
  baseLineHeightRatio: 1.5,
  baseGridSize: 8,
  borderRadius: {
    // optional border radius for controls
    controlBorderRadius: 8,
    // any other name of border radius
  },
  fontScaleRatio: modularScaleFontRatios.perfectFourth,
  colors: {
    /** Accent color to bring attention to design elements */
    lightAccent: '#ccc';
    lightAccentText: 'black';
    /** Used as background color for dark on light design or text color of inverted design */
    lightShades: 'white';
    lightShadesText: 'black';
    primary: 'black';
    primaryText: 'white';
    /** Alternative accent color */
    darkAccent: 'orange';
    darkAccentText: 'white';
    /** Used as text color for dark on light design or background color of inverted design */
    darkShades: 'black';
    darkShadesText: 'white';
    /** Uses as background for danger elements or as invalid color */
    danger: 'red';
    dangerText: 'white';
    /** Uses as background for info elements or as info text color */
    info: 'blue';
    infoText: 'white';
    neutral: '#ccc';
    neutralText: 'black';
    /** Uses as background for success elements or as success text color */
    success: 'green';
    successText: 'white';
    /** Text input backgrounds */
    textInput: 'white';
    /** Text input border colors */
    textInputBorder: '#999';
    /** Uses as background for warning elements or as warning text color */
    warning: 'orange';
    warningText: 'white';
    // ... extra colors you want to use
  },
  fontFamily: {
    // you are responsible to actually include these fonts to your HTML
    body: 'Rubik',
    heading: 'Luna',
  },
});
```

#### Settings

- `baseFontSize`
  - `number` - e.g. `16`
  - `number[]` - e.g. `[14,15,16]` - this is suitable if you're using responsive design system and want to change base font size based on the device
- `baseLineHeightRatio`
  - `number` - e.g. 1.5
    - ratio used to calculate line height
    - ratio is calculated based on modular scale and grid size. The point is to align it with grid size so you always have a multiplies of grid size used as line height.
- `baseGridSize`
  - `number` - e.g. `8` - all spacings are caculated as multiplies of `baseGridSize` for example `m: 1` will result to `margin: 8`, `m: 0.5` is `margin: 4` and `m: -1` is `margin: -8`.
    - `borderRadius`
  - `number` - e.g. `8`
  - `string` - e.g. `8px`
  - `{ [name: string]: string | number }` - named border radiuses so you can address them e.g. `borderRadius: 'controlBorderRadius'`.
- `fontScaleRatio`
  - `number` - e.g. `1.4`. This property is used by modular scale to compute font size.
- `colors`
  - [`ColorPalette`](../visage/src/types.ts#L5) - each color can be a string or `ScaleValue`. Scale value supports dot (e.g. `primary.-1` or `primary.1`) notation so you can have more than one shade of the color in your palette.
    ``fontFamily`
  - [`FontPalette`](../visage/src/types.ts#L41)
    - fonts used by visage, `body` and `heading` are required.

### N-point and font scale theme

Base theme that uses [N-point grid](https://spec.fm/specifics/8-pt-grid) and font scale for typography. This theme creator should be used to create completely custom theme.

```
import { createNPointFontScaleTheme } from '@byteclaw/visage-themes';

const theme = createNPointFontScaleTheme({
  fontSize: { values: [10, 12, 16, 20, 28, 38], offset: 1 },
  lineHeights: { values: [14, 16, 20, 24, 32, 44], offset: 1 },
  baseGridSize: 8,
  borderRadius: {
    // optional border radius for controls
    controlBorderRadius: 8,
    // any other name of border radius
  },
  colors: {
    /** Accent color to bring attention to design elements */
    lightAccent: '#ccc';
    lightAccentText: 'black';
    /** Used as background color for dark on light design or text color of inverted design */
    lightShades: 'white';
    lightShadesText: 'black';
    primary: 'black';
    primaryText: 'white';
    /** Alternative accent color */
    darkAccent: 'orange';
    darkAccentText: 'white';
    /** Used as text color for dark on light design or background color of inverted design */
    darkShades: 'black';
    darkShadesText: 'white';
    /** Uses as background for danger elements or as invalid color */
    danger: 'red';
    dangerText: 'white';
    /** Uses as background for info elements or as info text color */
    info: 'blue';
    infoText: 'white';
    neutral: '#ccc';
    neutralText: 'black';
    /** Uses as background for success elements or as success text color */
    success: 'green';
    successText: 'white';
    /** Text input backgrounds */
    textInput: 'white';
    /** Text input border colors */
    textInputBorder: '#999';
    /** Uses as background for warning elements or as warning text color */
    warning: 'orange';
    warningText: 'white';
    // ... extra colors you want to use
  },
  fontFamily: {
    // you are responsible to actually include these fonts to your HTML
    body: 'Rubik',
    heading: 'Luna',
  },
});
```

#### Settings

- `fontSize`
  - `ScaleValue<number | number[]>` - scale value
- `lineHeights`
  - `ScaleValue<number | number[]>` - scale value
- `baseGridSize`
  - `number` - e.g. `8` - all spacings are caculated as multiplies of `baseGridSize` for example `m: 1` will result to `margin: 8`, `m: 0.5` is `margin: 4` and `m: -1` is `margin: -8`.
    - `borderRadius`
  - `number` - e.g. `8`
  - `string` - e.g. `8px`
  - `{ [name: string]: string | number }` - named border radiuses so you can address them e.g. `borderRadius: 'controlBorderRadius'`.
- `colors`
  - [`ColorPalette`](../visage/src/types.ts#L5) - each color can be a string or `ScaleValue`. Scale value supports dot (e.g. `primary.-1` or `primary.1`) notation so you can have more than one shade of the color in your palette.
    ``fontFamily`
  - [`FontPalette`](../visage/src/types.ts#L41)
    - fonts used by visage, `body` and `heading` are required.
