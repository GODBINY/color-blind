# 04. Tech — 기술 스택 & 색 변환 알고리즘

> v1.0 — 2026-07-08
> 시스템 구조·배포는 [05_Architecture.md](05_Architecture.md) 참고. 이 문서는 스택 선정과 핵심 알고리즘(시뮬레이션 + 번역)을 다룬다.

---

## 1. Tech Stack

| 영역 | 선택 | 비고 |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Learn/Home은 SSG로 SEO 확보, 에디터는 클라이언트 컴포넌트 |
| Styling | **Tailwind CSS v4** | 디자인 토큰([03_UI_UX.md](03_UI_UX.md))을 `@theme`으로 정의 |
| 이미지 처리 | **Canvas 2D (정지 이미지) + WebGL (Live Camera)** | 아래 §4 성능 전략 |
| 카메라 | `getUserMedia` | HTTPS 필수, iOS Safari 제약 확인 |
| i18n | **next-intl** | `/en`, `/ko` 라우팅 |
| 상태 | React state + LocalStorage wrapper | 서버 상태 없음, 전역 스토어 불필요 (Context 1개) |
| 배포 | **Vercel** | Preview 배포로 리뷰 |
| 테스트 | Vitest (색 변환 함수 단위 테스트 필수) + Playwright (핵심 플로우) | 행렬 연산은 스냅샷 값으로 검증 |
| Lint/Format | ESLint + Prettier | |

## 2. 색 변환 파이프라인 개요

두 기능은 하나의 파이프라인을 공유한다:

```
                    ┌─ Simulate: 그대로 출력 ──────────────┐
sRGB → linear RGB → │                                      │→ linear → sRGB
                    └─ Translate: 시뮬레이션과의 오차를     │
                       보이는 축으로 재분배(daltonize) ─────┘
```

**공통 전처리 — sRGB ↔ linear RGB** (모든 행렬 연산은 linear 공간에서):

```ts
const toLinear = (c: number) => // c: 0..1
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const toSRGB = (c: number) =>
  c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
```

## 3. Simulate — 색약 시야 시뮬레이션

### 알고리즘 선택

| 알고리즘 | 특징 | 채택 |
|---|---|---|
| **Machado et al. 2009** | 생리학 기반. severity 0.0–1.0을 0.1 단위 행렬로 제공 → **약도 색약(anomalous trichromacy) 표현 가능**. RGB 3×3 행렬 곱 한 번이라 빠름 | ✅ **기본 (Protan/Deutan)** |
| Brettel et al. 1997 | dichromacy(완전 2색형)의 표준. LMS 공간에서 confusion line을 두 반평면에 투영. Tritan 정확도가 Machado보다 좋음 | ✅ **Tritan 전용** (Machado의 tritan 행렬은 부정확하다고 알려져 있음) |
| Viénot et al. 1999 | Brettel의 protan/deutan 단순화(행렬 1개) | 참고용 |

> 구현 검증 레퍼런스: DaltonLens 문서와 `libDaltonLens`(public domain), Machado 행렬 표 (https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html)

### Machado 행렬 (severity 1.0 예시)

```
Protanopia (1.0)                Deuteranopia (1.0)
 0.152286  1.052583 -0.204868    0.367322  0.860646 -0.227968
 0.114503  0.786281  0.099216    0.280085  0.672501  0.047413
-0.003882 -0.048116  1.051998   -0.011820  0.042940  0.968881
```

- severity 슬라이더: 공개된 0.1 단위 행렬 11개를 상수로 내장하고, 중간값은 인접 행렬 두 개를 선형 보간 (identity와의 단순 보간보다 정확)
- Monochromacy: linear 공간 luminance (Rec.709 가중치 0.2126/0.7152/0.0722) 회색조

### Tritan — Brettel 1997

- linear RGB → LMS (Hunt-Pointer-Estevez 등 문헌 기준 변환 행렬)
- S축 confusion line을 기준 두 반평면(475nm / 660nm 앵커)에 투영 후 RGB 복원
- severity < 1.0은 원본과 결과를 선형 블렌딩

## 4. Translate — 색 번역 (Daltonization)

**목표**: 색약인 사람이 구분하기 어려운 색 차이(예: 초록 잎 속의 빨간 장미)를, **그 사람이 구분할 수 있는 축의 차이로 옮겨서** 사진의 인상과 아름다움을 전달한다.

> 정직성 원칙: 잃어버린 색 지각을 "복원"하는 것이 아니다. 우리는 색의 *차이*를 번역한다. UI/카피에서도 "교정·치료" 표현 금지 ([08_Brand.md](08_Brand.md)).

### 기본 알고리즘 — Error Redistribution (Fidaner et al. 계열)

```
1. sim   = simulate(original)          // 그 사람에게 보이는 모습
2. error = original - sim              // 그 사람이 "잃어버리는" 색 정보
3. shifted = M_shift × error           // 오차를 보이는 축으로 회전
4. result = original + strength × shifted
5. clamp & gamut 처리
```

- **Protan/Deutan**: 적록축 오차를 청황축으로 재분배. 표준 shift 행렬 예:

```
M_shift = [ 0    0    0
            0.7  1    0
            0.7  0    1 ]
```

- **Tritan**: 청황축 오차를 적록축으로 재분배 (shift 행렬 전치 형태)
- **Protan 추가 보정**: 빨강이 어둡게 보이는 문제(luminance loss)를 명도 보상으로 병행

### 품질 규칙

- `strength` 기본 80%. 100%는 하늘·피부톤까지 변해 부자연스러울 수 있음 → 슬라이더 제공 ([02_PRD.md](02_PRD.md) T-4)
- **번역 효과 측정**: `Δ = mean|simulate(result) - simulate(original)|` — Δ가 임계값 미만이면 "이 사진은 이미 잘 보여요" 안내
- 검증 도구: 번역 후 시뮬레이션(= 그 사람이 볼 모습)을 반드시 미리보기로 제공 — 이것이 T-5의 근거
- 알고리즘 튜닝은 실제 색약 당사자(남자친구) 피드백으로 검증하는 것이 최우선. 문헌 지표보다 "꽃이 보이는가"가 기준

## 5. 렌더링 & 성능 전략

| 대상 | 방식 | 이유 |
|---|---|---|
| 정지 이미지 (Translate/Simulate) | Canvas 2D `ImageData` + 픽셀 루프, 4096px 초과 시 리사이즈 | 1회성 연산, 구현 단순. 12MP에서도 수백 ms 수준 |
| 처리 중 블로킹 방지 | Web Worker (`OffscreenCanvas` 지원 시) | 메인 스레드 UI 유지 |
| Live Camera | **WebGL fragment shader** (행렬을 uniform으로) | 30fps 실시간은 CPU 루프 불가 |
| Compare Slider | 변환본을 캔버스/이미지 2장으로 두고 `clip-path`로 분할 | 드래그마다 재연산 금지 |
| 색 이름 매칭 | 색 사전(≈140색)의 Lab 값 사전 계산, 최근접 탐색 | 실시간 픽커 대응 |

## 6. 폴더 구조 (Next.js App Router)

```
src/
├── app/
│   └── [locale]/
│       ├── layout.tsx / page.tsx        # Home
│       ├── translate/page.tsx
│       ├── simulate/page.tsx
│       ├── live/page.tsx
│       ├── find-my-view/page.tsx
│       └── learn/
│           ├── page.tsx
│           ├── [type]/page.tsx          # protanopia | deuteranopia | tritanopia
│           └── faq/page.tsx
├── components/
│   ├── ui/                              # Button, Toast, Slider... (03_UI_UX 명세)
│   ├── editor/                          # UploadZone, CompareSlider, PreviewToggle,
│   │                                    # VisionTypeTabs, StrengthSlider (Translate/Simulate 공유)
│   ├── camera/                          # CameraView, ColorChip, Crosshair
│   └── quiz/                            # QuizCard, DotPlate, ResultCard
├── lib/
│   ├── color/
│   │   ├── srgb.ts                      # linear 변환
│   │   ├── simulate.ts                  # Machado/Brettel
│   │   ├── machado-matrices.ts          # 0.1 step 행렬 상수
│   │   ├── daltonize.ts                 # 번역 (error redistribution)
│   │   ├── color-names.ts              # 색 이름 사전 + Lab 최근접
│   │   └── __tests__/
│   ├── canvas/                          # ImageData 처리, Worker, 리사이즈
│   ├── webgl/                           # Live Camera shader
│   ├── quiz/                            # 문항 생성(confusion line 색 쌍), 판정 로직
│   ├── storage.ts                       # LocalStorage wrapper (버전 키 포함)
│   └── analytics.ts                     # GTM dataLayer 헬퍼 (06_Analytics)
├── i18n/                                # next-intl 메시지 (en.json, ko.json)
└── styles/
docs/                                    # 이 문서들
public/og/                               # OG 이미지 (07_SEO)
```

## 7. LocalStorage 스키마

```ts
// key: "iris:v1"  (스키마 버전 포함 — 마이그레이션 대비)
{
  visionType: "protan" | "deutan" | "tritan" | null,
  severity: number,          // 0..1
  translateStrength: number, // 0..1, 기본 0.8
  language: "en" | "ko",
  completedOnboarding: boolean,
  findMyViewResult: { type: string; confidence: "clear" | "unclear"; at: string } | null
}
```

## 8. 기술 리스크 & 대응

| 리스크 | 대응 |
|---|---|
| iOS Safari HEIC 업로드 | `heic2any` 등으로 클라이언트 변환, 실패 시 안내 |
| iOS Safari getUserMedia 제약 (PWA/인앱브라우저) | 기능 감지 후 Translate로 폴백 유도 |
| 디스플레이마다 색 재현 차이 | Find My View 시작 화면에 밝기 안내, 결과를 "Most likely"로만 표현 |
| 번역 결과가 부자연스러움 | strength 기본 80% + 슬라이더, 당사자 피드백 루프 |
| 대형 이미지 메모리 (구형 모바일) | 4096 → 2048px 단계적 폴백 |
