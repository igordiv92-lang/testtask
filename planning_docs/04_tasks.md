# 04. Detailed Tasks Checklist

Use this checklist to track development progress in real-time.

## Milestone 1: Setup & Configurations
- [x] Initialize Next.js 14+ TypeScript project (`npx create-next-app`)
- [x] Set up Tailwind CSS & global colors (dark mode)
- [x] Install shadcn/ui components
- [x] Install utility packages: `framer-motion`, `lucide-react`, `sonner`
- [x] Configure Vitest and React Testing Library

## Milestone 2: Authentication Flow
- [x] Build `lib/auth/service.ts` (Signup, Login, Logout, Persist)
- [x] Create `/login` page with field validation & animations
- [x] Create `/signup` page with field validation & animations
- [x] Create navigation route guard middleware or higher-order component (HOC) to secure dashboard pages

## Milestone 3: Landing Page & Pricing
- [x] Build Navbar and Footer components
- [x] Create Hero section with a mock typing email preview
- [x] Create Features & Service grid
- [x] Create FAQ Accordion with expanding animations
- [x] Create Pricing page with Monthly/Yearly toggle
- [x] Implement Premium upgrade mock checkout modal (Stripe-like UI)

## Milestone 4: Dashboard & Generator
- [x] Create Dashboard Layout with Sidebar
- [x] Build Prompt Form (Textarea with suggestions, Tone selector pills, Length segmented control)
- [x] Create API Route `/api/generate` with Gemini API client
- [x] Implement robust local Mock Generator (fallback)
- [x] Create Animated Output card (typewriter effect, copy, edit, regenerate commands)
- [x] Implement token/credit counter warning states (e.g. "0 credits left, upgrade to Pro")

## Milestone 5: Profile & Settings
- [x] Create Profile view layout
- [x] Build Credit details card and history overview
- [x] Add Logout capability

## Milestone 6: Polishing & Testing
- [x] Integrate Error Boundaries to prevent white screens
- [x] Write Vitest test suite for core UI interactions
- [x] Audit responsivity across Mobile, Tablet, and Desktop
- [x] Deploy to Vercel/Netlify
- [x] Draft README.md and final AI Development Report
