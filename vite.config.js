import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import Inspect from 'vite-plugin-inspect'
// import viteCssModule from 'vite-plugin-style-modules';

// vite-plugin-style-modules导出的函数没有调用签名
// declare module "vite-plugin-style-modules" 
// { export default function viteCssModule(path?: RegExp) }
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    // react(),
    // viteCssModule(/\.model\.css/),
    Inspect({
      build: true,
      outputDir: '.vite-inspect'
    }),
  ],
  resolve: {
    // 路径别名
    // alias: {
    //   "@": resolve(__dirname, 'src'), 
    // },
    // 使用路径别名时想要省略的后缀名，可以自己 增减
    extensions: ['.js', '.json', '.ts'] 
  },
  // css: {
  //   modules: {
  //     // scopeBehaviour: 'local',
  //     // globalModulePaths: [/\.model\.css/],
  //     // 开启 camelCase 格式变量名转换
  //     localsConvention: 'camelCase',
  //     // 类名 前缀
  //     generateScopedName: '[local]-[hash:base64:5]',
  //   }
  // }
})
