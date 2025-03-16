module.exports = {
  lintOnSave: false,
  devServer: {
    open: true,
    port: 8080,
    proxy: {
      '/': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      }
    }
  }
} 