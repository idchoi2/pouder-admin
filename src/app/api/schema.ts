import { z } from 'zod'

export const bookmarkGenerateScheme = z.object({
  title: z.string(),
  // website_field: z.nativeEnum(Website_Field),
  // website_type: z.nativeEnum(Website_Type),
  // type: z.string(),
  bookmark_field: z.string(),
  tags: z.array(z.string()),
})

export const bookmarkFieldGenerateScheme = z.object({
  emoji: z.string(),
  label_ko: z.string(),
  label_en: z.string(),
})
