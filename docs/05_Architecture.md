# 05. Architecture — 시스템 구조

> v1.0 — 2026-07-08
> 스택 선정 근거와 알고리즘은 [04_Tech.md](04_Tech.md) 참고.

---

## 1. 설계 원칙

1. **서버리스, 아니 서버 자체가 없음** — MVP는 백엔드 0. 모든 이미지 처리·판정·저장은 브라우저에서.
2. **프라이버시가 아키텍처다** — "사진이 서버로 가지 않는다"는 코드 구조로 보장되고, 마케팅 포인트가 된다.
3. **정적 우선** — SEO 대상 페이지(Home, Learn)는 빌드 타임에 생성. 에디터만 클라이언트 컴포넌트.

## 2. 시스템 다이어그램

```
┌─────────────────────────── Browser ────────────────────────────┐
│                                                                 │
│  Next.js App (SSG shell + Client Components)                    │
│                                                                 │
│  ┌───────────┐   ┌──────────────────────────────┐               │
│  │ UI Layer  │──▶│ lib/color (simulate/daltonize)│              │
│  │ (React)   │   │  ├ Canvas2D + Web Worker (정지)│             │
│  └─────┬─────┘   │  └ WebGL shader (Live Camera) │              │
│        │         └──────────────────────────────┘               │
│        ├──▶ LocalStorage ("iris:v1")                            │
│        └──▶ dataLayer ──▶ GTM ──▶ GA4 / Clarity                 │
│                                                                 │
│  이미지/카메라 프레임: 브라우저 밖으로 나가지 않음 ❌→서버         │
└─────────────────────────────────────────────────────────────────┘
              │ 정적 자산/HTML 요청
              ▼
        Vercel (Edge CDN) ── 빌드: Next.js SSG
```

## 3. 라우팅 & 렌더링 전략

| Route | 렌더링 | 이유 |
|---|---|---|
| `/[locale]` (Home) | SSG | SEO, LCP |
| `/[locale]/translate` | SSG shell + Client | 에디터는 전부 클라이언트. 셸은 정적으로 즉시 표시 |
| `/[locale]/simulate` | Redirect | 이전 공유 링크를 `/[locale]/translate`로 이동 |
| `/[locale]/live` | Client | 카메라 권한 필요 |
| `/[locale]/find-my-view` | SSG shell + Client | 문항 생성은 클라이언트 랜덤 |
| `/[locale]/learn/**` | **SSG (전체 정적)** | SEO 핵심 자산 |
| `sitemap.xml`, `robots.txt`, OG | 빌드 타임 생성 | [07_SEO.md](07_SEO.md) |

- `[locale]` = `en` | `ko`, next-intl 미들웨어가 Accept-Language 기반 리다이렉트. `x-default`는 `/en`.
- 페이지 간 이미지 전달(Home 업로드 → `/translate`): 메모리 내 전달(Context) + 새로고침 시 소실 허용. URL/스토리지에 이미지 저장하지 않음.

## 4. 상태 관리

```
AppContext (React Context 1개)
├── userSettings   : LocalStorage와 동기화 (visionType, severity, language...)
├── currentImage   : 세션 한정 (ImageBitmap) — 저장 안 함
└── editorState    : 모드(translate|simulate), strength, 미리보기 토글
```

- 전역 스토어 라이브러리(Redux/Zustand) 불필요 판단. 상태 표면이 작고 서버 상태가 없음. 복잡해지면 Zustand로 전환 (컴포넌트 인터페이스 유지).
- LocalStorage 접근은 `lib/storage.ts` wrapper로만 — 스키마 버전(`iris:v1`) 관리, SSR 가드, try/catch (사파리 프라이빗 모드).

## 5. 이미지 처리 실행 모델

```
업로드 → 디코드(createImageBitmap) → EXIF 회전 보정 → 4096px 리사이즈
  → Worker로 ImageData 전송(transferable)
  → Worker: simulate / daltonize (행렬 연산)
  → 메인: 결과 비트맵 렌더 + Compare Slider
```

- Worker 미지원/실패 시 메인 스레드 폴백 (requestIdleCallback 청크 처리)
- Live Camera: `<video>` → WebGL 텍스처 → shader에서 행렬 적용 → 캔버스 출력. Color Picker는 중앙 1px `readPixels`.

## 6. 에러 처리 & 관측

| 레이어 | 방식 |
|---|---|
| 색 변환 함수 | 순수 함수 + 단위 테스트 (문헌 기준값 스냅샷) |
| UI 에러 | Error Boundary + 브랜드 톤 안내 화면 |
| 런타임 에러 수집 | MVP: GA4 exception 이벤트로 최소 수집. 규모 커지면 Sentry (이미지 데이터 첨부 금지) |
| 성능 | Vercel Analytics (Web Vitals) 또는 GA4 Web Vitals 이벤트 |

## 7. 보안 & 프라이버시 체크리스트

- [ ] CSP: `img-src 'self' blob: data:`, 외부 스크립트는 GTM/GA/Clarity만 허용
- [ ] 이미지 관련 네트워크 요청이 없음을 E2E 테스트로 고정 (Playwright에서 request 감시)
- [ ] 분석 이벤트 파라미터에 픽셀/파일명 등 콘텐츠 정보 포함 금지 ([06_Analytics.md](06_Analytics.md))
- [ ] 개인정보처리방침 페이지: "이미지는 기기를 떠나지 않습니다" 명시
- [ ] GDPR/쿠키: EU 트래픽 대비 Consent Mode v2 (GTM 설정)

## 8. 확장 경로 (v2+를 막지 않는 결정들)

| 미래 기능 | 지금 해두는 것 |
|---|---|
| PWA | 아키텍처가 이미 클라이언트 완결 → Service Worker만 추가하면 됨 |
| 공유 URL (번역 결과 링크) | 그때 최초의 서버(이미지 임시 저장 or URL 파라미터 레시피 재현) 필요 — 에디터 상태를 직렬화 가능하게 유지 |
| Native App | `lib/color`를 프레임워크 독립 순수 TS로 유지 → RN/캡ac이터 재사용 |
| 계정/히스토리 | LocalStorage 스키마에 버전 키 유지 → 마이그레이션 경로 확보 |
