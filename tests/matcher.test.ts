import {
  GetBucketAclCommand,
  GetObjectAclCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
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
} from '../src/matcher.js';

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

describe('toReceiveCommandTimes', () => {
  it('passes with 0 received commands', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toReceiveCommandTimes(PutObjectCommand, 0);
  });

  it('ignores other commands', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'bar' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'baz' }));
    expect(s3Mock).toReceiveCommandTimes(PutObjectCommand, 0);
    expect(s3Mock).toReceiveCommandTimes(GetObjectCommand, 1);
    expect(s3Mock).toReceiveCommandTimes(GetBucketAclCommand, 3);
  });

  it.fails('fails when command is not called as specified', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'bar' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'baz' }));
    expect(s3Mock).toReceiveCommandTimes(GetBucketAclCommand, 1);
  });

  describe('not', () => {
    it('passes when not called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toReceiveCommandTimes(PutObjectCommand, 1);
    });

    it('passes when called different than specified', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandTimes(PutObjectCommand, 2);
    });

    it.fails('fails when command received as specified', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandTimes(GetObjectCommand, 1);
    });
  });
});

describe('toHaveReceivedCommandTimes', () => {
  it('passes with 0 received commands', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toHaveReceivedCommandTimes(PutObjectCommand, 0);
  });

  it('ignores other commands', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'bar' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'baz' }));
    expect(s3Mock).toHaveReceivedCommandTimes(PutObjectCommand, 0);
    expect(s3Mock).toHaveReceivedCommandTimes(GetObjectCommand, 1);
    expect(s3Mock).toHaveReceivedCommandTimes(GetBucketAclCommand, 3);
  });

  it.fails('fails when command is not called as specified', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'bar' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'baz' }));
    expect(s3Mock).toHaveReceivedCommandTimes(GetBucketAclCommand, 1);
  });

  describe('not', () => {
    it('passes when not called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toHaveReceivedCommandTimes(PutObjectCommand, 1);
    });

    it('passes when called different than specified', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommandTimes(PutObjectCommand, 2);
    });

    it.fails('fails when command received as specified', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandTimes(GetObjectCommand, 1);
    });
  });
});

describe('toReceiveCommandOnce', () => {
  it('passes when called exactly once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommandOnce(GetObjectCommand);
  });

  it.fails('fails when not called', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toReceiveCommandOnce(GetObjectCommand);
  });

  it.fails('fails when called more than once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommandOnce(GetObjectCommand);
  });

  it('ignores other commands', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'bar' }));
    expect(s3Mock).toReceiveCommandOnce(GetObjectCommand);
  });

  describe('not', () => {
    it('passes when not called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toReceiveCommandOnce(GetObjectCommand);
    });

    it.fails('fails when called exactly once', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandOnce(GetObjectCommand);
    });

    it('passes when called more than once', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandOnce(GetObjectCommand);
    });
    it('ignores other commands', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
      expect(s3Mock).not.toReceiveCommandOnce(GetObjectCommand);
    });
  });
});

describe('toHaveReceivedCommandOnce', () => {
  it('passes when called exactly once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommandOnce(GetObjectCommand);
  });

  it.fails('fails when not called', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toHaveReceivedCommandOnce(GetObjectCommand);
  });

  it.fails('fails when called more than once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommandOnce(GetObjectCommand);
  });

  it('ignores other commands', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'bar' }));
    expect(s3Mock).toHaveReceivedCommandOnce(GetObjectCommand);
  });

  describe('not', () => {
    it('passes when not called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toHaveReceivedCommandOnce(GetObjectCommand);
    });

    it.fails('fails when called exactly once', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommandOnce(GetObjectCommand);
    });

    it('passes when called more than once', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommandOnce(GetObjectCommand);
    });

    it('ignores other commands', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
      expect(s3Mock).not.toHaveReceivedCommandOnce(GetObjectCommand);
    });
  });
});

describe('toReceiveCommand', () => {
  it.fails('fails when no command received', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toReceiveCommand(GetObjectCommand);
  });

  it('passes when received command once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommand(GetObjectCommand);
  });

  it('passes when received command more than once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommand(GetObjectCommand);
  });

  it.fails('fails when only received other commands', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    expect(s3Mock).toReceiveCommand(GetObjectCommand);
  });

  describe('not', () => {
    it('passes when no command received', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toReceiveCommand(GetObjectCommand);
    });

    it('passes when other commands received', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
      expect(s3Mock).not.toReceiveCommand(GetObjectCommand);
    });

    it.fails('fails when command received once', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommand(GetObjectCommand);
    });

    it.fails('fails when command received multiple times', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommand(GetObjectCommand);
    });
  });
});

describe('toHaveReceivedCommand', () => {
  it.fails('fails when no command received', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toHaveReceivedCommand(GetObjectCommand);
  });

  it('passes when received command once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommand(GetObjectCommand);
  });

  it('passes when received command more than once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommand(GetObjectCommand);
  });

  it.fails('fails when only received other commands', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    expect(s3Mock).toHaveReceivedCommand(GetObjectCommand);
  });

  describe('not', () => {
    it('passes when no command received', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toHaveReceivedCommand(GetObjectCommand);
    });

    it('passes when other commands received', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
      expect(s3Mock).not.toHaveReceivedCommand(GetObjectCommand);
    });

    it.fails('fails when command received once', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommand(GetObjectCommand);
    });

    it.fails('fails when command received multiple times', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommand(GetObjectCommand);
    });
  });
});

describe('toReceiveCommandWith', () => {
  it('passes when received with command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'test.txt',
    });
  });

  it('passes when received with partial command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
      Bucket: 'foo',
    });
  });

  it('passes when received at least once with command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'bucket1', Key: 'key1' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bucket2', Key: 'key2' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bucket3', Key: 'key3' }));

    expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
      Bucket: 'bucket2',
      Key: 'key2',
    });
  });

  it('passes when received at least once with partial command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'bucket1', Key: 'key1' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bucket2', Key: 'key2' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bucket3', Key: 'key3' }));

    expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
      Key: 'key2',
    });
  });

  it('passes when received mutliple times with command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'test.txt',
    });
  });

  it('passes when received mutliple times with partial command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test2.txt' }));
    expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
      Bucket: 'foo',
    });
  });

  it.fails('fails when received with wrong command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommandWith(PutObjectCommand, {
      Bucket: 'foo',
      Key: 'test.txt',
    });
  });

  it.fails('fails when input does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'wrongkey.txt',
    });
  });

  it.fails('fails when input misses fields', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'test.txt',
      VersionId: '10',
    });
  });

  describe('not', () => {
    it('passes when never called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toReceiveCommandWith(PutObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
      });
    });

    it('passes when not called with input', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandWith(GetObjectCommand, {
        Bucket: 'bar',
        Key: 'test.txt',
      });
    });

    it.fails('fails when one matching input', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'baz', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandWith(GetObjectCommand, {
        Bucket: 'bar',
        Key: 'test.txt',
      });
    });

    it.fails('fails on partial match', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'baz', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandWith(GetObjectCommand, {
        Bucket: 'bar',
      });
    });

    it('passes when called with additional arguments', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
        VersionId: 'abc',
      });
    });
  });
});

describe('toHaveReceivedCommandWith', () => {
  it('passes when received with command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'test.txt',
    });
  });

  it('passes when received with partial command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
      Bucket: 'foo',
    });
  });

  it('passes when received at least once with command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'bucket1', Key: 'key1' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bucket2', Key: 'key2' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bucket3', Key: 'key3' }));

    expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
      Bucket: 'bucket2',
      Key: 'key2',
    });
  });

  it('passes when received at least once with partial command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'bucket1', Key: 'key1' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bucket2', Key: 'key2' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bucket3', Key: 'key3' }));

    expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
      Key: 'key2',
    });
  });

  it('passes when received mutliple times with command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'test.txt',
    });
  });

  it('passes when received mutliple times with partial command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test2.txt' }));
    expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
      Bucket: 'foo',
    });
  });

  it.fails('fails when received with wrong command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommandWith(PutObjectCommand, {
      Bucket: 'foo',
      Key: 'test.txt',
    });
  });

  it.fails('fails when input does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'wrongkey.txt',
    });
  });

  it.fails('fails when input misses fields', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'test.txt',
      VersionId: '10',
    });
  });

  describe('not', () => {
    it('passes when never called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toHaveReceivedCommandWith(PutObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
      });
    });

    it('passes when not called with input', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommandWith(GetObjectCommand, {
        Bucket: 'bar',
        Key: 'test.txt',
      });
    });

    it.fails('fails when one matching input', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'baz', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommandWith(GetObjectCommand, {
        Bucket: 'bar',
        Key: 'test.txt',
      });
    });

    it.fails('fails on partial match', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'baz', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommandWith(GetObjectCommand, {
        Bucket: 'bar',
      });
    });

    it('passes when called with additional arguments', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
        VersionId: 'abc',
      });
    });
  });
});

describe('toReceiveNthCommandWith', () => {
  it('passes when command matches', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toReceiveNthCommandWith(GetObjectCommand, 2, {
      Bucket: 'foo',
      Key: 'file2.txt',
    });
  });

  it('passes when command partially matches', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toReceiveNthCommandWith(GetObjectCommand, 2, {
      Key: 'file2.txt',
    });
  });

  it('ignores other commands', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectAclCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toReceiveNthCommandWith(GetObjectCommand, 2, {
      Key: 'file2.txt',
    });
  });

  it.fails('fails when number is incorrect', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toReceiveNthCommandWith(GetObjectCommand, 3, {
      Bucket: 'foo',
      Key: 'file2.txt',
    });
  });

  it.fails('fails when call is beyond actual calls', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(s3Mock).toReceiveNthCommandWith(GetObjectCommand, 2, {
      Bucket: 'foo',
      Key: 'file2.txt',
    });
  });

  describe('not', () => {
    it('succeeds when command does not match', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
      expect(s3Mock).not.toReceiveNthCommandWith(GetObjectCommand, 2, {
        Bucket: 'bar',
        Key: 'file2.txt',
      });
    });

    it('succeeds when command has missing inputs', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
      expect(s3Mock).not.toReceiveNthCommandWith(GetObjectCommand, 2, {
        Bucket: 'foo',
        Key: 'file2.txt',
        VersionId: 'was not specified',
      });
    });

    it('succeeds when call is beyond actual calls', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(s3Mock).not.toReceiveNthCommandWith(GetObjectCommand, 5, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    });

    it.fails('fails when call matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(s3Mock).not.toReceiveNthCommandWith(GetObjectCommand, 1, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    });

    it.fails('fails when call partially matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(s3Mock).not.toReceiveNthCommandWith(GetObjectCommand, 1, {
        Bucket: 'foo',
      });
    });
  });
});

describe('toHaveReceivedNthCommandWith', () => {
  it('passes when command matches', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toHaveReceivedNthCommandWith(GetObjectCommand, 2, {
      Bucket: 'foo',
      Key: 'file2.txt',
    });
  });

  it('passes when command partially matches', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toHaveReceivedNthCommandWith(GetObjectCommand, 2, {
      Key: 'file2.txt',
    });
  });

  it('ignores other commands', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectAclCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toHaveReceivedNthCommandWith(GetObjectCommand, 2, {
      Key: 'file2.txt',
    });
  });

  it.fails('fails when number is incorrect', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toHaveReceivedNthCommandWith(GetObjectCommand, 3, {
      Bucket: 'foo',
      Key: 'file2.txt',
    });
  });

  it.fails('fails when call is beyond actual calls', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(s3Mock).toHaveReceivedNthCommandWith(GetObjectCommand, 2, {
      Bucket: 'foo',
      Key: 'file2.txt',
    });
  });

  describe('not', () => {
    it('succeeds when command does not match', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
      expect(s3Mock).not.toHaveReceivedNthCommandWith(GetObjectCommand, 2, {
        Bucket: 'bar',
        Key: 'file2.txt',
      });
    });

    it('succeeds when command has missing inputs', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
      expect(s3Mock).not.toHaveReceivedNthCommandWith(GetObjectCommand, 2, {
        Bucket: 'foo',
        Key: 'file2.txt',
        VersionId: 'was not specified',
      });
    });

    it('succeeds when call is beyond actual calls', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(s3Mock).not.toHaveReceivedNthCommandWith(GetObjectCommand, 5, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    });

    it.fails('fails when call matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(s3Mock).not.toHaveReceivedNthCommandWith(GetObjectCommand, 1, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    });

    it.fails('fails when call partially matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(s3Mock).not.toHaveReceivedNthCommandWith(GetObjectCommand, 1, {
        Bucket: 'foo',
      });
    });
  });
});

describe('toReceiveLastCommandWith', () => {
  it('passes when only command matches', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(s3Mock).toReceiveLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file1.txt',
    });
  });

  it('passes when last command matches', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toReceiveLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file3.txt',
    });
  });

  it('passes when last command partially matches', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toReceiveLastCommandWith(GetObjectCommand, {
      Key: 'file3.txt',
    });
  });

  it('ignores other commands', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectAclCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(s3Mock).toReceiveLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file2.txt',
    });
  });

  it.fails('fails when only command does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(s3Mock).toReceiveLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file3.txt',
    });
  });

  it.fails('fails when last command does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toReceiveLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file1.txt',
    });
  });

  it.fails('fails when not called at all', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toReceiveLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file1.txt',
    });
  });

  describe('not', () => {
    it('passes when not called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toReceiveLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    });

    it('passes when last command does not match', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      expect(s3Mock).not.toReceiveLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    });

    it('passes when input misses fields', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      expect(s3Mock).not.toReceiveLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file2.txt',
        VersionId: 'not specified',
      });
    });

    it.fails('fails when last command matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      expect(s3Mock).not.toReceiveLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file2.txt',
      });
    });

    it.fails('fails when last command partially matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      expect(s3Mock).not.toReceiveLastCommandWith(GetObjectCommand, {
        Key: 'file2.txt',
      });
    });
  });
});

describe('toHaveReceivedLastCommandWith', () => {
  it('passes when only command matches', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(s3Mock).toHaveReceivedLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file1.txt',
    });
  });

  it('passes when last command matches', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toHaveReceivedLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file3.txt',
    });
  });

  it('passes when last command partially matches', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toHaveReceivedLastCommandWith(GetObjectCommand, {
      Key: 'file3.txt',
    });
  });

  it('ignores other commands', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectAclCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(s3Mock).toHaveReceivedLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file2.txt',
    });
  });

  it.fails('fails when only command does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(s3Mock).toHaveReceivedLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file3.txt',
    });
  });

  it.fails('fails when last command does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toHaveReceivedLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file1.txt',
    });
  });

  it.fails('fails when not called at all', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toHaveReceivedLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file1.txt',
    });
  });

  describe('not', () => {
    it('passes when not called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toHaveReceivedLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    });

    it('passes when last command does not match', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      expect(s3Mock).not.toHaveReceivedLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    });

    it('passes when input misses fields', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      expect(s3Mock).not.toHaveReceivedLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file2.txt',
        VersionId: 'not specified',
      });
    });

    it.fails('fails when last command matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      expect(s3Mock).not.toHaveReceivedLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file2.txt',
      });
    });

    it.fails('fails when last command partially matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      expect(s3Mock).not.toHaveReceivedLastCommandWith(GetObjectCommand, {
        Key: 'file2.txt',
      });
    });
  });
});

describe('toReceiveAnyCommand', () => {
  it.fails('fails when no command received', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toReceiveAnyCommand();
  });

  it('passes when one command was received', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(s3Mock).toReceiveAnyCommand();
  });

  describe('not', () => {
    it('passes when no command received', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toReceiveAnyCommand();
    });

    it.fails('fails when one command was received', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(s3Mock).not.toReceiveAnyCommand();
    });

    it.fails('fails when multiple commands were received', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      await s3.send(new GetObjectAclCommand({ Bucket: 'foo', Key: 'file3.txt' }));
      expect(s3Mock).not.toReceiveAnyCommand();
    });
  });
});

describe('toHaveReceivedAnyCommand', () => {
  it.fails('fails when no command received', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toHaveReceivedAnyCommand();
  });

  it('passes when one command was received', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(s3Mock).toHaveReceivedAnyCommand();
  });

  describe('not', () => {
    it('passes when no command received', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toHaveReceivedAnyCommand();
    });

    it.fails('fails when one command was received', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(s3Mock).not.toHaveReceivedAnyCommand();
    });

    it.fails('fails when multiple commands were received', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      await s3.send(new GetObjectAclCommand({ Bucket: 'foo', Key: 'file3.txt' }));
      expect(s3Mock).not.toHaveReceivedAnyCommand();
    });
  });
});
