export type Instruction = {
  type: "argumentative" | "interpretative";
  theme: string;
  title: string;
  prompt: string;
  time: string;
};

export type Criterion = {
  label: string;
  title: string;
  details: string;
  scoring_guidelines: string;
  taxonomy_level: string;
  parent: string | null;
};

export type Specification = {
  label: string;
  title: string;
  details: string;
  max_points: number;
  taxonomy_level: string;
};

export type ParsedInstructions = {
  instructions: Instruction[];
  criteria: Criterion[];
  specifications: Specification[];
};
