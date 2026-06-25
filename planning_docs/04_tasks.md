# 04. Detailed Tasks Checklist

Use this checklist to track development progress in real-time.

## Milestone 1: Setup & Configurations
- [ ] Initialize Next.js 14+ TypeScript project (`npx create-next-app`)
- [ ] Set up Tailwind CSS & global colors (dark mode)
- [ ] Install shadcn/ui components
- [ ] Install utility packages: `framer-motion`, `lucide-react`, `sonner`
- [ ] Configure Vitest and React Testing Library

## Milestone 2: Authentication Flow
- [ ] Build `lib/auth/service.ts` (Signup, Login, Logout, Persist)
- [ ] Create `/login` page with field validation & animations
- [ ] Create `/signup` page with field validation & animations
- [ ] Create navigation route guard middleware or higher-order component (HOC) to secure dashboard pages

## Milestone 3: Landing Page & Pricing
- [ ] Build Navbar and Footer components
- [ ] Create Hero section with a mock typing email preview
- [ ] Create Features & Service grid
- [ ] Create FAQ Accordion with expanding animations
- [ ] Create Pricing page with Monthly/Yearly toggle
- [ ] Implement Premium upgrade mock checkout modal (Stripe-like UI)

## Milestone 4: Dashboard & Generator
- [ ] Create Dashboard Layout with Sidebar
- [ ] Build Prompt Form (Textarea with suggestions, Tone selector pills, Length segmented control)
- [ ] Create API Route `/api/generate` with Gemini API client
- [ ] Implement robust local Mock Generator (fallback)
- [ ] Create Animated Output card (typewriter effect, copy, edit, regenerate commands)
- [ ] Implement token/credit counter warning states (e.g. "0 credits left, upgrade to Pro")

## Milestone 5: Profile & Settings
- [ ] Create Profile view layout
- [ ] Build Credit details card and history overview
- [ ] Add Logout capability

## Milestone 6: Polishing & Testing
- [ ] Integrate Error Boundaries to prevent white screens
- [ ] Write Vitest test suite for core UI interactions
- [ ] Audit responsivity across Mobile, Tablet, and Desktop
- [ ] Deploy to Vercel/Netlify
- [ ] Draft README.md and final AI Development Report
