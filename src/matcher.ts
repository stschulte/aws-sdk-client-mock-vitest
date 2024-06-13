import type { MetadataBearer } from "@smithy/types";
import type {
  ExpectationResult,
  MatcherState,
} from "@vitest/expect";
import type { AwsCommand, AwsStub } from "aws-sdk-client-mock";

import { ObjectContaining } from "@vitest/expect";

import { notNull, ordinalOf } from "./utils.js";

type AwsCommandConstructur<
  Input extends object,
  Output extends MetadataBearer
> = new (input: Input) => AwsCommand<Input, Output>;

/*
  unfortunately RawMatcherFn from @vitest/expect defines a matcher like this

      (this: T, received: any, expected: any, options?: any): ExpectationResult;

  this does not work in our case since we may get multiple values for expected,
  e.g.

      toHaveReceivedNthCommandWith(PutObjectCommand, 2, {
        Bucket: "foo",
        Key: "test2.txt",
      });
*/
type CustomMatcherFn = (this: MatcherState, ...args: any) => ExpectationResult;

/**
 * This defines our matchers as they can be used in actual tests, see
 * https://vitest.dev/guide/extending-matchers.html#extending-matchers
 * for reference
 */
interface BaseMatcher<R> {
  toHaveReceivedCommand<Input extends object, Ouptut extends MetadataBearer>(
    command: AwsCommandConstructur<Input, Ouptut>
  ): R;

  toHaveReceivedCommandOnce<
    Input extends object,
    Ouptut extends MetadataBearer
  >(
    command: AwsCommandConstructur<Input, Ouptut>
  ): R;

  toHaveReceivedCommandTimes<
    Input extends object,
    Ouptut extends MetadataBearer
  >(
    command: AwsCommandConstructur<Input, Ouptut>,
    times: number
  ): R;

  toHaveReceivedCommandWith<
    Input extends object,
    Ouptut extends MetadataBearer
  >(
    command: AwsCommandConstructur<Input, Ouptut>,
    input: Partial<Input>
  ): R;

  toHaveReceivedLastCommandWith<
    Input extends object,
    Ouptut extends MetadataBearer
  >(
    command: AwsCommandConstructur<Input, Ouptut>,
    input: Partial<Input>
  ): R;

  toHaveReceivedNthCommandWith<
    Input extends object,
    Ouptut extends MetadataBearer
  >(
    command: AwsCommandConstructur<Input, Ouptut>,
    times: number,
    input: Partial<Input>
  ): R;
}

/**
 * We define some aliases
 */
interface AliasMatcher<R> {
  toReceiveCommand: BaseMatcher<R>["toHaveReceivedCommand"];
  toReceiveCommandOnce: BaseMatcher<R>["toHaveReceivedCommandOnce"];
  toReceiveCommandTimes: BaseMatcher<R>["toHaveReceivedCommandTimes"];
  toReceiveCommandWith: BaseMatcher<R>["toHaveReceivedCommandWith"];
  toReceiveLastCommandWith: BaseMatcher<R>["toHaveReceivedLastCommandWith"];
  toReceiveNthCommandWith: BaseMatcher<R>["toHaveReceivedNthCommandWith"];
}

type CustomMatcher<R = unknown> = AliasMatcher<R> & BaseMatcher<R>;

function formatCalls(
  context: MatcherState,
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>,
  expectedCall: Record<string, any> | undefined,
  message: string
): string {
  const calls = client.commandCalls(command);

  return calls.length === 0
    ? message
    : [
      message,
      "",
      "Received:",
      "",
      ...calls.flatMap((call, index) => {
        const input = call.args[0].input;
        return [
          `   ${ordinalOf(index + 1)} ${command.name} call`,
          "",
          expectedCall
            ? context.utils.diff(expectedCall, input, { omitAnnotationLines: true })
            : context.utils
              .stringify(input)
              .split("\n")
              .map(line => `    ${line}`)
              .join("\n"),
          ""
        ].filter(notNull);
      }),
      `Number of calls: ${calls.length}`
    ].join("\n");
}

const toHaveReceivedCommandTimes: CustomMatcherFn = function(
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>,
  times: number
) {
  const { isNot } = this;
  const callCount = client.commandCalls(command).length;
  const pass = callCount === times;

  return {
    message: () => {
      const message = isNot
        ? `expected "${command.name}" to not be called ${times} times`
        : `expected "${command.name}" to be called ${times} times, but got ${callCount} times`;
      return formatCalls(this, client, command, undefined, message);
    },
    pass
  };
};
const toReceiveCommandTimes = toHaveReceivedCommandTimes;

const toHaveReceivedCommandOnce: CustomMatcherFn = function(
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>
) {
  const { isNot } = this;
  const callCount = client.commandCalls(command).length;
  const pass = callCount === 1;
  return {
    message: () => {
      const message = isNot
        ? `expected "${command.name}" to not be called once`
        : `expected "${command.name}" to be called once, but got ${callCount} times`;
      return formatCalls(this, client, command, undefined, message);
    },
    pass
  };
};
const toReceiveCommandOnce = toHaveReceivedCommandOnce;

const toHaveReceivedCommand: CustomMatcherFn = function(
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>
) {
  const { isNot } = this;
  const callCount = client.commandCalls(command).length;
  const pass = callCount >= 1;
  return {
    message: () => {
      const message = isNot
        ? `expected "${command.name}" to not be called at all, but actually been called ${callCount} times`
        : `expected "${command.name}" to be called at least once`;
      return formatCalls(this, client, command, undefined, message);
    },
    pass
  };
};
const toReceiveCommand = toHaveReceivedCommand;

const toHaveReceivedCommandWith: CustomMatcherFn = function(
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>,
  input: Record<string, any>
) {
  const { isNot, utils } = this;
  const calls = client.commandCalls(command);

  const pass = calls.some(call =>
    new ObjectContaining(input).asymmetricMatch(call.args[0].input)
  );

  return {
    message: () => {
      const message = isNot
        ? `expected "${command.name}" to not be called with arguments: ${utils.printExpected(input)}`
        : `expected "${command.name}" to be called with arguments: ${utils.printExpected(input)}`;
      return formatCalls(this, client, command, input, message);
    },
    pass
  };
};
const toReceiveCommandWith = toHaveReceivedCommandWith;
/*

  */
const toHaveReceivedNthCommandWith: CustomMatcherFn = function(
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>,
  times: number,
  input: Record<string, any>
) {
  const { isNot, utils } = this;
  const calls = client.commandCalls(command);

  const call = calls.length < times ? undefined : calls[times - 1];
  const pass = call
    ? new ObjectContaining(input).asymmetricMatch(call.args[0].input)
    : false;

  return {
    message: () => {
      const message = isNot
        ? `expected ${ordinalOf(times)} "${command.name}" to not be called with arguments: ${utils.printExpected(input)}`
        : `expected ${ordinalOf(times)} "${command.name}" to be called with arguments: ${utils.printExpected(input)}`;
      return formatCalls(this, client, command, input, message);
    },
    pass
  };
};
const toReceiveNthCommandWith = toHaveReceivedNthCommandWith;

const toHaveReceivedLastCommandWith: CustomMatcherFn = function(
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>,
  input: Record<string, any>
) {
  const { isNot, utils } = this;
  const calls = client.commandCalls(command);

  const call = calls.length === 0 ? undefined : calls[calls.length - 1];
  const pass = call
    ? new ObjectContaining(input).asymmetricMatch(call.args[0].input)
    : false;

  return {
    message: () => {
      const message = isNot
        ? `expected last "${command.name}" to not be called with arguments: ${utils.printExpected(input)}`
        : `expected last "${command.name}" to be called with arguments: ${utils.printExpected(input)}`;
      return formatCalls(this, client, command, input, message);
    },
    pass
  };
};
const toReceiveLastCommandWith = toHaveReceivedLastCommandWith;

export type { CustomMatcher }
export {
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
  toReceiveNthCommandWith
};
