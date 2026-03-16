# PRD

## Energy Log

*A calm, delightful, private web app for capturing what charges and drains you — and for practicing better shifts in real time.*

Version 0.2  •  March 15, 2026

| Hosting & sync | Cloud-synced web app deployed on Vercel. |
| --- | --- |
| Product shape | Ongoing reflection habit with a strong rolling 30-day structure. |
| Reflection depth | Deeper prompts are part of the default capture experience, not hidden behind extra taps. |
| Notifications | No reminders or nagging loops in MVP. |
| Privacy | Single-user and private by default. |

Interpretation note: your “ongoing vs. only 30 days” input is treated as ongoing use, organized into repeatable 30-day cycles so the product keeps its original discipline without becoming a one-time program.

# 1. Executive summary

Energy Log is a lightweight, iPhone-first reflective web app for quickly capturing the moments that gave energy or took energy away, then turning those moments into patterns, practice, and better self-regulation. The app is designed to feel calm and premium rather than clinical or productivity-obsessed. It should be usable from a Safari bookmark, work beautifully on small screens, and make deeper self-observation feel inviting rather than heavy.

The product starts from a simple daily habit — log charges and drains — but extends it into three ongoing practices: intentionally generating energy, anticipating predictable drains, and shifting language, focus, and state in real time. The app should therefore do more than capture journal entries; it should help the user spot repeating patterns, rehearse better reframes, and preserve momentum across rolling 30-day cycles.

> Key product call: this is not a reminder-driven habit tracker. It is a private reflection companion that helps the user notice, name, and redirect energy patterns with as little friction as possible.

# 2. Problem statement, goals, and non-goals

People who care deeply about excellence, relationships, and outcomes often know that something is draining them before they can articulate why. Existing journaling products either create too much writing friction, feel too generic, or emphasize streaks and reminders more than awareness and regulation. The opportunity is to build a narrow tool that is emotionally intelligent, fast enough for daily use, and structured enough to reveal recurring patterns.

## Product goals

- Make it easy to log a charge or drain in under a minute, with deeper prompts available immediately in the same flow.

- Help the user identify recurring drains, recurring sources of lift, and recurring language patterns over time.

- Turn insight into practice by supporting three explicit commitments during each 30-day cycle.

- Feel delightful on iPhone: one-thumb friendly, visually calm, emotionally warm, and respectful of attention.

- Protect privacy through private-by-default architecture, minimal sharing surface, and clear data control.

## Non-goals for MVP

- No social feed, community layer, or public sharing.

- No reminders, push notifications, or streak-pressure mechanics.

- No AI therapist or always-on coaching experience in MVP.

- No broad life-tracking dashboard for sleep, nutrition, or task management.

- No multi-user collaboration beyond future export or share options.

# 3. User, jobs to be done, and product principles

Primary user: a single self-aware adult who wants a structured but lightweight way to understand what fuels them, what depletes them, and how to recover agency more quickly. They are thoughtful, likely high-functioning, and not looking for another noisy productivity app.

| Job to be done | Implication for product |
| --- | --- |
| Capture quickly | The first action must be obvious: log charge, log drain, or start a shift. The product cannot require setup before first value. |
| Go deeper when ready | The reflection flow should expose the deeper prompts by default, but the prompts must feel progressive and manageable rather than like a long form. |
| See the pattern | The app should synthesize recurring triggers, expectations, language, and successful recovery tactics. |
| Stay engaged without nagging | Progress should come from clarity, visual calm, and usefulness — not from notifications or streak pressure. |

## Experience principles

- Quiet confidence: the tone should feel grounded, emotionally literate, and never preachy.

- Tap first, write second: segmented controls, chips, and fast patterns should reduce typing where possible.

- Depth without heaviness: deeper prompts are visible, but each prompt should feel like one small step.

- Beautiful restraint: the interface should be warm and elegant, not cute, gamified, or over-designed.

- Respect private reflection: sensitive content should never feel exposed, crowded, or casually shareable.

# 4. Information architecture and core flows

Recommended primary navigation on iPhone: Today, Timeline, Patterns, Practices. Settings should sit behind a profile or gear icon so the primary navigation stays focused on the daily loop.

| Flow | Primary screen | Desired feeling |
| --- | --- | --- |
| Open app | Today | Immediately know where to act, what day of the cycle it is, and what has already been logged today. |
| Log event | Charge / Drain composer | Fast, guided, reflective. The user should feel helped rather than interrogated. |
| Interrupt pattern | Shift Now | A quick state reset with reframing language and a physical reset suggestion. |
| Review meaning | Patterns | See recurring drains, recurring charges, and repeated inner language with gentle synthesis. |
| Renew practice | Practices | Recommit to the three practices and carry them into the next 30-day cycle. |

## Core flow details

> **Today screen:** Shows the current cycle day, a simple visual progress motif, today’s logged moments, and three prominent actions: Add charge, Add drain, Shift now. It should also surface the active 30-day commitments so the user remembers what they are practicing.

> **Charge / Drain composer:** Opens as a focused mobile composer with the deeper reflection prompts already present. The first steps should use tap targets: charge vs. drain, internal / external / both, predictable / not predictable. Narrative fields should follow with supportive placeholder copy.

> **Shift Now flow:** A fast in-the-moment interrupt. Ask: What am I focusing on? What expectation am I attached to? What language am I using? Then present reframes, a short breathing or reset cue, and an optional note about whether the state shifted.

> **Patterns review:** Transforms entries into useful summaries: common predictable drains, most frequent expectations, language patterns, energy-giving activities, and recovery actions that reliably help.

# 5. Functional requirements

| Area | Requirement | Pri. | Notes |
| --- | --- | --- | --- |
| Daily logging | User can create unlimited daily entries tagged as charge or drain. | P0 | Each entry belongs to a date, a cycle, and optionally a timestamp. |
| Daily logging | Entry captures: what happened; energizing or draining; internal / external / both; predictable; expectation/story; inner language; what helped shift state. | P0 | Only event type and “what happened” are required; the rest should feel easy to complete. |
| Practices | User can define three active commitments for a 30-day cycle. | P0 | These commitments map directly to the original framework. |
| Practices | User can mark when a commitment was practiced and add lightweight notes. | P1 | Useful for seeing whether intentional energy generation actually happened. |
| Shift Now | User can launch a quick pattern interrupt at any time from Today. | P0 | Should take less than 60 seconds and support optional follow-up note. |
| Patterns | App surfaces recurring charges, drains, triggers, expectations, and language patterns. | P0 | Can begin with rule-based summaries; advanced synthesis can come later. |
| History | User can review entries by day, week, or cycle. | P1 | Default should stay list-based and calm; avoid heavy analytics in MVP. |
| Privacy | User can edit or delete any entry and export their data. | P0 | Export can be JSON and/or clean PDF summary later. |
| Offline resilience | If network is unavailable, capture locally and sync when connection returns. | P1 | Important for bookmark-based use on walks or in transit. |
| Authentication | Private sign-in with magic link or passkey; stay signed in on personal device. | P0 | Authentication must feel minimal but trustworthy. |

# 6. Screen-level specification

## Today

- Top area shows greeting, current cycle day, and a subtle progress visualization for the 30-day cycle.

- Primary actions are large, thumb-friendly buttons: Add charge, Add drain, Shift now.

- A compact stack of today’s entries shows the latest moments without forcing navigation away from the main screen.

- Active commitments are visible in a small card so the user remembers what they are practicing today.

## Charge / Drain composer

- The first step should immediately confirm whether the user is logging a charge or a drain, using color and tone that feel supportive rather than alarmist.

- The deeper prompts should appear in a clear sequence: what happened; source; predictability; expectation/story; inner language; what helped shift state.

- Use chips, toggles, and short text areas to reduce friction; never present one long intimidating form.

- Saving should feel lightweight, with an elegant completion state that returns the user to Today.

## Patterns

- Show recurring charges and drains as intelligible themes, not dense analytics dashboards.

- Highlight repeated expectations and repeated inner-language phrases so the user can notice the story beneath the event.

- Surface “what helps” patterns to reinforce recovery strategies that work in practice.

- Allow filtering by cycle, date range, or charge/drain type.

## Practices

- At the start of each cycle, the user defines three commitments aligned to the framework.

- During the cycle, the app tracks whether commitments were practiced and what impact they had.

- At cycle end, the user gets a short reflection summary and can roll commitments forward, revise them, or start a fresh cycle.

## Settings & privacy

- Include account access, export, delete-all-data, theme preference, and optional Add to Home Screen guidance.

- Do not bury destructive privacy actions; the app should make ownership and control obvious.

# 7. Delight factors, privacy, and technical approach

## Delight factors

- Soft visual language: restrained color, strong typography, generous white space, and subtle motion.

- Microcopy that sounds calm, perceptive, and non-judgmental.

- One-thumb ergonomics: large tap targets, sticky primary action area, and respectful safe-area spacing for iPhone Safari.

- Dark mode and light mode that both feel intentional.

- Small moments of reward: a graceful save state, satisfying transitions, and clear evidence that reflection is accumulating into wisdom.

## Privacy and trust requirements

- Private by default: no public URLs, no sharing surface in MVP, and no accidental exposure of sensitive entries.

- Sensitive content should be encrypted in transit and stored in a managed database with secure authentication.

- Analytics, if any, should be minimal and behavior-focused rather than content-invasive.

- The product should offer data export and full deletion so ownership is explicit.

## Technical approach (MVP recommendation)

| Layer | Recommendation |
| --- | --- |
| Frontend | Responsive Next.js app optimized for iPhone Safari, deployable on Vercel and accessible from a bookmark or Add to Home Screen. |
| Backend | Server actions / API routes for entry creation, cycle management, auth, and export. |
| Data store | Managed Postgres or equivalent cloud database with a simple schema for users, cycles, entries, shifts, and practices. |
| Auth | Magic link or passkey-first sign-in; persistent session on the user’s personal device. |
| Offline behavior | Service-worker-backed caching plus local queue for unsent entries, synced when connectivity returns. |
| Insights engine | Rule-based summaries at launch; richer pattern synthesis can be layered on after behavior data exists. |

# 8. Success metrics, MVP scope, and open questions

## Success metrics

- At least four distinct days of use per week during an active cycle.

- A healthy mix of quick logs and deeper reflections, indicating the app supports both immediacy and depth.

- Regular use of Shift Now in moments of actual friction, not just passive logging.

- Meaningful revisit behavior: the user returns to patterns and practices, not only to entry capture.

- Low abandonment due to friction: most entry sessions should finish once started.

## Recommended MVP scope

- Private authentication and secure cloud sync.

- Today screen, charge/drain composer, Shift Now flow, Practices screen, and Patterns summary screen.

- Rolling 30-day cycles with the ability to start a new cycle and carry forward commitments.

- Basic export and delete-data controls.

- Simple rule-based pattern summaries instead of advanced AI interpretation.

## Open questions for the next iteration

- Should the user be able to export a weekly or cycle-end reflection as a polished PDF?

- Should pattern summaries remain fully rule-based, or should a limited AI summary layer be added later under strict privacy controls?

- What naming direction best matches the emotional tone: straightforward (“Energy Log”), reflective, or more premium/editorial?

> Bottom line: build a private, elegant reflection tool that makes self-awareness easier to practice in the moment and more useful over time. The app should help the user protect the engine behind their best work and presence — without noise, pressure, or performative wellness mechanics.
