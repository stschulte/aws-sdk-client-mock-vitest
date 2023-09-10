import { CustomMatcher } from "../src";
import "vitest";

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatcher<T> {}
  interface AsymmetricMatchersContaining extends CustomMatcher {}
}
