# 02. PRD — 기능 요구사항

> v1.0 — 2026-07-08
> 범위: MVP. 핵심 기능은 **Translate (색 번역)**, 보조 기능은 Simulate (시뮬레이션).
> 이후 버전 기능은 [09_Roadmap.md](09_Roadmap.md) 참고.

---

## 1. Information Architecture

```
Home (/)
├── Translate      (/translate)      ← 핵심: 그 사람의 색으로 번역
├── Simulate       (/simulate)       ← 보조: 그 사람의 시야로 보기
├── Live Camera    (/live)
├── Find My View   (/find-my-view)
└── Learn          (/learn)
    ├── /learn/protanopia
    ├── /learn/deuteranopia
    ├── /learn/tritanopia
    └── /learn/faq
```

- 모든 기능은 Route 기반 (SEO를 위해 각 기능이 고유 URL을 가짐)
- 도메인: `iris.withint.com` (가칭 — [08_Brand.md](08_Brand.md))
- i18n: `/en/...`, `/ko/...` prefix ([05_Architecture.md](05_Architecture.md))
- Translate와 Simulate는 내부적으로 같은 에디터 컴포넌트를 모드만 바꿔 공유

## 2. Core User Flows

### Flow A — 보내는 사람 (핵심 플로우)
```
"이 장미를 그 사람에게 보여주고 싶다"
 → Home에서 사진 업로드
 → 상대의 색약 유형 선택
    ├─ 알고 있음 → 선택 (Deutan 등)
    └─ 모름 → "그 사람에게 물어보기": Find My View 링크 공유
              (또는 대표 유형인 Deutan으로 우선 진행)
 → 색 번역 적용
 → 미리보기 토글: "그 사람에게는 이렇게 보여요"
    (번역 전 시뮬레이션 vs 번역 후 시뮬레이션 — 꽃이 도드라지는 걸 확인)
 → 다운로드 / 공유 (메시지 카드 형태, 08_Brand 카피)
```

### Flow B — 색약 당사자
```
받은 링크로 진입 (or 직접 방문)
 → Find My View로 내 유형 확인 → LocalStorage 저장
 → 이후 모든 기능이 내 유형 기본 적용
    ├─ Translate: 내 사진을 내 눈에 잘 보이게 변환
    └─ Live Camera: 실시간 번역 필터로 꽃밭/단풍 구경, 색 이름 확인
```

### Flow C — 이해하고 싶은 사람
```
사진 업로드 → Simulate → Compare Slider로 원본 vs 그 사람의 시야
 → "이래서 번역이 필요하구나" → Translate로 유도
```

### Returning Visit
- LocalStorage의 `visionType` / `severity`가 있으면 업로드 즉시 해당 설정 적용. 유형 선택 단계를 건너뛴다.

## 3. 화면별 요구사항

### 3.1 Home (`/`)

| ID | 요구사항 | 우선순위 |
|---|---|---|
| H-1 | Hero: 핵심 카피 + 대표 이미지 (붉은 장미: 색약 시야 → 번역 후 시야 크로스페이드, "묻혀 있던 꽃이 떠오르는" 순간) | P0 |
| H-2 | Hero 내 즉시 업로드 CTA (파일 선택 + 드래그&드롭 + 모바일 카메라/갤러리) | P0 |
| H-3 | 업로드 시 `/translate`로 이동하며 이미지 전달 | P0 |
| H-4 | 기능 카드: Translate / Simulate / Live Camera / Find My View / Learn | P0 |
| H-5 | 언어 전환 (EN/KO) | P0 |

### 3.2 Translate (`/translate`) — 핵심 기능

| ID | 요구사항 | 우선순위 |
|---|---|---|
| T-1 | 이미지 업로드: 파일 선택, 드래그&드롭, 붙여넣기(Ctrl+V), 모바일 촬영 | P0 |
| T-2 | 지원 포맷: JPEG/PNG/WebP/HEIC(변환), 최대 20MB. 처리 전 최대 4096px 리사이즈 | P0 |
| T-3 | 상대 유형 선택: Protan / Deutan / Tritan (텍스트 라벨 항상 노출) | P0 |
| T-4 | 번역 강도 슬라이더 0–100%, 기본 80% (과보정은 부자연스러움 — [04_Tech.md](04_Tech.md)) | P1 |
| T-5 | **미리보기 토글 "그 사람에게는 이렇게 보여요"**: 번역 전 시뮬레이션 ↔ 번역 후 시뮬레이션을 Compare Slider로 비교 | P0 |
| T-6 | 일반 보기: 원본 ↔ 번역본 비교 (보내는 사람 눈 기준) | P0 |
| T-7 | 다운로드: 번역 이미지 PNG/JPEG. 파일명 `{brand}-for-{type}-{date}` | P0 |
| T-8 | 공유: Web Share API (모바일) / 링크 복사 (데스크톱). 하단에 한 줄 카피 포함 옵션("네가 볼 수 있는 색으로 번역했어") | P1 |
| T-9 | 모든 처리는 클라이언트에서 수행. "사진은 서버로 전송되지 않아요" UI 명시 | P0 |
| T-10 | 유형을 모를 때: "그 사람에게 물어보기" → Find My View 링크 복사/공유 | P1 |

**Edge cases**
- 지원하지 않는 포맷 → 친절한 에러 토스트 + 지원 포맷 안내
- 초대형 이미지 → 자동 리사이즈 후 안내 (품질 이슈 방지)
- Canvas 메모리 실패(구형 모바일) → 2048px로 재시도
- 번역 효과가 미미한 이미지(이미 구분 가능한 색 구성) → "이 사진은 이미 잘 보여요 :)" 안내 (번역 전후 시뮬레이션 차이가 작을 때)

### 3.3 Simulate (`/simulate`)

| ID | 요구사항 | 우선순위 |
|---|---|---|
| S-1 | Translate와 동일한 업로드 UX (T-1, T-2 공유) | P0 |
| S-2 | 유형 선택: Protan / Deutan / Tritan / Monochromacy(회색조) | P0 (Mono는 P1) |
| S-3 | 강도(severity) 슬라이더 0–100%, 기본 100% (Machado 행렬 보간) | P1 |
| S-4 | Compare Slider: 원본 ↔ 시뮬레이션 좌우 드래그 비교 (터치/키보드 지원) | P0 |
| S-5 | 다운로드/공유 (T-7, T-8과 동일 규칙) | P1 |
| S-6 | 하단 CTA: "이 사진, 그 사람이 잘 볼 수 있게 번역해 볼까요?" → `/translate` | P1 |

### 3.4 Live Camera (`/live`)

| ID | 요구사항 | 우선순위 |
|---|---|---|
| L-1 | `getUserMedia` 후면 카메라 스트림 (전/후면 전환) | P0 |
| L-2 | 실시간 필터: Off / **Translate(내 유형에 맞게 보정)** / Simulate(색약 시야) | P1 |
| L-3 | 중앙 고정 Color Picker: 조준점 아래 픽셀 색상 표시 | P0 |
| L-4 | 색상 정보: HEX, RGB, **Color Name** (최근접 색 이름, EN/KO) — "이 꽃 무슨 색이야?"에 답하는 기능 | P0 |
| L-5 | 탭하면 현재 색상 고정(freeze) + 복사 | P1 |
| L-6 | 카메라 권한 거부/미지원: 안내 화면 + Translate로 유도 | P0 |
| L-7 | 카메라 프레임은 저장/전송하지 않음을 명시 | P0 |

**Color Name 규칙**: 색 이름 사전(≈140색, CSS named colors 기반 + 한국어 번역)에서 Lab 거리 최근접 매칭 (MVP 단순화, [04_Tech.md](04_Tech.md)).

### 3.5 Find My View (`/find-my-view`)

**목적**: 의료 진단이 아니라, **서비스 기본값(visionType/severity) 설정을 위한 Quick Check**.

많은 사용자, 특히 한국어 사용자는 자신의 유형을 "적록색약"처럼 뭉뚱그려서만 알고 있을 뿐 protan/deutan/tritan이라는 학명이나 서로의 차이를 모른다 — "적록색약" 자체가 사실 protan과 deutan 두 유형을 합친 말이라는 것도 잘 알려져 있지 않다. Find My View는 유형을 추정해주는 데서 그치지 않고, **이 구분을 처음으로 알게 해주는 역할**을 겸한다 (결과 화면에서 상위 카테고리와 함께 설명, Learn 링크로 연결).

보내는 사람이 상대에게 링크로 보내는 사용례가 많으므로, 진입 화면에 "OO님이 당신의 색을 알고 싶어해요" 같은 따뜻한 컨텍스트 카피 사용 (MVP는 고정 카피, 이름 삽입은 v2).

#### 테스트 설계

- 총 **12문항**, 소요 시간 목표 90초 이내
- 실제 Ishihara 판 이미지를 사용하지 않는다 (저작권 + 화면 색 재현 한계). 자체 생성 도트 패턴 사용
- 문항 유형 2종:
  1. **도트 패턴 판독 (8문항)** — 랜덤 도트 원판 안에 숫자/도형이 숨겨진 SVG를 런타임 생성. 배경색·도형색을 각 유형의 **confusion line** 위 색 쌍으로 구성 (protan축 3, deutan축 3, tritan축 2)
  2. **다른 색 찾기 (4문항)** — 4개의 색 패치 중 하나만 confusion line에서 벗어난 색. "다른 하나를 고르세요"
- 각 문항에 "잘 안 보여요" 선택지 제공 (강제 추측 방지)
- 문항 순서와 정답 위치는 랜덤화

#### 판정 로직

```
축별 오답수 집계 (protan_miss, deutan_miss, tritan_miss)
→ 전체 오답 ≤ 1        : "Typical color vision (아마도 일반 색각)"
→ 특정 축 오답 ≥ 50%   : 해당 축을 Most likely로 판정
   - protan/deutan 모두 높으면 오답률 높은 쪽 + "Red-green" 부가 표기
→ severity 추정: 해당 축 오답률 50–75% → mild(0.6), 75%+ → strong(1.0)
→ 판정 불가(오답이 고르게 분산) : "결과가 명확하지 않아요" + Learn 유도
```

#### 결과 화면

```
Most likely

   Deutan

(This is not a medical diagnosis)
```

- 결과 아래: ① "이 설정으로 시작하기" CTA (LocalStorage 저장 → `/translate`) ② 해당 유형 Learn 링크 ③ "정확한 검사는 안과에서" 한 줄 ④ "이 결과를 보낸 사람에게 알려주기" (결과 텍스트 공유)
- Protan/Deutan 결과에는 "적록색약 중 Deutan"처럼 사용자가 알던 상위 카테고리를 함께 표기 (Tritan은 "청황색약") — 뭉뚱그린 표현과 정확한 유형명을 연결해주는 것이 이 화면의 핵심 역할
- 화면 밝기/야간 모드가 결과에 영향을 줄 수 있음을 시작 화면에 안내

#### 면책 원칙 (전 화면 공통)
- "진단", "검사 결과", "이상/정상" 등의 단어를 쓰지 않는다 → 금지어 목록은 [08_Brand.md](08_Brand.md)
- 항상 "Most likely / ~일 가능성이 높아요" 화법

### 3.6 Learn (`/learn/*`)

| ID | 요구사항 | 우선순위 |
|---|---|---|
| E-1 | 유형별 페이지 3종: protanopia / deuteranopia / tritanopia | P0 |
| E-2 | 구성: 정의(비의료 톤) → 인구 통계 → **같은 사진의 원본/시뮬레이션/번역본 3단 비교** → 일상에서 겪는 상황 → 주변인이 할 수 있는 것 | P0 |
| E-3 | FAQ 페이지 (10문항 내외, FAQPage structured data) | P1 |
| E-4 | 모든 Learn 페이지는 SSG — SEO 핵심 자산 ([07_SEO.md](07_SEO.md)) | P0 |

## 4. 색약 유형별 UX 차이

색약 당사자가 **Primary 사용자**다. 서비스 자체가 색약 친화적이어야 한다.

| 원칙 | 적용 |
|---|---|
| 색만으로 정보를 전달하지 않는다 | 유형 탭은 색+텍스트, 슬라이더 상태는 수치 병기, 상태는 아이콘+문구 |
| 번역 결과 확인 | 당사자에게는 번역 전후가 실제로 다르게 보여야 함 — Compare Slider가 그 자체로 검증 도구 |
| Find My View 답변 UI | 색 패치 선택 상태를 테두리 굵기+체크 아이콘으로 표시 |
| 대비 | 본문 텍스트 WCAG AA(4.5:1) 이상 ([03_UI_UX.md](03_UI_UX.md)) |
| 번역 기본값 | Protan: 빨강의 어두움 보상(명도 조정 병행) / Deutan: 적록 오차를 청황축으로 / Tritan: 청황 오차를 적록축으로 ([04_Tech.md](04_Tech.md)) |
| Learn 콘텐츠 | 유형별 "실제로 헷갈리는 색 조합" 예시를 다르게 구성 |

## 5. 비기능 요구사항

| 항목 | 기준 |
|---|---|
| 성능 | LCP < 2.5s (모바일 4G), 번역/시뮬레이션 적용 < 1s (12MP 이미지, 중급 폰) |
| 프라이버시 | 이미지·카메라 프레임의 서버 전송 없음. 분석 도구에 이미지 데이터 포함 금지 |
| 접근성 | WCAG 2.1 AA 목표. 키보드 내비게이션, 스크린리더 라벨 |
| 브라우저 | 최신 Chrome/Safari/Edge/Firefox + iOS Safari 16+, Android Chrome |
| 오프라인 | MVP 미지원 (PWA는 v2, [09_Roadmap.md](09_Roadmap.md)) |
