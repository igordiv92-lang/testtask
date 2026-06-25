# Planning Documents Overview

To build a premium, production-grade AI Email Generator (called **VibeMail AI**) within the 48-hour timeline, we organize our preparation into structured markdown documents.

This folder is structured as follows:

| Filename | Purpose | Why We Use It |
| :--- | :--- | :--- |
| [`README.md`](file:///c:/Users/User/Desktop/tz/planning_docs/README.md) | Navigation & Rationale | Explains how the planning is structured and why these files exist. |
| [`01_idea_and_concept.md`](file:///c:/Users/User/Desktop/tz/planning_docs/01_idea_and_concept.md) | Product Vision & User Experience | Outlines the look & feel, landing page layout, core dashboard fields, pricing model, and user flows before we write any code. |
| [`02_tech_stack.md`](file:///c:/Users/User/Desktop/tz/planning_docs/02_tech_stack.md) | Tech Stack Choice & Architecture | Selects Next.js, Tailwind CSS, shadcn/ui, and Framer Motion, justifying how they fulfill the assignment's core and extra requirements. |
| [`03_implementation_plan.md`](file:///c:/Users/User/Desktop/tz/planning_docs/03_implementation_plan.md) | Phase-by-Phase Roadmap | Breaks development down into 6 key stages, starting with project setup and ending with verification and deployment. |
| [`04_tasks.md`](file:///c:/Users/User/Desktop/tz/planning_docs/04_tasks.md) | Granular Tasks Checklist | A checklist representing daily/hourly tasks, so progress can be tracked in real-time. |
| [`05_testing_strategy.md`](file:///c:/Users/User/Desktop/tz/planning_docs/05_testing_strategy.md) | Quality & Error Handling | Defines testing methods (Vitest, Component tests, boundary checks) to satisfy the "Будет плюсом" requirements. |
| [`06_ai_report_draft.md`](file:///c:/Users/User/Desktop/tz/planning_docs/06_ai_report_draft.md) | AI Dev Report Template | A placeholder to gather important prompts and decisions for the final report required by the assignment guidelines. |

---

## Why Structured This Way?

1. **Separation of Concerns**: Product designers can refine `01_idea_and_concept.md`, engineers can argue about `02_tech_stack.md`, and project managers can track progress via `04_tasks.md`.
2. **AI-Friendly Architecture**: LLM tools work best when files are narrow and highly focused. It reduces context-token overhead and avoids editing conflicts.
3. **Traceability**: By defining the AI Report template (`06_ai_report_draft.md`) first, we can easily keep track of which prompt led to which component structure, ensuring a stellar final submission.
