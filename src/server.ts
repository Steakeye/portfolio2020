import sirv from 'sirv';
import polka from 'polka';
import { v4 as uuidV4 } from 'uuid';
import type { ServerResponse } from 'http';
import compression from 'compression';
import helmet from 'helmet';
import * as sapper from '@sapper/server';
import { server as serverConfig } from './resources/config.json';
import { unquoteString } from './utils/String';

// This ensures css inclusion? We're not emitting scss
// import './styles/global.scss';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === `development`;

const helmetDirectivesDefault = {
  'default-src': [`'self'`],
  'base-uri': [`'self'`],
  'block-all-mixed-content': [],
  'font-src': [`'self'`, `https:`, `data:`],
  'frame-ancestors': [`'self'`],
  'img-src': [`'self'`, `data:`],
  'object-src': [`'none'`],
  'script-src': [`'self'`],
  'script-src-attr': [`'none'`],
  'style-src': [`'self'`, `https:`, `'unsafe-inline'`],
  'upgrade-insecure-requests': [],
};

const {
  thirdParty: { fontSources, styleSources },
} = serverConfig;
const fontDirectives = fontSources.map(unquoteString);
const styleDirectives = styleSources.map(unquoteString);
const connectSrcDirectives = [`'self'`, ...styleDirectives, ...fontDirectives];
const {
  'font-src': oldFontSrc,
  'img-src': oldImageSrc,
  'script-src': oldScriptSrc,
  'style-src': oldStyleSrc,
  ...serverHelmetDirectives
} = helmetDirectivesDefault;

function numberOnce(req, res, next) {
  res.locals = res.locals ?? {};
  res.locals.nonce = uuidV4();
  next();
}

polka() // You can also use Express
  .use(
    numberOnce,
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...serverHelmetDirectives,
          fontSrc: [...oldFontSrc, ...fontDirectives],
          imgSrc: [...oldImageSrc, `blob:`],
          // enable watches and automatic refresh on dev only
          connectSrc: dev ? [...connectSrcDirectives, `localhost:10000`] : connectSrcDirectives,
          scriptSrc: [
            ...oldScriptSrc,
            (req, res) => `'nonce-${(res as ServerResponse & { locals }).locals.nonce}'`,
            `blob:`,
          ],
          styleSrc: [...oldStyleSrc, ...styleDirectives],
        },
      },
    }),
    compression({ threshold: 0 }),
    sirv(`public`, { dev }),
    sapper.middleware(),
  )
  .listen(PORT, (err) => {
    if (err) console.log(`error`, err);
  });
