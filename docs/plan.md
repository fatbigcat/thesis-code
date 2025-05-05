# Essay Grading Webapp: Build Plan (Checklist Format)

## Backend Setup

- [ ] Set up Next.js API routes (or separate Express server).
- [ ] Create `/api/gradeEssay` endpoint to receive essays and instructions.
- [ ] Securely store OpenAI API key in environment variables.
- [ ] Create basic OpenAI call function for grading.
- [ ] Design initial grading prompt template.

## Essay Evaluation Logic

- [ ] Parse uploaded grading instructions.
- [ ] Split grading into multiple criteria (content, comparison, language, etc.).
- [ ] Implement grading flow per criterion.
- [ ] Aggregate individual scores into final grade.
- [ ] Integrate confidence scoring per section.
- [ ] Flag low-confidence sections for mandatory review.
- [ ] Annotate low-confidence sections in essay output.

## Database Setup (Teacher Mode)

- [ ] Set up PostgreSQL database.
- [ ] Create tables: `essays`, `grades`, `feedback`, `users`.
- [ ] Implement database connection (e.g., with Prisma or Drizzle).
- [ ] Implement save functionality for graded essays.
- [ ] Implement retrieval functionality for stored essays.

## Authentication and User Roles

- [ ] Implement login system (NextAuth.js or JWT).
- [ ] Differentiate Student and Teacher roles.
- [ ] Protect routes and UI based on roles.

## Frontend Enhancements

### Teacher Mode

- [ ] Build grading instructions upload form.
- [ ] Display parsed grading criteria.
- [ ] Build teacher manual review interface.
- [ ] Allow editing feedback and scores for flagged sections.

### Student Mode

- [ ] Build essay submission form.
- [ ] Allow selection of grading instructions template.
- [ ] Display graded essay with annotations.
- [ ] Allow essay export (PDF or Markdown).

### Interface Features

- [ ] Highlight grammar, content, and style issues with different colors.
- [ ] Show feedback on hover over highlighted text.
- [ ] Indicate low-confidence flagged sections.

## Evaluation Improvements (Stretch Goals)

- [ ] Implement iterative grading with multiple evaluations.
- [ ] Add AHP (Analytic Hierarchy Process) weighting system.
- [ ] Enable fine-tuning of grading prompt templates.
- [ ] Add true/false self-verification of scoring.

## Testing

- [ ] Test basic grading functionality.
- [ ] Test low-confidence flagging system.
- [ ] Test database storage and retrieval.
- [ ] Test authentication and role-based access.
- [ ] Test essay export functionality.

## Deployment

- [ ] Set up hosting (e.g., Vercel, Railway, Render).
- [ ] Set up production database.
- [ ] Configure environment variables for production.
- [ ] Deploy frontend and backend.

---

> This checklist will help you build the essay grading webapp step-by-step, covering backend, frontend, evaluation logic, testing, and deployment.
