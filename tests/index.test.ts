import { describe, expect, it } from 'vitest';

import {
  toHaveReceivedCommand,
  toHaveReceivedCommandOnce,
  toHaveReceivedCommandTimes,
  toHaveReceivedCommandWith,
  toHaveReceivedLastCommandWith,
  toHaveReceivedNthCommandWith,
  toReceiveCommand,
  toReceiveCommandOnce,
  toReceiveCommandTimes,
  toReceiveCommandWith,
  toReceiveLastCommandWith,
  toReceiveNthCommandWith,
} from '../src/index.js';

expect.extend({
  toHaveReceivedCommand,
  toHaveReceivedCommandOnce,
  toHaveReceivedCommandTimes,
  toHaveReceivedCommandWith,
  toHaveReceivedLastCommandWith,
  toHaveReceivedNthCommandWith,
  toReceiveCommand,
  toReceiveCommandOnce,
  toReceiveCommandTimes,
  toReceiveCommandWith,
  toReceiveLastCommandWith,
  toReceiveNthCommandWith,
});

describe('aws-sdk-client-mock-vitest', () => {
  it.each([
    'toHaveReceivedCommand',
    'toHaveReceivedCommandOnce',
    'toHaveReceivedCommandTimes',
    'toHaveReceivedCommandWith',
    'toHaveReceivedLastCommandWith',
    'toHaveReceivedNthCommandWith',
    'toReceiveCommand',
    'toReceiveCommandOnce',
    'toReceiveCommandTimes',
    'toReceiveCommandWith',
    'toReceiveLastCommandWith',
    'toReceiveNthCommandWith',
  ])('should be able to extend with %s', (matcher) => {
    expect(expect('something')).toHaveProperty(matcher);
  });
});
