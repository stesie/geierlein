const {ipcRenderer} = require('electron');

((module) => {
  const ipc = require('electron').ipcRenderer;

  ipc.on('show-about-dialog', () => $('#about').modal());

  ipc.on('start-send-data', (sender, data) => geierlein.startSendData(data.asTestcase));

  ipc.on('show-ustsvza', () => geierlein.showUStSvzA());

  ipc.on('reprint-protocol', (sender, data) => geierlein.showProtocol(data));

  ipc.on('reset-form', () => geierlein.resetForm());

  ipc.on('serialize', () => ipcRenderer.send('serialize-result', geierlein.serialize()));

  ipc.on('unserialize', (sender, data) => {
    if (geierlein.unserialize(data)) {
      ipcRenderer.send('unserialize-success');
    } else {
      alert('Das Format der Datei ist fehlerhaft.  ' +
        'Die Datei kann nicht geöffnet werden');
    }
  });

  // Replace toolbar
  $('.nav')
    .empty()
    .append($('<li><a href="#">Neu</a></li>').click(() => ipcRenderer.send('trigger-host-new')))
    .append($('<li><a href="#">Öffnen</a></li>').click(() => ipcRenderer.send('trigger-host-open')))
    .append($('<li><a href="#">Speichern</a></li>').click(() => ipcRenderer.send('trigger-host-save')))
    .append($('<li><a href="#">Daten senden</a></li>').click(() => geierlein.startSendData(false)));

  // Drop focus after click, no matter what
  $('.nav li a').click((ev) => ev.target.blur())

  // Notify main-thread if form's changed, so it can track changes
  $('.ustva, .datenlieferant').on('change keyup', () => ipcRenderer.send('form-changed'));
  $('body').on('reset-form', () => ipcRenderer.send('form-reset'));

  // We're running in chrome context, no need for reverse proxying.
  geierlein.transfer = geierlein.transferDirect;
})(__tmpModule);
