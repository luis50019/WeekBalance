import { defineCollection, z } from "astro:content";

const docs = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string({ error: "El titulo es obligatorio" }).min(1),
    description: z.string({ error: "La descripcion es obligatoria" }).min(1),
    slug: z.string({ error: "El slug es obligatorio" }).min(1),
    sidebar: z.object({
      label: z.string({ error: "El label es obligatorio" }).min(1),
      order: z.number({ error: "El orden es obligatorio" }).int(),
      group: z.string().optional(),
    }),
    updatedAt: z.string().optional(),
  }),
});

export const collections = { docs };
