const {Menu, app} = require('electron');

module.exports = (hostipc) => {

  app.once('ready', () => {
    const template = [
      {
        label: 'Datei',
        submenu: [
          {
            label: 'Neu',
            accelerator: 'CmdOrCtrl+N',
            click: hostipc.new
          },
          {
            label: 'Öffnen ...',
            accelerator: 'CmdOrCtrl+O',
            click: hostipc.open
          },
          {
            label: 'Speichern',
            accelerator: 'CmdOrCtrl+S',
            click: hostipc.save
          },
          {
            label: 'Speichern unter ...',
            accelerator: 'CmdOrCtrl+Shift+S',
            click: hostipc.saveAs
          },
          {
            type: 'separator'
          },
          {
            label: 'Daten senden ...',
            click: () => hostipc.sendData(false)
          },
          {
            label: 'Übertragung testen ...',
            click: () => hostipc.sendData(true)
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
      /* {
        label: 'Bearbeiten',
        submenu: [
          {
            label: 'Einstellungen',
            accelerator: 'CmdOrCtrl+,'
          },
        ]
      }, */
      {
        label: 'Werkzeuge',
        submenu: [
          {
            label: 'Dauerfristverlängerung ...',
            click: hostipc.showUStSVzA
          },
          {
            label: 'Protokoll nachdrucken ...',
            click: hostipc.reprintProtocol
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
            click: hostipc.showAboutDialog
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
};
