import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
  port: 5173,
  host: '0.0.0.0', // utile pour accéder via le réseau local
  fs: {
    allow: ['.']
  }
},
preview: {
  port: 8080
},
// PAS besoin de `historyApiFallback`, car Vite gère ça automatiquement

//   server: { port: 5173,     
//     historyApiFallback: true
//  }
});