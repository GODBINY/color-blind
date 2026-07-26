---
schema: omd.preferences/v1
design_md_hash_at_creation:
---

# Preference Log

## 2026-07-26T00:00:00.000Z — avoid-generic-ai-saas-palette

```omd-meta
id: pref_ms105qpt_90fba283
timestamp: 2026-07-26T00:00:00.000Z
scope: color
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "DESIGN.md, src/app/globals.css"
```

Avoid generic cream, navy, and sand AI-SaaS palettes. Prefer clay paper, ink plum, and muted mulberry for Iris.

## 2026-07-26T00:00:00.000Z — avoid-beige-and-orange

```omd-meta
id: pref_ms10fns3_331464e8
timestamp: 2026-07-26T00:00:00.000Z
scope: color
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "DESIGN.md, src/app/globals.css"
```

Avoid beige and orange entirely. Use a decisive aubergine-black palette with pressed-paper text and berry accents.

## 2026-07-26T00:00:00.000Z — light-first-theme-with-dark-option

```omd-meta
id: pref_ms10qcy2_d1fe76b1
timestamp: 2026-07-26T00:00:00.000Z
scope: visualTheme
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "DESIGN.md, src/app/globals.css"
```

Use a bright lavender-white theme by default, with an explicit dark-mode option. Avoid beige and orange in both themes.

## 2026-07-26T00:00:00.000Z — replace-poor-test-visuals

```omd-meta
id: pref_ms10xtal_fa1ca1b4
timestamp: 2026-07-26T00:00:00.000Z
scope: visualTheme
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "src/components/find-my-view/FindMyViewQuiz.tsx"
```

Replace poor-looking colour-vision test visuals with polished, original comparison cards; do not copy official diagnostic plates.

## 2026-07-26T00:00:00.000Z — make-their-eyes-a-result-not-comparison

```omd-meta
id: pref_ms1199e9_7a1bdcf9
timestamp: 2026-07-26T00:00:00.000Z
scope: layout
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "src/components/editor/ImageEditor.tsx"
```

In Translate, make “Their eyes” a finished-image experience that conveys richer distinctions; keep before/after dragging as an optional explanation rather than the default.

## 2026-07-26T00:00:00.000Z — compact-adaptive-color-markers

```omd-meta
id: pref_ms126uou_a504fabe
timestamp: 2026-07-26T00:00:00.000Z
scope: components.badge
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "src/components/color-pick/ImageColorPicker.tsx, src/components/ui/ThemeToggle.tsx"
```

Keep circular controls compact. Photo color markers use the sampled color as their fill and automatically use black ink for light fills or white ink for dark fills, for both their outline and number.

## 2026-07-26T00:00:00.000Z — precision-zoom-for-color-picking

```omd-meta
id: pref_ms129z5o_d3419814
timestamp: 2026-07-26T00:00:00.000Z
scope: components.input
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "src/components/color-pick/ImageColorPicker.tsx"
```

Image color picking must support zooming into small areas so users can select precise pixels.

## 2026-07-26T00:00:00.000Z — clear-scenario-led-menu-copy

```omd-meta
id: pref_ms12ff4t_58449ee1
timestamp: 2026-07-26T00:00:00.000Z
scope: voice
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "src/app/[locale]/page.tsx, messages/ko.json"
```

Homepage menu copy should state each task plainly before its emotional framing. Position image color extraction for paper figures, charts, and result images where people need exact HEX and RGB values.

## 2026-07-26T00:00:00.000Z — use-familiar-colorblind-tool-labels

```omd-meta
id: pref_ms12j27m_6a29dcfd
timestamp: 2026-07-26T00:00:00.000Z
scope: voice
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "messages/ko.json"
```

Use familiar, task-explicit Korean labels: “색약 시뮬레이션”, “라이브 카메라로 색 확인하기”, “내 시야 설정하기”, and “이미지 내 색상 추출 도구”.

## 2026-07-26T00:00:00.000Z — inclusive-simulation-menu-label

```omd-meta
id: pref_ms12kitu_91adaf6a
timestamp: 2026-07-26T00:00:00.000Z
scope: voice
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "messages/ko.json, docs/03_UI_UX.md"
```

Name the simulation menu “색약·색맹 시뮬레이션” so its scope is immediately clear.

## 2026-07-26T01:31:32.000Z — lead-translation-copy-with-shared-beauty

```omd-meta
id: pref_ms14gzal_b1aff2c0
timestamp: 2026-07-26T01:31:32.000Z
scope: voice
signal: user-statement
confidence: explicit
status: pending
source_agent: codex
source_context: "src/components/editor/ImageEditor.tsx"
```

Translation copy should lead with shared moments such as flowers and sunsets that may have been less distinct, framing the feature as sharing beauty rather than technical colour differences. Keep claims honest: translate distinctions, never promise to restore colour vision.

## 2026-07-26T01:40:00.000Z — use-familiar-korean-red-green-term

```omd-meta
id: pref_ms14t7c0_815e5e5d
timestamp: 2026-07-26T01:40:00.000Z
scope: voice
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "messages/ko.json, src/components/editor/ImageEditor.tsx"
```

For Korean product copy, use the familiar term “적녹색약” for the red–green colour-vision family; retain Protan and Deutan as optional explanatory subtypes rather than leading labels.

## 2026-07-26T02:00:00.000Z — localize-color-vision-taxonomy-by-locale

```omd-meta
id: pref_ms15j4w0_d0e9c1f4
timestamp: 2026-07-26T02:00:00.000Z
scope: voice
signal: user-statement
confidence: explicit
status: pending
source_agent: codex
source_context: "src/lib/vision-labels.ts"
```

Adapt color-vision labels to each supported locale’s familiar medical terminology. Keep one canonical internal model, present the local umbrella category first, and keep Protan/Deutan/Tritan as optional comparison detail rather than literal one-to-one translations.

## 2026-07-26T00:00:00.000Z — group-home-tools-by-user-goal

```omd-meta
id: pref_ms133uw9_c5c96afd
timestamp: 2026-07-26T00:00:00.000Z
scope: layout
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "src/app/[locale]/page.tsx"
```

Organize the homepage task menu into goal-based groups with brief context, not a flat list of feature rows.

## 2026-07-26T00:00:00.000Z — learn-cards-use-real-simulations-and-local-names

```omd-meta
id: pref_ms13acz3_fe1173ac
timestamp: 2026-07-26T00:00:00.000Z
scope: visualTheme
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "src/app/[locale]/learn/page.tsx, src/lib/learn/content.ts"
```

Learn cards use model-based color-vision simulations instead of decorative gradients, and non-English locales lead with localized type names plus the academic term in parentheses.

## 2026-07-26T16:19:00.000Z — brand-nunbit-noonbit

```omd-meta
id: pref_ms1gw4zv_7a56b7aa
timestamp: 2026-07-26T16:19:00.000Z
scope: visualTheme
signal: user-statement
confidence: explicit
status: pending
source_agent: codex
source_context: "DESIGN.md, messages/*.json, docs/08_Brand.md"
```

Use NUNBIT / 눈빛 as the product name. Lead with “서로 다른 눈빛, 같은 아름다움.” in Korean and “Every eye sees a different light.” in English; retain “See the world through another’s eyes.” as supporting English copy.

## 2026-07-26T16:22:00.000Z — pair-color-codes-with-plain-language-names

```omd-meta
id: pref_ms1gzd4i_37c6f6be
timestamp: 2026-07-26T16:22:00.000Z
scope: voice
signal: user-statement
confidence: explicit
status: pending
source_agent: codex
source_context: "src/components/color-pick/ImageColorPicker.tsx"
```

In image color picking, pair HEX/RGB values with an intuitive plain-language colour description such as “연한 빨간색” or “진한 빨간색”.

## 2026-07-26T08:34:19.848Z — make-feature-explanations-direct

```omd-meta
id: pref_ms1jkoxh_6f691dbb
timestamp: 2026-07-26T08:34:19.848Z
scope: voice
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "messages/ko.json, src/components/editor/ImageEditor.tsx"
```

Keep warm emotional framing in headings, but make CTA and tool descriptions direct: explicitly say color-blind people, state whether a new translated image is created, and state when the original stays unchanged.

## 2026-07-26T08:38:54.208Z — keep-cta-labels-short-and-task-first

```omd-meta
id: pref_ms1jqkmn_66d76fe0
timestamp: 2026-07-26T08:38:54.208Z
scope: voice
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "messages/ko.json, src/components/editor/ImageEditor.tsx"
```

Keep primary feature labels short and task-first; reserve warm, emotional wording for supporting copy rather than CTA titles.

## 2026-07-26T08:40:25.872Z — make-header-wordmark-more-prominent

```omd-meta
id: pref_ms1jsjcu_3026d735
timestamp: 2026-07-26T08:40:25.872Z
scope: typography
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "src/app/[locale]/layout.tsx"
```

Make the NUNBIT header wordmark slightly larger so the brand is immediately legible without increasing header density.

## 2026-07-26T10:15:22.120Z — keep-theme-toggle-compact

```omd-meta
id: pref_ms1n6mmg_95239e7c
timestamp: 2026-07-26T10:15:22.120Z
scope: components.button
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "src/components/ui/ThemeToggle.tsx"
```

Keep the light/dark theme toggle visually compact; avoid oversized circular controls in the header.

## 2026-07-26T10:20:00.000Z — make-theme-toggle-smaller

```omd-meta
id: pref_ms1najd7_92a762c5
timestamp: 2026-07-26T10:20:00.000Z
scope: components.button
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "src/components/ui/ThemeToggle.tsx"
```

Keep the header light/dark toggle at a very compact visual size; reduce it again when it still reads as oversized.

## 2026-07-26T11:10:00.000Z — make-reference-results-verifiable

```omd-meta
id: pref_ms1qfkju_c3dd0bdd
timestamp: 2026-07-26T11:10:00.000Z
scope: voice
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "src/components/find-my-view/FindMyViewQuiz.tsx"
```

For reference-test results, label correct and different counts precisely and let people review every entered answer against its reference value.

## 2026-07-26T11:20:00.000Z — keep-translation-previews-identical

```omd-meta
id: pref_ms1qyhrc_e27d5b7b
timestamp: 2026-07-26T11:20:00.000Z
scope: layout
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "src/components/editor/ImageEditor.tsx"
```

The “what reaches them” translation preview must show the exact same finished file as the translated side of the comparison, never a separately simulated image.

## 2026-07-26T11:30:00.000Z — translation-is-a-single-comparison

```omd-meta
id: pref_ms1r3gwo_a8184d28
timestamp: 2026-07-26T11:30:00.000Z
scope: layout
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "src/components/editor/ImageEditor.tsx"
```

Present translation as one fixed before/after comparison, not two tabs: original as “the scene I share” and translated as “how it reaches them.”

## 2026-07-26T11:40:00.000Z — eliminate-page-level-horizontal-scroll

```omd-meta
id: pref_ms1rgzca_fe837fc7
timestamp: 2026-07-26T11:40:00.000Z
scope: layout
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "src/app/globals.css"
```

On desktop as well as mobile, the document itself must never horizontally scroll or bounce; keep any intentional image pan/zoom inside its own component.

## 2026-07-26T12:31:16.000Z — remove-duplicated-view-checking-entry

```omd-meta
id: pref_ms1s1c26_f0dc4013
timestamp: 2026-07-26T12:31:16.000Z
scope: layout
signal: user-correction
confidence: explicit
status: pending
source_agent: codex
source_context: "src/app/[locale]/page.tsx, src/components/editor/ImageEditor.tsx"
```

Do not expose a separate view-checking entry when it repeats the same upload-and-comparison flow. The homepage should lead with photo translation and image HEX/RGB extraction only.

## 2026-07-26T12:46:04.000Z — keep-external-support-ui-in-nunbit-palette

```omd-meta
id: pref_ms1skg1h_1e297753
timestamp: 2026-07-26T12:46:04.000Z
scope: color
signal: user-statement
confidence: explicit
status: pending
source_agent: codex
source_context: "src/app/[locale]/layout.tsx"
```

External support links must use NUNBIT’s own plum, berry, and lavender-white palette rather than the platform’s default brand colours.
