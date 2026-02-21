---
name: ux-design
description: Apply UX research, information architecture, interaction design, and usability principles to product and service design. Use when planning user research, reviewing design decisions, writing UX specifications, evaluating usability, or defining design systems.
---

# UX Design Skill

Frameworks for user experience research, design strategy, interaction design, and design system governance.

## UX Research Methods

### Method Selection by Research Question

| Question Type | Recommended Method | Output |
|---|---|---|
| What do users need? | In-depth interview (IDI) | Jobs-to-be-done, pain points |
| How do users behave? | Contextual inquiry, session recording | Usage patterns, friction points |
| Which design works better? | A/B test, preference test | Quantified conversion lift |
| Can users complete tasks? | Usability test (moderated) | Task completion rate, error rate |
| What is sentiment at scale? | Survey (NPS, CSAT, SUS) | Benchmark scores, trends |
| Why do users leave? | Exit survey, funnel analysis | Drop-off reasons |

### Interview Guide Template

**Screener criteria:** [Define target user profile]

**Warm-up (5 min):**
- Tell me about your role and how you spend most of your day.
- How long have you been using [product category]?

**Core questions (30-40 min):**
- Walk me through the last time you [target task]. Start from the very beginning.
- What were you trying to accomplish at that point?
- What made that hard / easy?
- What workarounds, if any, did you use?
- If you had a magic wand to change one thing, what would it be?

**Closing (5 min):**
- Is there anything I haven't asked that you think would be useful for us to know?

**Analysis:** Affinity clustering → themes → insights → design opportunities

---

## Information Architecture

### Card Sorting

Use **open card sort** when exploring how users naturally categorize content.
Use **closed card sort** when validating a proposed navigation structure.

**Optimal Workshop / Maze** are standard tools. Aim for 20–30 participants for quantitative reliability.

**Analysis output:** Similarity matrix → dendrogram → proposed IA with confidence scores

### Navigation Patterns

| Pattern | Best For | Consideration |
|---|---|---|
| Top navigation bar | Desktop, 5-8 top-level sections | Collapses poorly on mobile |
| Left sidebar | Complex apps, many sections | Takes horizontal space |
| Bottom tab bar | Mobile, 3-5 primary sections | iOS/Android standard |
| Hamburger menu | Mobile supplemental navigation | Low discoverability |
| Hub & spoke | Task-focused apps, deep flows | No cross-section shortcut |
| Search-first | Large catalogs, expert users | Requires good search quality |

---

## Interaction Design Principles

### Heuristics (Nielsen's 10 + Korean UX context)

1. **Visibility of system status** — Always show what is happening (loading states, progress, success/error)
2. **Match between system and real world** — Use language and metaphors familiar to Korean users; avoid jargon
3. **User control and freedom** — Easy undo, cancel, and back navigation
4. **Consistency and standards** — Follow platform conventions (iOS HIG, Material Design, Korean web norms)
5. **Error prevention** — Validate inputs before submission; warn before destructive actions
6. **Recognition over recall** — Surface options; don't require memorization
7. **Flexibility and efficiency** — Power-user shortcuts (keyboard shortcuts, bulk actions)
8. **Aesthetic and minimalist design** — Remove non-essential elements; prioritize content hierarchy
9. **Help users recognize and recover from errors** — Plain-language error messages with recovery steps
10. **Help and documentation** — Contextual help; Korean-language support materials

**Korean UX specifics:**
- Mobile-first: Korea has highest mobile usage density globally; design for thumb reach zones
- App fatigue: Users compare against KakaoTalk, Naver, Coupang — high baseline expectations
- Trust signals: Company registration number, customer service number, and physical address increase conversion

### Micro-interaction Patterns

| Trigger | Animation | Duration | Purpose |
|---|---|---|---|
| Button tap | Scale 0.97 → 1.0 | 100ms | Physical feedback |
| Form error | Shake + red border | 300ms | Draw attention |
| Success action | Checkmark + fade | 400ms | Confirm completion |
| Loading | Skeleton screen | Until data loads | Prevent layout shift |
| Destructive confirm | Slide-up modal | 250ms | Prevent accidents |

---

## Usability Testing

### Test Plan Template

**Objective:** [What design decisions will this test inform?]
**Participants:** [Number, screener criteria, recruitment method]
**Tasks:**
1. Task 1: [Specific, realistic scenario — no leading language]
2. Task 2: ...

**Metrics:**
- Task completion rate (binary: completed / not completed)
- Time on task
- Error rate (# of errors per task attempt)
- SUS score (post-test survey)
- Qualitative: verbal reactions, confusion moments

**Severity classification for issues found:**
| Severity | Definition | Fix Priority |
|---|---|---|
| Critical | Prevents task completion | Before launch |
| Major | Causes significant delay or frustration | Next sprint |
| Minor | Cosmetic or slight confusion | Backlog |

---

## Design System

### Component Documentation Standard

Each component should document:

```
Component: [Name]
Status: Stable / Beta / Deprecated

Usage: When to use vs. when NOT to use

Props / Variants:
  - variant: primary | secondary | ghost | danger
  - size: sm | md | lg
  - state: default | hover | active | disabled | loading

Accessibility:
  - Role: button / link / etc.
  - Keyboard: Tab to focus, Enter/Space to activate
  - ARIA: aria-label required for icon-only buttons
  - Color contrast: 4.5:1 minimum (WCAG AA)

Do / Don't:
  ✅ Use primary for one main CTA per page
  ❌ Use multiple primary buttons in the same view
```

### Design Token Structure

```
color/
  brand/primary     → #6366F1
  brand/secondary   → #818CF8
  semantic/success  → #10B981
  semantic/error    → #EF4444
  semantic/warning  → #F59E0B
  neutral/900       → #18181B
  neutral/500       → #71717A

spacing/
  xs  → 4px
  sm  → 8px
  md  → 16px
  lg  → 24px
  xl  → 32px
  2xl → 48px

typography/
  heading/xl  → Poppins 32px/1.25 SemiBold
  heading/lg  → Poppins 24px/1.3 SemiBold
  body/md     → Inter 16px/1.6 Regular
  body/sm     → Inter 14px/1.5 Regular
  label/md    → Inter 14px/1.4 Medium
```
