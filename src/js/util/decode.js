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
export default function lzw_decode(s) {
  const dict = {};
  const data = (s + "").split("");
  let currChar = data[0];
  let oldPhrase = currChar;
  const out = [currChar];
  let code = 256;
  let phrase;
  for (let i=1; i<data.length; i++) {
      const currCode = data[i].charCodeAt(0);
      if (currCode < 256) {
          phrase = data[i];
      }
      else {
        phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
      }
      out.push(phrase);
      currChar = phrase.charAt(0);
      dict[code] = oldPhrase + currChar;
      code++;
      oldPhrase = phrase;
  }
  out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
  let animCycle = []
  for (let i=0; i<out.length; i++) {
    out[i] = String.fromCharCode(out[i]);
    // animCycle.push(out.join(''));
  }
  const hex = stringToHexArray(out.join(''))
  return {string:out, hex:hex };
}
