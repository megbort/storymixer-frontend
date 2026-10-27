import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const appVersion = {
  build: process.env.APP_BUILD_NUMBER ?? 'dev',
  sha: process.env.APP_SHA ?? 'local',
}

const isStorybook = process.argv.some((arg) => arg.includes('storybook'))
const devtoolsPlugin = devtools({
  eventBusConfig: {
    enabled: !isStorybook,
    port: 42100,
  },
})

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    devtoolsPlugin,
    ...(isStorybook ? [] : [nitro()]),
    tailwindcss(),
    ...(isStorybook
      ? []
      : [
          tanstackStart({
            spa: {
              enabled: true,
              prerender: {
                outputPath: '/index',
              },
            },
          }),
        ]),
    viteReact(),
  ],
})
