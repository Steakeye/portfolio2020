import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import * as sapper from '@sapper/server'
import './styles/global.scss'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

polka() // You can also use Express
  .use(compression({ threshold: 0 }), sirv('public', { dev }), sapper.middleware())
  .listen(PORT, (err) => {
    if (err) console.log('error', err)
  })