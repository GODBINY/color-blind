# 09. Roadmap — 일정 & 확장 전략

> v1.0 — 2026-07-08
> 사이드 프로젝트 전제(주 10시간 내외, 평일 저녁+주말). 일정은 범위 우선이 아니라 **마일스톤 우선** — 늦어지면 기간을 늘리지 말고 범위를 줄인다.

---## 1. 마일스톤

```
M0 ─ Setup & 알고리즘 코어      (1.5주)
M1 ─ Translate 수직 슬라이스    (2주)   ← 첫 감동 확인 지점
M2 ─ Simulate + Find My View   (2주)
M3 ─ Live Camera               (1.5주)
M4 ─ Learn + SEO + 다듬기       (2주)
M5 ─ 계측 + 베타 + 런칭          (1주)
                          합계 ≈ 10주 (7월 중순 → 9월 말 런칭 목표)
```

### M0 — Setup & 알고리즘 코어 (~7/26)
- Next.js + TS + Tailwind + next-intl 셋업, Vercel 연결, 폴더 구조 ([04_Tech.md](04_Tech.md))
- `lib/color` 구현: sRGB↔linear, Machado 시뮬레이션, Brettel tritan, daltonize — **단위 테스트 포함**
- 디자인 토큰 코드화
- ✅ 완료 기준: 테스트 통과 + 샘플 장미 사진의 번역 결과를 남자친구에게 보여주고 "차이가 보인다" 확인 ← **프로젝트 최대 리스크(번역 품질)를 최전방에서 검증**

### M1 — Translate 수직 슬라이스 (~8/9)
- 업로드(UploadZone) → 유형 선택 → 번역 → Compare Slider → 미리보기 토글 → 다운로드/공유
- Web Worker 처리, 에러/엣지 케이스 ([02_PRD.md](02_PRD.md) 3.2)
- ✅ 완료 기준: 모바일 실기기에서 Flow A 전체가 동작

**구현 메모 (2026-07-20):** Translate/Simulate 공용 에디터의 업로드·Canvas 처리·비교·저장까지 구현했다. 홈에서 선택한 이미지는 세션 한정으로 Translate에 이어진다. 실제 모바일 기기 E2E와 HEIC/Web Share 처리는 다음 검증 항목으로 남긴다.

### M2 — Simulate + Find My View (~8/23)
- Simulate 페이지 (에디터 컴포넌트 재사용)
- Find My View: 문항 생성(도트 패턴 SVG, confusion line 색 쌍), 판정, 결과 저장, 공유 링크
- ✅ 완료 기준: FMV 결과가 Translate 기본값으로 이어지는 Flow B 동작

**구현 메모 (2026-07-20):** Simulate 비교 흐름과 Find My View 12문항/로컬 설정 저장/Translate 연결을 구현했다. 도트 패턴 기반 문항과 실제 사용자 검증은 후속 보정이 필요하다.

### M3 — Live Camera (~9/2)
- getUserMedia + WebGL shader 필터(off/translate/simulate), Color Picker + 색 이름
- iOS Safari 실기기 검증 (최대 리스크 구간 — 안 되면 P1 기능 축소)
- ✅ 완료 기준: iPhone/Android 실기기에서 30fps 필터 + 색 이름 표시

**구현 메모 (2026-07-20):** 카메라 권한·전후면 전환·중앙 색의 HEX/RGB 표시는 구현했다. 실시간 필터, 색 이름, 모바일 30fps 검증은 아직 남아 있다.

### M4 — Learn + SEO + 폴리시 (~9/16)
- Learn 3종 + FAQ (EN/KO), 메타/hreflang/sitemap/structured data/OG ([07_SEO.md](07_SEO.md))
- 개인정보처리방침, 접근성 점검(키보드/스크린리더/대비), reduced-motion
- 카피 전수 리뷰 — [08_Brand.md](08_Brand.md) 체크리스트

### M5 — 계측 + 베타 + 런칭 (~9/23)
- GTM/GA4/Clarity/Search Console + 대시보드 ([06_Analytics.md](06_Analytics.md)), Consent Mode
- 지인 베타 (색약 당사자 2명 이상 포함), 피드백 반영
- 런칭: 커뮤니티 공유 (KO: 창업 스토리 글과 함께 / EN: r/ColorBlind — 홍보가 아닌 피드백 요청 톤으로)

## 2. MVP 제외 기능 (Backlog, 사유 포함)

| 기능 | 제외 사유 | 재검토 시점 |
|---|---|---|
| 공유 URL (링크로 결과 열람) | 최초의 서버/스토리지 필요 → 프라이버시 원칙 재설계 필요 | v1.5 — share 이벤트 수요 확인 후 |
| 동적 OG (결과 미리보기) | 공유 URL 전제 | 공유 URL과 함께 |
| GIF/비디오 번역 | 처리 시간·메모리 큼 | v2 |
| AI 장면 설명 ("무엇이 어떤 색인지 설명") | API 비용 + 이미지가 기기를 떠남 → 원칙 충돌, 옵트인 설계 필요 | v2 |
| 계정/히스토리 | 서버 필요, MVP 가치 낮음 | 앱 단계 |
| 안경/렌즈 등 물리 보정 정보 콘텐츠 | 의료 인접 — 신중해야 함 | 보류 |
| 다국어 3+ (JA 등) | 콘텐츠 유지비 | SEO 성과 확인 후 |
| Monochromacy 번역 | 수요 적고 번역 정의가 다름 (시뮬레이션은 P1로 포함) | v2 |

## 3. PWA → 앱 확장 전략

### 단계
```
v1  Web (MVP)          — 검증: 선물 퍼널 전환율, 오가닉 유입
v1.5 PWA               — 설치 가능 + 오프라인 (아키텍처가 이미 클라이언트 완결이라 비용 낮음)
v2  공유 URL + 동적 OG  — 첫 서버 도입, 바이럴 루프 강화
v3  Native App         — 조건부: 아래 트리거 충족 시
```

### PWA (v1.5)
- Service Worker 캐싱(앱 셸 + 색 사전), manifest, 설치 유도(재방문 사용자에게만)
- Live Camera 사용자에게 가치 최대 (홈 화면에서 바로 카메라)

### Native App (v3) — 진행 트리거
다음 중 2개 이상 충족 시에만 착수:
- 주간 재방문 사용자 1,000+ 또는 PWA 설치 500+
- Live Camera 사용 비중 30%+ (실시간 = 앱의 핵심 우위)
- 웹에서 불가능한 요구 확인 (카메라 성능, 공유 시트 통합, 위젯)

앱에서만 가능한 확장: 실시간 고성능 필터(네이티브 GPU), 사진 라이브러리 연동 일괄 번역, 공유 익스텐션("사진 앱에서 바로 번역해 보내기").
`lib/color`는 순수 TS로 유지해 재사용 ([05_Architecture.md](05_Architecture.md) §8).

## 4. 리스크 보드

| 리스크 | 신호 | 완화 |
|---|---|---|
| **번역 품질이 감동을 못 줌** (최대 리스크) | M0 당사자 테스트 실패 | strength 튜닝, 유형별 파라미터 조정, 명도 보상 추가. M0에서 조기 검증하는 이유 |
| iOS 카메라 제약 | M3 실기기 실패 | Live를 P1로 강등, 정지 이미지 중심 런칭 |
| SEO 성과 지연 | 3개월 노출 미미 | 콘텐츠 볼륨 확대 + KO 커뮤니티/스토리 채널 강화 |
| 사이드 프로젝트 동력 저하 | 마일스톤 2회 연속 지연 | 범위 축소 (Live Camera, Mono, FAQ부터 컷) |

## 5. 런칭 후 2주 체크

- [ ] 선물 퍼널 전환율 (목표 20%) — 미달 시 Clarity로 이탈 지점 확인
- [ ] `translate_no_effect_shown` 비율 — 높으면 알고리즘/안내 개선
- [ ] FMV shared_link 진입 — 바이럴 루프 작동 여부
- [ ] Search Console 색인 상태 — Learn 페이지 전체 색인 확인
- [ ] 색약 당사자 피드백 수집 채널 (간단한 피드백 링크) 운영
