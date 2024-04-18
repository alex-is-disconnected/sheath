import TypeShuffle from "./util/shuffle";
import lzw_encode from "./util/encode";
import calculateBytes from "./util/calc-bytes";

const swordParent = document.getElementById('sword');
const swordBtn = document.getElementById('button1');
const swordReader = document.getElementById('sword-reader');
const swordCard = document.getElementById('sword-card');


const encodeBtn = document.getElementById('encodeButton');
const encodeTextArea = document.getElementById("encodeTextArea");
const encodeTextOutput = document.getElementById("encodeTextOutput");
const textAreaBytes = document.getElementById("textarea-bytes");
const compressionBytes = document.getElementById("compression-bytes");

const writeBtn = document.getElementById('writeButton');

const swordDetectedReader = document.getElementById('sword-detect-reader');
const swordDetectedCard = document.getElementById('sword-detect-card');
const swordRemovedCard = document.getElementById('sword-remove-card');

const progressWrapper = document.getElementById('progress-wrapper');
const compressionProgress = document.getElementById('progress-text');
const compressionCalc = document.getElementById('compression-calc');
const progressClose = document.getElementById('close-progress');

for (let i = 1; i <= 108; i++) {
  // '░', '▒', '▓'
  swordCard.innerText += '▒';
  swordReader.innerText += '░';
  
  }
  
const readerTS = new TypeShuffle(swordReader);
const swordCardTS = new TypeShuffle(swordCard);

const swordRemovedTS = new TypeShuffle(swordRemovedCard);
const swordDetectedTS = new TypeShuffle(swordDetectedCard);
swordCardTS.clearCells();


window.NFC.onCardDetected((event, data) => {
  swordDetectedCard.style.display = 'block';
  swordRemovedCard.style.display = 'none';

  writeBtn.style.opacity = 1;
  swordCardTS.trigger('reader');
  swordDetectedTS.trigger('fx6');
  swordDetectedReader.style.display = 'none';
})

writeBtn.addEventListener('click', () => {
  const messageToWrite = encodeTextArea.innerHTML;
  console.log('click')
  window.NFC.writeInfo(messageToWrite)
})


document.addEventListener('keyup', function(event) {
  if (event.key === 'h' || event.key === 'H') {
    swordDetectedCard.style.display = 'block';
    swordRemovedCard.style.display = 'none';
  
    writeBtn.style.opacity = 1;
    swordCardTS.trigger('reader');
    swordDetectedTS.trigger('fx6');
    swordDetectedReader.style.display = 'none';
  }
});

document.addEventListener('keyup', function(event) {
  if (event.key === 'k' || event.key === 'K') {
    swordRemovedCard.style.display = 'block';
    swordDetectedCard.style.display = 'none';
  
    swordCardTS.trigger('clear-reader');
    writeBtn.style.opacity = 0;
    swordRemovedTS.trigger('fx6');
    swordDetectedReader.style.display = 'none';
  }
});

window.NFC.onCardRemoved((event, data) => {
  swordRemovedCard.style.display = 'block';
  swordDetectedCard.style.display = 'none';

  swordCardTS.trigger('clear-reader');
  writeBtn.style.opacity = 0;
  swordRemovedTS.trigger('fx6');
  swordDetectedReader.style.display = 'none';
})

// window.NFC.getReader().then((data) => {
//   swordDetectedReader.style.display = 'block';
//   const readerJSON = JSON.parse(data)
//   swordDetectedReader.innerHTML = `
//   <span class="black-highlight">READER DETECTED:</span><br><br>
//   <span class="black-highlight"> ${readerJSON.reader.name}</span>
//   `
// });

window.NFC.onReaderConnected((event, data) => {
  const readerJSON = JSON.parse(data)
  swordDetectedReader.innerHTML = `
  <span class="black-highlight">READER DETECTED:</span><br><br>
  <span class="black-highlight"> ${readerJSON.reader.name}</span>
  `
  const swordDetectReaderTS = new TypeShuffle(swordDetectedReader)
  swordDetectReaderTS.trigger('fx6');
})

const openSwordDetectReaderTS = new TypeShuffle(swordDetectedReader)
swordBtn.addEventListener('click', () => {
  swordParent.style.display = 'block'
  // window.NFC.getReader().then((data) => {
    swordDetectedReader.style.display = 'block';
    // const readerJSON = JSON.parse(data)
    // swordDetectedReader.innerHTML = `
    // <span class="black-highlight">READER DETECTED:</span><br><br>
    // <span class="black-highlight"> ${readerJSON.reader.name}</span>
    // `
    openSwordDetectReaderTS.clearCells();
    setTimeout(() => {
      
      openSwordDetectReaderTS.trigger('fx6')
    }, 500);
  // });
})

const swordNav = document.getElementById('sword-nav');
swordNav.addEventListener('click', openSword);

function openSword () {
  swordParent.style.display = 'block';
  swordDetectedReader.style.display = 'block';

  const shieldParent = document.getElementById('shield');
  const shieldDetectedReader = document.getElementById('shield-detect-reader');

  shieldParent.style.display = 'none';
  shieldDetectedReader.style.display = 'none';
}

encodeTextArea.addEventListener("input", function(event) {
  const value = encodeTextArea.value;
  const bytes = calculateBytes(value);
  textAreaBytes.innerHTML = `
  <span class="black-highlight">SIZE: ${bytes} bytes</span>
  `

});

const baseText = 'COMPRESSING'
function updateProgress() {
  let dots = compressionProgress.innerText.length - baseText.length;

  if (dots === 3) {
    compressionProgress.innerText = baseText;
  } else {
    compressionProgress.innerText += ".";
  }
}


function performEncode() {
  progressWrapper.style.display = 'flex';
  compressionProgress.innerText = 'COMPRESSING';
  const progInterval = setInterval(updateProgress, 500);

  encodeBtn.removeEventListener('click', performEncode);

  encodeTextOutput.style.display= 'block';
  encodeTextOutput.style.height= '35vw';
  encodeTextOutput.style.padding= '1rem';

  encodeTextArea.setAttribute("readonly", true);
  encodeTextArea.style.cursor = 'progress';
  const inputText = encodeTextArea.value;
  const lzwEncodeOutput = lzw_encode(inputText);
  const encodeedHexOuput = lzwEncodeOutput.hex;
  console.log(lzwEncodeOutput)
  let animCycleTracker = 0;
  const main = setInterval(() => {
    if (animCycleTracker <= encodeedHexOuput.length) {
    compressionBytes.innerHTML = `
    <span class="black-highlight">SIZE: ${animCycleTracker} bytes</span>
    `
    encodeTextOutput.innerHTML += encodeedHexOuput[encodeedHexOuput.length - animCycleTracker - 1] + '&nbsp;';
      if ( animCycleTracker < encodeedHexOuput.length - 30) {
        animCycleTracker += 10;
      } else {
        animCycleTracker += 1;
      }
    } if (animCycleTracker === encodeedHexOuput.length + 1) {
      clearInterval(main);
      encodeTextArea.removeAttribute("readonly");
      encodeTextArea.style.cursor = 'text';
      encodeBtn.addEventListener('click', performEncode)
      clearInterval(progInterval);
      compressionProgress.innerText = 'COMPLETE!';
      compressionCalc.style.display = 'block';
      const textAreaBytes = calculateBytes(encodeTextArea.value);
      const compressionBytes = encodeedHexOuput.length
      console.log(Math.round(compressionBytes/textAreaBytes * 10000) / 100)
      compressionCalc.innerHTML = 
      `
      <span class="black-highlight">${(100 - (compressionBytes/textAreaBytes) * 100).toFixed(2)}% COMPRESSION</span>
      `
      progressClose.classList.add('close-progress-active');
      progressClose.addEventListener('click', () => {
        compressionCalc.style.display = 'none';
        progressWrapper.style.display = 'none';

      })
    }

  }, 2);
}

// window.NFC.getReader().then((data) => {
//   console.log(JSON.parse(data)); // Handle the data from the main process
// });
encodeBtn.addEventListener('click', performEncode)



