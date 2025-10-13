import React from "react"
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
  StaticHandlerContext,
} from 'react-router-dom/server'
//@ts-ignore
import { renderToString } from 'react-dom/server'

import { routes } from '@/routes.tsx'

const { query, dataRoutes } = createStaticHandler(routes);

export async function render(req: Request){
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
    const html = await renderToString(
      <StaticRouterProvider
        router={router}
        context={context}
      />
    );

    return html
}