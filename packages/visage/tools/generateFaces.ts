import { lstatSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const files = readdirSync(resolve(__dirname, '../src/components'));
const components: { [key: string]: string } = {};

files.forEach(file => {
  const path = resolve(__dirname, '../src/components', file);

  if (lstatSync(path).isFile()) {
    const content = readFileSync(path, { encoding: 'utf8' });

    content.replace(
      /displayName:\s*'([^']+)',/g,
      (substring: string, displayName: string) => {
        // if there already is this component, throw an error
        if (components[displayName]) {
          throw new Error(
            `There is already a component named ${displayName} in ${components[displayName]}.\nCheck the ${file} and change the name.`,
          );
        }

        components[displayName] = file;
        return '';
      },
    );
  }
});

const componentNames = Object.keys(components).sort();

const typeFile: string[] = [
  `import { EmotionStyleSheet } from './types';`,
  '',
  'export interface VisageFaces {',
];

componentNames.forEach(c => {
  typeFile.push(`  // ${components[c]}`, `  ${c}?: EmotionStyleSheet;`);
});

typeFile.push(
  '  [componentName: string]: EmotionStyleSheet | undefined;',
  '}\n',
);

writeFileSync(resolve(__dirname, '../src/faces.ts'), typeFile.join('\n'));
