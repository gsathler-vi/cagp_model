import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const disciplinas = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/disciplinas' }),
  schema: z.object({
    codigo: z.string(),
    nome: z.string(),
    natureza: z.enum(['obrigatoria', 'optativa']),
    periodo: z.number().optional(),
    ch: z.number(),
    ementa: z.string(),
    preRequisitos: z.array(z.string()).default([]),
    modulo: z.string().optional(),
  }),
});

const normas = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/normas' }),
  schema: z.object({
    titulo: z.string(),
    orgao: z.string(),
    ano: z.number(),
    resumo: z.string(),
    arquivo: z.string().optional(),
  }),
});

const documentosOficiais = defineCollection({
  loader: glob({ pattern: '[!R]*.md', base: './_referencias/documentos-oficiais' }),
  schema: z.record(z.string(), z.any()),
});

export const collections = { disciplinas, normas, documentosOficiais };

