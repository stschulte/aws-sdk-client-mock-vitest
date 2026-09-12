/* eslint-disable @typescript-eslint/no-empty-object-type */
import 'vitest';

import { CustomMatcher } from '../src/matcher.ts';

declare module 'vitest' {
  interface Matchers<R, T> extends CustomMatcher<R, T> {}
}
