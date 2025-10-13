import { render } from '../../served/public/entry-server'

const server = Bun.serve({
  port: process.env.PORT,
  async fetch(req) {
    const html = await render(req);
    //console.log(html)
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  },
});

console.info(`Listening on http://localhost:${server.port}`);