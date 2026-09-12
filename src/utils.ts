export function asymmetricMatch<T extends object>(compareFn: (a: unknown, b: unknown) => boolean, sample: Partial<T>, other: T): boolean {
  let result = true;

  for (const property in sample) {
    if (!(property in other)) {
      result = false;
      break;
    }

    const value = sample[property];
    const otherValue = other[property];
    if (!compareFn(value, otherValue)) {
      result = false;
      break;
    }
  }

  return result;
}

export function indent(text: string, level: number): string {
  const pad = ' '.repeat(level);
  return text
    .split('\n')
    .map(line => line.length === 0 ? '' : `${pad}${line}`)
    .join('\n');
}

export function notNull<T>(obj: null | T): obj is T {
  return obj !== null;
}

export function notUndefined<T>(obj: T | undefined): obj is T {
  return obj !== undefined;
}

export function ordinalOf(n: number): string {
  const j = n % 10;
  const k = n % 100;
  const s = n.toString();
  if (j === 1 && k !== 11) return `${s}st`;
  if (j === 2 && k !== 12) return `${s}nd`;
  if (j === 3 && k !== 13) return `${s}rd`;
  return `${s}th`;
}
