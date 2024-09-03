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
} from '../src/matcher.js';

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

describe('toReceiveCommandTimes', () => {
  it('should pass with 0 received commands', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toReceiveCommandTimes(PutObjectCommand, 0);
  });

  it('should ignore other commands', async () => {
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

  it.fails('should fail when command is not called as specified', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'bar' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'baz' }));
    expect(s3Mock).toReceiveCommandTimes(GetBucketAclCommand, 1);
  });

  describe('not', () => {
    it('should pass when not called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toReceiveCommandTimes(PutObjectCommand, 1);
    });

    it('should pass when called different than specified', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandTimes(PutObjectCommand, 2);
    });

    it.fails('should fail when command received as specified', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandTimes(GetObjectCommand, 1);
    });
  });
});

describe('toHaveReceivedCommandTimes', () => {
  it('should pass with 0 received commands', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toHaveReceivedCommandTimes(PutObjectCommand, 0);
  });

  it('should ignore other commands', async () => {
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

  it.fails('should fail when command is not called as specified', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'bar' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'baz' }));
    expect(s3Mock).toHaveReceivedCommandTimes(GetBucketAclCommand, 1);
  });

  describe('not', () => {
    it('should pass when not called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toHaveReceivedCommandTimes(PutObjectCommand, 1);
    });

    it('should pass when called different than specified', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommandTimes(PutObjectCommand, 2);
    });

    it.fails('should fail when command received as specified', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandTimes(GetObjectCommand, 1);
    });
  });
});

describe('toReceiveCommandOnce', () => {
  it('should pass when called exactly once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommandOnce(GetObjectCommand);
  });

  it.fails('should fail when not called', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toReceiveCommandOnce(GetObjectCommand);
  });

  it.fails('should fail when called more than once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommandOnce(GetObjectCommand);
  });

  it('should ignore other commands', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'bar' }));
    expect(s3Mock).toReceiveCommandOnce(GetObjectCommand);
  });

  describe('not', () => {
    it('should pass when not called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toReceiveCommandOnce(GetObjectCommand);
    });

    it.fails('should fail when called exactly once', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandOnce(GetObjectCommand);
    });

    it('should pass when called more than once', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandOnce(GetObjectCommand);
    });
    it('should ignore other commands', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
      expect(s3Mock).not.toReceiveCommandOnce(GetObjectCommand);
    });
  });
});

describe('toHaveReceivedCommandOnce', () => {
  it('should pass when called exactly once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommandOnce(GetObjectCommand);
  });

  it.fails('should fail when not called', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toHaveReceivedCommandOnce(GetObjectCommand);
  });

  it.fails('should fail when called more than once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommandOnce(GetObjectCommand);
  });

  it('should ignore other commands', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'bar' }));
    expect(s3Mock).toHaveReceivedCommandOnce(GetObjectCommand);
  });

  describe('not', () => {
    it('should pass when not called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toHaveReceivedCommandOnce(GetObjectCommand);
    });

    it.fails('should fail when called exactly once', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommandOnce(GetObjectCommand);
    });

    it('should pass when called more than once', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommandOnce(GetObjectCommand);
    });

    it('should ignore other commands', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
      expect(s3Mock).not.toHaveReceivedCommandOnce(GetObjectCommand);
    });
  });
});

describe('toReceiveCommand', () => {
  it.fails('should fail when no command received', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toReceiveCommand(GetObjectCommand);
  });

  it('should pass when received command once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommand(GetObjectCommand);
  });

  it('should pass when received command more than once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommand(GetObjectCommand);
  });

  it.fails('should fail when only received other commands', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    expect(s3Mock).toReceiveCommand(GetObjectCommand);
  });

  describe('not', () => {
    it('should pass when no command received', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toReceiveCommand(GetObjectCommand);
    });

    it('should pass when other commands received', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
      expect(s3Mock).not.toReceiveCommand(GetObjectCommand);
    });

    it.fails('should fail when command received once', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommand(GetObjectCommand);
    });

    it.fails('should fail when command received multiple times', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommand(GetObjectCommand);
    });
  });
});

describe('toHaveReceivedCommand', () => {
  it.fails('should fail when no command received', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toHaveReceivedCommand(GetObjectCommand);
  });

  it('should pass when received command once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommand(GetObjectCommand);
  });

  it('should pass when received command more than once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommand(GetObjectCommand);
  });

  it.fails('should fail when only received other commands', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    expect(s3Mock).toHaveReceivedCommand(GetObjectCommand);
  });

  describe('not', () => {
    it('should pass when no command received', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toHaveReceivedCommand(GetObjectCommand);
    });

    it('should pass when other commands received', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
      expect(s3Mock).not.toHaveReceivedCommand(GetObjectCommand);
    });

    it.fails('should fail when command received once', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommand(GetObjectCommand);
    });

    it.fails('should fail when command received multiple times', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommand(GetObjectCommand);
    });
  });
});

describe('toReceiveCommandWith', () => {
  it('should pass when received with command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'test.txt',
    });
  });

  it('should pass when received with partial command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
      Bucket: 'foo',
    });
  });

  it('should pass when received at least once with command', async () => {
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

  it('should pass when received at least once with partial command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'bucket1', Key: 'key1' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bucket2', Key: 'key2' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bucket3', Key: 'key3' }));

    expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
      Key: 'key2',
    });
  });

  it('should pass when received mutliple times with command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'test.txt',
    });
  });

  it('should pass when received mutliple times with partial command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test2.txt' }));
    expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
      Bucket: 'foo',
    });
  });

  it.fails('should fail when received with wrong command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommandWith(PutObjectCommand, {
      Bucket: 'foo',
      Key: 'test.txt',
    });
  });

  it.fails('should fail when input does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'wrongkey.txt',
    });
  });

  it.fails('should fail when input misses fields', async () => {
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
    it('shoud pass when never called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toReceiveCommandWith(PutObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
      });
    });

    it('should pass when not called with input', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandWith(GetObjectCommand, {
        Bucket: 'bar',
        Key: 'test.txt',
      });
    });

    it.fails('should fail when one matching input', async () => {
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

    it.fails('should fail on partial match', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'baz', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandWith(GetObjectCommand, {
        Bucket: 'bar',
      });
    });

    it('should pass when called with additional arguments', async () => {
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
  it('should pass when received with command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'test.txt',
    });
  });

  it('should pass when received with partial command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
      Bucket: 'foo',
    });
  });

  it('should pass when received at least once with command', async () => {
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

  it('should pass when received at least once with partial command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'bucket1', Key: 'key1' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bucket2', Key: 'key2' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bucket3', Key: 'key3' }));

    expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
      Key: 'key2',
    });
  });

  it('should pass when received mutliple times with command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'test.txt',
    });
  });

  it('should pass when received mutliple times with partial command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test2.txt' }));
    expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
      Bucket: 'foo',
    });
  });

  it.fails('should fail when received with wrong command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommandWith(PutObjectCommand, {
      Bucket: 'foo',
      Key: 'test.txt',
    });
  });

  it.fails('should fail when input does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'wrongkey.txt',
    });
  });

  it.fails('should fail when input misses fields', async () => {
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
    it('shoud pass when never called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toHaveReceivedCommandWith(PutObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
      });
    });

    it('should pass when not called with input', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommandWith(GetObjectCommand, {
        Bucket: 'bar',
        Key: 'test.txt',
      });
    });

    it.fails('should fail when one matching input', async () => {
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

    it.fails('should fail on partial match', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'baz', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommandWith(GetObjectCommand, {
        Bucket: 'bar',
      });
    });

    it('should pass when called with additional arguments', async () => {
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
  it('should pass when command matches', async () => {
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

  it('should pass when command partially matches', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toReceiveNthCommandWith(GetObjectCommand, 2, {
      Key: 'file2.txt',
    });
  });

  it('should ignore other commands', async () => {
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

  it.fails('should fail when number is incorrect', async () => {
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

  it.fails('should fail when call is beyond actual calls', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(s3Mock).toReceiveNthCommandWith(GetObjectCommand, 2, {
      Bucket: 'foo',
      Key: 'file2.txt',
    });
  });

  describe('not', () => {
    it('should succeed when command does not match', async () => {
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

    it('should succeed when command has missing inputs', async () => {
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

    it('should succeed when call is beyond actual calls', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(s3Mock).not.toReceiveNthCommandWith(GetObjectCommand, 5, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    });

    it.fails('should fail when call matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(s3Mock).not.toReceiveNthCommandWith(GetObjectCommand, 1, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    });

    it.fails('should fail when call partially matches', async () => {
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
  it('should pass when command matches', async () => {
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

  it('should pass when command partially matches', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toHaveReceivedNthCommandWith(GetObjectCommand, 2, {
      Key: 'file2.txt',
    });
  });

  it('should ignore other commands', async () => {
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

  it.fails('should fail when number is incorrect', async () => {
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

  it.fails('should fail when call is beyond actual calls', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(s3Mock).toHaveReceivedNthCommandWith(GetObjectCommand, 2, {
      Bucket: 'foo',
      Key: 'file2.txt',
    });
  });

  describe('not', () => {
    it('should succeed when command does not match', async () => {
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

    it('should succeed when command has missing inputs', async () => {
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

    it('should succeed when call is beyond actual calls', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(s3Mock).not.toHaveReceivedNthCommandWith(GetObjectCommand, 5, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    });

    it.fails('should fail when call matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(s3Mock).not.toHaveReceivedNthCommandWith(GetObjectCommand, 1, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    });

    it.fails('should fail when call partially matches', async () => {
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
  it('should pass when only command matches', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(s3Mock).toReceiveLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file1.txt',
    });
  });

  it('should pass when last command matches', async () => {
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

  it('should pass when last command partially matches', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toReceiveLastCommandWith(GetObjectCommand, {
      Key: 'file3.txt',
    });
  });

  it('should ignore other commands', async () => {
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

  it.fails('should fail when only command does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(s3Mock).toReceiveLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file3.txt',
    });
  });

  it.fails('should fail when last command does not match', async () => {
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

  it.fails('should fail when not called at all', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toReceiveLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file1.txt',
    });
  });

  describe('not', () => {
    it('should pass when not called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toReceiveLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    });

    it('should pass when last command does not match', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      expect(s3Mock).not.toReceiveLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    });

    it('should pass when input misses fields', async () => {
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

    it.fails('should fail when last command matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      expect(s3Mock).not.toReceiveLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file2.txt',
      });
    });

    it.fails('should fail when last command partially matches', async () => {
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
  it('should pass when only command matches', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(s3Mock).toHaveReceivedLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file1.txt',
    });
  });

  it('should pass when last command matches', async () => {
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

  it('should pass when last command partially matches', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(s3Mock).toHaveReceivedLastCommandWith(GetObjectCommand, {
      Key: 'file3.txt',
    });
  });

  it('should ignore other commands', async () => {
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

  it.fails('should fail when only command does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(s3Mock).toHaveReceivedLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file3.txt',
    });
  });

  it.fails('should fail when last command does not match', async () => {
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

  it.fails('should fail when not called at all', () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toHaveReceivedLastCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'file1.txt',
    });
  });

  describe('not', () => {
    it('should pass when not called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toHaveReceivedLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    });

    it('should pass when last command does not match', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      expect(s3Mock).not.toHaveReceivedLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    });

    it('should pass when input misses fields', async () => {
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

    it.fails('should fail when last command matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      expect(s3Mock).not.toHaveReceivedLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file2.txt',
      });
    });

    it.fails('should fail when last command partially matches', async () => {
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
