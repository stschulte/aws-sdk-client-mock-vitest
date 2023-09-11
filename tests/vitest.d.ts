/* eslint-disable @typescript-eslint/no-empty-interface */
import "vitest";
import { CustomMatcher } from "../src";

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatcher<T> {}
  interface AsymmetricMatchersContaining extends CustomMatcher {}
}
