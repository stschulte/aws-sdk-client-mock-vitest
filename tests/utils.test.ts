import { describe, expect, it } from 'vitest';

import { notNull, notUndefined, objectToRecord, ordinalOf } from '../src/utils.js';

describe('notNull', () => {
  it('returns true when not null', () => {
    expect(notNull('Hi')).toBeTruthy();
  });

  it('returns false when null', () => {
    expect(notNull(null)).toBeFalsy();
  });

  it('returns true when undefined', () => {
    expect(notNull(undefined)).toBeTruthy();
  });
});

describe('notUndefined', () => {
  it('returns true when not undefined', () => {
    expect(notUndefined('Hi')).toBeTruthy();
  });

  it('returns false when undefined', () => {
    expect(notUndefined(undefined)).toBeFalsy();
  });

  it('returns true when null', () => {
    expect(notUndefined(null)).toBeTruthy();
  });
});

describe('ordinalOf', () => {
  const cases: [number, string][] = [
    [1, '1st'],
    [2, '2nd'],
    [3, '3rd'],
    [4, '4th'],
    [9, '9th'],
    [10, '10th'],
    [11, '11th'],
    [12, '12th'],
    [13, '13th'],
    [21, '21st'],
    [32, '32nd'],
    [93, '93rd'],
    [94, '94th'],
    [1001, '1001st'],
    [1011, '1011th'],
    [1012, '1012th'],
    [1013, '1013th'],
    [1021, '1021st'],
    [1022, '1022nd'],
    [1023, '1023rd'],
  ];
  it.each(cases)('translates %d to %s', (a, b) => {
    expect(ordinalOf(a)).toStrictEqual(b);
  });
});

describe('objectToRecord', () => {
  it('returns an empty object', () => {
    expect(objectToRecord({})).toStrictEqual({});
  });

  it('returns commands as is', () => {
    const command = {
      Bucket: 'foo',
      Key: 'bar',
    };
    expect(objectToRecord(command)).toStrictEqual({
      Bucket: 'foo',
      Key: 'bar',
    });
  });

  it('converts number to strings and removes symbols', () => {
    const sym = Symbol('foo');
    const command = {
      10: 'z',
      bar: 'y',
      [sym]: 'x',
    };

    expect(objectToRecord(command)).toStrictEqual({
      10: 'z',
      bar: 'y',
    });
  });
});
