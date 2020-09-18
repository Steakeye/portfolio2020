import * as sapper from '@sapper/app';
import './styles/global.scss'
import { appRoot } from './resources/config.json';

sapper.start({
  target: document.getElementById(appRoot),
})
