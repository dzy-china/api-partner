import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import electron from 'vite-plugin-electron'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },

    plugins: [
      vue(),
      AutoImport({
          imports: ["vue"],
          resolvers: [ElementPlusResolver()],
      }),
      Components({
          resolvers: [ElementPlusResolver()],
      }),
      electron({
          entry: [
              "electron/main.js",
              "electron/preload.js",
              "electron/ApiSqlite.js",
          ]
      })
    ]
})
