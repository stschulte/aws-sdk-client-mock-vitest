export function ordinalOf(n: number): string {
  const j = n % 10;
  const k = n % 100;
  const s = n.toString();
  if (j === 1 && k !== 11) return `${s}st`;
  if (j === 2 && k !== 12) return `${s}nd`;
  if (j === 3 && k !== 13) return `${s}rd`;
  return `${s}th`;
}

export function notNull<T>(obj: null | T): obj is T {
  return obj !== null;
}
