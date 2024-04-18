import TypeShuffle from "./util/shuffle";
import renderMessage from "./util/render-message";

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

readBtn.addEventListener('click', () => {
  window.NFC.readInfo('Data needed')
        .then(response => {
            renderMessage(response)
        })
        .catch(error => {
            console.error('Error:', error);
        });
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
  //renderMessage(uint8Array);
}


// window.NFC.getReader().then((data) => {
//   console.log(JSON.parse(data)); // Handle the data from the main process
// });
// decodeBtn.addEventListener('click', performDecode)

function stringToUint8Array(str) {
  const charCodes = Array.from(str).map(char => char.charCodeAt(0));
  return new Uint8Array(charCodes);
}

// Example usage:




