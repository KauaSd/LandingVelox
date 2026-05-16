# LandingVelox V2 - Master Implementation Plan

## Overview
This plan outlines the execution strategy for the LandingVelox evolution across 4 concurrent domains: Code Quality, Flight API Integration, Authentication, and Conversational AI. The goal is to modernize the UI/UX whilst strictly adhering to the existing "Tech-Noir Mint" design system and color palette.

---

## 1. Code Refactoring & Semantics (`frontend-specialist`, `performance-optimizer`, `seo-specialist`)
**Goals:** Enhance HTML semantics, implement responsive mobile-first approach, introduce micro-animations, improve accessibility (a11y), and streamline CSS usage.

**Implementation Steps:**
- **Refactoring:** Break `App.tsx` into smaller logical layout chunks (`<Header>`, `<Dashboard>`, `<FlightList>`, `<FilterBar>`).
- **Performance:** lazy load heavy components like `FlightTrackerMap`, `AiCopilot`, and `CheckoutModal` using `React.lazy()` and `<Suspense>`.
- **A11y & Semantics:** Ensure buttons have proper `aria-labels`, inputs have `id`/`htmlFor`, and keyboard navigation (`tabIndex`) is fully supported across dropdowns and modals.
- **CSS Architecture:** Refactor Tailwind utility classes in `App.tsx` and custom components to fully utilize the existing `--color-*` CSS variables defined in `index.css`. No new arbitrary hex colors will be added.

## 2. Flight API Integration (`backend-specialist`, `frontend-specialist`)
**Goals:** Replace mock data with live flight data from AviationStack (or Amadeus) via a search widget.

**Implementation Steps:**
- **Search Widget:** Develop a new `<FlightSearchWidget>` with Origin, Destination, Departure Date, Return Date (optional), and Passenger Count.
- **API Integration:** Create `services/api.ts` to mock the connection to AviationStack/Amadeus or use actual fetch endpoints if a generic open key is provided. Since this is frontend only, we'll design robust fallback mechanics and skeleton loaders.
- **Result Cards:** Build styled cards incorporating existing tech-noir styling (`glass-card`, `diagonal-grid`) showing flight details (Duration, Stops, Departure/Arrival times).
- **State Management:** Implement proper `Loading...` states using animated skeleton screens with `mint-glow`, and `Error/Empty` feedback states.

## 3. Login / Authentication System (`security-auditor`, `frontend-specialist`)
**Goals:** Build an Auth Modal integrating email & Google logins, while mapping session logic to `sessionStorage`.

**Implementation Steps:**
- **Auth Modal:** Create `<AuthModal>` triggered from the Header. State transition between `Login` and `Signup` smoothly using `motion/react` (Framer Motion).
- **Form UI:** Email/password fields using strict validation. Include floating labels, colored validation borders (using `--color-error` / `--color-primary-container`), and eye icons for password reveal.
- **Session Simulation:** Use `sessionStorage` or dummy JWT handling to simulate logged-in status.
- **Header Avatar:** Once authenticated, display user avatar in header. On click, a dropdown menu lists [Perfil, Minhas Viagens, Sair].

## 4. Conversational Copilot Chat (`frontend-specialist`, `backend-specialist`)
**Goals:** Enhance the current AI Copilot to be hybrid (chips + free-text) with typewriter effects and rich cards.

**Implementation Steps:**
- **Hybrid Interface:** Update `AiCopilot.tsx` to handle user messages vs fast-action chips ("Buscar voo", "Ver promoções", etc.).
- **Rich Card Responses:** Modify the chat rendering engine to parse bot intent and display components (e.g., `<MicroFlightCard>` dynamically inside the chat).
- **Typewriter Effect:** Use Framer Motion or string-stepping intervals to simulate typing for bot messages. Include `...` typing indicators.
- **Styling:** Differentiate user vs bot message bubbles using existing surface container variables. Add timestamps below messages.
- **Autocomplete:** Recommend next possible prompts depending on the conversational context.

---

## Verification & Checks
1. **Linter & Types:** Must run `npm run lint` cleanly.
2. **Design Cohesion:** No new hex colors injected into the repo; must strictly use `var(--color-...)` or Tailwind mappings.
3. **Responsive Testing:** Will be validated on Mobile (320px) up to Desktop (1024px+).
4. **UX Audits:** Verify keyboard navigation and contrast ratios.
5. **Execution Tools:** `python .agent/scripts/checklist.py .` or specific verification scripts depending on the orchestration phase.
