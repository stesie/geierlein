((module) => {
  const ipc = require('electron').ipcRenderer;

  ipc.on('show-about-dialog', () => $('#about').modal());

  ipc.on('start-send-data', (sender, data) => geierlein.startSendData(data.asTestcase));

  ipc.on('show-ustsvza', () => geierlein.showUStSvzA());

  // We're running in chrome context, no need for reverse proxying.
  geierlein.transfer = geierlein.transferDirect;
})(__tmpModule);
