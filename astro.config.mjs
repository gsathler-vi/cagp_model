// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Detecta automaticamente se o build está rodando no GitHub Actions para ajustar o base path
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const githubRepo = process.env.GITHUB_REPOSITORY || ''; // ex: "gsathler-vi/cagp"
const isUserPage = githubRepo.endsWith('.github.io');
const repoName = githubRepo.split('/')[1] || '';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  outDir: './dist',
  site: isGitHubActions && githubRepo
    ? `https://${githubRepo.split('/')[0]}.github.io`
    : 'https://cagp-ufmg.github.io',
  base: isGitHubActions && repoName && !isUserPage
    ? `/${repoName}`
    : '/',
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        '@astrojs/react/client.js',
      ],
    },
  },
  integrations: [react()],
});
