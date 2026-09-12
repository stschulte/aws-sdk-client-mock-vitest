/* eslint-disable @typescript-eslint/no-empty-object-type */

import 'vitest';
import { expect } from 'vitest';

import type { CustomMatcher } from './matcher.js';

import { allCustomMatcherWithAliases } from './matcher.js';

expect.extend(allCustomMatcherWithAliases);

/*
 * see https://vitest.dev/guide/extending-matchers.html
 */
declare module 'vitest' {
  interface Matchers<R, T> extends CustomMatcher<R, T> {}
}
