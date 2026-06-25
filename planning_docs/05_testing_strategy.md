# 05. Testing and Error Handling Strategy

To achieve a production-grade application and satisfy the "Будет плюсом" (nice to have) criteria, we establish a clean testing strategy and robust error handling.

---

## 1. Automated Tests

We configure **Vitest** + **React Testing Library** for fast, reliable unit/component testing.

### Test Areas
1. **Authentication Utilities**:
   - Validation helper tests (valid email, password length).
   - Auth service mock session recovery and credential rejection.
2. **Dashboard Form State**:
   - Ensure the "Generate" button is disabled if the prompt input is empty.
   - Verify selecting a tone updates the visual active state.
3. **AI Generation Hook / Fetching**:
   - Mocking the fetch API to check standard success scenarios.
   - Mocking API failure rates to verify error alert banners render.
4. **Pricing Upgrade Flow**:
   - Verify that toggling billing schedules changes the rendered prices.
   - Verify upgrading updates the user profile state.

---

## 2. Manual Verification Checklist
- **Responsiveness**: Verify dashboard behaves smoothly at widths `375px`, `768px`, and `1440px`.
- **Keyboard Navigation**: Check tab indexing and focus indicators on input elements.
- **Copy to Clipboard**: Verify success toast shows up and clipboard buffer is updated.

---

## 3. Error Handling (No White Screens)

To ensure the app never crashes to a blank canvas:
1. **React Error Boundary**:
   - Create a global `ErrorBoundary` page component.
   - Wrap the main App/Dashboard layouts.
   - In case of client-side crashes, display a styled "Oops! Something went wrong" message with a "Reload page" CTA.
2. **Form Validaions**:
   - Block button clicks and display inline help messages if inputs are invalid.
3. **API Level Boundaries**:
   - Handle API fetch failures with descriptive client-facing messages (e.g., "Network timeout, please try again" or "Gemini API quota exceeded").
   - Display toast notifications with precise issue descriptions.
