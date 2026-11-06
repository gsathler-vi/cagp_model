/**
 * paths.ts — Resolvedor Canônico de Caminhos Base para Assets Estáticos e Rotas
 * Garante paridade entre desenvolvimento local (base = '/') e GitHub Pages (base = '/cagp').
 */

/**
 * Retorna o caminho de um asset estático (imagens, logos, PDFs em public/) com o base path prefixado.
 * Exemplo: asset('/logos/cagp/emblema.svg') -> '/cagp/logos/cagp/emblema.svg'
 */
export function asset(path: string): string {
  const rawBase = import.meta.env.BASE_URL || '/';
  const cleanBase = rawBase.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

/**
 * Retorna uma rota interna com o base path prefixado.
 * Exemplo: route('/curso') -> '/cagp/curso'
 */
export function route(path: string): string {
  const rawBase = import.meta.env.BASE_URL || '/';
  const cleanBase = rawBase.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/') {
    return cleanBase ? `${cleanBase}/` : '/';
  }
  return `${cleanBase}${cleanPath}`;
}
