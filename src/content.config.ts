import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    source: z.enum(['essay', 'newsletter']),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    linkedinUrl: z.string().url().optional(),
  }),
});

export const collections = { writing };
