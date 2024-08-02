/* eslint-disable @typescript-eslint/no-empty-object-type */
import "vitest";

import { CustomMatcher } from "../src/matcher.ts";

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatcher<T> {}
  interface AsymmetricMatchersContaining extends CustomMatcher {}
}
