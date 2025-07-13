import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

import '../src/extend.js';

import { mockClient } from 'aws-sdk-client-mock';
import { describe, expect, it } from 'vitest';

describe('extend', () => {
  const secretMock = mockClient(SecretsManagerClient);

  it('should make matchers available', () => {
    expect(secretMock).not.toHaveReceivedCommand(GetSecretValueCommand);
    expect(secretMock).toHaveReceivedCommandTimes(GetSecretValueCommand, 0);
    expect(secretMock).not.toHaveReceivedAnyCommand();
  });
});
