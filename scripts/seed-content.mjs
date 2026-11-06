import fs from 'node:fs';
import path from 'node:path';

const discDir = path.resolve('src/content/disciplinas');
const normDir = path.resolve('src/content/normas');

// Clear existing
fs.rmSync(discDir, { recursive: true, force: true });
fs.rmSync(normDir, { recursive: true, force: true });
fs.mkdirSync(discDir, { recursive: true });
fs.mkdirSync(normDir, { recursive: true });

// 1. Mandatory Courses
const percursoContent = fs.readFileSync('percurso.qmd', 'utf8');
const periodSections = percursoContent.split(/<h3 class="mt-0">([0-9]+)º Período/);
let mandatoryCount = 0;

for (let i = 1; i < periodSections.length; i += 2) {
  const period = parseInt(periodSections[i], 10);
  const sectionText = periodSections[i + 1];
  
  const dRegex = /<details class="cagp-discipline"[^>]*>[\s\S]*?<strong>([A-Za-z]{3}\s+[0-9A-Za-z]{3}):\s*([^<]+)<\/strong>[\s\S]*?([0-9]+)h[\s\S]*?<p><strong>Ementa Oficial:<\/strong>\s*([\s\S]*?)<\/p>[\s\S]*?<\/details>/g;
  let dMatch;
  while ((dMatch = dRegex.exec(sectionText)) !== null) {
    const code = dMatch[1].trim();
    const name = dMatch[2].trim();
    const ch = parseInt(dMatch[3], 10);
    const ementa = dMatch[4].trim().replace(/\s+/g, ' ');
    const slug = code.toLowerCase().replace(/\s+/g, '-');
    const prereq = code === 'ECN 044' ? ['ECN 140'] : [];
    
    const obj = {
      codigo: code,
      nome: name,
      natureza: 'obrigatoria',
      periodo: period,
      ch: ch,
      ementa: ementa,
      preRequisitos: prereq,
      modulo: period <= 3 ? 'Geral' : period <= 7 ? 'Complementar' : 'Avançado'
    };
    
    fs.writeFileSync(path.join(discDir, `${slug}.json`), JSON.stringify(obj, null, 2), 'utf8');
    mandatoryCount++;
  }
}
console.log(`[Seed] Seeded ${mandatoryCount} mandatory courses.`);

// 2. Electives
const optativasContent = fs.readFileSync('optativas.qmd', 'utf8');
const optDetails = optativasContent.match(/<details class="cagp-discipline cagp-opt-card"[\s\S]*?<\/details>/g) || [];
let optCount = 0;

const optRegex = /<details class="cagp-discipline cagp-opt-card"[^>]*>[\s\S]*?<strong>([A-Za-z]{3}\s+[0-9A-Za-z]{3}):\s*([^<]+)<\/strong>[\s\S]*?([0-9]+)h[\s\S]*?<p><strong>Ementa Oficial:<\/strong>\s*([\s\S]*?)<\/p>[\s\S]*?<\/details>/;

optDetails.forEach((d) => {
  const m = optRegex.exec(d);
  if (m) {
    const code = m[1].trim();
    const name = m[2].trim();
    const ch = parseInt(m[3], 10);
    const ementa = m[4].trim().replace(/\s+/g, ' ');
    const rawSlug = (code.toLowerCase() + '-' + name.toLowerCase())
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 45);
    const slug = `opt-${rawSlug}`;
    
    const obj = {
      codigo: code,
      nome: name,
      natureza: 'optativa',
      ch: ch,
      ementa: ementa,
      preRequisitos: [],
      modulo: 'Optativa'
    };
    
    fs.writeFileSync(path.join(discDir, `${slug}.json`), JSON.stringify(obj, null, 2), 'utf8');
    optCount++;
  }
});
console.log(`[Seed] Seeded ${optCount} elective courses.`);

// 3. Norms
const canonicalNorms = [
  {
    slug: 'ppc-gestao-publica-2020',
    titulo: 'Projeto Pedagógico do Curso de Gestão Pública (PPC 2020)',
    orgao: 'Colegiado de Gestão Pública / FAFICH / UFMG',
    ano: 2020,
    resumo: 'Regulamenta a estrutura de 3.000h totais, 2.880h do Núcleo Específico, 120h de Formação Livre, 300h de Extensão Obrigatória e até 300h de AAC.',
    arquivo: '/documentos/ppc-gestao-publica-ufmg.pdf'
  },
  {
    slug: 'regulamento-curso-n20229',
    titulo: 'Regulamento do Curso Versão N-20229',
    orgao: 'Colegiado de Gestão Pública',
    ano: 2022,
    resumo: 'Define as normas operacionais de matrícula, pré-requisitos formais (ECN 044 exige ECN 140), estágios e colação de grau.',
    arquivo: '/documentos/regulamento-gestao-publica-ufmg.pdf'
  },
  {
    slug: 'regimento-interno-cagp-2024',
    titulo: 'Regimento Interno do CAGP',
    orgao: 'Centro Acadêmico de Gestão Pública',
    ano: 2024,
    resumo: 'Estatuto de governança discente, princípios de gestão transparente e representação nos colegiados.',
    arquivo: '/documentos/regimento-interno-cagp-ufmg.pdf'
  },
  {
    slug: 'resolucao-cepe-06-2019-aproveitamento',
    titulo: 'Resolução CEPE 06/2019 — Aproveitamento de Estudos',
    orgao: 'Conselho de Ensino, Pesquisa e Extensão (CEPE/UFMG)',
    ano: 2019,
    resumo: 'Fixa o prazo decadencial de protocolo de aproveitamento até o final do 2º período letivo após o ingresso.',
    arquivo: '/documentos/resolucao-cepe-06-2019-aproveitamento-estudos.pdf'
  },
  {
    slug: 'resolucao-cepe-02-2009-estagio',
    titulo: 'Resolução CEPE 02/2009 — Estágios na UFMG',
    orgao: 'Conselho de Ensino, Pesquisa e Extensão (CEPE/UFMG)',
    ano: 2009,
    resumo: 'Regras para convênios de estágio, relatórios semestrais e finais e dispensa pelo Art. 41.',
    arquivo: '/documentos/resolucao-cepe-02-2009-estagio-ufmg.pdf'
  }
];

for (const n of canonicalNorms) {
  const { slug, ...data } = n;
  fs.writeFileSync(path.join(normDir, `${slug}.json`), JSON.stringify(data, null, 2), 'utf8');
}
console.log(`[Seed] Seeded ${canonicalNorms.length} canonical norms.`);
