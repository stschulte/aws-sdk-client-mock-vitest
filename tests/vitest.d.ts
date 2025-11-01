/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'vitest';

import { CustomMatcher } from '../src/matcher.ts';

declare module 'vitest' {
  interface Matchers<T = any> extends CustomMatcher<T> {}
}
