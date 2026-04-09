import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 0.0.0.0 で待ち受ける設定
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://backend:8010',
        changeOrigin: true,
      }
    }
  },
optimizeDeps: {
    include: [
      '@opentelemetry/api',
      '@opentelemetry/sdk-trace-web',
      '@opentelemetry/sdk-trace-base',
      '@opentelemetry/instrumentation',
      '@opentelemetry/instrumentation-fetch',
      '@opentelemetry/exporter-trace-otlp-http',
      '@opentelemetry/context-zone',
      '@opentelemetry/resources',
      '@opentelemetry/semantic-conventions'
    ],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/], // CommonJS形式のライブラリをESMとして扱えるようにする
    },
  },
})
