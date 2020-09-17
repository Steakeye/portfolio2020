import * as sapper from '@sapper/app'
import './styles/global.scss'

//document.body.classList.add('js-enabled');

sapper.start({
  target: document.querySelector('#sapper'),
})
