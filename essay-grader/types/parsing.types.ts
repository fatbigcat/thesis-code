export interface ParsedInstructionSheet {
  type: string;
  theme: string;
  title: string;
  prompt: string;
  time: string;
  specifications: ParsedSpecification[];
  instructions: ParsedInstruction[];
  languagePrompt?: string;
}

export interface ParsedSpecification {
  label: string;
  title: string;
  details: string;
  taxonomyLevel: string;
  parent?: string | null;
}

export interface ParsedInstruction {
  label: string;
  title: string;
  details: string;
  scoringGuidelines: string;
  parent?: string | null;
}
