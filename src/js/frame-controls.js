document.getElementById('minimize').addEventListener('click', () => {
  window.windowControls.minimize();
});

document.getElementById('maximize').addEventListener('click', () => {
  window.windowControls.maximize();
});

document.getElementById('close').addEventListener('click', () => {
  window.windowControls.close();
});