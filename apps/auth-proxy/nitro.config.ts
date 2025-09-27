import { defineNitroConfig } from 'nitropack';

export default defineNitroConfig({
  srcDir: '.',
  preset: 'vercel',
  output: {
    dir: '.output',
    serverDir: '.output/server',
    publicDir: '.output/public'
  },
  vercel: {
    config: {
      functions: {
        'api/auth/**/*.ts': {
          runtime: 'nodejs18.x'
        }
      }
    }
  }
});