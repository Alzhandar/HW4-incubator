const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    if (parsedUrl.pathname.startsWith('/api')) {
      const proxy = createProxyMiddleware({
        target: 'https://fakeapi.platzi.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      });
      proxy(req, res, () => {});
    } else {
      handle(req, res, parsedUrl);
    }
  });
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
