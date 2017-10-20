((module) => {
  const ipc = require('electron').ipcRenderer;

  ipc.on('show-about-dialog', () => $('#about').modal());

  // We're running in chrome context, no need for reverse proxying.
  debugger;
  geierlein.transfer = geierlein.transferDirect;
})(__tmpModule);
