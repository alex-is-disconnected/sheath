"use strict";

// #############
// Example: MIFARE DESFire
// - what is covered:
//   - 3DES authentication
//   - reading data files
// - known issue:
//   - [mac0S Sierra and greater] when an error occurs during the authentication process,
//     the NFC must be reinitialized or the reader reconnected
//     in order to allow subsequent successful operations (TODO: add appropriate links, fix and test)
// #############

import { NFC } from './nfc-modules.js'
// import crypto from 'crypto';

// config

function convertUint8ToHex(data) {
  // Convert each byte in the Uint8Array to a hexadecimal string
  const hexArray = Array.from(data).map((byte) =>
    byte.toString(16).padStart(2, "0")
  );
  return hexArray;
}

function decrypt(key, data, iv = Buffer.alloc(8).fill(0)) {
  // const decipher = crypto.createDecipheriv("DES-EDE-CBC", key, iv);
  decipher.setAutoPadding(false);

  return Buffer.concat([decipher.update(data), decipher.final()]);
}

function encrypt(key, data, iv = Buffer.alloc(8).fill(0)) {
  // const decipher = crypto.createCipheriv("DES-EDE-CBC", key, iv);
  decipher.setAutoPadding(false);

  return Buffer.concat([decipher.update(data), decipher.final()]);
}

const desfire = {
  key: "00000000000000000000000000000000",
  appId: [0x3d, 0xda, 0x70],
  //appId: [0xAB, 0x04, 0x36],

  keyId: [0x00],
  read: {
    // supply location of an existing data
    fileId: [0x02],
    offset: [0x00, 0x00, 0x00],
    length: [0x40, 0x00, 0x00],
  },
};

const nfc = new NFC();

nfc.on("reader", async (reader) => {
  console.log(`device attached`, reader);

  // we have to handle MIFARE DESFire
  reader.autoProcessing = false;

  // just handy shortcut to send data
  const send = async (cmd, comment = null, responseMaxLength = 40) => {
    const b = Buffer.from(cmd);

    console.log((comment ? `[${comment}] ` : "") + `sending`, b);

    const data = await reader.transmit(b, responseMaxLength);

    // console.log((comment ? `[${comment}] ` : '') + `received data`, data);

    return data;
  };

  const wrap = (cmd, dataIn) => [
    0x90,
    cmd,
    0x00,
    0x00,
    dataIn.length,
    ...dataIn,
    0x00,
  ];

  reader.on("card", async (card) => {

    const selectApplication = async () => {
      // 1: [0x5A] SelectApplication(appId) [4 bytes] - Selects one specific application for further access
      // DataIn: appId (3 bytes)
      const allAppIds = await send([0x90, 0x6a, 0x00, 0x00, 0x00]);
      const mainAppId = allAppIds.slice(0, 3);
      desfire.appId = mainAppId;
      const res = await send(wrap(0x5a, desfire.appId), "step 1 - select app");

      console.log(convertUint8ToHex(res));
      // something went wrong
      if (res.slice(-1)[0] !== 0x00) {
        throw new Error("error in step 1");
      }
    };

    const authenticate = async (key) => {
      // 2: [0x0a] Authenticate(keyId) [2bytes]
      // DataIn: keyId (1 byte)
      const res1 = await send(
        wrap(0x0a, desfire.keyId),
        "step 2 - authenticate"
      );

      // something went wrong
      if (res1.slice(-1)[0] !== 0xaf) {
        throw new Error("error in step 2 - authenticate");
      }

      // encrypted RndB from reader
      // cut out status code (last 2 bytes)
      const ecRndB = res1.slice(0, -2);

      // decrypt it
      const RndB = decrypt(key, ecRndB);

      // rotate RndB
      const RndBp = Buffer.concat([RndB.slice(1, 8), RndB.slice(0, 1)]);

      // generate a 8 byte Random Number A
      // const RndA = crypto.randomBytes(8);

      // concat RndA and RndBp
      const msg = encrypt(key, Buffer.concat([RndA, RndBp]));

      // send it back to the reader
      const res2 = await send(wrap(0xaf, msg), "step 2 - set up RndA");

      // something went wrong
      if (res2.slice(-1)[0] !== 0x00) {
        throw new Error("error in step 2 - set up RndA");
      }

      // encrypted RndAp from reader
      // cut out status code (last 2 bytes)
      const ecRndAp = res2.slice(0, -2);

      // decrypt to get rotated value of RndA2
      const RndAp = decrypt(key, ecRndAp);

      // rotate
      const RndA2 = Buffer.concat([RndAp.slice(7, 8), RndAp.slice(0, 7)]);

      // compare decrypted RndA2 response from reader with our RndA
      // if it equals authentication process was successful
      if (!RndA.equals(RndA2)) {
        throw new Error("error in step 2 - match RndA random bytes");
      }

      return {
        RndA,
        RndB,
      };
    };

    function numberTo3ByteHexLE(number) {
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

    function stringToUint8Array(str) {
      // Use TextEncoder to convert the string to UTF-8 encoded bytes
      const encoder = new TextEncoder();
      const encoded = encoder.encode(str);
      
      // The encoded result is already a Uint8Array
      return encoded;
    }
    const chunkLength = 40;
    function chunkString(str) {
      const result = [];
      for (let i = 0; i < str.length; i += chunkLength) {
          // Slice the string into chunks of 'chunkLength' characters
          let chunk = str.substring(i, i + chunkLength);
          // Pad the last chunk with spaces if it's shorter than 'chunkLength'
          chunk = chunk.padEnd(chunkLength, ' ');
          result.push(chunk);
      }
      return result;
    }

    const writeData = async (message) => {
      // 3: [0xBD] ReadData(FileNo,Offset,Length) [8bytes] - Reads data from Standard Data Files or Backup Data Files
      // const res = await send(wrap(0xad, [desfire.read.fileId, ...desfire.read.offset, ...desfire.read.length]), 'step 3 - read', 400);
      const messageToWrite = message
      const chunkedMsg = chunkString(messageToWrite);
      for (let i = 0; i < chunkedMsg.length; i++) {
        const currentMsg = chunkedMsg[i];
        let currentOffset = i * chunkLength;
        let currentOffset3ByteHex = numberTo3ByteHexLE(currentOffset);
        desfire.read.offset = currentOffset3ByteHex;
        const currentMsgBuffer = stringToUint8Array(currentMsg);
        //console.log('message Buffer', currentMsgBuffer)
        const res = await send(
          wrap(0x3d, [
            desfire.read.fileId,
            ...desfire.read.offset,
            ...desfire.read.length,
            ...currentMsgBuffer
          ]),
          "step 3 - read",
          400
        );
        const res2 = await send(
          wrap(0x3d, [
            desfire.read.fileId,
            ...desfire.read.offset,
            ...desfire.read.length,
            ...currentMsgBuffer
          ]),
          "step 3 - read",
          400
        );
        console.log('response', res)
      }
      // something went wrong
      // if (res.slice(-1)[0] !== 0x00) {
      // 	throw new Error('error in step 3 - read');
      // }
      // let stringRepresentation = '';
      // for (let i = 0; i < combinedBufferMessage.length; i++) {
      // 		stringRepresentation += String.fromCharCode(combinedBufferMessage[i]);
      // }

    };

    const renderPage = async (hexData) => {
      console.log(hexData);

      function byteToHex(byte) {
        return byte.toString(16).padStart(2, "0");
      }

      function hexToAscii(data) {
        return Array.from(data)
          .map((byte) => {
            return byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : ".";
          })
          .join("");
      }

      const bytesPerLine = 16; // Adjust based on how many bytes you want per line
      const container = document.getElementById("hexDisplay");
			container.innerHTML = '';
      for (let offset = 0; offset < hexData.length; offset += bytesPerLine) {
        const lineData = hexData.slice(offset, offset + bytesPerLine);
        const hexChunks = Array.from(lineData).map((byte) => byteToHex(byte));

        // Create the line element
        const lineDiv = document.createElement("div");
        lineDiv.className = "hex-line";

        // Offset
        const offsetDiv = document.createElement("div");
        offsetDiv.className = "offset";
        offsetDiv.textContent = offset.toString(16).padStart(8, "0");

        // Hex data container
        const hexDataDiv = document.createElement("div");
        hexDataDiv.className = "hex-data";

        // Create a span for each 4-byte chunk
        for (let i = 0; i < hexChunks.length; i += 4) {
          const chunkSpan = document.createElement("span");
					chunkSpan.classList.add('hex-chunk')
          chunkSpan.textContent = hexChunks.slice(i, i + 4).join(" ");
          hexDataDiv.appendChild(chunkSpan);
          if (i < hexChunks.length - 4) {
            // Add spacing between spans, but not after the last span
            hexDataDiv.appendChild(document.createTextNode("   ")); // Three spaces for separation
          }
        }

        // ASCII representation
        const asciiRepDiv = document.createElement("div");
        asciiRepDiv.className = "ascii-rep";
				const asciiData = hexToAscii(lineData)
				for (let i = 0; i < asciiData.length; i++) {
					const currentChar = asciiData[i];
					const currentAsciiSpan = document.createElement('span');
					currentAsciiSpan.innerText = currentChar;
					if (currentChar === ' ') {
						currentAsciiSpan.innerHTML = '&nbsp;'
					}
					currentAsciiSpan.classList.add('ascii-item')
					asciiRepDiv.appendChild(currentAsciiSpan);
				};
        // Append to the line element
        lineDiv.appendChild(offsetDiv);
        lineDiv.appendChild(hexDataDiv);
        lineDiv.appendChild(asciiRepDiv);

        // Append the line to the container
        container.appendChild(lineDiv);
      }

			const allAsciiReps = document.querySelectorAll('.ascii-rep');
			console.log(allAsciiReps);
			const allAsciiItems = document.querySelectorAll('.ascii-item');
			allAsciiReps.forEach((el) => {
				console.log('hi')
				el.addEventListener('mouseover', () => {
					allAsciiItems.forEach((item) => {
						item.classList.add('narrow-ascii-item');
					})
				})
				el.addEventListener('mouseout', () => {
					allAsciiItems.forEach((item) => {
						item.classList.remove('narrow-ascii-item');
					})
				})
			})
    };

    try {
      // step 1
      await selectApplication();

      // step 2
      const key = Buffer.from(desfire.key, "hex");
      await authenticate(key);

      // step 3
      await writeData();

    } catch (err) {
      console.error(`error occurred during processing steps`, reader, err);
    }
  });

  reader.on("error", (err) => {
    console.error(`an error occurred`, reader, err);
  });

  reader.on("end", () => {
    console.log(`device removed`, reader);
  });
});

nfc.on("error", (err) => {
  console.error(`an error occurred`, err);
});
