# 06. Analytics — 측정 설계

> v1.0 — 2026-07-08
> 초기에는 백엔드 없이 운영. 모든 측정은 클라이언트 태그 기반.

---

## 1. 도구 스택

| 도구 | 용도 |
|---|---|
| **Google Tag Manager** | 태그 관리 단일 창구. 코드에서는 `dataLayer.push`만 |
| **GA4** | 이벤트, 퍼널, 리텐션 |
| **Microsoft Clarity** | 세션 리플레이, 히트맵 — Compare Slider/미리보기 토글 사용 행태 관찰 |
| **Google Search Console** | 오가닉 키워드, 색인 상태 ([07_SEO.md](07_SEO.md)) |
| Vercel Analytics | Web Vitals 보조 |

**원칙**: 이벤트 파라미터에 이미지 내용, 파일명, 픽셀 색상값 등 사용자 콘텐츠를 절대 담지 않는다. 담는 것은 행위와 설정값뿐.

## 2. 이벤트 스키마

구현은 `lib/analytics.ts` 헬퍼로 통일: `track(event, params)`.

### 공통 파라미터 (모든 이벤트)
`locale` (en|ko), `vision_type_setting` (protan|deutan|tritan|none), `page`

### Translate (핵심 퍼널)
| 이벤트 | 파라미터 | 시점 |
|---|---|---|
| `image_upload` | `source` (file|drag|paste|camera), `feature` (translate|simulate) | 디코드 성공 시 |
| `translate_applied` | `target_type`, `strength` | 번역 렌더 완료 |
| `preview_their_eyes` | `target_type` | "그 사람의 눈" 미리보기 토글 |
| `compare_slider_used` | `feature` | 첫 드래그 시 1회/세션 |
| `download` | `feature`, `target_type`, `format` | |
| `share` | `feature`, `method` (webshare|copy) | |
| `translate_no_effect_shown` | - | "이미 잘 보여요" 안내 노출 |

### Simulate
| 이벤트 | 파라미터 |
|---|---|
| `simulation_selected` | `type`, `severity` |
| `simulate_to_translate_cta` | - (Simulate→Translate 전환 CTA 클릭) |

### Live Camera
| 이벤트 | 파라미터 |
|---|---|
| `live_camera_start` / `live_camera_denied` | - |
| `live_filter_selected` | `mode` (off|translate|simulate), `type` |
| `color_pick` | - (freeze 시. 색상값은 담지 않음) |

### Find My View
| 이벤트 | 파라미터 |
|---|---|
| `fmv_start` | `entry` (direct|shared_link|translate_cta) |
| `fmv_question_answered` | `index`, `axis` |
| `fmv_complete` | `result_type`, `confidence` |
| `fmv_abandon` | `last_index` (beforeunload/이탈) |
| `fmv_saved_as_default` | `result_type` |
| `fmv_share_link_copied` | - (보내는 사람이 상대에게 링크 공유) |

### 온보딩/기타
`onboarding_start`, `onboarding_complete`, `language_change`, `learn_page_view` (`type`), `exception` (`message` — 콘텐츠 미포함)

## 3. 퍼널 정의 (GA4 탐색 보고서)

1. **선물 퍼널 (North Star)**: `image_upload(translate)` → `translate_applied` → `preview_their_eyes` → `download|share`
   - 목표: 업로드→공유 20%+
2. **당사자 퍼널**: `fmv_start` → `fmv_complete` → `fmv_saved_as_default` → 이후 세션 `translate_applied|live_filter_selected(translate)`
3. **이해 퍼널**: `simulation_selected` → `simulate_to_translate_cta` → `translate_applied`
4. **공유 루프**: `fmv_share_link_copied` → (상대 기기) `fmv_start(entry=shared_link)` — 바이럴 계수 추정

## 4. Dashboard 설계 (Looker Studio, GA4 연결)

### Page 1 — Overview
- 주간 세션/사용자, 신규 vs 재방문, 국가/언어 분포
- North Star: **주간 "전달된 선물" 수** (= translate 이후 download+share)
- Web Vitals 요약 (LCP/INP)

### Page 2 — 선물 퍼널
- 퍼널 단계별 전환율 (기간 비교)
- `target_type` 분포 (Deutan이 다수일 것 — 콘텐츠 우선순위 근거)
- strength 분포 히스토그램 (기본 80%가 적절한지 검증)
- `translate_no_effect_shown` 비율 (알고리즘 튜닝 신호)

### Page 3 — Find My View
- 시작/완료/이탈 (문항 index별 이탈 — 어려운 문항 발견)
- 결과 유형 분포, `confidence=unclear` 비율 (판정 로직 품질 신호)
- shared_link 진입 비율

### Page 4 — 획득 (SEO)
- Search Console 연결: 쿼리별 노출/클릭/순위
- 랜딩 페이지별 오가닉 세션 (Learn 페이지 기여도)
- 유입 채널: organic / social / direct / referral

### Clarity 활용 체크리스트
- Compare Slider를 발견하지 못하는 사용자 비율 (rage click / dead click)
- 모바일 업로드 실패 지점
- Find My View 문항 화면 체류 시간

## 5. 리포팅 주기

| 주기 | 액션 |
|---|---|
| 주 1회 | 대시보드 Page 1–2 확인, 퍼널 이상치 체크 |
| 월 1회 | SEO 페이지 (Page 4) + 콘텐츠 백로그 갱신 ([07_SEO.md](07_SEO.md)) |
| 릴리즈 후 48h | 해당 기능 이벤트 유입 확인 (계측 누락 검증) |

## 6. 동의 & 프라이버시

- GTM Consent Mode v2 설정, EU 트래픽에 배너 노출 (MVP: 간단한 CMP)
- Clarity 마스킹: 입력 필드 기본 마스킹, 캔버스 영역 마스킹 확인 (이미지 리플레이 노출 방지 — 필수 검증 항목)
- 개인정보처리방침에 도구 목록 명시
