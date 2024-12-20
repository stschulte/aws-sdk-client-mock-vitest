import { describe, expect, it } from 'vitest';

import {
  toHaveReceivedAnyCommand,
  toHaveReceivedCommand,
  toHaveReceivedCommandOnce,
  toHaveReceivedCommandTimes,
  toHaveReceivedCommandWith,
  toHaveReceivedLastCommandWith,
  toHaveReceivedNthCommandWith,
  toReceiveAnyCommand,
  toReceiveCommand,
  toReceiveCommandOnce,
  toReceiveCommandTimes,
  toReceiveCommandWith,
  toReceiveLastCommandWith,
  toReceiveNthCommandWith,
} from '../src/index.js';

expect.extend({
  toHaveReceivedAnyCommand,
  toHaveReceivedCommand,
  toHaveReceivedCommandOnce,
  toHaveReceivedCommandTimes,
  toHaveReceivedCommandWith,
  toHaveReceivedLastCommandWith,
  toHaveReceivedNthCommandWith,
  toReceiveAnyCommand,
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
    'toHaveReceivedAnyCommand',
    'toReceiveCommand',
    'toReceiveCommandOnce',
    'toReceiveCommandTimes',
    'toReceiveCommandWith',
    'toReceiveLastCommandWith',
    'toReceiveNthCommandWith',
    'toReceiveAnyCommand',
  ])('should be able to extend with %s', (matcher) => {
    expect(expect('something')).toHaveProperty(matcher);
  });
});
