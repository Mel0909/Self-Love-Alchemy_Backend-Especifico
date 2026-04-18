import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  
  resolve: {
    alias: [
      { 
        find: '@/backend', 
        replacement: resolve(__dirname, './src/app/(backend)') 
      },
      { 
        find: '@/frontend', 
        replacement: resolve(__dirname, './src/app/(frontend)') 
      },
      { 
        find: '@', 
        replacement: resolve(__dirname, './src') 
      },
    ],
  },
  plugins: [react()],
  test: {
    environment: 'node',
    
    include: ['src/tests/**/*.test.ts'], 
    exclude: ['tests/e2e/**'],
    
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './tests/coverage',
      include: ['src/**'],
      exclude: [
        'src/generated/**',
        'src/components/ui/**',
        '**/*.d.ts',
      ],
    },
    server: {
      deps: {
        inline: ['next']
      }
    },
  }
})