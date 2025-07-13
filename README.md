# AWS SDK Client Mock Vitest

[![CI Status](https://github.com/stschulte/aws-sdk-client-mock-vitest/workflows/CI/badge.svg)](https://github.com/stschulte/aws-sdk-client-mock-vitest/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/stschulte/aws-sdk-client-mock-vitest/graph/badge.svg?token=VO6C4ZG7YD)](https://codecov.io/gh/stschulte/aws-sdk-client-mock-vitest)
[![npm version](https://badge.fury.io/js/aws-sdk-client-mock-vitest.svg)](https://badge.fury.io/js/aws-sdk-client-mock-vitest)

This module adds custom matchers to verfiy calls to your AWS Client Mock.
It was heavily inspired by [aws-sdk-client-mock-jest](https://www.npmjs.com/package/aws-sdk-client-mock-jest).

## Why do you want to use the module

You develop code that makes use of the [AWS SDK for JavaScript v3](https://github.com/aws/aws-sdk-js-v3).
You are already writing tests for it through the great [aws-sdk-client-mock](https://www.npmjs.com/package/aws-sdk-client-mock) package.
You also want to ensure that your actual code performs certain calls against your AWS Client Mocks. While there
is [aws-sdk-client-mock-jest](https://www.npmjs.com/package/aws-sdk-client-mock-jest) you prefer
[vitest](https://github.com/vitest-dev/vitest).

You can use this module to use expect extensions for vitest to ensure certain commands have been called
on your AWS clients.

## Install

```console
npm install --save-dev aws-sdk-client-mock-vitest
```

You must register the new matchers explicity (think about putting this to a
[setup file](https://vitest.dev/config/#setupfiles)). You can either just
register the matchers you are interested in, or register all available matchers
(the easiest solution).

## Automatic Setup (Recommended)

The easiest way to get started is to use the automatic extend functionality which sets up both the matchers and TypeScript declarations in one import:

```javascript
/*
  you may want to put the following into a file tests/setup.ts
  and then specify your vite.config.ts as such

      import { defineConfig } from "vitest/config";

      export default defineConfig({
        test: {
          setupFiles: ["tests/setup.ts"],
        },
      });

  to add the custom matchers before each test run
*/
import "aws-sdk-client-mock-vitest/extend";
```

This automatically extends vitest's `expect` with all available matchers and includes the necessary TypeScript declarations, so you don't need to create a separate `vitest.d.ts` file.

## Manual Setup

Alternatively, you can manually register matchers. To register all matchers use the following:

```javascript
/*
  you may want to put the following into a file tests/setup.ts
  and then specify your vite.config.ts as such

      import { defineConfig } from "vitest/config";

      export default defineConfig({
        test: {
          setupFiles: ["tests/setup.ts"],
        },
      });

  to add the custom matchers before each test run
*/
import { expect } from "vitest";
import { allCustomMatcher } from "aws-sdk-client-mock-vitest";

expect.extend(allCustomMatcher);
```

You can also register just the matchers you care about:

```javascript
/*
  you may want to put the following into a file tests/setup.ts
  and then specify your vite.config.ts as such

      import { defineConfig } from "vitest/config";

      export default defineConfig({
        test: {
          setupFiles: ["tests/setup.ts"],
        },
      });

  to add the custom matchers before each test run
*/
import { expect } from "vitest";
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
  toReceiveAnyCommand,
  toHaveReceivedAnyCommand,
  toReceiveCommandExactlyOnceWith,
  toHaveReceivedCommandExactlyOnceWith,
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
  toReceiveAnyCommand,
  toHaveReceivedAnyCommand,
  toReceiveCommandExactlyOnceWith,
  toHaveReceivedCommandExactlyOnceWith,
});
```

## Typescript support

> [!NOTE]
> If you're using the automatic setup with `import "aws-sdk-client-mock-vitest/extend"`, TypeScript declarations are automatically included and you can skip this section.

In case you are using typescript with manual setup, create a `vitest.d.ts` file with the following content

```javascript
// tests/vitest.d.ts
import "vitest";
import { CustomMatcher } from "aws-sdk-client-mock-vitest";

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatcher<T> {}
  interface AsymmetricMatchersContaining extends CustomMatcher {}
}
```

> [!TIP]
> If you are using `eslint` in your project you may want to add the following
> lines at the beginning of your `vitest.d.ts` file:
>
> ```javascript
> /* eslint-disable @typescript-eslint/no-empty-object-type */
> /* eslint-disable @typescript-eslint/no-explicit-any */
> ```

If you get the following error in your tests

```
Error: Invalid Chai property: toHaveReceivedCommandWith
```

Then you probably forgot to run `expect.extend` with the matcher you are using in your test (see above)

## Sample usage

Lets assume you have written a function to read a secret from the AWS Secrets
Manager. It may look like this:

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

Naturally we want to test this function to verify it either returns the secret
when found or raises an exception otherwise. But we do not want to do actual
AWS API calls. We can write a test with `vite` without doing any network requests
thanks to `aws-sdk-client-mock`. This test may look like this:

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

The test above verifies our `readSecret` function does indeed return the value
of the secret when the API response includes a `SecretString`. However we have
not validated we are actually retrieving the correct secret.

We may want to actually inspect our mock client to verify we sent
a specific command. We can do this with our custom expect matcher
`expect(mockClient).toHaveReceivedCommandWith(...)`.

To make use of it we are changing our testfile and registering
custom matchers

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

/* you can also run this in setupTests, see above */
expect.extend({ toHaveReceivedCommandWith });

/* You may want to put this in some vitest.d.ts, see above */
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

## Running test

In order to run tests locally, execute the following

```console
npm ci
npm run test:coverage
```

If you get an `ERR_INSPECTOR_NOT_AVAILABLE` error, make sure your nodejs is compiled with
`inspector` support. Otherwise run `npm run test` to skip code coverage

## Thank you

I would like to thank Maciej Radzikowski for the awesome `aws-sdk-client-mock` and
`aws-sdk-client-mock-jest` packages. These helped a lot testing AWS code and also
helped building this library
