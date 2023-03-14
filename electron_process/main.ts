import { app, BrowserWindow } from 'electron';

const baseUrl = '../';

app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 1080, height: 1440 });
  win.loadFile(`${baseUrl}dist/duckling/index.html`);
});
