import * as sapper from '@sapper/app';
import './styles/global.scss';
import { initConsoleCLI } from './browser-console/BrowserConsole';
import { appRoot } from './resources/config.json';

sapper.start({
  target: document.getElementById(appRoot),
}).then(() => {
  console.info('Steakeye client app initialised');
  initConsoleCLI();
});
