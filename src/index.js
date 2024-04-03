import './index.css';
import'./tooltip.css';
import './js/frame-controls.js';
import './js/homepage-setup.js';
import './js/sword.js';
import './js/shield.js';

window.NFC.onReaderConnected((data) => {
  console.log('data!', data)
})

const netMap = document.getElementById('net-map');
const appNav = document.getElementById('app-nav');
netMap.addEventListener('click', () => {
  appNav.classList.toggle('wide-nav');
})