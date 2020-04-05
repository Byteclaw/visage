import * as babel from '@babel/core';
import plugin from '..';

const options: babel.TransformOptions = {
  parserOpts: {
    plugins: ['jsx'],
  },
  generatorOpts: {},
  babelrc: false,
  configFile: false,
  plugins: [plugin],
};

const transform = (code: string) => babel.transform(code, options).code;

it('hoists static styles prop', () => {
  const code = transform(`
import React from 'react';

export function Test() {
  return (
    <>
      <Component styles={{ test: true }} />
      <Component styles={{ test: true }} />
      <Component styles={{ test: true }} />
    </>
  );
}
  `);

  expect(code).toMatchInlineSnapshot(`
    "import React from 'react';

    var _ref = Object.freeze({
      test: true
    });

    var _ref2 = Object.freeze({
      test: true
    });

    var _ref3 = Object.freeze({
      test: true
    });

    export function Test() {
      return <>
          <Component styles={_ref} />
          <Component styles={_ref2} />
          <Component styles={_ref3} />
        </>;
    }"
  `);
});

it('hoists styles with deep static style sheet', () => {
  const code = transform(`
import React from 'react';

export function Test() {
  return <Component styles={{ test: true, responsive: [1, 2, 3], '&:test': { arr: [true, false, \`test\`]} }} />;
}
  `);

  expect(code).toMatchInlineSnapshot(`
    "import React from 'react';

    var _ref = Object.freeze({
      test: true,
      responsive: [1, 2, 3],
      '&:test': {
        arr: [true, false, \`test\`]
      }
    });

    export function Test() {
      return <Component styles={_ref} />;
    }"
  `);
});

it('hoists styles with an interpolation', () => {
  const code = transform(`
import React from 'react';

const str = 'abwab';

export function Test() {
  return <Component styles={{ test: true, color: \`\${str}\` }} />;
}
  `);

  expect(code).toMatchInlineSnapshot(`
    "import React from 'react';
    const str = 'abwab';

    var _ref = Object.freeze({
      test: true,
      color: \`\${str}\`
    });

    export function Test() {
      return <Component styles={_ref} />;
    }"
  `);
});

it('hoists static styles from object spread', () => {
  const code = transform(`
import React from 'react';

export function Test() {
  return (
    <>
      <Component {...{}} {...{ styles: { test: true } }} />
      <Component {...{ styles: { test: true } }} />
      <Component {...{ styles: { test: true } }} />
    </>
  );
}
  `);

  expect(code).toMatchInlineSnapshot(`
    "import React from 'react';

    var _ref = Object.freeze({
      test: true
    });

    var _ref2 = Object.freeze({
      test: true
    });

    var _ref3 = Object.freeze({
      test: true
    });

    export function Test() {
      return <>
          <Component {...{}} {...{
          styles: _ref
        }} />
          <Component {...{
          styles: _ref2
        }} />
          <Component {...{
          styles: _ref3
        }} />
        </>;
    }"
  `);
});

it('hoists static styles from object spread with computed key', () => {
  const code = transform(`
import React from 'react';

export function Test() {
  return (
    <>
      <Component {...{}} {...{ [\`styles\`]: { test: true } }} />
      <Component {...{ styles: { test: true } }} />
      <Component {...{ styles: { test: true } }} />
    </>
  );
}
  `);

  expect(code).toMatchInlineSnapshot(`
    "import React from 'react';

    var _ref = Object.freeze({
      test: true
    });

    var _ref2 = Object.freeze({
      test: true
    });

    var _ref3 = Object.freeze({
      test: true
    });

    export function Test() {
      return <>
          <Component {...{}} {...{
          [\`styles\`]: _ref
        }} />
          <Component {...{
          styles: _ref2
        }} />
          <Component {...{
          styles: _ref3
        }} />
        </>;
    }"
  `);
});

it('does not hoist styles with a spread', () => {
  const code = transform(`
import React from 'react';

const defaultStyles = {
  test: true,
};

export function Test() {
  return <Component styles={{ test: true, ...defaultStyles }} />;
}
  `);

  expect(code).toMatchInlineSnapshot(`
    "import React from 'react';
    const defaultStyles = {
      test: true
    };
    export function Test() {
      return <Component styles={{
        test: true,
        ...defaultStyles
      }} />;
    }"
  `);
});
