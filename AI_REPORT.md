# AI Development Report — VibeMail AI

This report documents the AI-assisted development workflow, model utilization, and prompt engineering strategies applied in the construction of the VibeMail AI MVP.

---

## 1. AI Tools & Models Applied

- **Gemini Agent (Antigravity)**: Served as the primary pairing assistant. Used to architect folder setups, build TS models, design responsive Tailwind structures, configure Vitest test layouts, and troubleshoot storage allocation limits.
- **Gemini 1.5 Flash (via SDK)**: Configured as the core LLM generator in `/api/generate` due to its high efficiency, low pricing, and strict adherence to formatting instructions.
- **Local Fallback Engine**: A rule-based mock parser with synthetic latency (1.2s delay) that mimics the Gemini API model when credentials are not configured.

---

## 2. Process and Methodology

1. **Structured Preparation**: Before writing any project code, we drafted comprehensive documentation files inside `planning_docs/` to isolate ideas, stack choices, tasks, and testing protocols.
2. **Environment Troubleshooting (Disk Limits)**: We detected a critical `0.00 GB` storage limit on the `C:` drive during project initialization. We executed a workaround:
   - Configured `npm` global caches to the `D:` drive (`D:\npm_cache`).
   - Created a Directory Junction linking `node_modules` to the `D:` drive (`D:\tz_node_modules`).
   - Temporarily moved documentation out of the workspace directory, initialized Next.js using `create-next-app` with `--skip-install`, restored files, and completed the install on the `D:` drive.
3. **Core Development**: Bootstrapped pages and routing components sequentially: Auth layer (`lib/auth/`) -> Layout & Navbar -> Landing Screen -> Dashboard Workspace -> Pricing Flow -> Profile Settings -> Error Boundary.
4. **Validation & Verification**: Added a unit testing suite under `test/` and verified it using Vitest.

---

## 3. Important AI Prompt Index (15 Key Prompts)

Below is the list of core prompts used to instruct the AI coding agent during development:

### Milestone 1: Setup & Workarounds
1. **Drive Allocation Inspection**:
   > `"Get-PSDrive -PSProvider FileSystem"`
2. **Directory Junction Creation**:
   > `"New-Item -ItemType Junction -Path 'c:\Users\User\Desktop\tz\node_modules' -Value 'D:\tz_node_modules' -Force"`
3. **Npm Cache Path Modification**:
   > `"npm config set cache D:\npm_cache --global"`
4. **Skip Install Initialization**:
   > `"npx -y create-next-app@latest ./ --skip-install --ts --tailwind --eslint --app --import-alias '@/*' --use-npm --disable-git --yes"`

### Milestone 2: Auth Service Layer
5. **Auth Database Simulation**:
   > `"Write a TypeScript class AuthService that manages registration, login, logout, and session states using localStorage. Add simulated network latency (800ms) for async calls, a 5-generation credit counter for Free users, and upgrade Plan handlers."`
6. **React Auth Context Hook**:
   > `"Create an AuthProvider component in React that wraps routes, maintains user state, and enforces HOC route protection (unauthenticated users redirect to /login, authenticated users trying to access login redirect to /dashboard)."`

### Milestone 3: Interface Styling & Landing
7. **Tailwind v4 Global CSS configuration**:
   > `"Create app/globals.css importing tailwindcss. Configure root color tokens for dark mode (zinc-950 background, slate-800 borders, violet accent). Add custom utility classes for glassmorphic cards, gradient text, and glow-blobs with pulseGlow keyframe animations."`
8. **Responsive Glassmorphism Header**:
   > `"Build a responsive Navbar component in React that displays links depending on authentication state. Include a hamburger menu for mobile drawer layout."`
9. **Interactive Landing Page tone-switching**:
   > `"Write a landing page for app/page.tsx with a hero section, description, benefits, and FAQ accordion. On the hero section, add an interactive mockup that shows an email draft typewriter typing, changing content dynamically when the user selects a tone (Professional vs. Casual)."`

### Milestone 4: Workspace Generator
10. **Gemini SDK route integration with fallback**:
    > `"Write a Next.js POST handler in app/api/generate/route.ts. If GEMINI_API_KEY is available, use @google/generative-ai to request gemini-1.5-flash with tone/length directives. If not, fallback to a local template dictionary matching keywords like 'meeting' or 'outreach' with a 1.2s delay."`
11. **Typewriter animated workspace canvas**:
    > `"Create app/dashboard/page.tsx with left-side prompt controls (suggested topic chips, tone selectors grid, length tabs) and a right-side canvas showing characters typing out one-by-one. Include 'Edit Mode', 'Copy to Clipboard', and credit counter alerts."`

### Milestone 5: Profile & Payment flows
12. **Stripe payment popup simulation**:
    > `"Create an interactive billing checkout modal in app/pricing/page.tsx. Simulate Stripe checkout form fields with length validations, payment loaders, and state upgrades. If the payment succeeds, invoke the auth upgrade service."`
13. **Credit consumption stats bar**:
    > `"Build app/profile/page.tsx showing joined date, email details, and a visual progress bar indicating credits used vs max credits. If credits are low, render an upgrade banner."`

### Milestone 6: Quality Assurance
14. **Error Page Boundary**:
    > `"Create app/error.tsx to act as the Next.js App Router global client-side error boundary, showing an elegant error message with a reload action button."`
15. **Vitest Unit Test Scripting**:
    > `"Configure vitest.config.ts with jsdom environment and alias mappings. Write a test suite in test/auth.test.ts testing registration validations, login authentication, credit exhaustion, and role upgrades."`

---

## 4. Future Improvements (Given more time)

1. **Real DB & Auth Integrations**: Move from `localStorage` to **Supabase Auth** and **PostgreSQL** schema databases.
2. **Rich Text Formatting (TipTap)**: Incorporate a document editor block to allow bolding, bullets, and links directly on the output editor panel.
3. **Reply Generation Mode**: Allow users to paste a received email in addition to entering a prompt, let AI generate suggested responses.
4. **Draft History Directory**: Archive generated emails, allowing users to label, search, and recall drafts they previously generated.
