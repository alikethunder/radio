import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
  StaticHandlerContext,
} from 'react-router-dom/server'
//@ts-ignore
import { renderToReadableStream } from 'react-dom/server.browser'

import { routes } from './src/routes.tsx'

let { query, dataRoutes } = createStaticHandler(routes);

const server = Bun.serve({
  port: process.env.PORT,
  async fetch(req) {
    //console.log('API_PORT : ', process.env.API_PORT);

    const url = new URL(req.url);

    const { pathname } = new URL(req.url);
    console.info(`Requesting: ${pathname}`);

    // Create a fetch request
    const fetchRequest = new Request(url.toString(), {
      method: req.method,
      headers: req.headers,
    });
    let context = await query(req);

    if (context instanceof Response) {
      return context; // Redirect or other response
    }

    let router = createStaticRouter(dataRoutes, context);

    // 3. Server-side rendering
    const stream = await renderToReadableStream(
      <StaticRouterProvider
        router={router}
        context={context}
      />
    );
    return new Response(stream, {
      headers: { "Content-Type": "text/html" },
    });
  },
});

console.info(`Listening on http://localhost:${server.port}`);