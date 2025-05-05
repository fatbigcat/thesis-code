# Essay Grading Webapp: Project Goals and Needs (Checklist Format)

## Main Goals

- [ ] Enable essay grading based on user-uploaded grading instructions.
- [ ] Use OpenAI API to grade essays following structured grading rubrics.
- [ ] Support argumentative/reflective essay grading.
- [ ] Support interpretative essay grading.
- [ ] Provide detailed feedback via visual annotations.
- [ ] Allow students to export graded essays.
- [ ] Enable teachers to save, review, and comment on graded essays.

## Technical Needs

- [ ] Parse grading instructions into discrete evaluation criteria.
- [ ] Implement multi-criteria evaluation system:
  - [ ] Grade each criterion separately.
  - [ ] Calculate weighted final score.
- [ ] Integrate confidence scoring for each subgrade.
- [ ] Flag low-confidence areas for mandatory manual teacher review.
- [ ] Apply multi-layered evaluation:
  - [ ] Initial grading with LLM.
  - [ ] Self-evaluation by LLM.
  - [ ] Human review required for flagged items.
- [ ] Implement iterative grading:
  - [ ] Generate multiple evaluations.
  - [ ] Select most confident/best evaluation.
  - [ ] Apply True/False self-verification step.
- [ ] Ensure system scalability and extensibility for future updates.

## AI Prompt Engineering Requirements

- [ ] Design specialized prompts for each grading category.
- [ ] Include few-shot examples in prompts.
- [ ] Handle essay structure and enforce minimum length constraints.
- [ ] Implement re-evaluation triggers for low-confidence scoring.

## Teacher/Student UX Needs

### Teacher Mode

- [ ] Upload grading instructions.
- [ ] Review and edit AI-graded essays.
- [ ] Save graded essays with student metadata.

### Student Mode

- [ ] Upload essay and grading instructions (or select public templates).
- [ ] Receive marked essay and structured feedback.
- [ ] Download graded essay (without permanent storage unless teacher account).

### Interface Features

- [ ] Visual annotation of feedback on essay text.
- [ ] Different highlight colors for grammar, content, and style issues.
- [ ] Manual review interface for flagged (low-confidence) sections.

## Stretch Goals (Future Versions)

- [ ] Implement AHP (Analytic Hierarchy Process) for weight optimization.
- [ ] Add True/False verification layer.
- [ ] Auto-adjust rubric weights based on AI vs teacher feedback.
- [ ] Provide token-level granular feedback.
- [ ] Build historical grading analysis dashboards for teachers.

---

> This checklist is optimized for task tracking by an LLM agent or human project manager.
