# Design System: MCQ Quiz App (Modern Edition)

Follow this file exactly for all UI work. This design system balances clarity with modern aesthetics.

## Principles

1. **Clarity first**: Content must be easy to read and navigate. Visual hierarchy guides the eye.
2. **Subtle depth**: Soft shadows and gentle transitions create a sense of layering without distraction.
3. **Refined interactions**: Hover states and micro-animations provide feedback without being jarring.
4. **Warm minimalism**: A warm, paper-like aesthetic with modern touches like subtle borders and refined spacing.
5. **Accessible by default**: High contrast, clear typography, and keyboard navigation are non-negotiable.

## Colors (light mode only)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FAF7EE` | Page background (warm ivory) |
| `--panel` | `#F5F2E8` | Side panel, subtle fills |
| `--surface` | `#FFFFFF` | Cards, inputs, elevated surfaces |
| `--text` | `#1F1D1A` | Primary text |
| `--text-muted` | `#6B665C` | Secondary text, labels |
| `--border` | `#E8E2D4` | Subtle borders, dividers |
| `--ink` | `#1F1D1A` | Primary buttons, active states |
| `--correct` | `#2F6B3F` | Success indicators |
| `--correct-bg` | `#E8F5E9` | Correct answer background |
| `--wrong` | `#C62828` | Error indicators |
| `--wrong-bg` | `#FFEBEE` | Wrong answer background |
| `--marked` | `#B07A12` | Review markers |
| `--shadow-sm` | `0 1px 2px rgba(31, 29, 26, 0.05)` | Subtle elevation |
| `--shadow-md` | `0 4px 6px -1px rgba(31, 29, 26, 0.08)` | Card elevation |
| `--accent` | `#4A6FA5` | Accent color for links, focus rings (used sparingly) |

Rules:
- The accent color is reserved for links, focus indicators, and chart highlights.
- Never use purple, neon, or overly saturated colors.
- Pair status indicators with text labels for accessibility.

## Typography

- Font: `Inter`, falling back to `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. Code blocks use `ui-monospace, "SF Mono", Menlo, Consolas, monospace`.
- Weights: 400 regular, 500 medium, 600 semibold. Avoid bold (700+).
- Sizes: 
  - Labels/meta: 13px (line-height 1.5)
  - Body/options: 15px (line-height 1.6)
  - Question text: 17px (line-height 1.5)
  - Section titles: 20px (line-height 1.35)
  - Page titles: 24px (line-height 1.3)
  - Result score: 32px (line-height 1.2)
- Sentence case preferred. Avoid all-caps.

## Layout

- Two columns: fixed left side panel (260px) and fluid main content area.
- Main content max-width: 800px, centered with 40px horizontal padding (24px on mobile).
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64. Use consistently.
- Corner radius: 8px on cards and buttons, 6px on inputs. No pill shapes.
- Borders: 1px solid `--border` for subtle separation.
- Shadows: Use `--shadow-sm` for slight elevation on panels, `--shadow-md` for cards and modals.

### Side panel

- Background `--panel`, no border, full height, fixed position.
- Top: App name in 16px semibold, 24px padding top/bottom.
- Navigation: Vertical list with 8px vertical padding per item, 16px horizontal padding. Items have 4px left border that becomes `--accent` when active.
- Active item: Background `--surface` with `--shadow-sm`, text `--ink` semibold.
- Hover state: Background `--surface` with 50% opacity transition.
- Topics section: Scrollable list below nav, 13px text with question count in `--text-muted`.
- Mobile (< 800px): Collapses to hamburger menu with slide-in panel.

## Components

### Buttons
- Primary: `--ink` background, white text, 40px height, 16px horizontal padding, 8px radius, `--shadow-sm`. Hover: lighten background 10%. Active: darken 10%.
- Secondary: `--surface` background, `--text` text, 1px `--border`, same height/padding. Hover: `--shadow-sm` appears.
- Text button: No background/border, `--accent` text with underline on hover.
- Disabled: 50% opacity, cursor not-allowed.
- Transition: `all 0.15s ease-out` for hover/active states.

### Question card
- `--surface` background, `--shadow-md`, 8px radius, 1px `--border`.
- Padding: 28px on desktop, 20px on mobile.
- Meta row: 13px `--text-muted`, uppercase tracking-wide, margin-bottom 12px.
- Question text: 17px, line-height 1.5, margin-bottom 20px.
- Code blocks: `--panel` background, 1px `--border`, 6px radius, 16px padding, overflow-x auto, font-size 13px.

### Option rows
- Full-width stack with 10px gap between options.
- Each option: `--surface` background, 1px `--border`, 8px radius, 14px 16px padding.
- Option key (A/B/C/D): 28px square, 1px border, centered text, 13px font.
- Hover state: Border becomes `--accent`, background shifts to `--surface` with subtle shadow.
- Selected: Border 2px `--ink`, key square filled `--ink` with white text.
- Correct (feedback): `--correct-bg` background, `--correct` border, "Correct" badge in green.
- Wrong (feedback): `--wrong-bg` background, `--wrong` border, "Your answer" badge in red.
- Transition: `border-color 0.15s ease-out, background-color 0.15s ease-out`.

### Explanation block
- `--panel` background, 1px `--border`, 8px radius, 20px padding.
- Heading: "Explanation" in 15px semibold, margin-bottom 12px.
- Body: 15px text, line-height 1.6.
- Per-option reasoning: Bulleted list with 8px top margin per item.

### Progress bar
- 8px height, `--border` track with `--panel` fill, 4px radius.
- Fill: `--ink` solid, no gradient. Smooth transition on width change.
- Label above: "Question X of Y" in 13px `--text-muted`.

### Timer
- Positioned top-right, 15px semibold, tabular nums.
- Normal: `--text` color.
- Last 5 minutes: `--wrong` color with subtle pulse animation (opacity 0.7 to 1 every 2s).

### Question palette
- Grid of 32px square cells, 8px gap, `--panel` fill, 1px `--border`, 6px radius.
- States:
  - Unanswered: default
  - Answered: `--ink` fill, white text
  - Marked: 2px `--marked` border
  - Current: 2px `--accent` outline, 2px offset
- Legend below: 13px `--text-muted` with colored dots matching states.

### Tables and results
- Clean tables: 1px `--border` between rows, header in 13px semibold `--text-muted`.
- Hover row: `--surface` background with `--shadow-sm`.
- Score display: 32px `--ink` with "out of 100" in 15px `--text-muted` below.
- Charts: Bar charts with `--ink` bars, 8px gap, `--border` grid lines. Line charts with 2px `--accent` stroke, no fill.

### Forms and inputs
- `--surface` background, 1px `--border`, 40px height, 12px padding, 6px radius.
- Focus: 2px `--accent` outline, no shadow.
- Select dropdowns: Same styling, custom arrow icon in `--text-muted`.
- Checkboxes: 20px square, 2px `--border`, `--ink` fill when checked, 4px radius.
- Labels: 13px semibold `--text`, 8px bottom margin.

### Dialogs/Modals
- Centered overlay, `--surface` background, `--shadow-md`, 8px radius, 1px `--border`.
- Backdrop: `rgba(31, 29, 26, 0.5)` with no blur.
- Padding: 24px all around.
- Title: 18px semibold, margin-bottom 16px.
- Actions: Right-aligned button group with 12px gap.
- Animation: Fade in (opacity 0→1) and scale up (0.95→1) over 0.2s.

## Screens

### Home
- Hero section: 24px title, 15px subtitle in `--text-muted`, 32px bottom margin.
- Three mode cards in responsive grid (1 col mobile, 3 col desktop), 24px gap.
- Each card: Icon (simple SVG), title, description, primary button.
- Recent attempts: Table below cards, showing date, mode, score.

### Study
- Filter bar: Topic select, difficulty chips, bookmark toggle, search input. All 40px height.
- Question card: Full width, with prev/next navigation buttons sticky at bottom.
- Status indicator: "Studied"/"Needs revision" chip top-right of card.

### Test
- Setup screen: Form with topic multi-select, question count slider (10/20/30/all), difficulty chips, timer toggle, feedback style radio.
- Quiz screen: Progress bar top, question card center, palette sidebar right (collapsible on mobile).
- Results screen: Score circle (if implemented) or large number, topic breakdown bar chart, retry wrong answers button.

### Exam
- Start screen: Blueprint table (topic | allocated | available), config summary, 100-minute timer preview, start button.
- Exam screen: Full-screen, timer top-right, question card center, palette bottom (scrollable), submit button prominent.
- Confirm submit dialog: Shows answered/unanswered/marked counts.
- Results: Score, topic performance table, weak topics highlighted, "Practice weak topics" button.

### Progress
- Stats overview: Total questions, accuracy %, streak (if tracked).
- Attempt history: Scrollable list with date, mode, score, duration.
- Topic performance: Horizontal bar chart showing accuracy per topic.
- Weak topics: List of topics < 60% accuracy with "Review" action.

## Focus and accessibility

- Focus visible: `outline: 2px solid var(--accent); outline-offset: 2px;` on all interactive elements.
- Contrast: Minimum 4.5:1 for body text, 3:1 for large text and UI components.
- Tap targets: Minimum 40x40px for touch.
- Reduced motion: Respect `prefers-reduced-motion` — disable transitions and animations when set.
- Screen readers: Proper ARIA labels on icons, status indicators, and navigation.

## Motion guidelines

- Default: Subtle transitions on interactive elements.
- Timing: 0.15s for hovers, 0.2s for modals, 0.3s for page-like transitions.
- Easing: `ease-out` for enter, `ease-in` for exit.
- Allowed animations: Fade-in, slide-up (subtle, 8px), scale (for modals).
- No confetti, bouncy easing, or distracting animations during quizzes.

## Do not

- No gradients, heavy shadows, neon colors, or busy patterns.
- No emojis, illustrations, mascots, or decorative icons unless explicitly needed.
- No automatic dark mode (design for light only).
- No pill-shaped buttons or fully circular elements.
- No center-aligned body text or justified paragraphs.
- No auto-playing videos or sounds.
- No pop-ups or interstitial ads (this is a study app!).