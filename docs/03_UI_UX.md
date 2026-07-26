# 03. UI / UX — 디자인 시스템 & 화면 설계

> v1.0 — 2026-07-08
> 브랜드 톤(카피, 비주얼 무드)은 [08_Brand.md](08_Brand.md), 기능 정의는 [02_PRD.md](02_PRD.md) 참고.

---

## 1. UX Principles

1. **One Upload** — 사진 한 장이면 시작된다. 회원가입도, 설정도 먼저 요구하지 않는다.
2. **Comparison First** — 결과 화면은 항상 비교가 중심이다. 특히 Translate의 "그 사람에게는 이렇게 보여요" 미리보기(번역 전 시야 vs 번역 후 시야)가 이 서비스의 결정적 순간.
3. **Gift, not Filter** — UI 언어는 "필터 적용"이 아니라 "번역해서 전하기". 결과 화면은 보정 도구가 아니라 선물 포장처럼 느껴져야 한다.
4. **No Learning** — 설명 없이 사용 가능해야 한다. 툴팁이 필요하면 UI가 잘못된 것.

## 2. Design Tokens

### 2.1 Color

```
--color-bg          #F7F7FC   /* 기본: 밝은 라일락 화이트 배경 */
--color-surface     #FFFFFF   /* 카드, 패널 */
--color-primary     #2D2330   /* Plum ink — 텍스트, 주요 버튼 */
--color-accent      #9B4A76   /* Berry — 포인트, CTA hover, 하이라이트 */
--color-text        #2D2330
--color-text-sub    #6E6474   /* Soft plum gray */
--color-border      #DED7E2
--color-error       #B84E58   /* 채도 낮춘 베리 레드 — 색약 대비 고려해 아이콘+텍스트 병행 */
--color-success     #476F5A
```

- **규칙**: 상태(에러/성공)를 색만으로 전달하지 않는다. 항상 아이콘+문구 병기.
- 기본은 라이트 모드이며, 헤더 전환으로 다크 모드를 선택할 수 있다. 선택값은 이 기기에 저장한다.
- 본문 텍스트 대비 4.5:1 이상 유지. `#2D2330 on #F7F7FC` = 약 14:1 ✓
- Accent(#9B4A76)는 텍스트 색으로 사용 금지 (대비 부족) — 배경/장식/hover 전용.

### 2.2 Typography

| 토큰 | 크기/행간 | 용도 |
|---|---|---|
| display | 40/48 (mobile 32/40), 600 | Hero 카피 |
| h1 | 28/36, 600 | 페이지 제목 |
| h2 | 22/30, 600 | 섹션 |
| body | 16/26, 400 | 본문 |
| caption | 13/20, 400 | 보조, 면책 문구 |

- 폰트: `Pretendard Variable` (KO) + `Inter` (EN) — 둘 다 variable, self-host.
- 숫자(HEX/RGB 값)는 `tabular-nums`.

### 2.3 Spacing / Radius / Shadow

```
Spacing (4px base): 4, 8, 12, 16, 24, 32, 48, 64, 96
  --space-1 ~ --space-9

Radius:
  --radius-s   8px    /* 인풋, 작은 버튼 */
  --radius-m   12px   /* 버튼, 컬러칩 */
  --radius-l   20px   /* 카드, 이미지 컨테이너 */
  --radius-full 9999px /* 토글, pill */

Shadow (은은하게, 병원 느낌의 flat 회색 금지):
  --shadow-s   0 1px 2px rgba(0,0,0,0.18)
  --shadow-m   0 4px 12px rgba(0,0,0,0.24)
  --shadow-l   0 12px 32px rgba(0,0,0,0.32)   /* 모달, 업로드 hover */
```

### 2.4 Motion

```
--duration-fast    150ms   /* hover, 토글 */
--duration-base    250ms   /* 카드 진입, 슬라이더 */
--duration-slow    500ms   /* 이미지 크로스페이드, 페이지 전환 */
--ease-out         cubic-bezier(0.16, 1, 0.3, 1)
--ease-in-out      cubic-bezier(0.65, 0, 0.35, 1)
```

- 시그니처 모션: **크로스페이드** (Hero, 결과 첫 로드). Translate에서는 "그 사람의 시야 → 번역 후" 전환 — 배경에 묻혀 있던 꽃이 서서히 떠오르는 순간이 이 서비스의 핵심 감정.
- `prefers-reduced-motion` 시 크로스페이드는 즉시 전환으로 대체.

## 3. Responsive Layout

| Breakpoint | 값 | 레이아웃 |
|---|---|---|
| mobile | < 640px | 1열, 하단 고정 CTA, Compare Slider는 세로 화면에 맞춰 이미지 우선 |
| tablet | 640–1024px | 2열 카드, 사이드 여백 확대 |
| desktop | > 1024px | max-width 1120px 중앙 정렬, Simulator는 좌 이미지 / 우 컨트롤 패널 |

- **모바일 우선.** 예상 트래픽의 다수가 모바일 공유 링크 유입.
- Simulator 데스크톱: 이미지 영역 ≥ 65% 확보, 컨트롤은 우측 320px 패널.
- Live Camera는 항상 풀블리드(전체 화면) + 오버레이 컨트롤.

## 4. Component Spec

| 컴포넌트 | 상태 | 명세 |
|---|---|---|
| `Button` | primary / secondary / ghost, sm / md / lg, loading, disabled | primary: bg-primary + white text, radius-m, h 48px(md). 문구는 [08_Brand.md](08_Brand.md) 버튼 카피 규칙 준수 |
| `UploadZone` | idle / dragover / loading / error | 점선 border → dragover 시 accent 배경 + scale(1.01). "여기에 사진을 놓아주세요". 파일 선택·카메라 촬영 버튼 내장 |
| `CompareSlider` | dragging / idle | 세로 핸들 + 좌우 라벨(모드별: "Original/Translated", "Before/After — their view"). 터치 44px 히트 영역. 키보드 ←→ 지원 |
| `Hero vision tabs` | 적녹색약: Protan / Deutan · 청황색약: Tritan | 홈 CompareSlider 아래에서 먼저 익숙한 상위 범주를 보여주고, 그 안에서 기준 시야를 선택한다. 선택하면 오른쪽 "번역한 뒤" 이미지가 해당 시뮬레이션으로 바뀐다. |
| `VisionTypeTabs` | selected / unselected | 적녹색약 안의 Protan / Deutan, 청황색약 Tritan (+ 전색맹 Monochromacy, Simulate 전용). 텍스트 라벨 항상 노출, 선택은 배경+밑줄로 표시 (색만 사용 금지). `전색약`은 별도 모델이 생기기 전까지 Monochromacy의 이름으로 사용하지 않는다. |
| `PreviewToggle` | my-eyes / their-eyes | Translate 전용. `내 눈으로 보기`는 원본↔번역본 드래그 비교다. `그 사람의 눈으로 보기`는 번역 후 완성 이미지를 단독으로 보여주는 결과 화면이며, 번역 전/후 드래그 비교는 "번역 전에는 어떻게 보였을까?"를 눌렀을 때만 연다. |
| `StrengthSlider` | - | 번역 강도/시뮬레이션 severity 공용. 0–100%, 현재 값 수치 병기, 스텝 5% |
| `ColorChip` | - | Live Camera용. 사용자가 프레임을 탭한 위치를 십자선으로 표시하고 해당 지점의 색 미리보기 + HEX + RGB를 보여준다. 중앙 고정 샘플링 금지. |
| `ImageColorPicker` | empty / picking / saved | 업로드 이미지의 탭 위치에 번호 마커를 남기고, 데스크톱은 우측·모바일은 하단의 스크롤 목록에 사람이 읽기 쉬운 색 이름(예: 연한 빨간색)·HEX·RGB를 쌓는다. 각 항목은 개별 삭제할 수 있으며 번호는 남은 목록에 맞춰 다시 정렬된다. 저장 시 원본·번호 마커·목록을 하나의 PNG로 합성한다. |
| `QuizCard` | idle / selected / answered | Find My View 문항. 고정 색값의 자체 제작 3카드 비교를 사용하며, 공식 Ishihara 플레이트나 진단 이미지를 복제하지 않는다. 선택 표시는 테두리 + 화살표 아이콘 |
| `Toast` | info / error | 하단 중앙, 4s 자동 소멸, 아이콘+문구 |
| `LangSwitch` | - | EN/KO 토글, 헤더 우측 |
| `Footer` | - | 프라이버시 문구와 저작권, 그리고 Ko-fi 외부 링크로 열리는 작은 응원 버튼. 플랫폼 기본 파랑 대신 NUNBIT의 plum 잉크·lavender-white 토큰을 사용하고, 응원 문구와 버튼 라벨은 현재 언어에 맞춘다. |

### Home task menu

- 홈 히어로에는 행동이 겹치지 않는 두 버튼만 둔다: `사진 번역하기`와 `이미지에서 HEX·RGB 추출하기`. 사진 번역은 원본 `내가 전할 장면`과 번역본 `그 사람에게 전해질 모습`을 하나의 드래그 비교로 보여 준다.
- 메뉴는 감성 문구보다 사용자가 하려는 일을 먼저 이름 붙인다: `사진 번역하기`, `라이브 카메라로 색 확인하기`, `내 시야 설정하기`, `이미지 내 색상 추출 도구`.
- 각 항목 아래에는 쓰는 상황과 결과를 한 줄로 적는다. 색상 추출은 논문 그림·그래프·결과 이미지에서 특정 지점의 HEX/RGB 값을 기록하고 저장하는 도구임을 명시한다.
- 홈의 작업 메뉴는 상위 제목 `무엇을 해볼까요?` 아래 `사진을 함께 보기`, `색을 확인하고 기록하기`, `내 시야 알아보기`의 세 목적만 둔다. 각 목적의 짧은 설명을 왼쪽에, 해당 기능 두 개를 오른쪽에 두어 상위 목적 → 실행할 기능의 순서가 바로 읽히게 한다. `내 시야 설정하기`와 Learn은 `내 시야 알아보기`에 포함한다.
- Learn의 각 유형 카드는 장식용 그래디언트 대신 같은 사진에 적용한 해당 유형의 색각 시뮬레이션 이미지를 사용한다. 이는 모델 기반 예시이며, 개인의 실제 경험을 단정하는 이미지는 아니다.

## 5. Wireframes (구조 스케치)

### Home (mobile)
```
┌──────────────────────┐
│ NUNBIT      EN|KO    │
│                      │
│  서로 다른 눈빛,       │
│  그 사람의 색으로      │
│                      │
│  [장미 사진: 그 사람의 │
│   시야 ⇄ 번역 후      │
│   크로스페이드]        │
│                      │
│  ┌────────────────┐  │
│  │  📷 사진 올리기  │  │  ← 주 CTA → /translate
│  └────────────────┘  │
│                      │
│  ┌──────┐ ┌──────┐   │
│  │그 사람│ │ Live │   │
│  │의 시야│ │Camera│   │
│  └──────┘ └──────┘   │
│  ┌──────┐ ┌──────┐   │
│  │ Find │ │Learn │   │
│  │MyView│ │      │   │
│  └──────┘ └──────┘   │
└──────────────────────┘
```

### Translate (desktop) — 핵심 화면
```
┌────────────────────────────────────────────┐
│ NUNBIT                            EN|KO    │
├──────────────────────────┬─────────────────┤
│ ⦿ 내 눈  ○ 그 사람의 눈   │ 누구에게 보여줄   │
│                          │ 건가요?          │
│   ┌──────────┃─────────┐ │ [Protan][Deutan]│
│   │ Original ┃Translated│ │ [Tritan]        │
│   │          ┃          │ │ 유형을 모른다면? │
│   │      ◀ ┃ ▶        │ │ → 물어보기 링크  │
│   └──────────┃─────────┘ │                 │
│                          │ 번역 강도   80%  │
│  "그 사람의 눈" 모드:     │ ────────●────   │
│   번역 전 시야 ┃ 번역 후  │                 │
│   시야 비교               │ [ Download ]    │
│                          │ [ 보내기 💌 ]    │
│   업로드해도 서버에 저장되지│                 │
│   않아요                  │                 │
├──────────────────────────┴─────────────────┤
│ 이 사진이 왜 다르게 보이는지 궁금하다면 → Learn │
└────────────────────────────────────────────┘
```

### Simulate (desktop)
```
Translate와 동일 레이아웃, 우측 패널만 차이:
  Vision type [Protan][Deutan][Tritan][Mono]
  Severity 100% ──────────●──
  하단 CTA: "이 사진, 그 사람이 잘 볼 수 있게
            번역해 볼까요?" → /translate
```

### Find My View — 문항 / 결과
```
┌──────────────────────┐   ┌──────────────────────┐
│  3 / 12   ────●───   │   │                      │
│                      │   │     Most likely      │
│   [도트 패턴 원판]     │   │                      │
│                      │   │       Deutan         │
│  무엇이 보이나요?      │   │                      │
│  [ 8 ] [ 3 ] [ 6 ]   │   │ (Not a medical       │
│  [ 잘 안 보여요 ]      │   │      diagnosis)      │
│                      │   │                      │
└──────────────────────┘   │ [이 설정으로 시작하기] │
                           │  Deutan에 대해 알아보기│
                           └──────────────────────┘
```

### Live Camera (mobile, full-bleed)
```
┌──────────────────────┐
│  ✕            ⟲전환  │
│                      │
│      [카메라 뷰]      │
│         ┼            │  ← 중앙 조준점
│                      │
│ ┌──────────────────┐ │
│ │ ● Terracotta     │ │
│ │ #C96F4A  201,111,74│
│ └──────────────────┘ │
│  [필터: Off|P|D|T]   │
└──────────────────────┘
```

## 6. 상태별 UX 카피 원칙

- 에러도 브랜드 톤으로: "앗, 이 파일은 읽을 수 없었어요. JPG나 PNG로 다시 시도해 볼까요?"
- 로딩(Translate): "사진 속 색의 차이를 옮기는 중..." / 로딩(Simulate): "그 사람의 시선으로 바꾸는 중..."
- 빈 상태(업로드 전): 기능 설명이 아니라 감정 제안 — "보여주고 싶었던 사진으로 시작해 보세요."
- 번역 완료 순간: 꽃·노을처럼 함께 보고 싶은 장면을 떠올리게 하되, "이제 볼 수 있어요"처럼 색각이 되돌아온다는 약속은 하지 않는다. "장면의 인상이 더 잘 전해지도록" 같은 정직한 표현을 쓴다.
