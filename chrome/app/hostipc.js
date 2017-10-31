const {Menu, app, dialog, ipcMain} = require('electron');
const fs = require('fs');

let fileChanged = false;
let filePath;

module.exports = (ipcSend) => {
  const self = {
    new: () => {
      self.askSaveChanges()
      .then((saveChanges) => {
        if (saveChanges) {
          self.save();
        }

        ipcSend('reset-form');

        filePath = undefined;
        fileChanged = false;
      })
      .catch((x) => undefined);
    },

    open: () => {
      self.askSaveChanges()
      .then((saveChanges) => {
        if (saveChanges) {
          self.save();
        }

        const files = dialog.showOpenDialog({
          properties: ['openFile']
        });

        if (typeof files === 'object' && files.__proto__.constructor === Array) {
          self.openFile(files[0])
        }
      })
      .catch((x) => undefined);
    },

    openFile: (file) => {
      ipcMain.once('unserialize-success', () => {
        fileChanged = false;
        filePath = file;
      });

      ipcSend('unserialize', fs.readFileSync(file, 'UTF-8'));
    },

    save: () => {
      if (filePath === undefined) {
        self.saveAs();
      } else {
        // keep a reference to the filePath, since as may be reset between serialize call and
        // the result callback
        const keptFilePath = filePath;

        ipcMain.once('serialize-result', (sender, data) => {
          fs.writeFileSync(keptFilePath, data);
        });

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

    showAboutDialog: () => ipcSend('show-about-dialog'),

    askSaveChanges: () => {
      if (!fileChanged) {
        // no need to save changes, just go on
        return Promise.resolve(false);
      }

      return new Promise((resolve, reject) => {
        dialog.showMessageBox({
          type: 'question',
          buttons: ['Ja', 'Nein', 'Abbrechen'],
          cancelId: 2,
          title: 'Änderungen speichern?',
          message: 'Am Formular wurden Änderungen vorgenommen, die noch nicht gespeichert wurden. Sollen diese gespeichert werden?'
        }, function (response) {
          switch (response) {
            case 0: // yes, save
              resolve(true);
            break;

            case 1: // no, don't save
              resolve(false);

            case 2: // cancle
              reject('dialog cancelled');
          }
        });
      });
    }
  };

  ipcMain.on('trigger-host-new', self.new);
  ipcMain.on('trigger-host-open', self.open);
  ipcMain.on('trigger-host-save', self.save);

  ipcMain.on('form-changed', () => fileChanged = true);
  ipcMain.on('form-reset', () => fileChanged = false);

  return self;
};
