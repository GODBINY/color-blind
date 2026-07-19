---
omd: 0.1
brand: Iris
bootstrapped_from: airbnb
bootstrapped_from_secondary: 29cm
bootstrapped_at: 2026-07-19
tokens:
  source: project-docs (docs/03_UI_UX.md, docs/08_Brand.md)
  colors:
    bg: "#F8F6F2"
    surface: "#FFFFFF"
    primary: "#243447"
    accent: "#E6B17E"
    text: "#243447"
    text-sub: "#6B7280"
    border: "#E5E1DA"
    error: "#B4534B"
    success: "#4E7A5A"
  typography:
    family: { ko: "Pretendard Variable", en: "Inter" }
    display: { size: "40/48 (mobile 32/40)", weight: 600, use: "Hero copy" }
    h1: { size: "28/36", weight: 600, use: "Page title" }
    h2: { size: "22/30", weight: 600, use: "Section" }
    body: { size: "16/26", weight: 400, use: "Body" }
    caption: { size: "13/20", weight: 400, use: "Secondary, disclaimers" }
    numeric: "tabular-nums (HEX/RGB values)"
  spacing: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64, 9: 96 }
  rounded: { s: 8, m: 12, l: 20, full: 9999 }
  shadow:
    s: "0 1px 2px rgba(36,52,71,0.06)"
    m: "0 4px 12px rgba(36,52,71,0.08)"
    l: "0 12px 32px rgba(36,52,71,0.12)"
  motion:
    fast: "150ms"
    base: "250ms"
    slow: "500ms"
    ease-out: "cubic-bezier(0.16, 1, 0.3, 1)"
    ease-in-out: "cubic-bezier(0.65, 0, 0.35, 1)"
---

# Design System — Iris

> Hybrid bootstrap: structure and photography-first warmth from **Airbnb**, editorial restraint and whitespace-as-brand from **29CM**. All token values (color/type/spacing/radius/shadow/motion) are Iris's own, defined in [docs/03_UI_UX.md](docs/03_UI_UX.md) and [docs/08_Brand.md](docs/08_Brand.md) — the two references shaped *structure and philosophy*, not color or type values.

## 1. Visual Theme & Atmosphere

Iris is a warm, comparison-first surface built around one recurring gesture: a photograph transforms in front of you, and something that was invisible becomes visible. The canvas is a warm off-white (`#F8F6F2`) — never pure white, never a cool clinical tone — carrying deep navy (`#243447`) text and warm sand (`#E6B17E`) as a single restrained accent. Nothing about the palette should read as a hospital, a lab, or a test result screen; the mood is closer to a sunlit study or a handwritten letter.

From **Airbnb** this system borrows the conviction that *photography is the hero and chrome should recede* — the same discipline Airbnb applies to listing cards applies here to the Compare Slider and the before/after crossfade: the image does the emotional work, the UI gets out of the way. From **29CM** this system borrows *whitespace as the brand asset* and the editorial instinct to subordinate secondary information (strength percentages, HEX values, technical labels) the way 29CM subordinates price to photograph — present, legible, never louder than the image.

The signature moment is the **crossfade**: in Translate, the "their eyes" preview transitions from before → after and a flower that was buried in the background quietly rises into visibility. This is Iris's equivalent of Airbnb's heart-icon save — the one place the interface is allowed a small emotional beat — and of 29CM's tile-reveal-on-scroll — unhurried, never bouncy, never celebratory with confetti or sound.

**Key Characteristics:**
- Warm off-white canvas (`#F8F6F2`), never pure white — avoids the clinical/lab association explicitly rejected in [08_Brand.md](docs/08_Brand.md)
- Deep navy (`#243447`) as the only text/primary-button color; warm sand (`#E6B17E`) as the singular accent, background/hover/highlight only — never used as text (contrast)
- Photography/comparison is the hero content — Compare Slider, before/after crossfade — chrome recedes (Airbnb)
- Generous whitespace, restrained chrome, no urgency styling — comparison earns its own room (29CM)
- Soft, warm shadows (never flat institutional grey, never zero-shadow flatness) — depth reads as natural light
- State conveyed by icon + text always, never color alone (color-blind-friendly UI is a product requirement, not a nicety)
- No stock photography of eyes, no Ishihara-plate imagery, no isometric tech illustration, no medical iconography

## 2. Color Palette & Roles

| Token | Hex | Role |
|---|---|---|
| `--color-bg` | `#F8F6F2` | Page canvas — warm off-white |
| `--color-surface` | `#FFFFFF` | Cards, panels |
| `--color-primary` | `#243447` | Text, primary buttons, deep navy |
| `--color-accent` | `#E6B17E` | Warm sand — CTA hover, highlight, decoration only |
| `--color-text-sub` | `#6B7280` | Secondary text |
| `--color-border` | `#E5E1DA` | Dividers, input borders |
| `--color-error` | `#B4534B` | Desaturated red-brown — always icon + text, never color alone |
| `--color-success` | `#4E7A5A` | Desaturated green — always icon + text, never color alone |

**Explicit refusals**: no Rausch-style saturated brand red (would clash with the "not a medical correction" thesis and reads alarm-adjacent for a color-vision product), no 29CM-style pure-monochrome black/white (too cold/clinical for a gift-framed product), no blue-on-white "accessibility tool" combination ([08_Brand.md](docs/08_Brand.md) explicitly bans this — it reads as hospital software).

**Accent discipline (29CM-derived)**: `#E6B17E` is spent like 29CM spends sale-red — sparingly, on one or two moments per screen (hover state, a single highlight), never as a structural color.

## 3. Typography Rules

### Font Family
- **Korean**: `Pretendard Variable`, self-hosted
- **English**: `Inter`, self-hosted
- Numeric values (HEX/RGB in Live Camera, percentages in sliders) use `tabular-nums`

### Hierarchy

| Role | Size/Line-height | Weight | Use |
|---|---|---|---|
| Display | 40/48 (mobile 32/40) | 600 | Hero copy |
| H1 | 28/36 | 600 | Page title |
| H2 | 22/30 | 600 | Section heading |
| Body | 16/26 | 400 | Standard copy |
| Caption | 13/20 | 400 | Secondary, disclaimer, privacy notice |

### Principles
- **Warm weight floor (Airbnb-derived)**: headings never drop below 600 — thin display weights read cold and corporate, which conflicts with the "gift, not filter" thesis.
- **One family per language, no display companion (29CM-derived)**: Pretendard/Inter carry every surface from hero to footer; emphasis is by weight, not by introducing a second face.
- **Numbers stay legible, not loud**: HEX/RGB/percentage values are `tabular-nums` and sit at body or caption size — informative, never the visual focus (echoes 29CM's price-is-punctuation-not-verb discipline).

## 4. Component Stylings

Full behavioral spec lives in [docs/03_UI_UX.md §4](docs/03_UI_UX.md). Token mapping:

**Button (primary)**
- Background: `--color-primary` (`#243447`) · Text: white · Radius: `--radius-m` (12px) · Height: 48px (md)
- Hover: background shifts toward `--color-accent` tint, never a full accent fill (accent stays a whisper, per §2)

**Button (secondary/ghost)**
- Background: transparent · Text: `--color-primary` · Border: 1px `--color-border`
- Modeled on 29CM's ghost-outline restraint — no fill, border only, weight-based emphasis

**UploadZone**
- Idle: dashed `--color-border` · Dragover: `--color-accent`-tinted background + `scale(1.01)` over `--duration-fast`
- Copy: "여기에 사진을 놓아주세요" — invitation, not instruction

**CompareSlider**
- Vertical handle, 44px touch target, keyboard ←→ support
- This is Iris's photography-first hero component (Airbnb parallel: listing card image) — no chrome competes with it; labels sit outside the image, never overlaid

**PreviewToggle**
- "my-eyes ↔ their-eyes" — badge appears only in their-eyes mode ("지금 {type}의 시야로 보고 있어요")
- Crossfade transition: `--duration-slow` (500ms), `--ease-out` — see §15

**VisionTypeTabs / StrengthSlider / ColorChip / QuizCard / Toast / LangSwitch / Footer**
- Full specs unchanged from [03_UI_UX.md §4](docs/03_UI_UX.md) — apply token values above (radius, color, spacing, shadow) consistently; never introduce ad hoc values.

## 5. Layout Principles

### Spacing System
4px base scale: `--space-1` (4) … `--space-9` (96) — see frontmatter. Section gaps favor the larger end of the scale (`--space-6`–`--space-7`, 32–48px) between major blocks, echoing 29CM's "whitespace is the brand asset" — a cramped comparison feels like a diagnostic tool, not a gift.

### Grid & Container
- Mobile (<640px): 1 column, bottom-fixed primary CTA, Compare Slider prioritizes the image over chrome
- Tablet (640–1024px): 2-column cards
- Desktop (>1024px): max-width 1120px centered; editor screens run image ≥65% / controls 320px right panel (Airbnb parallel: search bar and content get generous space, controls stay compact)

### Whitespace Philosophy
- Comparison needs room to breathe — never place two comparison states closer than `--space-5` (24px) apart
- A layout that feels "too empty" on first pass is usually closer to correct than one that feels efficient (29CM principle, applied to a gift-framed product)

### Border Radius Scale
- `--radius-s` 8px: inputs, small buttons
- `--radius-m` 12px: buttons, color chips
- `--radius-l` 20px: cards, image containers
- `--radius-full`: toggles, pills

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow | Page background, text blocks |
| `--shadow-s` | `0 1px 2px rgba(36,52,71,0.06)` | Inputs, small cards |
| `--shadow-m` | `0 4px 12px rgba(36,52,71,0.08)` | Cards, panels |
| `--shadow-l` | `0 12px 32px rgba(36,52,71,0.12)` | Modals, upload hover |

**Shadow philosophy**: soft and warm-tinted (navy-based rgba, not pure black) — reads as natural light, the Airbnb approach — but never absent entirely the way 29CM's flat marketing surface is. Iris compares two states side by side; a small amount of lift helps separate "before" from "after" without competing with the image. Flat-grey institutional shadows are explicitly rejected ([03_UI_UX.md §2.3](docs/03_UI_UX.md)).

## 7. Do's and Don'ts

### Do
- Keep the accent (`#E6B17E`) to one or two moments per screen
- Pair every state (error/success/selection) with icon + text, never color alone
- Let the Compare Slider / crossfade be the visual focus — everything else recedes
- Use warm, wide margins between comparison blocks
- Write CTAs as short verbs ending an action, no exclamation marks ([08_Brand.md §5](docs/08_Brand.md))

### Don't
- Don't use pure white canvas or a blue-accent combination — reads as accessibility/medical tooling
- Don't use saturated red as a structural color — reserved meaning conflicts with "not a diagnosis"
- Don't add stock eye-closeups, Ishihara plates, or isometric tech illustration
- Don't use words like 진단/검사 결과/고치다/교정 — full list in [08_Brand.md §4](docs/08_Brand.md)
- Don't use urgency copy ("지금 바로!", "놓치지 마세요") — quiet CTAs only

## 8. Responsive Behavior

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | <640px | 1 column, bottom-fixed CTA, image-priority Compare Slider |
| Tablet | 640–1024px | 2-column cards, expanded margins |
| Desktop | >1024px | max-width 1120px centered; editor = image ≥65% / 320px control panel |

Mobile-first — most traffic arrives via shared links. Live Camera is always full-bleed with overlay controls. Full breakpoint/edge-case detail: [docs/03_UI_UX.md §3](docs/03_UI_UX.md), [docs/02_PRD.md §5](docs/02_PRD.md).

## 9. Agent Prompt Guide

### Quick Token Reference
- Background: `#F8F6F2` · Surface: `#FFFFFF` · Text/Primary: `#243447` · Accent: `#E6B17E` (sparse)
- Radius: 8 / 12 / 20 / full · Shadow: soft warm navy-tinted, three tiers
- Type: Pretendard Variable (KO) / Inter (EN), headings ≥600 weight

### Example Component Prompts
- "Compare Slider: two images side by side with a vertical drag handle, 44px touch target. Labels outside the image (never overlaid). `--shadow-m` on the container, `--radius-l` (20px) corners. No color competes with the photograph."
- "Primary button: `#243447` background, white text, `--radius-m` (12px), 48px height, Pretendard/Inter 16px medium. Hover: subtle warm-sand tint, never a full accent fill."
- "UploadZone: dashed `#E5E1DA` border on `#F8F6F2` canvas. Dragover: warm-sand tinted background + 1.01 scale over 150ms. Copy is an invitation, not an instruction."
- "Error toast: icon + text together, `#B4534B` (desaturated, not alarm-red), bottom-center, 4s auto-dismiss, warm tone throughout."

### Iteration Guide
1. Start from the warm off-white canvas — never pure white, never cool grey
2. The comparison image is the hero; every other element should visually recede
3. Spend the accent (`#E6B17E`) once or twice per screen, never as a fill
4. Icon + text for every state — this is a color-vision product, color-only signaling is a functional bug, not a style choice
5. Headings stay ≥600 weight — thin weights read cold and undercut the "gift" framing

---

## 10. Voice & Tone

Iris's voice is **warm, calm, honest, minimal** ([08_Brand.md §3](docs/08_Brand.md)) — closer to a handwritten note than either a travel-magazine invitation (Airbnb) or a curated-editor's caption (29CM), though it borrows discipline from both: Airbnb's refusal of transactional/urgency language, and 29CM's `~해요` friendly-formal register over corporate `~합니다`.

| Context | Tone | Not this |
|---|---|---|
| Feature description | "그 사람이 볼 수 있는 색으로 번역해요" | "CVD 보정 알고리즘 적용" |
| Result delivery | "Deutan일 가능성이 높아요" | "당신은 적록색약입니다" |
| Invitation | "~해 볼까요?", "~해 보세요" | "지금 바로!", "무료로!" |
| Limitation disclosure | "정확한 확인은 안과에서 할 수 있어요" | "본 결과는 법적 효력이 없습니다" |
| Referring to color-blind people | "색을 다르게 보는", "OO의 색" | "색각 이상", "결함", "환자" |

**Forbidden phrases** (full list: [08_Brand.md §4](docs/08_Brand.md)): 진단/검사 결과/판정, 환자/색각 이상자/장애, 정상/비정상, 고치다/교정/치료/회복, 불쌍/안타깝다, 신기하죠?/놀랍게도, 무료!/지금 바로!/놓치지 마세요. The principle underneath every one of these: **the person reading the copy might be color-blind, or might love someone who is — it must feel warm to both.**

## 11. Brand Narrative

Iris (가칭, `iris.withint.com`) began from a single moment: a red rose in full bloom, and the wish to show it to a color-blind boyfriend who would see it lost in the background instead ([01_Project.md §1](docs/01_Project.md)). The founding thesis is deliberately narrow: *"We don't fix color vision. We translate beauty."* The product does not restore lost color perception — it cannot — it translates the **distinction and impression** of color across two people's vision.

The name draws on three overlapping meanings: **iris the flower** (the founding story starts with a flower), **iris the eye** (the anatomical seat of color vision), and **Iris the Greek messenger goddess of the rainbow** — a deity whose entire role was carrying messages between gods and mortals across the rainbow, which maps with unusual precision onto a service whose job is carrying color across two different kinds of vision.

Tagline, fixed:
- KO: **내가 본 아름다움을, 그 사람이 볼 수 있는 색으로.**
- EN: **Share the beauty you see — in colors they can see.**

What Iris refuses: the medical-diagnostic aesthetic (white background + blue accent, Ishihara-plate imagery, "결과/진단/판정" vocabulary), the pity frame (동정, "불쌍하다", "~밖에 못 보는"), the engineering-tool exposure that competitors default to ("필터 강도 파라미터 조절" instead of "그 사람의 색으로 번역하기"). What Iris embraces: photography as the emotional center (inherited structurally from Airbnb's photography-first listing cards), restraint and whitespace as a sign of care rather than emptiness (inherited from 29CM's editorial discipline), and treating every translated photo as a **gift**, not a filter output — the download button says "저장하기", the share button says "보내기", never "Export" or "Apply Filter".

Core values, fixed ([01_Project.md §5](docs/01_Project.md)): **Empathy** (understanding comes before features), **Gift** (the output is a gift, not a diagnostic result), **Connection** (a translated photo is only complete once it's shared), **Honesty** (we never claim to correct color vision), **Simplicity & Beauty** (one photo is enough to start — this is an experience, not a tool).

## 12. Principles

1. **Understanding before features.** *(Empathy, [01_Project.md §5](docs/01_Project.md))* Every screen should first help someone understand a different way of seeing before it asks them to do anything. *UI implication:* Simulate ("see their view") is positioned as the on-ramp to Translate, never the other way around.
2. **The output is a gift, not a result.** Downloaded/shared images are framed as something given, never as an export or a corrected file. *UI implication:* button copy is "저장하기"/"보내기", never "Export"/"Download filtered image"; the share card carries a warm one-line message, not a watermark-only artifact.
3. **A photo completes itself by being shared.** *(Connection)* Translate's purpose isn't the transformation — it's the moment the photo reaches the other person. *UI implication:* the "their eyes" preview toggle (T-5) is the decisive screen, not a secondary tab.
4. **We translate, we do not correct.** *(Honesty)* Lost color perception cannot be restored; only its distinctions and impressions can be carried across. *UI implication:* copy never uses 교정/치료/회복; every translated result offers a "their eyes" preview as proof, not just a claim.
5. **Photography is the hero; chrome recedes.** *(Structural principle, Airbnb-derived)* The Compare Slider and crossfade carry the emotional weight — surrounding UI should be legible but quiet.
6. **Whitespace and restraint read as care, not emptiness.** *(Structural principle, 29CM-derived)* A comparison crowded by chrome reads like a diagnostic tool; a comparison given room reads like something someone made carefully for you.
7. **State is never color alone.** *(Product-specific, from [02_PRD.md §4](docs/02_PRD.md))* This is a color-vision product — relying on color-only signaling for errors, selection, or success is a functional bug, not a style lapse.

## 13. Personas

*Fictional archetypes derived from [01_Project.md §4](docs/01_Project.md) target users — not individual people.*

**은서, 29, 서울.** 남자친구가 Deutan이다. 예쁜 걸 보면 반사적으로 사진부터 찍고, 그 사람에게 보여주고 싶어서 이 서비스를 처음 열었다. 유형은 이미 알고 있어서 Find My View는 건너뛰고 바로 Translate로 간다. 다운로드보다 "보내기"를 더 많이 쓴다 — 사진을 카톡으로 바로 보내는 게 목적이라서. 번역 후 결과가 "필터 적용"처럼 보이면 바로 이탈한다.

**Marcus, 34, Chicago.** Deuteranopia, self-diagnosed years ago but never learned the word "deutan" until a partner sent him a Find My View link. Uses Live Camera most — walks through a farmer's market with the color-name picker on, mostly out of curiosity rather than need. Skeptical of anything that sounds like a vision test; abandons any flow that feels like it's grading him.

**하윤, 26, 대구.** 자신이 "적록색약"이라는 것만 알고 protan인지 deutan인지 모른다. Find My View를 처음 시작할 때 "이거 병원 검사 아니야?"라는 의심으로 들어왔다가, 결과 화면에서 "적록색약 중 Deutan"이라는 설명을 보고서야 자기 유형을 처음으로 정확히 알게 된다. 이 순간이 이탈하지 않고 남는 결정적 지점.

**Jiwoo (지우), 24, designer, Seoul.** Not color-blind, uses Simulate purely for accessibility QA on her own product mockups — checks whether a client's brand palette holds up under protanopia before shipping. Values that Simulate never talks down to her; wants numbers (severity %) alongside the visual, doesn't want to be "sold" a gift-framing that doesn't apply to her use case.

## 14. States

| State | Treatment |
|---|---|
| **Empty (pre-upload)** | Emotional prompt, not feature explanation: "보여주고 싶었던 사진으로 시작해 보세요." No illustration required. |
| **Loading (Translate)** | "그 사람이 볼 수 있는 색으로 번역하는 중..." — warm, specific, never a bare spinner-only state. |
| **Loading (Simulate)** | "그 사람의 시선으로 바꾸는 중..." |
| **Error (unsupported file)** | "앗, 이 파일은 읽을 수 없었어요. JPG나 PNG로 다시 시도해 볼까요?" — icon + warm text, never a bare red banner. |
| **Translate no-effect** | "이 사진은 이미 잘 보여요 :)" when Δ (post-translation simulated difference) falls below threshold — reframed as good news, not a null result. |
| **FMV result (clear)** | "Most likely / Deutan / (This is not a medical diagnosis)" + parent-category note ("적록색약 중 Deutan") — never "진단"/"판정". |
| **FMV result (unclear)** | "결과가 명확하지 않아요" + Learn link — no forced conclusion. |
| **Success (first translate, one-time only)** | "이제 꽃이 보이나요?" style copy — shown once per install, never repeated (over-use cited explicitly as a risk in [03_UI_UX.md §6](docs/03_UI_UX.md)). |
| **Camera permission denied** | Warm redirect to Translate, not a dead end. |
| **Disabled** | Opacity reduction + border stays warm-toned, never switches to cold institutional grey. |

## 15. Motion & Easing

**Durations:**

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 150ms | Hover, toggle |
| `--duration-base` | 250ms | Card entry, slider |
| `--duration-slow` | 500ms | Image crossfade, page transition |

**Easings:**

| Token | Curve | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances, crossfade settle |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Two-way transitions |

**Signature motion.** The **before/after crossfade** ([03_UI_UX.md §2.4](docs/03_UI_UX.md)) is Iris's one allowed emotional beat — a flower buried in a color-blind person's view of the background quietly rises into visibility over `--duration-slow` with `--ease-out`. This is the direct equivalent of Airbnb's heart-icon "joy" motion and 29CM's tile-reveal-on-scroll: used exactly once as the hero moment, never scattered across the interface as decoration.

**Reduce motion.** Under `prefers-reduced-motion: reduce`, the crossfade becomes an instant cut. The emotional beat is preserved through copy and the Compare Slider's static before/after, not through motion — same principle both reference systems apply.

<!--
omd:init Philosophy Layer sources (2026-07-19)

§11-13 were filled directly from this project's own planning docs rather than
re-prompting the user, since docs/01_Project.md, docs/02_PRD.md, docs/03_UI_UX.md,
and docs/08_Brand.md already specify founding story, tagline, core values,
target users, and voice/tone in detail (all dated 2026-07-08, v1.0).

- Founding story, vision, core values, target users: docs/01_Project.md
- Find My View purpose (incl. the "적록색약 뭉뚱그림" problem noted by the user
  on 2026-07-19): docs/02_PRD.md §3.5
- Component specs, design tokens, motion tokens, state copy principles:
  docs/03_UI_UX.md
- Brand story, naming rationale, tone/voice table, forbidden phrases,
  copy system: docs/08_Brand.md

Personas (§13) are fictional archetypes derived from docs/01_Project.md §4
target-user table, not individual people. Names are illustrative.

Structural/philosophical borrowing only from the two references (airbnb,
29cm) — no token values (color/type/spacing/radius/shadow) were carried over;
all token values are this project's own, defined in docs/03_UI_UX.md.
-->
