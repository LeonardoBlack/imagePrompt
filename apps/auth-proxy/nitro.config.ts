import { defineNitroConfig } from 'nitropack';

export default defineNitroConfig({
  srcDir: '.',
  preset: 'vercel',
  experimental: {
    wasm: true
  }
});