import { z } from "zod";

export const ParsedInstructionsSchema = z.object({
  type: z.string(),
  theme: z.string(),
  title: z.string(),
  prompt: z.string(),
  time: z.string(),
  specifications: z.array(
    z.object({
      label: z.string(),
      title: z.string(),
      details: z.string(),
      taxonomyLevel: z.string(),
      parent: z.string().nullable().optional(),
    })
  ),
  instructions: z.array(
    z.object({
      label: z.string(),
      title: z.string(),
      details: z.string(),
      scoringGuidelines: z.string(),
      parent: z.string().nullable().optional(),
    })
  ),
  languagePrompt: z.string().optional().default(""),
});
