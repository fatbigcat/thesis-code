import { z } from "zod";

export const InstructionSchema = z.object({
  type: z.enum(["argumentative", "interpretative"]),
  theme: z.string(),
  title: z.string(),
  prompt: z.string(),
  time: z.string(),
});

export const CriterionSchema = z.object({
  label: z.string(),
  title: z.string(),
  details: z.string(),
  scoring_guidelines: z.string(),
  taxonomy_level: z.string(),
  parent: z.string().nullable(),
});

export const SpecificationSchema = z.object({
  label: z.string(),
  title: z.string(),
  details: z.string(),
  max_points: z.number(),
  taxonomy_level: z.string(),
});

export const ParsedInstructionsSchema = z.object({
  instructions: z.array(InstructionSchema),
  criteria: z.array(CriterionSchema),
  specifications: z.array(SpecificationSchema),
});
