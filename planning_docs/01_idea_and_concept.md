# 01. Idea and Concept: VibeMail AI

VibeMail AI is a premium AI-powered email writing platform tailored for professionals, creators, and developers who need high-converting, grammatically flawless, and tone-optimized emails in seconds. 

## Design System & Theme
- **Color Palette**: Dark Mode Centric. Deep space backgrounds (`#09090b`), slate borders, vibrant electric indigo/violet gradients (`from-indigo-500 to-purple-600`) as primary accents, and emerald/mint for success states.
- **Aesthetic**: Glassmorphism (`backdrop-blur-md bg-zinc-900/50 border border-zinc-800`), sleek typography (Inter or Outfit), and interactive hover states (card lifting, glow effects).
- **Animations**: Using Framer Motion for fade-ins, page transitions, accordion expands, and button press actions.

---

## User Flow & Pages

### 1. Landing Page (Public)
An immersive homepage to drive signups.
- **Hero Section**: Large typography with a glowing gradient: *"Write emails 10x faster. Keep your vibe."* and an interactive mock dashboard mockup showing a real-time typing email.
- **Service Description**: Three-step visual guide (1. Type subject -> 2. Select tone & length -> 3. Export).
- **Benefits Section**: Icon-rich grid outlining speed, multi-language support, tone matching, and saved history.
- **FAQ Accordion**: 4-5 core questions (e.g., "Is it free?", "Can I connect my own API key?", "How does payment work?") with smooth height transitions.
- **CTA Section**: A card prompting users to get started for free.

### 2. Authentication (Public/Restricted)
- **Login / Signup Pages**: Centered glassmorphic card.
- Modern form fields with real-time error validation (e.g., email format, minimum password length).
- Easy toggle between Login and Sign Up.

### 3. Dashboard (Authenticated App)
The heart of VibeMail AI.
- **Sidebar or Navbar**: User info, plan status (Free/Pro badge), link to Profile, link to Pricing.
- **Generator Canvas**:
  - **Subject/Prompt Area**: Large, responsive textarea with placeholder prompts.
  - **Tone Selector**: Visual grid of pills (Professional, Casual, Bold, Persuasive, Apologetic, Humorous).
  - **Length Selector**: Segmented control slider (Short, Medium, Long).
  - **Generate Button**: High-contrast violet button with loading states.
  - **Output Area**: An elegant card that shows a typing effect for the generated email. Includes actions: "Copy to Clipboard" (with a checked animation icon), "Edit" (converting the output to a textarea), and "Re-generate".

### 4. Pricing / Premium Page (Public/Authenticated)
- **Pricing Cards**: Free Plan vs. Pro Plan ($19/mo).
- Interactive toggle between Monthly and Yearly billing (saves 20%).
- **Premium Upgrade Flow**: Clicking "Upgrade" on the Pro plan opens a sleek modal simulating a Stripe checkout page. The user inputs test card details (e.g., 4242...), clicks pay, sees a processing spinner, and is redirected to a custom success page where their account badge changes to "PRO" instantly.

### 5. Profile Page (Authenticated)
- Minimalist dashboard showing:
  - User details (Email, Date joined).
  - Usage stats (e.g., "5/20 free generation credits used this month").
  - Account actions (Reset password mock, Change avatar, Log out).
