function stringToHexArray(str) {
  // Encode string to UTF-8 bytes
  const utf8Bytes = new TextEncoder().encode(str);

  // Convert bytes to hex array
  const hexArray = [];
  for (const byte of utf8Bytes) {
    hexArray.push(byte.toString(16).padStart(2, '0').toUpperCase());
  }

  return hexArray; // Join the array elements with a space
}

// Decompress an LZW-encoded string
export default function lzw_decode(compressed) {
  // Building the dictionary.
  let dict = {};
  let data = (compressed + "").split("");
  let currentChar = data[0];
  let oldPhrase = currentChar;
  let out = [currentChar];
  let code = 256;
  let phrase;

  for (let i = 1; i < data.length; i++) {
      let currCode = data[i].charCodeAt(0);
      if (currCode < 256) {
          phrase = data[i];
      } else {
          phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currentChar);
      }
      out.push(phrase);
      currentChar = phrase.charAt(0);
      dict[code] = oldPhrase + currentChar;
      code++;
      oldPhrase = phrase;
  }

  return {
    string: out.join(""),
    hex:stringToHexArray(out.join(""))
  }
}