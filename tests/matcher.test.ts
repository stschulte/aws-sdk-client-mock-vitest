import { mockClient } from "aws-sdk-client-mock";
import {
  GetBucketAclCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { describe, it, expect } from "vitest";

import { toHaveReceivedCommandTimes } from "../src/matcher.js";

expect.extend({
  toHaveReceivedCommandTimes,
});

describe("toHaveReceivedCommandTimes", () => {
  it("should pass with 0 received commands", async () => {
    const s3Mock = mockClient(S3Client);
    expect(s3Mock).toHaveReceivedCommandTimes(PutObjectCommand, 0);
  });

  it("should ignore other commands", async () => {
    const s3Mock = mockClient(S3Client);
    const s3 = new S3Client({});
    await s3.send(new GetObjectCommand({ Bucket: "foo", Key: "test.txt" }));
    await s3.send(new GetBucketAclCommand({ Bucket: "foo" }));
    await s3.send(new GetBucketAclCommand({ Bucket: "bar" }));
    await s3.send(new GetBucketAclCommand({ Bucket: "baz" }));
    expect(s3Mock).toHaveReceivedCommandTimes(PutObjectCommand, 0);
    expect(s3Mock).toHaveReceivedCommandTimes(GetObjectCommand, 1);
    expect(s3Mock).toHaveReceivedCommandTimes(GetBucketAclCommand, 3);
  });
});
