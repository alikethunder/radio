const server = Bun.serve({
  port: 5454,
  async fetch(req) {
    const render = (await import( '../../served/public/entry-server')).render;
    const html = await render(req);
    //console.log(html)
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  },
});

console.info(`Listening on http://localhost:${server.port}`);