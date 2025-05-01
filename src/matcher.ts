import type { MetadataBearer } from '@smithy/types';
import type {
  ExpectationResult,
  MatcherState,
} from '@vitest/expect';
import type { AwsCommand, AwsStub } from 'aws-sdk-client-mock';

import { ObjectContaining } from '@vitest/expect';

import { notUndefined, ordinalOf } from './utils.js';

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

type AwsCommandConstructor<
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
    command: AwsCommandConstructor<Input, Output>
  ): R;

  toHaveReceivedCommandExactlyOnceWith<
    Input extends object,
    Output extends MetadataBearer,
  >(
    command: AwsCommandConstructor<Input, Output>,
    input: Partial<Input>
  ): R;

  toHaveReceivedCommandOnce<
    Input extends object,
    Output extends MetadataBearer,
  >(
    command: AwsCommandConstructor<Input, Output>
  ): R;

  toHaveReceivedCommandTimes<
    Input extends object,
    Output extends MetadataBearer,
  >(
    command: AwsCommandConstructor<Input, Output>,
    times: number
  ): R;

  toHaveReceivedCommandWith<
    Input extends object,
    Output extends MetadataBearer,
  >(
    command: AwsCommandConstructor<Input, Output>,
    input: Partial<Input>
  ): R;

  toHaveReceivedLastCommandWith<
    Input extends object,
    Output extends MetadataBearer,
  >(
    command: AwsCommandConstructor<Input, Output>,
    input: Partial<Input>
  ): R;

  toHaveReceivedNthCommandWith<
    Input extends object,
    Output extends MetadataBearer,
  >(
    command: AwsCommandConstructor<Input, Output>,
    times: number,
    input: Partial<Input>
  ): R;
}

type CustomMatcher<R = unknown> = AliasMatcher<R> & BaseMatcher<R>;

export function formatCalls<Input extends object, Output extends MetadataBearer, TCmdInput extends Input, TCmdOutput extends Output>(
  message: string,
  client: AwsStub<Input, Output, unknown>,
  command: AwsCommandConstructor<TCmdInput, TCmdOutput> | undefined,
  expectedCall: TCmdInput | undefined,
  utils: {
    diff: MatcherState['utils']['diff'];
    stringify: MatcherState['utils']['stringify'];
  },
): string {
  const clientName = client.clientName();
  const calls = command ? client.commandCalls(command) : client.calls();
  const { diff, stringify } = utils;

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

          const input = arg.input;

          return [
            `   ${ordinalOf(index + 1)} ${name} call`,
            '',
            expectedCall
              ? diff(expectedCall, input, { omitAnnotationLines: true })
              : stringify(input)
                  .split('\n')
                  .map(line => `    ${line}`)
                  .join('\n'),
            '',
          ].filter(notUndefined);
        }),
        `Number of calls: ${calls.length.toString()}`,
      ].join('\n');
}

function toHaveReceivedCommandTimes<Input extends object, Output extends MetadataBearer>(
  this: MatcherState,
  client: AwsStub<Input, Output, unknown>,
  command: AwsCommandConstructor<Input, Output>,
  times: number,
): ExpectationResult {
  const { isNot } = this;
  const { diff, stringify } = this.utils;

  const callCount = client.commandCalls(command).length;
  const pass = callCount === times;

  return {
    message() {
      const message = isNot
        ? `expected "${command.name}" to not be called ${times.toString()} times`
        : `expected "${command.name}" to be called ${times.toString()} times, but got ${callCount.toString()} times`;
      return formatCalls(message, client, command, undefined, { diff, stringify });
    },
    pass,
  };
};
const toReceiveCommandTimes = toHaveReceivedCommandTimes;

function toHaveReceivedCommandOnce<Input extends object, Output extends MetadataBearer>(
  this: MatcherState,
  client: AwsStub<Input, Output, unknown>,
  command: AwsCommandConstructor<Input, Output>,
): ExpectationResult {
  const { isNot } = this;
  const { diff, stringify } = this.utils;

  const callCount = client.commandCalls(command).length;
  const pass = callCount === 1;
  return {
    message() {
      const message = isNot
        ? `expected "${command.name}" to not be called once`
        : `expected "${command.name}" to be called once, but got ${callCount.toString()} times`;
      return formatCalls(message, client, command, undefined, { diff, stringify });
    },
    pass,
  };
};
const toReceiveCommandOnce = toHaveReceivedCommandOnce;

function toHaveReceivedCommand<Input extends object, Output extends MetadataBearer>(
  this: MatcherState,
  client: AwsStub<Input, Output, unknown>,
  command: AwsCommandConstructor<Input, Output>,
): ExpectationResult {
  const { isNot } = this;
  const { diff, stringify } = this.utils;

  const callCount = client.commandCalls(command).length;
  const pass = callCount >= 1;
  return {
    message() {
      const message = isNot
        ? `expected "${command.name}" to not be called at all, but actually been called ${callCount.toString()} times`
        : `expected "${command.name}" to be called at least once`;
      return formatCalls(message, client, command, undefined, { diff, stringify });
    },
    pass,
  };
};
const toReceiveCommand = toHaveReceivedCommand;

function toHaveReceivedCommandWith<Input extends object, Output extends MetadataBearer>(
  this: MatcherState,
  client: AwsStub<Input, Output, unknown>,
  command: AwsCommandConstructor<Input, Output>,
  input: Input & Record<string, unknown>,
): ExpectationResult {
  const { isNot } = this;
  const { diff, printExpected, stringify } = this.utils;

  const calls = client.commandCalls(command);

  const pass = calls.some(call =>
    new ObjectContaining(input).asymmetricMatch(call.args[0].input),
  );

  return {
    message() {
      const message = isNot
        ? `expected "${command.name}" to not be called with arguments: ${printExpected(input)}`
        : `expected "${command.name}" to be called with arguments: ${printExpected(input)}`;
      return formatCalls(message, client, command, input, { diff, stringify });
    },
    pass,
  };
};
const toReceiveCommandWith = toHaveReceivedCommandWith;

function toHaveReceivedCommandExactlyOnceWith<Input extends object, Output extends MetadataBearer>(
  this: MatcherState,
  client: AwsStub<Input, Output, unknown>,
  command: AwsCommandConstructor<Input, Output>,
  input: Input & Record<string, unknown>,
): ExpectationResult {
  const { isNot } = this;
  const { diff, printExpected, stringify } = this.utils;

  const calls = client.commandCalls(command);

  const hasCallWithArgs = calls.some(call =>
    new ObjectContaining(input).asymmetricMatch(call.args[0].input),
  );

  const pass = calls.length === 1 && hasCallWithArgs;

  return {
    message() {
      const message = isNot
        ? `expected "${command.name}" to not be called once with arguments: ${printExpected(input)}`
        : `expected "${command.name}" to be called once with arguments: ${printExpected(input)}`;
      return formatCalls(message, client, command, input, { diff, stringify });
    },
    pass,
  };
};
const toReceiveCommandExactlyOnceWith = toHaveReceivedCommandExactlyOnceWith;

function toHaveReceivedNthCommandWith<Input extends object, Output extends MetadataBearer>(
  this: MatcherState,
  client: AwsStub<Input, Output, unknown>,
  command: AwsCommandConstructor<Input, Output>,
  times: number,
  input: Input & Record<string, unknown>,
): ExpectationResult {
  const { isNot } = this;
  const { diff, printExpected, stringify } = this.utils;

  const calls = client.commandCalls(command);

  const call = calls.length < times ? undefined : calls[times - 1];
  const pass = call
    ? new ObjectContaining(input).asymmetricMatch(call.args[0].input)
    : false;

  return {
    message() {
      const message = isNot
        ? `expected ${ordinalOf(times)} "${command.name}" to not be called with arguments: ${printExpected(input)}`
        : `expected ${ordinalOf(times)} "${command.name}" to be called with arguments: ${printExpected(input)}`;
      return formatCalls(message, client, command, input, { diff, stringify });
    },
    pass,
  };
};
const toReceiveNthCommandWith = toHaveReceivedNthCommandWith;

function toHaveReceivedLastCommandWith<Input extends object, Output extends MetadataBearer>(
  this: MatcherState,
  client: AwsStub<Input, Output, unknown>,
  command: AwsCommandConstructor<Input, Output>,
  input: Input & Record<string, unknown>,
): ExpectationResult {
  const { isNot } = this;
  const { diff, printExpected, stringify } = this.utils;

  const calls = client.commandCalls(command);

  const call = calls.length === 0 ? undefined : calls[calls.length - 1];
  const pass = call
    ? new ObjectContaining(input).asymmetricMatch(call.args[0].input)
    : false;

  return {
    message() {
      const message = isNot
        ? `expected last "${command.name}" to not be called with arguments: ${printExpected(input)}`
        : `expected last "${command.name}" to be called with arguments: ${printExpected(input)}`;
      return formatCalls(message, client, command, input, { diff, stringify });
    },
    pass,
  };
};
const toReceiveLastCommandWith = toHaveReceivedLastCommandWith;

function toHaveReceivedAnyCommand(
  this: MatcherState,
  client: AwsStub<object, MetadataBearer, unknown>,
) {
  const { isNot } = this;
  const { diff, stringify } = this.utils;

  const calls = client.calls();
  const pass = calls.length > 0;

  return {
    message() {
      const message = isNot
        ? `expected client "${client.clientName()}" to not receive any calls, but was called`
        : `expected client "${client.clientName()}" to have been called, but was not called`;
      return formatCalls(message, client, undefined, undefined, { diff, stringify });
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
