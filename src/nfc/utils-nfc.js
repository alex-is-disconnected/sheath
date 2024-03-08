import crypto from 'crypto';

export function convertUint8ToHex(data) {
  // Convert each byte in the Uint8Array to a hexadecimal string
  const hexArray = Array.from(data).map((byte) =>
    byte.toString(16).padStart(2, "0")
  );
  return hexArray;
}

export function decrypt(key, data, iv = Buffer.alloc(8).fill(0)) {
  const decipher = crypto.createDecipheriv("DES-EDE-CBC", key, iv);
  decipher.setAutoPadding(false);

  return Buffer.concat([decipher.update(data), decipher.final()]);
}

export function encrypt(key, data, iv = Buffer.alloc(8).fill(0)) {
  const decipher = crypto.createCipheriv("DES-EDE-CBC", key, iv);
  decipher.setAutoPadding(false);

  return Buffer.concat([decipher.update(data), decipher.final()]);
}

export function wrap (cmd, dataIn) { 
  return [
    0x90,
    cmd,
    0x00,
    0x00,
    dataIn.length,
    ...dataIn,
    0x00,
  ];  
}

export function numberTo3ByteHexLE(number) {
  // Convert the number to a hexadecimal string, removing the '0x' prefix
  let hexString = number.toString(16);
  // Pad the string to ensure it is at least 6 characters (3 bytes) long, then slice to get the last 6 characters
  hexString = hexString.padStart(6, "0").slice(-6);
  // Reverse the hex string to account for little endian format
  const hexChunks = [];
  for (let i = 0; i < hexString.length; i += 2) {
    // Convert each chunk back into a number and unshift to hexChunks array for little endian order
    hexChunks.unshift(parseInt(hexString.substring(i, i + 2), 16));
  }
  // Now hexChunks contains numbers in little endian order
  return hexChunks;
}