const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // 👈🏽 your API endpoint goes here.
    createProxyMiddleware({
      target: 'http://127.0.0.15000', // 👈🏽 your API URL goes here.
      changeOrigin: true,
    })
  );
};