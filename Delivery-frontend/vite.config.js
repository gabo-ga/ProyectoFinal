import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: false,
    /*https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certificados/localhost+2-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certificados/localhost+2.pem')),
    }*/
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.js",
  },
});
