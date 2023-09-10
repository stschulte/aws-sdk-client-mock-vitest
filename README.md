# AWS SDK Client Mock Vitest

[![CI Status](https://github.com/stschulte/aws-sdk-client-mock-vitest/workflows/CI/badge.svg)](https://github.com/stschulte/aws-sdk-client-mock-vitest/actions/workflows/test.yml)
[![npm version](https://badge.fury.io/js/aws-sdk-client-mock-vitest.svg)](https://badge.fury.io/js/aws-sdk-client-mock-vitest)

This module adds custom matchers to verfiy calls to your AWS Client Mock.
It was heavily inspired by [aws-sdk-client-mock-jest](https://www.npmjs.com/package/aws-sdk-client-mock-jest)

## Why do you want to use the module

You develop code that makes use of the AWS SDK3 and you want to write tests for it. You want to make use
of [aws-sdk-client-mock](https://www.npmjs.com/package/aws-sdk-client-mock) and you test your code with
[vitest](https://github.com/vitest-dev/vitest). You want to easily check wether certain commands have been
called in your tests

## Install

```
npm install --save-dev aws-sdk-client-mock-vitest
```

You must register the new matchers explicity (think about putting this to a [setup file](https://vitest.dev/config/#setupfiles)):

```javascript
import {
  toReceiveCommandTimes,
  toHaveReceivedCommandTimes,
  toReceiveCommandOnce,
  toHaveReceivedCommandOnce,
  toReceiveCommand,
  toHaveReceivedCommand,
  toReceiveCommandWith,
  toHaveReceivedCommandWith,
  toReceiveNthCommandWith,
  toHaveReceivedNthCommandWith,
  toReceiveLastCommandWith,
  toHaveReceivedLastCommandWith,
} from "aws-sdk-client-mock-vitest";

expect.extend({
  toReceiveCommandTimes,
  toHaveReceivedCommandTimes,
  toReceiveCommandOnce,
  toHaveReceivedCommandOnce,
  toReceiveCommand,
  toHaveReceivedCommand,
  toReceiveCommandWith,
  toHaveReceivedCommandWith,
  toReceiveNthCommandWith,
  toHaveReceivedNthCommandWith,
  toReceiveLastCommandWith,
  toHaveReceivedLastCommandWith,
});
```

In case you are using typescript, create a `vitest.d.ts` file with the following content

```javascript
import { CustomMatcher } from "aws-sdk-client-mock-vitest";

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatcher<T> {}
  interface AsymmetricMatchersContaining extends CustomMatcher {}
}
```

If you get the following error in your tests

```
Error: Invalid Chai property: toHaveReceivedCommandWith
```

Then your probably forgot to run `expect.extend` with the matcher you are using in your test (see above)

## Sample usage

Lets assume you have code that retrieves a secret from the AWS Secrets Manager

```typescript
// src/main.ts
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export async function readSecret(secretId: string): Promise<string> {
  const client = new SecretsManagerClient({});
  const command = new GetSecretValueCommand({ SecretId: secretId });
  const response = await client.send(command);
  if (response.SecretString) {
    return response.SecretString;
  }
  throw new Error("Unable to read the secret");
}
```

You can test this with vite without doing any network requests thanks to
`aws-sdk-client-mock`

```typescript
// tests/main.test.ts
import { describe, it, expect } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

import { readSecret } from "../src/main";

const smMock = mockClient(SecretsManagerClient);

describe("readSecret", () => {
  it("should return the secret value", async () => {
    /* Setup our mock. In this test the secret will always be secr3t */
    smMock.on(GetSecretValueCommand).resolves({ SecretString: "secr3t" });

    const result = await readSecret("foo");
    expect(result).toBe("secr3t");

    // We have not verified that we actually interacted with our
    // Secret Manager correcty
  });
});
```

But we may want to actually inspect our mock client to verify that we actually
have sent a specific command. We can do this by changing our testfile
and registering custom matchers.

```typescript
// tests/main.test.ts
import { describe, it, expect } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

import {
  CustomMatcher,
  toHaveReceivedCommandWith,
} from "aws-sdk-client-mock-vitest";

/* you can also run this in setupTests.ts */
expect.extend({ toHaveReceivedCommandWith });

/* You may want to put this in some vitest.d.ts file see https://vitest.dev/guide/extending-matchers.html */
declare module "vitest" {
  interface Assertion<T = any> extends CustomMatcher<T> {}
  interface AsymmetricMatchersContaining extends CustomMatcher {}
}

import { readSecret } from "../src/main";

const smMock = mockClient(SecretsManagerClient);

describe("readSecret", () => {
  it("should read it", async () => {
    smMock.on(GetSecretValueCommand).resolves({ SecretString: "secr3t" });

    const result = await readSecret("foo");
    expect(result).toBe("secr3t");

    /* Ensure we use the inut of the function to fetch the correct secret */
    expect(smMock).toHaveReceivedCommandWith(GetSecretValueCommand, {
      SecretId: "foo",
    });
  });
});
```

## Thank

I would like to thank Maciej Radzikowski for the awesome `aws-sdk-client-mock` and
`aws-sdk-client-mock-jest` that helped a lot to port these matchers to vitest
