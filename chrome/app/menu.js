const {Menu, app, dialog} = require('electron');
const fs = require('fs');

module.exports = (ipcSend) =>
app.once('ready', () => {
  const template = [
    {
      label: 'Datei',
      submenu: [
        {
          label: 'Neu',
          accelerator: 'CmdOrCtrl+N'
        },
        {
          label: 'Öffnen ...',
          accelerator: 'CmdOrCtrl+O'
        },
        {
          label: 'Speichern',
          accelerator: 'CmdOrCtrl+S'
        },
        {
          label: 'Speichern unter ...',
          accelerator: 'CmdOrCtrl+Shift+S'
        },
        {
          type: 'separator'
        },
        {
          label: 'Daten senden ...',
          click: () => ipcSend('start-send-data', { asTestcase: false })
        },
        {
          label: 'Übertragung testen ...',
          click: () => ipcSend('start-send-data', { asTestcase: true })
        },
        {
          type: 'separator'
        },
        {
          label: 'Beenden',
          accelerator: 'CmdOrCtrl+Q',
          role: 'close'
        }
      ]
    },
    {
      label: 'Bearbeiten',
      submenu: [
        {
          label: 'Einstellungen',
          accelerator: 'CmdOrCtrl+,'
        },
      ]
    },
    {
      label: 'Werkzeuge',
      submenu: [
        {
          label: 'Dauerfristverlängerung ...',
          click: () => ipcSend('show-ustsvza')
        },
        {
          label: 'Protokoll nachdrucken ...',
          click: () => {
            const files = dialog.showOpenDialog({properties: ['openFile']});
            if (typeof files === 'object' && files.__proto__.constructor === Array)
              ipcSend('reprint-protocol', fs.readFileSync(files[0], 'UTF-8'));
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Entwickler-Tools anzeigen',
          accelerator: (function() {
            if (process.platform === 'darwin')
              return 'Alt+Command+I';
            else
              return 'Ctrl+Shift+I';
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.toggleDevTools();
          }
        },
      ]
    },
    {
      label: 'Hilfe',
      role: 'help',
      submenu: [
        {
          label: 'Info',
          role: 'about',
          click: () => ipcSend('show-about-dialog')
        },
      ]
    },
  ];

  if (process.platform === 'darwin') {
    const name = app.getName();
    template.unshift({
      label: name,
      submenu: [
        {
          label: 'About ' + name,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide ' + name,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() { app.quit(); }
        },
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
});
