import { createProxyMiddleware } from 'http-proxy-middleware';

export default function setupProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://172.16.16.10:8082',
      changeOrigin: true,
    })
  );
}
