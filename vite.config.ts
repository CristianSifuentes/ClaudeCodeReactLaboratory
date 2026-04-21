import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// @CONCEPT: React Compiler (React Forget) — 2026 Production Standard
// In a real 2026 setup you would add: babel-plugin-react-compiler
// to the plugins array below. It automatically memoizes components
// and values at build time, eliminating the need for manual
// useMemo / useCallback calls.
//
// Example (when installed):
//   import ReactCompilerPlugin from 'babel-plugin-react-compiler'
//   plugins: [react({ babel: { plugins: [ReactCompilerPlugin] } })]
//
// For this demo we use standard plugin-react; comments in components
// show exactly what the compiler would handle automatically.

export default defineConfig({
  plugins: [react()],
})
