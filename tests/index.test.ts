import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { mockClient } from 'aws-sdk-client-mock';
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

  // https://github.com/stschulte/aws-sdk-client-mock-vitest/issues/5
  it('mocks aws secret manager', async () => {
    const secretMock = mockClient(SecretsManagerClient);
    secretMock.on(GetSecretValueCommand).resolves({ SecretString: 'secr3t' });

    const sm = new SecretsManagerClient();
    const command = new GetSecretValueCommand({ SecretId: 'foo' });
    const response = await sm.send(command);
    expect(response.SecretString).toBe('secr3t');

    expect(secretMock).toHaveReceivedCommandWith(GetSecretValueCommand, { SecretId: 'foo' });
  });
});
