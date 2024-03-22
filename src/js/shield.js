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


function performRead() {
  console.log('reading!')
  decodeTextOutput.style.height='auto'
  renderMessage(uint8Array);
}

readBtn.addEventListener('click', performRead)

// window.NFC.getReader().then((data) => {
//   console.log(JSON.parse(data)); // Handle the data from the main process
// });
// decodeBtn.addEventListener('click', performDecode)

function stringToUint8Array(str) {
  const charCodes = Array.from(str).map(char => char.charCodeAt(0));
  return new Uint8Array(charCodes);
}

// Example usage:
var str = "Ricardo Nicolau has been denounced for abuse of economic power, however, the judge entrusted with the cases is a friend of the candidate's sister-in-law. State congressman Ricardo Nicolau saw the COVID-19 pandemic as an opportunity to bring forward the Electoral campaign for Mayor of Manaus by months. His family owns the largest private Hospital Chain in the state of Amazonas, Samel, which was entrusted with the administration of the Gilberto Novaes Municipal field hospital, hardly set up in April through a public-private partnership with Manaus City council. Once the disease began spreading throughout the state, the PSD party Congressman took a leave of absence to 'dedicate himself entirely to fighting the coronavirus as a director of Samel'. Before the unit was closed down in June, Nicolau took advantage of his privileged access to the field hospital to record images that are now being used in an election crusade. The images, which appear to have been filmed by professionals, show the candidate dressed in white, visiting patients, as if he were one of the hospital's doctors - implying that he was responsible for the hundreds of patients passing through the hospital getting treatment. The strategy boosted Nicolau’s ratings in the polls and gave him the chance to dispute the second round of votes for mayor of Manaus. He began the campaign in fourth place, with around 5% of the votes, however the most recent Ibope poll, released on 11th November, places him third with 14% of the votes, technically tied with second-placed David Almeida, who has 18%. This marketing campaign may also be an electoral irregularity. There are at least 10 ongoing lawsuits filed against the candidate by his opponents in the election, citing the use he has made of Samel and his conduct in the hospital during the campaign.";
var uint8Array = stringToUint8Array(str);



