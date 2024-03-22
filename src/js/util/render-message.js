// export default async function renderMessage (hexData) {
//   console.log(hexData);

//   function byteToHex(byte) {
//     return byte.toString(16).padStart(2, "0");
//   }

//   function hexToAscii(data) {
//     return Array.from(data)
//       .map((byte) => {
//         return byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : ".";
//       })
//       .join("");
//   }

//   const bytesPerLine = 16;
//   const container = document.getElementById("hex-display");
//   container.innerHTML = '';
//   for (let offset = 0; offset < hexData.length; offset += bytesPerLine) {
//     const lineData = hexData.slice(offset, offset + bytesPerLine);
//     const hexChunks = Array.from(lineData).map((byte) => byteToHex(byte));

//     const lineDiv = document.createElement("div");
//     lineDiv.className = "hex-line";

//     const offsetDiv = document.createElement("div");
//     offsetDiv.className = "offset";
//     offsetDiv.textContent = offset.toString(16).padStart(6, "0");

//     const hexDataDiv = document.createElement("div");
//     hexDataDiv.className = "hex-data";

//     for (let i = 0; i < hexChunks.length; i += 4) {
//       const chunkSpan = document.createElement("span");
//       chunkSpan.classList.add('hex-chunk')
//       chunkSpan.textContent = hexChunks.slice(i, i + 4).join(" ");
//       hexDataDiv.appendChild(chunkSpan);
//       if (i < hexChunks.length - 4) {

//         hexDataDiv.appendChild(document.createTextNode("   "));
//       }
//     }

//     const asciiRepDiv = document.createElement("div");
//     asciiRepDiv.className = "ascii-rep";
//     const asciiData = hexToAscii(lineData)
//     for (let i = 0; i < asciiData.length; i++) {
//       const currentChar = asciiData[i];
//       const currentAsciiSpan = document.createElement('span');
//       currentAsciiSpan.innerText = currentChar;
//       if (currentChar === ' ') {
//         currentAsciiSpan.innerHTML = '&nbsp;'
//       }
//       currentAsciiSpan.classList.add('ascii-item')
//       asciiRepDiv.appendChild(currentAsciiSpan);
//     };

//     lineDiv.appendChild(offsetDiv);
//     lineDiv.appendChild(hexDataDiv);
//     lineDiv.appendChild(asciiRepDiv);

//     container.appendChild(lineDiv);
//   }

// };

export default async function renderMessage(hexData) {
  console.log(hexData);

  function byteToHex(byte) {
    return byte.toString(16).padStart(2, "0");
  }

  function byteToAscii(byte) {
    return String.fromCharCode(byte);
}

  function hexToAscii(data) {
    return Array.from(data)
      .map((byte) => {
        return byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : ".";
      })
      .join("");
  }
  const delayPerChunk = 100;
  const delayPerLine = 10;
  const bytesPerLine = 16;

  document.getElementById('offset').innerHTML='';
  document.getElementById('ascii-rep').innerHTML='';
  document.getElementById('hex-data').innerHTML='';

  for (let offset = 0, lineCount = 0; offset < hexData.length; offset += bytesPerLine, lineCount++) {
    const lineData = hexData.slice(offset, offset + bytesPerLine);
    const hexChunks = Array.from(lineData).map((byte) => byteToHex(byte));
    const asciiData = hexToAscii(lineData);
  
    // Calculate the start delay for this line based on its count
    const lineStartDelay = lineCount * delayPerLine;
  
    const asciiLineDiv = document.createElement("div");
    asciiLineDiv.className = "ascii-line";
    
    const offsetDiv = document.createElement("div");
    offsetDiv.className = "offset-child";
    offsetDiv.textContent = offset.toString(16).padStart(4, "0");
    const hexDataDiv = document.createElement("div");
    hexDataDiv.className = "hex-line";
    
    document.getElementById('offset').appendChild(offsetDiv)
    document.getElementById('ascii-rep').appendChild(asciiLineDiv);
    document.getElementById('hex-data').appendChild(hexDataDiv);
  
    hexChunks.forEach((chunk, index) => {
      // Calculate total delay by adding the start delay for the line and the individual delay for this chunk
      const totalDelay = lineStartDelay + index * delayPerChunk;
      setTimeout(() => {
        // Create and append the hex chunk span
        const currentHexSpan = document.createElement("span");
        currentHexSpan.classList.add('hex-chunk');
        currentHexSpan.textContent = chunk;
        hexDataDiv.appendChild(currentHexSpan);
        if (index < hexChunks.length - 1) {
          hexDataDiv.appendChild(document.createTextNode("   "));
        }
  
        // Create and append the corresponding ASCII span
        const currentChar = asciiData[index];
        const currentAsciiSpan = document.createElement('span');
        currentAsciiSpan.innerText = currentChar;
        if (currentChar === ' ') {
          currentAsciiSpan.innerHTML = '&nbsp;'
        }
        currentAsciiSpan.classList.add('ascii-item');
        asciiLineDiv.appendChild(currentAsciiSpan);
        currentHexSpan.addEventListener('mouseover', () => {
          currentAsciiSpan.classList.add('hovered-ascii');
          currentHexSpan.classList.add('hovered-hex');
        })

        currentAsciiSpan.addEventListener('mouseover', () => {
          currentAsciiSpan.classList.add('hovered-ascii');
          currentHexSpan.classList.add('hovered-hex');
        })

        currentHexSpan.addEventListener('mouseout', () => {
          currentAsciiSpan.classList.remove('hovered-ascii');
          currentHexSpan.classList.remove('hovered-hex');
        })

        currentAsciiSpan.addEventListener('mouseout', () => {
          currentAsciiSpan.classList.remove('hovered-ascii');
          currentHexSpan.classList.remove('hovered-hex');
        })

        if (index === hexChunks.length - 1) {
          document.getElementById('close-hex').style.backgroundColor = 'var(--ui-main-color)';
        }
      }, totalDelay); // Sequential delay for each chunk, factoring in the line delay
    });
  }
};
