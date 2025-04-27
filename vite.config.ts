import { defineConfig } from "vite";
import path from "path";

export default defineConfig(({ mode }) => ({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        // Add popup and background script entry points if needed
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Chrome extension specific configuration
  define: {
    'process.env.VITE_CHROME_EXTENSION': JSON.stringify(true)
  }
}));
