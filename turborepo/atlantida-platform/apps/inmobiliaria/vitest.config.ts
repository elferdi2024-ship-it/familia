import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        include: ['__tests__/**/*.test.{ts,tsx}'],
        exclude: ['node_modules', '.next'],
        css: false,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['lib/**', 'hooks/**', 'contexts/**', 'components/**'],
            exclude: ['**/*.d.ts', '**/*.test.*'],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '.'),
            '@repo/lib': path.resolve(__dirname, '../../packages/lib/src'),
            '@repo/types': path.resolve(__dirname, '../../packages/types/src'),
            '@repo/ui': path.resolve(__dirname, '../../packages/ui/src'),
        },
    },
})
