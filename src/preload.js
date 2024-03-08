// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('windowControls', {
  close: () => ipcRenderer.send('close-app'),
  minimize: () => ipcRenderer.send('minimize-app'),
  maximize: () => ipcRenderer.send('maximize-app'),
  onReaderConnected: (callback) => ipcRenderer.on('reader-connected', (_event, data) => callback(data))
})