import { expect } from 'vitest';

import { allCustomMatcher, type CustomMatcher } from './matcher.js';

expect.extend(allCustomMatcher);

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends CustomMatcher<T> { }
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends CustomMatcher { }
}
