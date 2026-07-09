import { defineConfig } from 'vite';   // Vite's configuration helper
import react from '@vitejs/plugin-react'; // React plugin for Fast Refresh

// https://vitejs.dev/config/
export default defineConfig({
  // Enable React Fast Refresh and JSX transform
  plugins: [react()],

  // Development server configuration
  server: {
    // Proxy: instead of calling the backend directly from the browser,
    // we ask Vite to forward all requests starting with /api
    proxy: {
      '/api': {
        target: 'https://localhost:5001', // Backend HTTPS URL
        changeOrigin: true,                // Required for virtual hosted sites
        secure: false,                     // ✅ Ignore self‑signed SSL certificate (dev only!)
      },
    },
  },
});