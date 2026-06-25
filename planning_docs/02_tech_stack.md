# 02. Tech Stack and Architecture

To build a robust, scalable, and beautifully designed application within a short time frame, we select the following industry-standard technologies.

## Framework & Language
- **Next.js 14+ (App Router)**: Next.js is the premier React framework for building production applications. App Router provides file-based routing, server components, and API routes out of the box, which is ideal for an AI application.
- **TypeScript**: Ensures strict typing, auto-completion, and catches bug compilation-time, making codebase maintenance straightforward.

## Styling & UI Components
- **Tailwind CSS**: A utility-first CSS framework that allows rapid UI construction directly within JSX. Required for shadcn/ui and supports responsive layouts effortlessly.
- **shadcn/ui**: Built on Radix UI primitives and Tailwind CSS. We use pre-built components (Cards, Buttons, Dialogs, Selects, Toasts, Tabs) to save styling time while maintaining a polished look.
- **Lucide React**: Clean, modern vector icon library.
- **Framer Motion**: Allows high-performance, fluid CSS animations, spring transitions, and interactive UI micro-behaviors.

## Data & Authentication Strategy
- **Authentication**: We implement a clean, abstract auth service layer (`lib/auth/service.ts`).
  - **Local persistence fallback**: Stores user credentials, session state, and user settings inside `localStorage`.
  - **Why?** It ensures that whoever reviews the project can register and log in instantly without needing to configure backend DB keys.
  - **Ready for Supabase/Auth.js**: The service layer exposes standard methods (`login`, `signup`, `logout`, `getUser`), making it easy to swap in Supabase Auth by changing the service file.
- **Database & User Credits**: Simulates database operations inside local state/storage. Users start with 5 free generation credits. They can buy Pro (Premium Flow) to get unlimited credits.

## AI Generation Architecture
- **Route Handler (`app/api/generate/route.ts`)**:
  - Receives post request: `{ prompt: string, tone: string, length: string }`.
  - Checks if `GEMINI_API_KEY` is present.
  - **If key present**: Uses `@google/generative-ai` to query `gemini-1.5-flash` with a tailored prompt constraint.
  - **If key missing**: Executes a robust rule-based mock engine that generates tailored emails based on templates matching the prompt and tone, returning it with a `1.5s` synthetic delay to mimic real AI API calls.
- **Front-end display**: Uses a custom react hook to animate the output characters one-by-one (typewriter effect), creating an immersive experience.

## Testing Setup
- **Vitest**: Modern, fast runner to run unit and integration tests.
- **React Testing Library**: Validates UI component render states, click interactions, and form submissions.
