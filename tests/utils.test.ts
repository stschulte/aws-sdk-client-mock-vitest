import { describe, expect, it } from "vitest";

import { notNull, ordinalOf } from "../src/utils.js";

describe("notNull", () => {
  it("should return true when not null", () => {
    expect(notNull("Hi")).toBe(true);
  });

  it("should return false when null", () => {
    expect(notNull(null)).toBe(false);
  });

  it("should return true when undefined", () => {
    expect(notNull(undefined)).toBe(true);
  });
});

describe("ordinalOf", () => {
  const cases: Array<[number, string]> = [
    [1, "1st"],
    [2, "2nd"],
    [3, "3rd"],
    [4, "4th"],
    [9, "9th"],
    [10, "10th"],
    [11, "11th"],
    [12, "12th"],
    [13, "13th"],
    [21, "21st"],
    [32, "32nd"],
    [93, "93rd"],
    [94, "94th"],
    [1001, "1001st"],
    [1011, "1011th"],
    [1012, "1012th"],
    [1013, "1013th"],
    [1021, "1021st"],
    [1022, "1022nd"],
    [1023, "1023rd"]
  ];
  it.each(cases)("should translate %d to %s", (a, b) => {
    expect(ordinalOf(a)).toStrictEqual(b);
  });
});
