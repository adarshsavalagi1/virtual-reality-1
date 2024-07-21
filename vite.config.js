import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Load the certificate and key
const cert = fs.readFileSync(path.resolve(__dirname, 'cert.pem'));
const key = fs.readFileSync(path.resolve(__dirname, 'key.pem'));

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key,
      cert,
    },
    port: 3000, // You can change this to your preferred port
  },
});
