((module) => {
  const ipc = require('electron').ipcRenderer;

  ipc.on('show-about-dialog', () => $('#about').modal());

  // hide bootstrap .navbar
  document.getElementsByTagName('body')[0].className = 'electron';

})(module);
