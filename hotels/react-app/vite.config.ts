import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  server: {
    port: 5174,
    proxy: {
      '/cities': 'http://localhost:8005',
      '/users': 'http://localhost:8005',
      '/hotels': 'http://localhost:8005',
      '/bookings': 'http://localhost:8005',
      '/widget': 'http://localhost:8005',
      '/payments': 'http://localhost:8005',
    },
  },
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});
