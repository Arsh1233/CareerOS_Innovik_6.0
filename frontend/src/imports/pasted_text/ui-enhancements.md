# UI Fix & Enhancement Prompt

**Stack assumption:** React + Tailwind CSS (using CSS variables / Tailwind dark: prefix for theming). Update file references if your stack differs.

---

## 1. Fix Light Theme Contrast (parity with dark theme)

The light theme currently looks broken/washed out compared to dark theme. Fix this systematically, not component-by-component.

**Steps:**
1. Audit every color token currently defined for dark mode (backgrounds, text, borders, muted text, accent colors, card surfaces, shadows).
2. For each dark-mode token, define a light-mode counterpart with equivalent *semantic weight* — not the same hex logic inverted blindly. Example:
   - `bg-primary` (dark: `#0a0a0f`) → light: `#f8f9fb` (not pure white — keep slight tint to avoid glare)
   - `text-primary` (dark: `#f5f5f7`) → light: `#111318` (near-black, not `#000`)
   - `text-muted` (dark: `#a1a1aa`) → light: `#5b5f6b` (must hit ≥4.5:1 contrast against light bg — many light themes fail here with too-pale gray)
   - `border` (dark: `rgba(255,255,255,0.1)`) → light: `rgba(15,15,20,0.1)` — don't reuse white-alpha borders in light mode, they vanish.
3. Run every text/background pair through a contrast checker — target **WCAG AA minimum (4.5:1 for body text, 3:1 for large text/UI components)**.
4. Fix specific known failure patterns:
   - Light-gray text on white backgrounds (low contrast)
   - Icons using `currentColor` inheriting a too-light parent color
   - Disabled/placeholder states that become invisible in light mode
   - Shadows that were tuned for dark backgrounds (glow-style) now looking like dirty smudges on white — replace with soft, cool-gray drop shadows
   - Any hardcoded hex/rgba color inline instead of using the theme token (find and replace these — they're why light mode breaks when dark mode was clearly designed carefully)
5. Deliverable: a single source-of-truth theme file (e.g. `theme.css` or `tailwind.config` extension) with both palettes fully defined, no component should hardcode a color.

---

## 2. Profile Screen (new)

Build a dedicated `/profile` screen, consistent with the app's existing design system (cards, spacing, typography already used elsewhere).

**Sections to include:**
- **Header:** avatar (upload/change), name, role/title, short bio, edit-profile button
- **Stats row:** key metrics as small stat cards (e.g. total activity, streak, rank/score — pick metrics relevant to the app's domain)
- **Activity section:** embed the heatmap (see #3) here
- **Details/Settings:** email, account info, preferences, theme toggle
- **Responsive:** must work at mobile width (stack vertically) and desktop (2-column layout: sidebar info + main content)

Match existing card styling and apply the glassmorphism treatment (#4) to the header and stat cards.

---

## 3. LeetCode-style Activity Heatmap

Replace/upgrade the current hiring heatmap with LeetCode/GitHub-contribution-graph behavior:

- **Grid:** weeks as columns, days (Sun–Sat) as rows, ~52-week scrolling window
- **Intensity scale:** 4–5 shades from "no activity" to "high activity" based on a count value per day (not binary on/off)
- **Hover tooltip:** shows exact date + count (e.g. "12 hires on Mar 14, 2026")
- **Month labels** along the top, **day labels** (Mon/Wed/Fri) along the side
- **Streak tracking:** current streak + longest streak displayed above/beside the grid
- **Total count** summary (e.g. "482 activities in the last year")
- **Theme-aware colors:** intensity scale must have distinct, accessible variants for both light and dark themes (don't reuse one green scale for both — light mode needs deeper saturation to read clearly on white)
- **Interaction:** clicking a day can filter/scroll to that day's detail list if applicable

---

## 4. Glassmorphism Card Enhancement

Apply true glassmorphism to key cards (stat cards, profile header, featured/highlighted cards — not every card, to avoid visual noise):

```css
.glass-card {
  background: rgba(255, 255, 255, 0.55); /* light mode */
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.12);
  border-radius: 16px;
}

.dark .glass-card {
  background: rgba(20, 20, 28, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
}
```

**Requirements:**
- Cards need a background behind them (gradient mesh, blurred blob shapes, or image) for the blur to actually read as "glass" — flat single-color backgrounds make backdrop-blur invisible. Add subtle decorative gradient blobs behind the main content layer.
- Ensure text inside glass cards still passes contrast checks against the semi-transparent background in *both* themes.
- Add a subtle inner highlight (`inset 0 1px 0 rgba(255,255,255,0.4)`) on card top edge for the glass "sheen."
- Apply consistent border-radius and shadow depth across all glass cards for visual cohesion.

---

## Acceptance Criteria
- [ ] Every text/background pair in light mode passes WCAG AA contrast
- [ ] No hardcoded colors remain outside the theme token file
- [ ] Profile screen live at `/profile`, responsive, uses existing design system
- [ ] Heatmap shows intensity shades, tooltips, streaks, and month/day labels
- [ ] Designated cards use glassmorphism with working blur, correct in both themes