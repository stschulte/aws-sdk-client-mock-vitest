import { expect, it } from 'vitest';

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

it('should be able to extend with matchers', () => {
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
});
