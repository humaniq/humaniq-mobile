export const zeroToHexZero = (v: string): string => {
  if (v === '0') {
    return `0x0`;
  }
  return v;
};

export const parseAsInt = (v: string): number => {
  if (v === '0x') {
    return 0;
  }
  if (v.startsWith('0x')) {
    return parseInt(v, 16);
  }
  return parseInt(v, 10);
};

export const parseHexAsBigInt = (v: string | number): bigint => {
  if (typeof v === 'string') {
    if (v === '0x') {
      return BigInt(0);
    }
    if (!v.startsWith('0x')) {
      return BigInt(`0x${v}`);
    }
    return BigInt(v);
  } else {
    return BigInt(v);
  }
};

export const bigIntToHexString = (v: bigint): string => {
  return `0x${v.toString(16)}`;
};

export const bigIntToDecimalString = (v: bigint): string => {
  return `0x${v.toString(16)}`;
};

const byteToHex: string[] = [];

for (let n = 0; n <= 0xff; ++n) {
  const hexOctet = n.toString(16).padStart(2, '0');
  byteToHex.push(hexOctet);
}

export const uintBufferToHex = (buff: Uint8Array): string => {
  const hexOctets = []; // new Array(buff.length) is even faster (preallocates necessary array size), then use hexOctets[i] instead of .push()
  for (let i = 0; i < buff.length; ++i) hexOctets.push(byteToHex[buff[i]]);
  return hexOctets.join('');
};

export const hexStringToBuffer = (str: string): Buffer => {
  return Buffer.from(str.replace('0x', ''), 'hex');
};
