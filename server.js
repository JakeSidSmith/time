import path from 'node:path';

import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';

const CWD = process.cwd();
const PORT = process.env.PORT ?? 8080;
const STATIC_PATHNAME = path.resolve(CWD, 'static');
const BUILD_PATHNAME = path.resolve(CWD, 'build');

const app = new Hono();

app.use(
  '/*',
  serveStatic({
    root: path.relative(CWD, STATIC_PATHNAME),
  })
);

app.use(
  '/*',
  serveStatic({
    root: path.relative(CWD, BUILD_PATHNAME),
  })
);

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  }
);
