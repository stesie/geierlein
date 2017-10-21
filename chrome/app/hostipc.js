const {Menu, app, dialog, ipcMain} = require('electron');
const fs = require('fs');

let fileChanged = false;
let filePath;

module.exports = (ipcSend) => {
  const self = {
    new: () => {
      // @todo
    },

    open: () => {
      // @todo ask save changes

      const files = dialog.showOpenDialog({
        properties: ['openFile']
      });

      if (typeof files === 'object' && files.__proto__.constructor === Array) {
        ipcMain.once('unserialize-success', () => {
          fileChanged = false;
          filePath = files[0];
        });
        ipcSend('unserialize', fs.readFileSync(files[0], 'UTF-8'));
      }
    },

    save: () => {
      if (filePath === undefined) {
        self.saveAs();
      } else {
        ipcMain.once('serialize-result', (sender, data) => fs.writeFileSync(filePath, data));
        ipcSend('serialize');
        fileChanged = false;
      }
    },

    saveAs: () => {
      const newFilePath = dialog.showSaveDialog({});
      if (newFilePath !== undefined) {
        filePath = newFilePath;
        self.save();
      }
    },

    sendData: (asTestcase) => ipcSend('start-send-data', { asTestcase }),

    showUStSVzA: () => ipcSend('show-ustsvza'),

    reprintProtocol: () => {
      const files = dialog.showOpenDialog({
        filters: [{ name: 'Protokoll XML-Datei', extensions: ['xml']}],
        properties: ['openFile']
      });

      if (typeof files === 'object' && files.__proto__.constructor === Array)
        ipcSend('reprint-protocol', fs.readFileSync(files[0], 'UTF-8'));
    },

    showAboutDialog: () => ipcSend('show-about-dialog')
  };

  ipcMain.on('trigger-host-new', self.new);
  ipcMain.on('trigger-host-open', self.open);
  ipcMain.on('trigger-host-save', self.save);

  return self;
};
