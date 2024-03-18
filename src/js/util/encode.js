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

export default function lzw_encode(s) {
  const dict = {};
  const data = (s + "").split("");
  const out = [];
  let currChar;
  let phrase = data[0];
  let code = 256;
  for (let i=1; i<data.length; i++) {
      currChar=data[i];
      if (dict[phrase + currChar] != null) {
          phrase += currChar;
      }
      else {
          out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
          dict[phrase + currChar] = code;
          code++;
          phrase=currChar;
      }
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

