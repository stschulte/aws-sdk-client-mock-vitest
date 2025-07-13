/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'vitest';

import { allCustomMatcherWithAliases, type CustomMatcher } from './matcher.js';

expect.extend(allCustomMatcherWithAliases);

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatcher<T> {}
  interface AsymmetricMatchersContaining extends CustomMatcher {}
}
