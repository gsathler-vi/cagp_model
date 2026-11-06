// CAGP UFMG — Service Worker Oficial (PWA Offline & Anti-Lie-Fi)
const CACHE_NAME = 'cagp-pwa-v1793963574781';
const PRECACHE_ASSETS = [
  "/.nojekyll",
  "/_astro/AcgCalculatorCore.DOx30k5l.js",
  "/_astro/AcgCalculatorWidget.DJiFXXJG.js",
  "/_astro/AcgGuardianCore.CP5nR6Cm.js",
  "/_astro/AcgGuardianWidget.CP1T-2JJ.js",
  "/_astro/Art41SimulatorCore.Cv2SE3rZ.js",
  "/_astro/Art41Widget.W_CV_9z5.js",
  "/_astro/AvatarRenderer.BC0cGbN2.js",
  "/_astro/BaseLayout.zeeVaDuT.css",
  "/_astro/BottomNav.astro_astro_type_script_index_0_lang.DsV2IKHW.js",
  "/_astro/BottomSheet.Cr9ZlP3l.js",
  "/_astro/CalouroChecklistCore.IZEQ4CIq.js",
  "/_astro/CalouroChecklistWidget.DRE_e09V.js",
  "/_astro/ClientRouter.astro_astro_type_script_index_0_lang.DXqcZz58.js",
  "/_astro/CurriculumDossierWidget.DrvFzR36.js",
  "/_astro/CurriculumGraphDynamic.DKYa5nw_.js",
  "/_astro/CurriculumGraphWidget.CUZh4fk-.js",
  "/_astro/DesktopFloatingDock.Dw88239N.js",
  "/_astro/GlobalSheets.DGrtkCR0.js",
  "/_astro/HomeHeroHub.BhAqGqvs.js",
  "/_astro/MobileDrawer.astro_astro_type_script_index_0_lang.DAmnuIhm.js",
  "/_astro/OptativasCatalogExplorer.xeBOCe-C.js",
  "/_astro/OverviewCalcWidget.DFcSWuWP.js",
  "/_astro/OverviewCalouroWidget.BQDgbXSm.js",
  "/_astro/OverviewGuardianWidget.DUjFo6eq.js",
  "/_astro/OverviewStageWidget.DsbE153f.js",
  "/_astro/SettingsInteractive.bRWRH-G8.js",
  "/_astro/StudentDossierTracker.CUiMY4fg.js",
  "/_astro/SuperAppHeader.astro_astro_type_script_index_0_lang.DXudVMKV.js",
  "/_astro/SuperAppWelcomeModal.DzgdL40v.js",
  "/_astro/avatarHelper.CxntxNu5.js",
  "/_astro/client.DhKIrtAU.js",
  "/_astro/ics.DfNGFypq.js",
  "/_astro/icsGenerator.DXgYzzPy.js",
  "/_astro/jsx-runtime.CNO_G2AP.js",
  "/_astro/paths.jZAEuws9.js",
  "/_astro/react-dom.CF8fzYW_.js",
  "/_astro/react.CmU_e8vp.js",
  "/_astro/rolldown-runtime.WkwZ5CU-.js",
  "/_astro/shortcutsCatalog.B3KIx1X_.js",
  "/acg/index.html",
  "/acg/",
  "/acg",
  "/calouros/index.html",
  "/calouros/",
  "/calouros",
  "/configuracoes/index.html",
  "/configuracoes/",
  "/configuracoes",
  "/curso/index.html",
  "/curso/",
  "/curso",
  "/documentos/cne-dcn-educacao-ambiental-2012.pdf",
  "/documentos/cne-dcn-educacao-direitos-humanos-2012.pdf",
  "/documentos/cne-dcn-relacoes-etnico-raciais-2004.pdf",
  "/documentos/cne-parecer-003-2004-relacoes-etnico-raciais.pdf",
  "/documentos/declaracao-atividade-avaliativa.pdf",
  "/documentos/depoimentos-de-egressos.pdf",
  "/documentos/dti-office365-criacao-conta.pdf",
  "/documentos/ementario-gestao-publica-ufmg/index.html",
  "/documentos/ementario-gestao-publica-ufmg/",
  "/documentos/ementario-gestao-publica-ufmg",
  "/documentos/ementario-gestao-publica-ufmg.pdf",
  "/documentos/estagio-manual-orientacoes-fafich.pdf",
  "/documentos/estagio-modelo-plano-de-atividades.docx",
  "/documentos/estagio-modelo-plano-de-atividades.pdf",
  "/documentos/estagio-modelo-relatorio-final.docx",
  "/documentos/estagio-modelo-relatorio-final.pdf",
  "/documentos/estagio-modelo-relatorio-semestral.docx",
  "/documentos/estagio-modelo-relatorio-semestral.pdf",
  "/documentos/estagio-modelo-termo-de-compromisso-com-convenio.docx",
  "/documentos/estagio-modelo-termo-de-compromisso-com-convenio.pdf",
  "/documentos/estagio-modelo-termo-de-compromisso-sem-vinculo.docx",
  "/documentos/estagio-modelo-termo-de-compromisso-sem-vinculo.pdf",
  "/documentos/estagio-relatorio-atividades-experiencia-profissional.docx",
  "/documentos/estagio-relatorio-atividades-experiencia-profissional.pdf",
  "/documentos/estagio-requerimento-integralizacao-experiencia-profissional.docx",
  "/documentos/estagio-requerimento-integralizacao-experiencia-profissional.pdf",
  "/documentos/fca-formacao-complementar-aberta.pdf",
  "/documentos/forma-ingresso-obtencao-novo-titulo.pdf",
  "/documentos/forma-ingresso-reopcao.pdf",
  "/documentos/forma-ingresso-sisu.pdf",
  "/documentos/index.html",
  "/documentos/",
  "/documentos",
  "/documentos/manual-aplicativo-siga-ufmg.pdf",
  "/documentos/percurso-bacharelado-nucleo-avancado/index.html",
  "/documentos/percurso-bacharelado-nucleo-avancado/",
  "/documentos/percurso-bacharelado-nucleo-avancado",
  "/documentos/percurso-bacharelado-nucleo-avancado.pdf",
  "/documentos/percurso-bacharelado-nucleo-complementar/index.html",
  "/documentos/percurso-bacharelado-nucleo-complementar/",
  "/documentos/percurso-bacharelado-nucleo-complementar",
  "/documentos/percurso-bacharelado-nucleo-complementar.pdf",
  "/documentos/percurso-bacharelado-nucleo-geral/index.html",
  "/documentos/percurso-bacharelado-nucleo-geral/",
  "/documentos/percurso-bacharelado-nucleo-geral",
  "/documentos/percurso-bacharelado-nucleo-geral.pdf",
  "/documentos/portaria-prae-1286-2026-permanencia-estudantil.pdf",
  "/documentos/ppc-gestao-publica-ufmg/index.html",
  "/documentos/ppc-gestao-publica-ufmg/",
  "/documentos/ppc-gestao-publica-ufmg",
  "/documentos/ppc-gestao-publica-ufmg.pdf",
  "/documentos/recepcao-calouros-2023-2.pdf",
  "/documentos/recepcao-ingressantes-2024-2.pdf",
  "/documentos/regimento-geral-ufmg.pdf",
  "/documentos/regimento-interno-cagp-ufmg/index.html",
  "/documentos/regimento-interno-cagp-ufmg/",
  "/documentos/regimento-interno-cagp-ufmg",
  "/documentos/regimento-interno-cagp-ufmg.pdf",
  "/documentos/regulamento-gestao-publica-ufmg/index.html",
  "/documentos/regulamento-gestao-publica-ufmg/",
  "/documentos/regulamento-gestao-publica-ufmg",
  "/documentos/regulamento-gestao-publica-ufmg.pdf",
  "/documentos/requerimento-aproveitamento-de-estudos-colegiado.pdf",
  "/documentos/requerimento-aproveitamento-de-estudos-drca.pdf",
  "/documentos/requerimento-atividade-integralizadora-credito-v20152.pdf",
  "/documentos/requerimento-atividade-integralizadora-credito-v20229.pdf",
  "/documentos/requerimento-avaliacao-medica.pdf",
  "/documentos/requerimento-formacao-complementar-aberta-fca.pdf",
  "/documentos/requerimento-inclusao-nome-social.pdf",
  "/documentos/requerimento-inscricao-colacao-de-grau-colegiado.pdf",
  "/documentos/requerimento-inscricao-colacao-de-grau-drca.pdf",
  "/documentos/requerimento-inscricao-exame-especial.pdf",
  "/documentos/requerimento-matricula-disciplina-isolada.pdf",
  "/documentos/requerimento-matricula-formacao-livre.pdf",
  "/documentos/requerimento-matricula-pos-graduacao.pdf",
  "/documentos/requerimento-mudanca-de-turno.pdf",
  "/documentos/requerimento-mudanca-percurso-curricular-drca.pdf",
  "/documentos/requerimento-mudanca-percurso-modalidade-habilitacao-enfase.pdf",
  "/documentos/requerimento-prioridade-registro-diploma.pdf",
  "/documentos/requerimento-regime-especial-graduacao.pdf",
  "/documentos/requerimento-revisao-desligamento-plano-estudos-colegiado.pdf",
  "/documentos/requerimento-revisao-desligamento-plano-integralizacao-drca.pdf",
  "/documentos/requerimento-trancamento-parcial-matricula.pdf",
  "/documentos/requerimento-trancamento-total-matricula.pdf",
  "/documentos/requerimento-transferencia-outra-ies.pdf",
  "/documentos/resolucao-01-2016-formacao-complementar-aberta.pdf",
  "/documentos/resolucao-01-2018-altera-formacao-complementar-aberta.pdf",
  "/documentos/resolucao-01-2019-estagio-curricular.pdf",
  "/documentos/resolucao-01-2020-atividades-integralizadoras-credito.pdf",
  "/documentos/resolucao-03-2016-modalidade-ead.pdf",
  "/documentos/resolucao-05-2016-mobilidade-estudantil.pdf",
  "/documentos/resolucao-07-2016-planejamento-horario.pdf",
  "/documentos/resolucao-08-2016-distribuicao-vagas-remanescentes.pdf",
  "/documentos/resolucao-cepe-01-2018-normas-gerais-graduacao.pdf",
  "/documentos/resolucao-cepe-02-2009-estagio-ufmg.pdf",
  "/documentos/resolucao-cepe-06-2019-aproveitamento-estudos.pdf",
  "/documentos/resolucao-cepe-11-2018-regras-transicao-graduacao.pdf",
  "/documentos/resolucao-cepe-19-2014-formacao-transversal.pdf",
  "/documentos/resolucao-congrega-02-2018-concurso-tcc.pdf",
  "/documentos/resolucao-prae-09-2015-nome-social.pdf",
  "/documentos/resolucao-ufmg-07-2025-contra-o-assedio.pdf",
  "/documentos/roteiro-comprovacao-conhecimentos-estudante.pdf",
  "/documentos/roteiro-regime-especial-raep-estudante.pdf",
  "/documentos/termo-aceite-orientador-tcc.pdf",
  "/documentos/transcricao-recepcao-ingressantes-2024-2/index.html",
  "/documentos/transcricao-recepcao-ingressantes-2024-2/",
  "/documentos/transcricao-recepcao-ingressantes-2024-2",
  "/estagio/index.html",
  "/estagio/",
  "/estagio",
  "/estagio-tcc/index.html",
  "/estagio-tcc/",
  "/estagio-tcc",
  "/faq/index.html",
  "/faq/",
  "/faq",
  "/gestao/index.html",
  "/gestao/",
  "/gestao",
  "/imagens/campanha-permanecer-fump.png",
  "/imagens/carteirinha.png",
  "/imagens/conexaowifi.png",
  "/imagens/dast-novo-bh.jpg",
  "/imagens/folheto-semana-do-servidor-ufmg-moc-02-1.jpg",
  "/imagens/guia-acesso-biblioteca.png",
  "/imagens/guia-acesso-sistemas.png",
  "/imagens/guia-alimentacao-no-campus.png",
  "/imagens/helis-grande.png",
  "/imagens/mapa-centro2.jpg",
  "/imagens/mapa-minas.jpg",
  "/imagens/mapa-moc-722x1024.jpg",
  "/imagens/mapa-pampulha-detalhado.jpg",
  "/imagens/mapa-saude.jpg",
  "/imagens/mapas-dos-campi.png",
  "/imagens/mapas-site-viver2026-723x1024.jpg",
  "/imagens/og-padrao.png",
  "/imagens/os-candangos.jpg",
  "/imagens/passo-a-passo-assistencia-fump.jpg",
  "/imagens/pwa/apple-touch-icon.png",
  "/imagens/pwa/pwa-192x192.png",
  "/imagens/pwa/pwa-512x512.png",
  "/imagens/pwa/pwa-icon.svg",
  "/imagens/pwa/pwa-maskable-512x512.png",
  "/imagens/tutoriais/print-mudanca-percurso-1.png",
  "/imagens/tutoriais/print-requerimento-aac-1.png",
  "/imagens/tutoriais/print-termo-estagio-1.png",
  "/imagens/yaku-932x1024.png",
  "/index.html",
  "/",
  "/logos/cagp/01_vertical_fundo_claro.svg",
  "/logos/cagp/02_vertical_transparente_positivo.svg",
  "/logos/cagp/03_vertical_fundo_escuro.svg",
  "/logos/cagp/04_vertical_transparente_negativo.svg",
  "/logos/cagp/05_horizontal_fundo_claro.svg",
  "/logos/cagp/06_horizontal_transparente_positivo.svg",
  "/logos/cagp/07_horizontal_fundo_escuro.svg",
  "/logos/cagp/08_horizontal_transparente_negativo.svg",
  "/logos/cagp/09_simbolo_fundo_claro.svg",
  "/logos/cagp/10_simbolo_transparente_positivo.svg",
  "/logos/cagp/11_simbolo_fundo_escuro.svg",
  "/logos/cagp/12_simbolo_transparente_negativo.svg",
  "/logos/cagp/13_horizontal_cagp_essencial.svg",
  "/logos/fump/01-fump-logo-branco-fundo-colorido-sigla.jpeg",
  "/logos/fump/02-fump-logo-branco-fundo-colorido.png",
  "/logos/fump/03-fump-logo-colorido-fundo-branco-sigla.jpeg",
  "/logos/fump/03-fump-sinae-logo-colorido-fundo-branco.png",
  "/logos/interno-rotas/capa-mapa-natal.svg",
  "/logos/interno-rotas/capa.svg",
  "/logos/interno-rotas/icone.svg",
  "/logos/interno-rotas/logo-horizontal.svg",
  "/logos/interno-rotas/logo.svg",
  "/logos/interno-rotas/marker.svg",
  "/logos/minhaufmg/logo-minha-ufmg.png",
  "/logos/semente_logo_fundo_laranja.png",
  "/logos/siga/siga-ufmg-fundo-azul.webp",
  "/logos/siga/siga-ufmg-fundo-branco.webp",
  "/logos/ufmg/aplicacoes/branco-completa-ufmg.jpg",
  "/logos/ufmg/aplicacoes/branco-ufmg.jpg",
  "/logos/ufmg/aplicacoes/negativo-completa-ufmg.jpg",
  "/logos/ufmg/aplicacoes/negativo-ufmg.jpg",
  "/logos/ufmg/aplicacoes/preto-completa-ufmg.jpg",
  "/logos/ufmg/aplicacoes/preto-ufmg.jpg",
  "/logos/ufmg/aplicacoes/principal-completa-ufmg.jpg",
  "/logos/ufmg/aplicacoes/principal-completa2-ufmg.jpg",
  "/logos/ufmg/aplicacoes/principal-completa3-ufmg.jpg",
  "/logos/ufmg/aplicacoes/principal-ufmg.jpg",
  "/logos/ufmg/assinaturas/cac-ufmg.jpg",
  "/logos/ufmg/assinaturas/copi-ufmg.jpg",
  "/logos/ufmg/assinaturas/dai-ufmg.jpg",
  "/logos/ufmg/assinaturas/ddcs-ufmg.jpg",
  "/logos/ufmg/assinaturas/dri-ufmg.jpg",
  "/logos/ufmg/assinaturas/dti-ufmg.jpg",
  "/logos/ufmg/assinaturas/nai-ufmg.png",
  "/logos/ufmg/assinaturas/ordem-ufmg.jpg",
  "/logos/ufmg/assinaturas/pj-ufmg.jpg",
  "/logos/ufmg/assinaturas/pra-ufmg.jpg",
  "/logos/ufmg/assinaturas/prae-ufmg.png",
  "/logos/ufmg/assinaturas/principal-ufmg.jpg",
  "/logos/ufmg/assinaturas/proex-ufmg.jpg",
  "/logos/ufmg/assinaturas/prograd-ufmg.jpg",
  "/logos/ufmg/assinaturas/prograd-ufmg.png",
  "/logos/ufmg/assinaturas/proplan-ufmg.jpg",
  "/logos/ufmg/assinaturas/prorh-ufmg.jpg",
  "/logos/ufmg/assinaturas/prpg-ufmg.jpg",
  "/logos/ufmg/assinaturas/prpq-ufmg.jpg",
  "/manifest.webmanifest",
  "/mapa-do-site/index.html",
  "/mapa-do-site/",
  "/mapa-do-site",
  "/optativas/index.html",
  "/optativas/",
  "/optativas",
  "/percurso/index.html",
  "/percurso/",
  "/percurso",
  "/pesquisa/index.html",
  "/pesquisa/",
  "/pesquisa",
  "/sobre/index.html",
  "/sobre/",
  "/sobre",
  "/tcc/index.html",
  "/tcc/",
  "/tcc"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          fetch(url)
            .then((res) => {
              if (res.ok) return cache.put(url, res);
            })
            .catch(() => {})
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Ambiente Local / Preview: Sempre direto da rede para evitar cache obsoleto durante testes
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '0.0.0.0') {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  // Navegação: Network-first com anti-Lie-Fi timeout de 2.5s
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Anti-Lie-Fi timeout (2.5s)')), 2500)
          );
          const networkResponse = await Promise.race([fetch(req), timeoutPromise]);
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(req, networkResponse.clone());
            return networkResponse;
          }
        } catch (_) {
          // Fallback para cache imediato
        }
        const cached = await caches.match(req);
        if (cached) return cached;
        const dirPath = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname + '/index.html';
        const dirCached = await caches.match(dirPath);
        if (dirCached) return dirCached;
        const indexCached = await caches.match('/index.html') || await caches.match('/');
        if (indexCached) return indexCached;
        return new Response('Sem conexão e sem cache disponível.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })()
    );
    return;
  }

  // Documentos, assets e fontes: Cache-first com revalidação em background
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        fetch(req).then((res) => {
          if (res && res.status === 200) {
            caches.open(CACHE_NAME).then((c) => c.put(req, res));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(req).then((res) => {
        if (res && res.status === 200) {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, resClone));
        }
        return res;
      });
    })
  );
});
