//merkle patricia trie utils

export type ByteTuple = [number, number];

export const getNibbles = (bytes: Uint8Array): ByteTuple[] => {
  const res: ByteTuple[] = [];
  for (const byte of bytes) {
    res.push([(byte >> 4) & 0x0f, byte & 0x0f]);
  }
  return res;
};

export const zip = (a: Array<any>, b: Array<any>) =>
  Array(Math.min(b.length, a.length))
    .fill(0)
    .map((_, i) => [a[i], b[i]]);

export type commonPrefixData<T> = {
  commonPrefix: T[];
  leftReminder: T[];
  rightReminder: T[];
};

export const getCommonPrefixLength = <T>(leftKey: T[], rightKey: T[]): number => {
  const zippedVals = zip(leftKey, rightKey);
  for (let i = 0; i < zippedVals.length; i++) {
    if (zippedVals[i][0] != zippedVals[i][1]) {
      return i;
    }
  }
  return Math.min(leftKey.length, rightKey.length);
};

export const consumeCommonPrefix = <T>(leftKey: T[], rightKey: T[]): commonPrefixData<T> => {
  const commonPrefixLength = getCommonPrefixLength(leftKey, rightKey);
  return {
    commonPrefix: leftKey.slice(0, commonPrefixLength),
    leftReminder: leftKey.slice(commonPrefixLength),
    rightReminder: rightKey.slice(commonPrefixLength)
  };
};
