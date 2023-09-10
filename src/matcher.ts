import type { AwsCommand, AwsStub } from "aws-sdk-client-mock";
import {
  MatcherState,
  ObjectContaining,
  ExpectationResult,
} from "@vitest/expect";
import { MetadataBearer } from "@smithy/types";
import { notNull, ordinalOf } from "./utils";

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
  toHaveReceivedCommandTimes<
    Input extends object,
    Ouptut extends MetadataBearer
  >(
    command: AwsCommandConstructur<Input, Ouptut>,
    times: number
  ): R;

  toHaveReceivedCommandOnce<
    Input extends object,
    Ouptut extends MetadataBearer
  >(
    command: AwsCommandConstructur<Input, Ouptut>
  ): R;

  toHaveReceivedCommand<Input extends object, Ouptut extends MetadataBearer>(
    command: AwsCommandConstructur<Input, Ouptut>
  ): R;

  toHaveReceivedCommandWith<
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

  toHaveReceivedLastCommandWith<
    Input extends object,
    Ouptut extends MetadataBearer
  >(
    command: AwsCommandConstructur<Input, Ouptut>,
    input: Partial<Input>
  ): R;
}

/**
 * We define some aliases
 */
interface AliasMatcher<R> {
  toReceiveCommandTimes: BaseMatcher<R>["toHaveReceivedCommandTimes"];
  toReceiveCommandOnce: BaseMatcher<R>["toHaveReceivedCommandOnce"];
  toReceiveCommand: BaseMatcher<R>["toHaveReceivedCommand"];
  toReceiveCommandWith: BaseMatcher<R>["toHaveReceivedCommandWith"];
  toReceiveNthCommandWith: BaseMatcher<R>["toHaveReceivedNthCommandWith"];
  toReceiveLastCommandWith: BaseMatcher<R>["toHaveReceivedLastCommandWith"];
}

type CustomMatcher<R = unknown> = BaseMatcher<R> & AliasMatcher<R>;

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
              ? context.utils.diff(expectedCall, input, {
                  omitAnnotationLines: true,
                })
              : context.utils
                  .stringify(input)
                  .split("\n")
                  .map((line) => `    ${line}`)
                  .join("\n"),
            "",
          ].filter(notNull);
        }),
        `Number of calls: ${calls.length}`,
      ].join("\n");
}

const toHaveReceivedCommandTimes: CustomMatcherFn = function (
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>,
  times: number
) {
  const { isNot } = this;
  const callCount = client.commandCalls(command).length;
  const pass = callCount === times;

  return {
    pass,
    message: () => {
      const message = isNot
        ? `expected "${command.name}" to not be called ${times} times`
        : `expected "${command.name}" to be called ${times} times, but got ${callCount} times`;
      return formatCalls(this, client, command, undefined, message);
    },
  };
};
const toReceiveCommandTimes = toHaveReceivedCommandTimes;

const toHaveReceivedCommandOnce: CustomMatcherFn = function (
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>
) {
  const { isNot } = this;
  const callCount = client.commandCalls(command).length;
  const pass = callCount === 1;
  return {
    pass,
    message: () => {
      const message = isNot
        ? `expected "${command.name}" to not be called once`
        : `expected "${command.name}" to be called once, but got ${callCount} times`;
      return formatCalls(this, client, command, undefined, message);
    },
  };
};
const toReceiveCommandOnce = toHaveReceivedCommandOnce;

const toHaveReceivedCommand: CustomMatcherFn = function (
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>
) {
  const { isNot } = this;
  const callCount = client.commandCalls(command).length;
  const pass = callCount >= 1;
  return {
    pass,
    message: () => {
      const message = isNot
        ? `expected "${command.name}" to not be called at all, but actually been called ${callCount} times`
        : `expected "${command.name}" to be called at least once`;
      return formatCalls(this, client, command, undefined, message);
    },
  };
};
const toReceiveCommand = toHaveReceivedCommand;

const toHaveReceivedCommandWith: CustomMatcherFn = function (
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>,
  input: Record<string, any>
) {
  const { isNot, utils } = this;
  const calls = client.commandCalls(command);

  const pass = calls.some((call) =>
    new ObjectContaining(input).asymmetricMatch(call.args[0].input)
  );

  return {
    pass,
    message: () => {
      const message = isNot
        ? `expected "${
            command.name
          }" to not be called with arguments: ${utils.printExpected(input)}`
        : `expected "${
            command.name
          }" to be called with arguments: ${utils.printExpected(input)}`;
      return formatCalls(this, client, command, input, message);
    },
  };
};
const toReceiveCommandWith = toHaveReceivedCommandWith;
/*

  */
const toHaveReceivedNthCommandWith: CustomMatcherFn = function (
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>,
  times: number,
  input: Record<string, any>
) {
  const { isNot, utils } = this;
  const calls = client.commandCalls(command);

  const call = calls.length <= times ? undefined : calls[times - 1];
  const pass = call
    ? new ObjectContaining(input).asymmetricMatch(call.args[0].input)
    : false;

  return {
    pass,
    message: () => {
      const message = isNot
        ? `expected ${ordinalOf(times)} "${
            command.name
          }" to not be called with arguments: ${utils.printExpected(input)}`
        : `expected ${ordinalOf(times)} "${
            command.name
          }" to be called with arguments: ${utils.printExpected(input)}`;
      return formatCalls(this, client, command, input, message);
    },
  };
};
const toReceiveNthCommandWith = toHaveReceivedNthCommandWith;

const toHaveReceivedLastCommandWith: CustomMatcherFn = function (
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
        ? `expected last "${
            command.name
          }" to not be called with arguments: ${utils.printExpected(input)}`
        : `expected last "${
            command.name
          }" to be called with arguments: ${utils.printExpected(input)}`;
      return formatCalls(this, client, command, input, message);
    },
    pass,
  };
};
const toReceiveLastCommandWith = toHaveReceivedLastCommandWith;

export {
  CustomMatcher,
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
};
