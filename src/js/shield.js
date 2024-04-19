import TypeShuffle from "./util/shuffle";
import renderMessage from "./util/render-message";
import lzw_encode from "./util/encode";
import lzw_decode from './util/decode';

const shieldParent = document.getElementById('shield');
const shieldBtn = document.getElementById('button2');
const shieldReader = document.getElementById('shield-reader');
const shieldCard = document.getElementById('shield-card');


const decodeBtn = document.getElementById('decodeButton');
const decodeTextOutput = document.getElementById("decodeTextOutput");

const readBtn = document.getElementById('readButton');

const shieldDetectedReader = document.getElementById('shield-detect-reader');
const shieldDetectedCard = document.getElementById('shield-detect-card');
const shieldRemovedCard = document.getElementById('shield-remove-card');


for (let i = 1; i <= 108; i++) {
  // '░', '▒', '▓'
  shieldCard.innerText += '▒';
  shieldReader.innerText += '░';
  
  }
  
const shieldCardTS = new TypeShuffle(shieldCard);

const shieldRemovedTS = new TypeShuffle(shieldRemovedCard);
const shieldDetectedTS = new TypeShuffle(shieldDetectedCard);
shieldCardTS.clearCells();



window.NFC.onCardDetected((event, data) => {
  shieldDetectedCard.style.display = 'block';
  shieldRemovedCard.style.display = 'none';

  readBtn.style.opacity = 1;
  shieldCardTS.trigger('reader');
  shieldDetectedTS.trigger('fx6');
  shieldDetectedReader.style.display = 'none';
})

document.addEventListener('keyup', function(event) {
  if (event.key === 'h' || event.key === 'H') {
    shieldDetectedCard.style.display = 'block';
    shieldRemovedCard.style.display = 'none';
  
    readBtn.style.opacity = 1;
    shieldCardTS.trigger('reader');
    shieldDetectedTS.trigger('fx6');
    shieldDetectedReader.style.display = 'none';
  }
});

document.addEventListener('keyup', function(event) {
  if (event.key === 'k' || event.key === 'K') {
    shieldRemovedCard.style.display = 'block';
    shieldDetectedCard.style.display = 'none';
  
    shieldCardTS.trigger('clear-reader');
    readBtn.style.opacity = 0;
    shieldRemovedTS.trigger('fx6');
    shieldDetectedReader.style.display = 'none';
  }
});

window.NFC.onCardRemoved((event, data) => {
  shieldRemovedCard.style.display = 'block';
  shieldDetectedCard.style.display = 'none';

  shieldCardTS.trigger('clear-reader');
  readBtn.style.opacity = 0;
  shieldRemovedTS.trigger('fx6');
  shieldDetectedReader.style.display = 'none';
})

const betterReading = document.getElementById('better-reading');
const betterReadingText = document.getElementById('better-reading-text');


function convertUint8ToHex(data) {
  // Convert each byte in the Uint8Array to a hexadecimal string
  const hexArray = Array.from(data).map((byte) =>
  byte.toString(16).padStart(2, "0")
);
return hexArray;
}

function hexToAscii(data) {
  return Array.from(data)
  .map((byte) => {
    return byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : ".";
  })
  .join("");
}

var str = "Ricardo Nicolau has been denounced for abuse of economic power, however, the judge entrusted with the cases is a friend of the candidate's sister-in-law. State congressman Ricardo Nicolau saw the COVID-19 pandemic as an opportunity to bring forward the Electoral campaign for Mayor of Manaus by months. His family owns the largest private Hospital Chain in the state of Amazonas, Samel, which was entrusted with the administration of the Gilberto Novaes Municipal field hospital, hardly set up in April through a public-private partnership with Manaus City council. Once the disease began spreading throughout the state, the PSD party Congressman took a leave of absence to 'dedicate himself entirely to fighting the coronavirus as a director of Samel'. Before the unit was closed down in June, Nicolau took advantage of his privileged access to the field hospital to record images that are now being used in an election crusade. The images, which appear to have been filmed by professionals, show the candidate dressed in white, visiting patients, as if he were one of the hospital's doctors - implying that he was responsible for the hundreds of patients passing through the hospital getting treatment. The strategy boosted Nicolau’s ratings in the polls and gave him the chance to dispute the second round of votes for mayor of Manaus. He began the campaign in fourth place, with around 5% of the votes, however the most recent Ibope poll, released on 11th November, places him third with 14% of the votes, technically tied with second-placed David Almeida, who has 18%. This marketing campaign may also be an electoral irregularity. There are at least 10 ongoing lawsuits filed against the candidate by his opponents in the election, citing the use he has made of Samel and his conduct in the hospital during the campaign.";
var compressed = arrayToString(lzw_encode(str).string)
var compressedUint8 = lzw_encode(str).hex

readBtn.addEventListener('click', () => {
  window.NFC.readInfo('Data needed')
        .then(response => {
            renderMessage(response)
            betterReadingText.innerText = hexToAscii(convertUint8ToHex(response));
        })
        .catch(error => {
            console.error('Error:', error);
        });
})

decodeBtn.addEventListener('click', () => {
  const original = betterReadingText.innerText;
  console.log(original)

  console.log(original)
  const decoded = lzw_decode(original);
  console.log(decoded)

  betterReadingText.innerText = decoded.string;
  // TODO : Make this hex into a uint 8 array;
  renderMessage(decoded.hex);
})

const hexDisplay = document.getElementById('hex-display');
const closeHex = document.getElementById('close-hex');
const openHex = document.getElementById('open-hex');


closeHex.addEventListener('click', () => {
  hexDisplay.style.display = 'none'
  betterReading.style.display = 'flex'
})

openHex.addEventListener('click', () => {
  hexDisplay.style.display = 'flex'
  betterReading.style.display = 'none'
})

// window.NFC.getReader().then((data) => {
//   shieldDetectedReader.style.display = 'block';
//   const readerJSON = JSON.parse(data)
//   shieldDetectedReader.innerHTML = `
//   <span class="black-highlight">READER DETECTED:</span><br><br>
//   <span class="black-highlight"> ${readerJSON.reader.name}</span>
//   `
//   const shieldDetectReaderTS = new TypeShuffle(shieldDetectedReader)
//   shieldDetectReaderTS.trigger('fx6');
// });

window.NFC.onReaderConnected((event, data) => {
  const readerJSON = JSON.parse(data)
  shieldDetectedReader.innerHTML = `
  <span class="black-highlight">READER DETECTED:</span><br><br>
  <span class="black-highlight"> ${readerJSON.reader.name}</span>
  `
  const shieldDetectReaderTS = new TypeShuffle(shieldDetectedReader)
  shieldDetectReaderTS.trigger('fx6');
})

shieldBtn.addEventListener('click', () => {
  shieldParent.style.display = 'block'
  // window.NFC.getReader().then((data) => {
    shieldDetectedReader.style.display = 'block';
    // const readerJSON = JSON.parse(tempData)
    // shieldDetectedReader.innerHTML = `
    // <span class="black-highlight">READER DETECTED:</span><br><br>
    // <span class="black-highlight"> ${readerJSON.reader.name}</span>
    // `
    const shieldDetectReaderTS = new TypeShuffle(shieldDetectedReader)
    shieldDetectReaderTS.clearCells();
    setTimeout(() => {
      
      shieldDetectReaderTS.trigger('fx6')
    }, 500);
  // });
})

const shieldNav = document.getElementById('shield-nav');
shieldNav.addEventListener('click', openShield);

function openShield () {
  shieldParent.style.display = 'block';
  shieldDetectedReader.style.display = 'block';

  const swordParent = document.getElementById('sword');
  const swordDetectedReader = document.getElementById('sword-detect-reader');

  swordParent.style.display = 'none';
  swordDetectedReader.style.display = 'none';
}

const homeNav = document.getElementById('home-nav');
homeNav.addEventListener('click', closeToHome);

function closeToHome () {
  shieldParent.style.display = 'none';
  shieldDetectedReader.style.display = 'none';

  const swordParent = document.getElementById('sword');
  const swordDetectedReader = document.getElementById('sword-detect-reader');

  swordParent.style.display = 'none';
  swordDetectedReader.style.display = 'none';
}


function performRead() {
  console.log('reading!')
  decodeTextOutput.style.height='auto'
  renderMessage(uint8Array);
}


// window.NFC.getReader().then((data) => {
//   console.log(JSON.parse(data)); // Handle the data from the main process
// });
// decodeBtn.addEventListener('click', performDecode)
function uint8ArrayToString(data) {
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(data);
}

function stringToUint8Array(str) {
  const charCodes = Array.from(str).map(char => char.charCodeAt(0));
  return new Uint8Array(charCodes);
}

// Example usage:

function arrayToString (array) {
  let output = ''
  array.forEach((item) => {
    output += item;
  })
  return output
}
