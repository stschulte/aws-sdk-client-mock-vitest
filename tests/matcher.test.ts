import {
  GetBucketAclCommand,
  GetObjectAclCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import {
  toHaveReceivedAnyCommand,
  toHaveReceivedCommand,
  toHaveReceivedCommandExactlyOnceWith,
  toHaveReceivedCommandOnce,
  toHaveReceivedCommandTimes,
  toHaveReceivedCommandWith,
  toHaveReceivedLastCommandWith,
  toHaveReceivedNthCommandWith,
  toReceiveAnyCommand,
  toReceiveCommand,
  toReceiveCommandExactlyOnceWith,
  toReceiveCommandOnce,
  toReceiveCommandTimes,
  toReceiveCommandWith,
  toReceiveLastCommandWith,
  toReceiveNthCommandWith,
} from '../src/matcher.js';

expect.extend({
  toHaveReceivedAnyCommand,
  toHaveReceivedCommand,
  toHaveReceivedCommandExactlyOnceWith,
  toHaveReceivedCommandOnce,
  toHaveReceivedCommandTimes,
  toHaveReceivedCommandWith,
  toHaveReceivedLastCommandWith,
  toHaveReceivedNthCommandWith,
  toReceiveAnyCommand,
  toReceiveCommand,
  toReceiveCommandExactlyOnceWith,
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

  it('fails when command is not called as specified', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'bar' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'baz' }));
    expect(() => {
      expect(s3Mock).toReceiveCommandTimes(GetBucketAclCommand, 1);
    }).toThrow(/expected "GetBucketAclCommand" to be called 1 times, but got 3 times/);
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

    it('fails when command received as specified', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(() => {
        expect(s3Mock).not.toReceiveCommandTimes(GetObjectCommand, 1);
      }).toThrow(/expected "GetObjectCommand" to not be called 1 times/);
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

  it('fails when command is not called as specified', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'bar' }));
    await s3.send(new GetBucketAclCommand({ Bucket: 'baz' }));
    expect(() => {
      expect(s3Mock).toHaveReceivedCommandTimes(GetBucketAclCommand, 1);
    }).toThrow(/expected "GetBucketAclCommand" to be called 1 times, but got 3 times/);
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

    it('fails when command received as specified', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(() => {
        expect(s3Mock).not.toReceiveCommandTimes(GetObjectCommand, 1);
      }).toThrow(/expected "GetObjectCommand" to not be called 1 times/);
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

  it('fails when not called', () => {
    const s3Mock = mockClient(S3Client);
    expect(() => {
      expect(s3Mock).toReceiveCommandOnce(GetObjectCommand);
    }).toThrow(/expected "GetObjectCommand" to be called once, but got 0 times/);
  });

  it('fails when called more than once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
    expect(() => {
      expect(s3Mock).toReceiveCommandOnce(GetObjectCommand);
    }).toThrow(/expected "GetObjectCommand" to be called once, but got 2 times/);
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

    it('fails when called exactly once', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(() => {
        expect(s3Mock).not.toReceiveCommandOnce(GetObjectCommand);
      }).toThrow(/expected "GetObjectCommand" to not be called once/);
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

  it('fails when not called', () => {
    const s3Mock = mockClient(S3Client);
    expect(() => {
      expect(s3Mock).toHaveReceivedCommandOnce(GetObjectCommand);
    }).toThrow(/expected "GetObjectCommand" to be called once, but got 0 times/);
  });

  it('fails when called more than once', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
    expect(() => {
      expect(s3Mock).toHaveReceivedCommandOnce(GetObjectCommand);
    }).toThrow(/expected "GetObjectCommand" to be called once, but got 2 times/);
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

    it('fails when called exactly once', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(() => {
        expect(s3Mock).not.toHaveReceivedCommandOnce(GetObjectCommand);
      }).toThrow(/expected "GetObjectCommand" to not be called once/);
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
  it('fails when no command received', () => {
    const s3Mock = mockClient(S3Client);
    expect(() => {
      expect(s3Mock).toReceiveCommand(GetObjectCommand);
    }).toThrow(/expected "GetObjectCommand" to be called at least once/);
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

  it('fails when only received other commands', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    expect(() => {
      expect(s3Mock).toReceiveCommand(GetObjectCommand);
    }).toThrow(/expected "GetObjectCommand" to be called at least once/);
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

    it('fails when command received once', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(() => {
        expect(s3Mock).not.toReceiveCommand(GetObjectCommand);
      }).toThrow(/expected "GetObjectCommand" to not be called at all, but actually been called 1 times/);
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
  it('fails when no command received', () => {
    const s3Mock = mockClient(S3Client);
    expect(() => {
      expect(s3Mock).toHaveReceivedCommand(GetObjectCommand);
    }).toThrow(/expected "GetObjectCommand" to be called at least once/);
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

  it('fails when only received other commands', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetBucketAclCommand({ Bucket: 'foo' }));
    expect(() => {
      expect(s3Mock).toHaveReceivedCommand(GetObjectCommand);
    }).toThrow(/expected "GetObjectCommand" to be called at least once/);
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

    it('fails when command received once', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(() => {
        expect(s3Mock).not.toHaveReceivedCommand(GetObjectCommand);
      }).toThrow(/expected "GetObjectCommand" to not be called at all, but actually been called 1 times/);
    });

    it('fails when command received multiple times', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      expect(() => {
        expect(s3Mock).not.toHaveReceivedCommand(GetObjectCommand);
      }).toThrow(/expected "GetObjectCommand" to not be called at all, but actually been called 2 times/);
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

  it('passes with a correct asymmetric match', async () => {
    // Assume  code that uses a random string for the bucket key with a known extension
    const name = randomUUID().toString();
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: `${name}.txt` }));

    // asymmetric matchers like stringMatching are typed as `any` so we cast them
    // as we want to compare them to strings
    expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: expect.stringMatching(/.txt$/) as string,
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

  it('fails when received with wrong command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(() => {
      expect(s3Mock).toReceiveCommandWith(PutObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
      });
    }).toThrow(/expected "PutObjectCommand" to be called with arguments/);
  });

  it('fails when input does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(() => {
      expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'wrongkey.txt',
      });
    }).toThrow(/expected "GetObjectCommand" to be called with arguments/);
  });

  it('fails when input misses fields', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(() => {
      expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
        VersionId: '10',
      });
    }).toThrow(/expected "GetObjectCommand" to be called with arguments/);
  });

  it('fails on failed asymmetric match', async () => {
    // Assume  code that uses a random string for the bucket key with a known extension
    const name = randomUUID().toString();
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: `${name}.txt` }));

    // asymmetric matchers like stringMatching are typed as `any` so we cast them
    // as we want to compare them to strings
    expect(() => {
      expect(s3Mock).toReceiveCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: expect.stringMatching(/.jpg/) as string,
      });
    }).toThrow(/expected "GetObjectCommand" to be called with arguments/);
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

    it('fails when one matching input', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'baz', Key: 'test.txt' }));
      expect(() => {
        expect(s3Mock).not.toReceiveCommandWith(GetObjectCommand, {
          Bucket: 'bar',
          Key: 'test.txt',
        });
      }).toThrow(/expected "GetObjectCommand" to not be called with arguments/);
    });

    it('fails on partial match', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'baz', Key: 'test.txt' }));
      expect(() => {
        expect(s3Mock).not.toReceiveCommandWith(GetObjectCommand, {
          Bucket: 'bar',
        });
      }).toThrow(/expected "GetObjectCommand" to not be called with arguments/);
    });

    it('fails on correct asymmetric match', async () => {
      // Assume  code that uses a random string for the bucket key with a known extension
      const name = randomUUID().toString();
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: `${name}.txt` }));

      // asymmetric matchers like stringMatching are typed as `any` so we cast them
      // as we want to compare them to strings
      expect(() => {
        expect(s3Mock).not.toReceiveCommandWith(GetObjectCommand, {
          Bucket: 'foo',
          Key: expect.stringMatching(/.txt$/) as string,
        });
      }).toThrow(/expected "GetObjectCommand" to not be called with arguments/);
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

    it('passes on incorrect asymmetric match', async () => {
      // Assume  code that uses a random string for the bucket key with a known extension
      const name = randomUUID().toString();
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: `${name}.txt` }));

      // asymmetric matchers like stringMatching are typed as `any` so we cast them
      // as we want to compare them to strings
      expect(s3Mock).not.toReceiveCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: expect.stringMatching(/.jpg/) as string,
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

  it('passes with a correct asymmetric match', async () => {
    // Assume  code that uses a random string for the bucket key with a known extension
    const name = randomUUID().toString();
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: `${name}.txt` }));

    // asymmetric matchers like stringMatching are typed as `any` so we cast them
    // as we want to compare them to strings
    expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: expect.stringMatching(/.txt$/) as string,
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

  it('fails when received with wrong command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(() => {
      expect(s3Mock).toHaveReceivedCommandWith(PutObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
      });
    }).toThrow(/expected "PutObjectCommand" to be called with arguments/);
  });

  it('fails when input does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(() => {
      expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'wrongkey.txt',
      });
    }).toThrow(/expected "GetObjectCommand" to be called with arguments/);
  });

  it('fails when input misses fields', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(() => {
      expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
        VersionId: '10',
      });
    }).toThrow(/expected "GetObjectCommand" to be called with arguments/);
  });

  it('fails on failed asymmetric match', async () => {
    // Assume  code that uses a random string for the bucket key with a known extension
    const name = randomUUID().toString();
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: `${name}.txt` }));

    // asymmetric matchers like stringMatching are typed as `any` so we cast them
    // as we want to compare them to strings
    expect(() => {
      expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: expect.stringMatching(/.jpg/) as string,
      });
    }).toThrow(/expected "GetObjectCommand" to be called with arguments/);
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

    it('fails when one matching input', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'baz', Key: 'test.txt' }));
      expect(() => {
        expect(s3Mock).not.toHaveReceivedCommandWith(GetObjectCommand, {
          Bucket: 'bar',
          Key: 'test.txt',
        });
      }).toThrow(/expected "GetObjectCommand" to not be called with arguments/);
    });

    it('fails on partial match', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'baz', Key: 'test.txt' }));
      expect(() => {
        expect(s3Mock).not.toHaveReceivedCommandWith(GetObjectCommand, {
          Bucket: 'bar',
        });
      }).toThrow(/expected "GetObjectCommand" to not be called with arguments/);
    });

    it('fails on correct asymmetric match', async () => {
      // Assume  code that uses a random string for the bucket key with a known extension
      const name = randomUUID().toString();
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: `${name}.txt` }));

      // asymmetric matchers like stringMatching are typed as `any` so we cast them
      // as we want to compare them to strings
      expect(() => {
        expect(s3Mock).not.toHaveReceivedCommandWith(GetObjectCommand, {
          Bucket: 'foo',
          Key: expect.stringMatching(/.txt$/) as string,
        });
      }).toThrow(/expected "GetObjectCommand" to not be called with arguments/);
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

    it('passes on incorrect asymmetric match', async () => {
      // Assume  code that uses a random string for the bucket key with a known extension
      const name = randomUUID().toString();
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: `${name}.txt` }));

      // asymmetric matchers like stringMatching are typed as `any` so we cast them
      // as we want to compare them to strings
      expect(s3Mock).not.toHaveReceivedCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: expect.stringMatching(/.jpg/) as string,
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

  it('fails when number is incorrect', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(() => {
      expect(s3Mock).toReceiveNthCommandWith(GetObjectCommand, 3, {
        Bucket: 'foo',
        Key: 'file2.txt',
      });
    }).toThrow(/expected 3rd "GetObjectCommand" to be called with arguments/);
  });

  it('fails when call is beyond actual calls', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(() => {
      expect(s3Mock).toReceiveNthCommandWith(GetObjectCommand, 2, {
        Bucket: 'foo',
        Key: 'file2.txt',
      });
    }).toThrow(/expected 2nd "GetObjectCommand" to be called with arguments/);
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

    it('fails when call matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(() => {
        expect(s3Mock).not.toReceiveNthCommandWith(GetObjectCommand, 1, {
          Bucket: 'foo',
          Key: 'file1.txt',
        });
      }).toThrow(/expected 1st "GetObjectCommand" to not be called with arguments/);
    });

    it('fails when call partially matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(() => {
        expect(s3Mock).not.toReceiveNthCommandWith(GetObjectCommand, 1, {
          Bucket: 'foo',
        });
      }).toThrow(/expected 1st "GetObjectCommand" to not be called with arguments/);
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

  it('fails when number is incorrect', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(() => {
      expect(s3Mock).toHaveReceivedNthCommandWith(GetObjectCommand, 3, {
        Bucket: 'foo',
        Key: 'file2.txt',
      });
    }).toThrow(/expected 3rd "GetObjectCommand" to be called with arguments/);
  });

  it('fails when call is beyond actual calls', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(() => {
      expect(s3Mock).toHaveReceivedNthCommandWith(GetObjectCommand, 2, {
        Bucket: 'foo',
        Key: 'file2.txt',
      });
    }).toThrow(/expected 2nd "GetObjectCommand" to be called with arguments/);
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

    it('fails when call matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(() => {
        expect(s3Mock).not.toHaveReceivedNthCommandWith(GetObjectCommand, 1, {
          Bucket: 'foo',
          Key: 'file1.txt',
        });
      }).toThrow(/expected 1st "GetObjectCommand" to not be called with arguments/);
    });

    it('fails when call partially matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(() => {
        expect(s3Mock).not.toHaveReceivedNthCommandWith(GetObjectCommand, 1, {
          Bucket: 'foo',
        });
      }).toThrow(/expected 1st "GetObjectCommand" to not be called with arguments/);
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

  it('fails when only command does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(() => {
      expect(s3Mock).toReceiveLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file3.txt',
      });
    }).toThrow(/expected last "GetObjectCommand" to be called with arguments/);
  });

  it('fails when last command does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(() => {
      expect(s3Mock).toReceiveLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    }).toThrow(/expected last "GetObjectCommand" to be called with arguments/);
  });

  it('fails when not called at all', () => {
    const s3Mock = mockClient(S3Client);
    expect(() => {
      expect(s3Mock).toReceiveLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    }).toThrow(/expected last "GetObjectCommand" to be called with arguments/);
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

    it('fails when last command matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      expect(() => {
        expect(s3Mock).not.toReceiveLastCommandWith(GetObjectCommand, {
          Bucket: 'foo',
          Key: 'file2.txt',
        });
      }).toThrow(/expected last "GetObjectCommand" to not be called with arguments/);
    });

    it('fails when last command partially matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      expect(() => {
        expect(s3Mock).not.toReceiveLastCommandWith(GetObjectCommand, {
          Key: 'file2.txt',
        });
      }).toThrow(/expected last "GetObjectCommand" to not be called with arguments/);
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

  it('fails when only command does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    expect(() => {
      expect(s3Mock).toHaveReceivedLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file3.txt',
      });
    }).toThrow(/expected last "GetObjectCommand" to be called with arguments/);
  });

  it('fails when last command does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file3.txt' }));
    expect(() => {
      expect(s3Mock).toHaveReceivedLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    }).toThrow(/expected last "GetObjectCommand" to be called with arguments/);
  });

  it('fails when not called at all', () => {
    const s3Mock = mockClient(S3Client);
    expect(() => {
      expect(s3Mock).toHaveReceivedLastCommandWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'file1.txt',
      });
    }).toThrow(/expected last "GetObjectCommand" to be called with arguments/);
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

    it('fails when last command matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      expect(() => {
        expect(s3Mock).not.toHaveReceivedLastCommandWith(GetObjectCommand, {
          Bucket: 'foo',
          Key: 'file2.txt',
        });
      }).toThrow(/expected last "GetObjectCommand" to not be called with arguments/);
    });

    it('fails when last command partially matches', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      expect(() => {
        expect(s3Mock).not.toHaveReceivedLastCommandWith(GetObjectCommand, {
          Key: 'file2.txt',
        });
      }).toThrow(/expected last "GetObjectCommand" to not be called with arguments/);
    });
  });
});

describe('toReceiveAnyCommand', () => {
  it('fails when no command received', () => {
    const s3Mock = mockClient(S3Client);
    expect(() => {
      expect(s3Mock).toReceiveAnyCommand();
    }).toThrow(/expected client "S3Client" to have been called, but was not called/);
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

    it('fails when one command was received', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(() => {
        expect(s3Mock).not.toReceiveAnyCommand();
      }).toThrow(/expected client "S3Client" to not receive any calls, but was called/);
    });

    it('fails when multiple commands were received', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      await s3.send(new GetObjectAclCommand({ Bucket: 'foo', Key: 'file3.txt' }));
      expect(() => {
        expect(s3Mock).not.toReceiveAnyCommand();
      }).toThrow(/expected client "S3Client" to not receive any calls, but was called/);
    });
  });
});

describe('toHaveReceivedAnyCommand', () => {
  it('fails when no command received', () => {
    const s3Mock = mockClient(S3Client);
    expect(() => {
      expect(s3Mock).toHaveReceivedAnyCommand();
    }).toThrow(/expected client "S3Client" to have been called, but was not called/);
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

    it('fails when one command was received', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      expect(() => {
        expect(s3Mock).not.toHaveReceivedAnyCommand();
      }).toThrow(/expected client "S3Client" to not receive any calls, but was called/);
    });

    it('fails when multiple commands were received', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file1.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'file2.txt' }));
      await s3.send(new GetObjectAclCommand({ Bucket: 'foo', Key: 'file3.txt' }));
      expect(() => {
        expect(s3Mock).not.toHaveReceivedAnyCommand();
      }).toThrow(/expected client "S3Client" to not receive any calls, but was called/);
    });
  });
});

describe('toHaveReceivedCommandExactlyOnceWith', () => {
  it('passes if called exactly once with command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommandExactlyOnceWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'test.txt',
    });
  });

  it('passes if called exactly once with partial command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toHaveReceivedCommandExactlyOnceWith(GetObjectCommand, {
      Bucket: 'foo',
    });
  });

  it('passes with a correct asymmetric match', async () => {
    // Assume  code that uses a random string for the bucket key with a known extension
    const name = randomUUID().toString();
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: `${name}.txt` }));

    // asymmetric matchers like stringMatching are typed as `any` so we cast them
    // as we want to compare them to strings
    expect(s3Mock).toHaveReceivedCommandExactlyOnceWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: expect.stringMatching(/.txt$/) as string,
    });
  });

  it('fails when not called', () => {
    const s3Mock = mockClient(S3Client);

    expect(() => {
      expect(s3Mock).toHaveReceivedCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'bucket2',
        Key: 'key2',
      });
    }).toThrow(/expected "GetObjectCommand" to be called once with arguments/);
  });

  it('fails when received with wrong command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(() => {
      expect(s3Mock).toHaveReceivedCommandExactlyOnceWith(PutObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
      });
    }).toThrow(/expected "PutObjectCommand" to be called once with arguments/);
  });

  it('fails when input does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(() => {
      expect(s3Mock).toHaveReceivedCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'wrongkey.txt',
      });
    }).toThrow(/expected "GetObjectCommand" to be called once with arguments/);
  });

  it('fails when input misses fields', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(() => {
      expect(s3Mock).toHaveReceivedCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
        VersionId: '10',
      });
    }).toThrow(/expected "GetObjectCommand" to be called once with arguments/);
  });

  it('fails on failed asymmetric match', async () => {
    // Assume  code that uses a random string for the bucket key with a known extension
    const name = randomUUID().toString();
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: `${name}.txt` }));

    // asymmetric matchers like stringMatching are typed as `any` so we cast them
    // as we want to compare them to strings
    expect(() => {
      expect(s3Mock).toHaveReceivedCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: expect.stringMatching(/.jpg/) as string,
      });
    }).toThrow(/expected "GetObjectCommand" to be called once with arguments/);
  });

  it('fails when received to often', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test2.txt' }));
    expect(() => {
      expect(s3Mock).toHaveReceivedCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
      });
    }).toThrow(/expected "GetObjectCommand" to be called once with arguments/);
  });

  describe('not', () => {
    it('passes when never called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toHaveReceivedCommandExactlyOnceWith(PutObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
      });
    });

    it('passes when not called with input', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'bar',
        Key: 'test.txt',
      });
    });

    it('passes when called multiple times', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'baz', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'bar',
        Key: 'test.txt',
      });
    });

    it('fails on partial match', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      expect(() => {
        expect(s3Mock).not.toHaveReceivedCommandExactlyOnceWith(GetObjectCommand, {
          Bucket: 'bar',
        });
      }).toThrow(/expected "GetObjectCommand" to not be called once with arguments/);
    });

    it('fails on correct asymmetric match', async () => {
      // Assume  code that uses a random string for the bucket key with a known extension
      const name = randomUUID().toString();
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: `${name}.txt` }));

      // asymmetric matchers like stringMatching are typed as `any` so we cast them
      // as we want to compare them to strings
      expect(() => {
        expect(s3Mock).not.toHaveReceivedCommandExactlyOnceWith(GetObjectCommand, {
          Bucket: 'foo',
          Key: expect.stringMatching(/.txt$/) as string,
        });
      }).toThrow(/expected "GetObjectCommand" to not be called once with arguments/);
    });

    it('passes when called with additional arguments', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toHaveReceivedCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
        VersionId: 'abc',
      });
    });

    it('passes on incorrect asymmetric match', async () => {
      // Assume  code that uses a random string for the bucket key with a known extension
      const name = randomUUID().toString();
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: `${name}.txt` }));

      // asymmetric matchers like stringMatching are typed as `any` so we cast them
      // as we want to compare them to strings
      expect(s3Mock).not.toHaveReceivedCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: expect.stringMatching(/.jpg/) as string,
      });
    });
  });
});

describe('toReceiveCommandExactlyOnceWith', () => {
  it('passes if called exactly once with command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommandExactlyOnceWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: 'test.txt',
    });
  });

  it('passes if called exactly once with partial command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(s3Mock).toReceiveCommandExactlyOnceWith(GetObjectCommand, {
      Bucket: 'foo',
    });
  });

  it('passes with a correct asymmetric match', async () => {
    // Assume  code that uses a random string for the bucket key with a known extension
    const name = randomUUID().toString();
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: `${name}.txt` }));

    // asymmetric matchers like stringMatching are typed as `any` so we cast them
    // as we want to compare them to strings
    expect(s3Mock).toReceiveCommandExactlyOnceWith(GetObjectCommand, {
      Bucket: 'foo',
      Key: expect.stringMatching(/.txt$/) as string,
    });
  });

  it('fails when not called', () => {
    const s3Mock = mockClient(S3Client);

    expect(() => {
      expect(s3Mock).toReceiveCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'bucket2',
        Key: 'key2',
      });
    }).toThrow(/expected "GetObjectCommand" to be called once with arguments/);
  });

  it('fails when received with wrong command', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(() => {
      expect(s3Mock).toReceiveCommandExactlyOnceWith(PutObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
      });
    }).toThrow(/expected "PutObjectCommand" to be called once with arguments/);
  });

  it('fails when input does not match', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(() => {
      expect(s3Mock).toReceiveCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'wrongkey.txt',
      });
    }).toThrow(/expected "GetObjectCommand" to be called once with arguments/);
  });

  it('fails when input misses fields', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    expect(() => {
      expect(s3Mock).toReceiveCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
        VersionId: '10',
      });
    }).toThrow(/expected "GetObjectCommand" to be called once with arguments/);
  });

  it('fails on failed asymmetric match', async () => {
    // Assume  code that uses a random string for the bucket key with a known extension
    const name = randomUUID().toString();
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: `${name}.txt` }));

    // asymmetric matchers like stringMatching are typed as `any` so we cast them
    // as we want to compare them to strings
    expect(() => {
      expect(s3Mock).toReceiveCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: expect.stringMatching(/.jpg/) as string,
      });
    }).toThrow(/expected "GetObjectCommand" to be called once with arguments/);
  });

  it('fails when received to often', async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
    await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test2.txt' }));
    expect(() => {
      expect(s3Mock).toReceiveCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
      });
    }).toThrow(/expected "GetObjectCommand" to be called once with arguments/);
  });

  describe('not', () => {
    it('passes when never called', () => {
      const s3Mock = mockClient(S3Client);
      expect(s3Mock).not.toReceiveCommandExactlyOnceWith(PutObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
      });
    });

    it('passes when not called with input', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'bar',
        Key: 'test.txt',
      });
    });

    it('passes when called multiple times', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      await s3.send(new GetObjectCommand({ Bucket: 'baz', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'bar',
        Key: 'test.txt',
      });
    });

    it('fails on partial match', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'bar', Key: 'test.txt' }));
      expect(() => {
        expect(s3Mock).not.toReceiveCommandExactlyOnceWith(GetObjectCommand, {
          Bucket: 'bar',
        });
      }).toThrow(/expected "GetObjectCommand" to not be called once with arguments/);
    });

    it('fails on correct asymmetric match', async () => {
      // Assume  code that uses a random string for the bucket key with a known extension
      const name = randomUUID().toString();
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: `${name}.txt` }));

      // asymmetric matchers like stringMatching are typed as `any` so we cast them
      // as we want to compare them to strings
      expect(() => {
        expect(s3Mock).not.toReceiveCommandExactlyOnceWith(GetObjectCommand, {
          Bucket: 'foo',
          Key: expect.stringMatching(/.txt$/) as string,
        });
      }).toThrow(/expected "GetObjectCommand" to not be called once with arguments/);
    });

    it('passes when called with additional arguments', async () => {
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: 'test.txt' }));
      expect(s3Mock).not.toReceiveCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: 'test.txt',
        VersionId: 'abc',
      });
    });

    it('passes on incorrect asymmetric match', async () => {
      // Assume  code that uses a random string for the bucket key with a known extension
      const name = randomUUID().toString();
      const s3Mock = mockClient(S3Client);
      const s3 = new S3Client({});
      await s3.send(new GetObjectCommand({ Bucket: 'foo', Key: `${name}.txt` }));

      // asymmetric matchers like stringMatching are typed as `any` so we cast them
      // as we want to compare them to strings
      expect(s3Mock).not.toReceiveCommandExactlyOnceWith(GetObjectCommand, {
        Bucket: 'foo',
        Key: expect.stringMatching(/.jpg/) as string,
      });
    });
  });
});
