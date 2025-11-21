// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // lovable-tagger uniquement en dev (évite les warnings en build prod)
    mode === 'development' && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    host: '::',         // écoute sur IPv6 (fonctionne aussi IPv4)
    port: 8080,
    strictPort: true,   // évite que Vite prenne un autre port si 8080 occupé
    open: true,         // ouvre automatiquement le navigateur en dev
  },

  preview: {
    port: 4173,
    strictPort: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: true,    // super utile pour debugger en prod sur Vercel/Render
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui', 'lucide-react', 'class-variance-authority', 'tailwind-merge'],
        },
      },
    },
  },

  // Très important pour React Router en production (Vercel, Netlify, Render Static, etc.)
  base: '/', // change en "/mon-subfolder/" seulement si tu déploies dans un sous-dossier
}));
