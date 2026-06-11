import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    server: {
        port: 55296,
        proxy: {
            "/api": {
                target: "http://localhost:5252",
                changeOrigin: true,
                secure: false
            }
        }
    }
})