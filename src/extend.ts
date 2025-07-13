/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'vitest';

import { allCustomMatcher, type CustomMatcher } from './matcher.js';

expect.extend(allCustomMatcher);

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatcher<T> {}
  interface AsymmetricMatchersContaining extends CustomMatcher {}
}
