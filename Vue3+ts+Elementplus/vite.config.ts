import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // 设置基础路径为相对路径，确保在不同环境下都能正常访问
  base: './',
  // 确保开发和生产环境的一致性
  define: {
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_OPTIONS_API__: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/_variables.scss";'
      }
    }
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass'
      })],
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core'
      ],
      dts: true,
      eslintrc: {
        enabled: true
      }
    }),
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass'
      })]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    // 确保模块解析正确
    dedupe: ['vue', 'echarts', 'zrender']
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/code-api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/code-api/, '')
      },
      '/data-api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/data-api/, '')
      }
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // 确保动态导入的路径正确
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        // 确保资源路径正确
        format: 'es',
        manualChunks(id) {
          // 更智能的分包策略，避免循环依赖
          if (id.includes('node_modules')) {
            if (id.includes('element-plus')) {
              return 'element-plus'
            }
            if (id.includes('vue') || id.includes('pinia') || id.includes('@vue')) {
              return 'vue-vendor'
            }
            if (id.includes('echarts') || id.includes('zrender')) {
              return 'echarts'
            }
            return 'vendor'
          }
          // 将页面组件分组到不同的 chunk 中
          if (id.includes('/src/views/')) {
            const dirs = id.split('/src/views/')[1].split('/')
            if (dirs.length > 1) {
              return `views-${dirs[0]}`
            }
            return 'views'
          }
        }
      }
    }
  }
})