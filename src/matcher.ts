import type { MetadataBearer } from '@smithy/types';
import type {
  ExpectationResult,
  MatcherState,
} from '@vitest/expect';
import type { AwsCommand, AwsStub } from 'aws-sdk-client-mock';

import { ObjectContaining } from '@vitest/expect';

import { notNull, ordinalOf } from './utils.js';

/**
 * We define some aliases
 */
interface AliasMatcher<R> {
  toReceiveAnyCommand: BaseMatcher<R>['toHaveReceivedAnyCommand'];
  toReceiveCommand: BaseMatcher<R>['toHaveReceivedCommand'];
  toReceiveCommandExactlyOnceWith: BaseMatcher<R>['toHaveReceivedCommandExactlyOnceWith'];
  toReceiveCommandOnce: BaseMatcher<R>['toHaveReceivedCommandOnce'];
  toReceiveCommandTimes: BaseMatcher<R>['toHaveReceivedCommandTimes'];
  toReceiveCommandWith: BaseMatcher<R>['toHaveReceivedCommandWith'];
  toReceiveLastCommandWith: BaseMatcher<R>['toHaveReceivedLastCommandWith'];
  toReceiveNthCommandWith: BaseMatcher<R>['toHaveReceivedNthCommandWith'];
}

type AwsCommandConstructur<
  Input extends object,
  Output extends MetadataBearer,
> = new (input: Input) => AwsCommand<Input, Output>;

/**
 * This defines our matchers as they can be used in actual tests, see
 * https://vitest.dev/guide/extending-matchers.html#extending-matchers
 * for reference
 */
interface BaseMatcher<R> {
  toHaveReceivedAnyCommand(): R;

  toHaveReceivedCommand<Input extends object, Output extends MetadataBearer>(
    command: AwsCommandConstructur<Input, Output>
  ): R;

  toHaveReceivedCommandExactlyOnceWith<
    Input extends object,
    Output extends MetadataBearer,
  >(
    command: AwsCommandConstructur<Input, Output>,
    input: Partial<Input>
  ): R;

  toHaveReceivedCommandOnce<
    Input extends object,
    Output extends MetadataBearer,
  >(
    command: AwsCommandConstructur<Input, Output>
  ): R;

  toHaveReceivedCommandTimes<
    Input extends object,
    Output extends MetadataBearer,
  >(
    command: AwsCommandConstructur<Input, Output>,
    times: number
  ): R;

  toHaveReceivedCommandWith<
    Input extends object,
    Output extends MetadataBearer,
  >(
    command: AwsCommandConstructur<Input, Output>,
    input: Partial<Input>
  ): R;

  toHaveReceivedLastCommandWith<
    Input extends object,
    Output extends MetadataBearer,
  >(
    command: AwsCommandConstructur<Input, Output>,
    input: Partial<Input>
  ): R;

  toHaveReceivedNthCommandWith<
    Input extends object,
    Output extends MetadataBearer,
  >(
    command: AwsCommandConstructur<Input, Output>,
    times: number,
    input: Partial<Input>
  ): R;
}

type CustomMatcher<R = unknown> = AliasMatcher<R> & BaseMatcher<R>;

function formatCalls(
  context: MatcherState,
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any> | undefined,
  expectedCall: Record<string, any> | undefined,
  message: string,
): string {
  const clientName = client.clientName();
  const calls = command ? client.commandCalls(command) : client.calls();

  return calls.length === 0
    ? message
    : [
        message,
        '',
        'Received:',
        '',
        ...calls.flatMap((call, index) => {
          const arg = call.args[0];
          const name = command?.name ?? `${clientName} with ${arg.constructor.name}`;

          /* eslint-disable @typescript-eslint/no-unsafe-assignment */
          const input = arg.input;

          return [
            `   ${ordinalOf(index + 1)} ${name} call`,
            '',
            expectedCall
              ? context.utils.diff(expectedCall, input, { omitAnnotationLines: true })
              : context.utils
                  .stringify(input)
                  .split('\n')
                  .map(line => `    ${line}`)
                  .join('\n'),
            '',
          ].filter(notNull);
        }),
        `Number of calls: ${calls.length.toString()}`,
      ].join('\n');
}

function toHaveReceivedCommandTimes(
  this: MatcherState,
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>,
  times: number,
): ExpectationResult {
  const { isNot } = this;
  const callCount = client.commandCalls(command).length;
  const pass = callCount === times;

  return {
    message: () => {
      const message = isNot
        ? `expected "${command.name}" to not be called ${times.toString()} times`
        : `expected "${command.name}" to be called ${times.toString()} times, but got ${callCount.toString()} times`;
      return formatCalls(this, client, command, undefined, message);
    },
    pass,
  };
};
const toReceiveCommandTimes = toHaveReceivedCommandTimes;

function toHaveReceivedCommandOnce(
  this: MatcherState,
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>,
): ExpectationResult {
  const { isNot } = this;
  const callCount = client.commandCalls(command).length;
  const pass = callCount === 1;
  return {
    message: () => {
      const message = isNot
        ? `expected "${command.name}" to not be called once`
        : `expected "${command.name}" to be called once, but got ${callCount.toString()} times`;
      return formatCalls(this, client, command, undefined, message);
    },
    pass,
  };
};
const toReceiveCommandOnce = toHaveReceivedCommandOnce;

function toHaveReceivedCommand(
  this: MatcherState,
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>,
): ExpectationResult {
  const { isNot } = this;
  const callCount = client.commandCalls(command).length;
  const pass = callCount >= 1;
  return {
    message: () => {
      const message = isNot
        ? `expected "${command.name}" to not be called at all, but actually been called ${callCount.toString()} times`
        : `expected "${command.name}" to be called at least once`;
      return formatCalls(this, client, command, undefined, message);
    },
    pass,
  };
};
const toReceiveCommand = toHaveReceivedCommand;

function toHaveReceivedCommandWith(
  this: MatcherState,
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>,
  input: Record<string, any>,
): ExpectationResult {
  const { isNot, utils } = this;
  const calls = client.commandCalls(command);

  const pass = calls.some(call =>
    new ObjectContaining(input).asymmetricMatch(call.args[0].input),
  );

  return {
    message: () => {
      const message = isNot
        ? `expected "${command.name}" to not be called with arguments: ${utils.printExpected(input)}`
        : `expected "${command.name}" to be called with arguments: ${utils.printExpected(input)}`;
      return formatCalls(this, client, command, input, message);
    },
    pass,
  };
};
const toReceiveCommandWith = toHaveReceivedCommandWith;

function toHaveReceivedCommandExactlyOnceWith(
  this: MatcherState,
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>,
  input: Record<string, any>,
): ExpectationResult {
  const { isNot, utils } = this;
  const calls = client.commandCalls(command);

  const hasCallWithArgs = calls.some(call =>
    new ObjectContaining(input).asymmetricMatch(call.args[0].input),
  );

  const pass = calls.length === 1 && hasCallWithArgs;

  return {
    message: () => {
      const message = isNot
        ? `expected "${command.name}" to not be called once with arguments: ${utils.printExpected(input)}`
        : `expected "${command.name}" to be called once with arguments: ${utils.printExpected(input)}`;
      return formatCalls(this, client, command, input, message);
    },
    pass,
  };
};
const toReceiveCommandExactlyOnceWith = toHaveReceivedCommandExactlyOnceWith;

function toHaveReceivedNthCommandWith(
  this: MatcherState,
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>,
  times: number,
  input: Record<string, any>,
): ExpectationResult {
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
    pass,
  };
};
const toReceiveNthCommandWith = toHaveReceivedNthCommandWith;

function toHaveReceivedLastCommandWith(
  this: MatcherState,
  client: AwsStub<any, any, any>,
  command: AwsCommandConstructur<any, any>,
  input: Record<string, any>,
): ExpectationResult {
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
    pass,
  };
};
const toReceiveLastCommandWith = toHaveReceivedLastCommandWith;

function toHaveReceivedAnyCommand(
  this: MatcherState,
  client: AwsStub<any, any, any>,
) {
  const { isNot } = this;
  const calls = client.calls();
  const pass = calls.length > 0;

  return {
    message: () => {
      const message = isNot
        ? `expected client "${client.clientName()}" to not receive any calls, but was called`
        : `expected client "${client.clientName()}" to have been called, but was not called`;
      return formatCalls(this, client, undefined, undefined, message);
    },
    pass,
  };
}
const toReceiveAnyCommand = toHaveReceivedAnyCommand;

const allCustomMatcher = {
  toHaveReceivedAnyCommand,
  toHaveReceivedCommand,
  toHaveReceivedCommandExactlyOnceWith,
  toHaveReceivedCommandOnce,
  toHaveReceivedCommandTimes,
  toHaveReceivedCommandWith,
  toHaveReceivedLastCommandWith,
  toHaveReceivedNthCommandWith,
};

const allCustomMatcherWithAliases = {
  ...allCustomMatcher,
  toReceiveAnyCommand,
  toReceiveCommand,
  toReceiveCommandExactlyOnceWith,
  toReceiveCommandOnce,
  toReceiveCommandTimes,
  toReceiveCommandWith,
  toReceiveLastCommandWith,
  toReceiveNthCommandWith,
};

export type { CustomMatcher };
export {
  allCustomMatcher,
  allCustomMatcherWithAliases,
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
};
