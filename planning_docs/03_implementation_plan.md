# 03. Implementation Plan

Our roadmap consists of 6 core phases to incrementally build, test, and polish the AI Email Generator.

---

## Phase 1: Initialization & Configurations
1. **Initialize Project**: Create a new Next.js project using Tailwind CSS, ESLint, and TypeScript.
2. **Setup Tailwind & shadcn/ui**: Configure the theme color palette (zinc/slate-based dark theme, primary violet/indigo, accents, glassmorphism utilities).
3. **Install Dependencies**: Install `framer-motion`, `lucide-react`, `sonner` (toast notifications), and API SDKs.
4. **Configuration**: Set up linting, TypeScript paths, and testing infrastructure (Vitest).

---

## Phase 2: Design System & Shared Layouts
1. **Global Styles**: Setup `app/globals.css` with dark-mode defaults, custom gradients, scrollbars, and helper utility classes.
2. **Layouts**: Implement the responsive Navigation Bar (glassmorphism header) and Footer.
3. **Common UI Library**: Initialize basic components like Buttons, Inputs, Textareas, Selects, Dialogs, Cards.

---

## Phase 3: Auth & Public Landing Pages
1. **Auth Service (`lib/auth/service.ts`)**: Implement login, signup, session recovery, and logout logic (using persistent localStorage fallback).
2. **Authentication Pages**: Create custom `/login` and `/signup` routes with animated form cards.
3. **Landing Page (`app/page.tsx`)**:
   - Hero banner with premium copy and simulated interactive dashboard graphics.
   - Core benefits and features grid.
   - Accordion FAQ component.
   - CTA banner linking directly to sign-up.

---

## Phase 4: Dashboard & Generator Engine
1. **Dashboard Page (`app/dashboard/page.tsx`)**:
   - Layout with user controls: prompt text area, tone selection cards, length slider.
   - "Generate" CTA button with active loading states.
   - Output workspace showing the generated email with writing animations.
   - Utility controls: "Copy to Clipboard" with dynamic checkmarks, "Edit Mode" toggler, and "Regenerate".
2. **API Route (`app/api/generate/route.ts`)**:
   - Structured JSON response parsing.
   - Setup prompt wrapper that shapes LLM outputs.
   - Implement the Gemini API client and fallback mock generator with delay.

---

## Phase 5: Premium Flow & Profile
1. **Pricing Page (`app/pricing/page.tsx`)**:
   - Comparison grids for Free vs. Pro.
   - Monthly/Yearly toggle with Framer Motion layout animations.
2. **Premium Upgrade Dialog**:
   - Interactive checkout modal (Card input fields with basic format validation).
   - "Processing payment" loading spinner followed by a success state.
   - Triggers user role upgrade to `PRO` in the global state, granting unlimited credits.
3. **Profile Page (`app/profile/page.tsx`)**:
   - Display avatar, email, current plan state.
   - Credit usage tracker.
   - Logout trigger.

---

## Phase 6: Testing & Verification
1. **Unit Testing**: Write unit tests for auth utilities, generation validation, and helper functions.
2. **Component Testing**: Test landing page links, dashboard generation form inputs, pricing toggle, and upgrade flows.
3. **Error Boundary Integration**: Add custom error boundary fallbacks to prevent white-screen crashes on failed client-side rendering.
