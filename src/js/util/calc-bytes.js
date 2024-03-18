export default function calculateBytes(str) {
  let bytes = 0;
  for (let i = 0; i < str.length; i++) {
    const codePoint = str.charCodeAt(i);
    if (codePoint < 0x80) {
      bytes += 1;
    } else if (codePoint < 0x800) {
      bytes += 2;
    } else if (codePoint < 0xD800 || codePoint >= 0xE000) {
      bytes += 3;
    } else {
      // Surrogate pair means 4 bytes
      i++; // Skip the next code unit since it's part of the surrogate pair
      bytes += 4;
    }
  }
  return bytes;
}
