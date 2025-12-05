import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量，确保 Netlify 后台配置的 API_KEY 能被读取
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // 这里的配置让代码里的 process.env.API_KEY 能在浏览器中正常工作
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})