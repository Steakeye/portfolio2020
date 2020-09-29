import type { Response, Request, NextFunction } from 'express';

export async function get(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (true) {
    /* res.setHeader('Content-Type', 'application/json'); */
    // res.end('email!'); //JSON.stringify(article));
    // res.redirect('mailto:andrew@steakeye.com'); // No redirect built-in to polka!
    res.writeHead(302, { Location: 'mailto:andrew@steakeye.com' });
    // res.writeHead(302, { Location : '//google.com' });
    res.end();
    console.log('email redirect');
  } else {
    next();
  }
}
