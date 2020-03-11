import * as benny from 'benny';
import globby from 'globby';
import { resolve } from 'path';
import { Options } from 'benny/lib/internal/common-types';

const defaultOptions: Options = {
  // warm up the code
  initCount: 10,
};

const originalAdd = benny.add;

function customAdd(
  caseName: string,
  test: () => Promise<any> | any,
  options: Options = {},
) {
  return originalAdd(caseName, test, { ...defaultOptions, ...options });
}

// @ts-ignore
benny.add = customAdd;

const cwd = process.cwd();

async function run() {
  const files = await globby(
    ['**/*.benchmark.{ts,tsx}', '!node_modules', '!dist'],
    {
      cwd,
    },
  );

  for (const file of files) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    await require(resolve(cwd, file)).bench;
  }
}

run();
