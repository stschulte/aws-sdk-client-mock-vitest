/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'vitest';
import { expect } from 'vitest';

import type { CustomMatcher } from './matcher.js';

import { allCustomMatcherWithAliases } from './matcher.js';

expect.extend(allCustomMatcherWithAliases);

/*
 * see https://vitest.dev/guide/extending-matchers.html
 */
declare module 'vitest' {
  interface Matchers<T = any> extends CustomMatcher<T> {}
}
