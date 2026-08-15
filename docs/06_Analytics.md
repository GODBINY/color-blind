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

## 2. 현재 이벤트 스키마

구현은 `src/lib/analytics.ts`의 `trackEvent(event, params)`로 통일한다. 모든 이벤트에는 `page_path`와 `locale`이 자동으로 붙고, 사진·파일명·픽셀 색상값·답안 내용은 절대 전송하지 않는다.

| 이벤트 | 시점 | 추가 파라미터 | 핵심 이벤트 권장 |
|---|---|---|---|
| `home_translation_cta_clicked` | 홈의 사진 번역 버튼을 누름 | - | - |
| `home_translation_photo_added` | 홈에서 유효한 사진을 선택·드롭하고 다음 화면으로 이동 | `entry_method` | - |
| `home_color_picker_opened` | 홈에서 이미지 색상 추출로 이동 | - | - |
| `home_simulation_opened` | 홈에서 시야 시뮬레이션으로 이동 | - | - |
| `photo_translation_started` | 번역 화면에서 유효한 사진을 읽음 | `entry_point` | - |
| `photo_translation_completed` | 새 사진 1장에 대한 첫 변환 완료 | `vision_type`, `translation_strength` | ✓ |
| `translated_image_saved` | 번역한 사진 저장 | `vision_type` | ✓ — 대표 전환 |
| `photo_simulation_started` | 시야 시뮬레이션에서 유효한 사진을 읽음 | `entry_point` | - |
| `photo_simulation_completed` | 새 사진 1장에 대한 첫 시야 시뮬레이션 완료 | `vision_type`, `simulation_strength` | - |
| `simulated_image_saved` | 시야 시뮬레이션 이미지 저장 | `vision_type` | - |
| `color_picker_started` | 색상 추출 도구에서 유효한 사진을 읽음 | - | - |
| `color_sample_added` | 이미지에서 색을 하나 고름 | - | - |
| `color_sample_exported` | 점과 색 목록을 이미지로 저장 | `sample_count` | ✓ |
| `find_my_view_started` | 참고 판 8장 확인 시작 | - | - |
| `find_my_view_completed` | 8장 모두 입력 | - | ✓ |
| `find_my_view_profile_saved` | 사진 비교에 쓸 시야를 저장 | `vision_type` | ✓ |
| `kofi_support_clicked` | Ko-fi 지원 링크 클릭 | `placement` | - |

`photo_translation_completed`는 강도나 시야를 바꿀 때마다 중복 집계하지 않고, 새 사진 1장당 한 번만 보낸다. 그래서 실제 퍼널 전환 수로 해석할 수 있다.

> GA4의 자동 `click`은 주로 외부 링크 클릭을 수집한다. 내부 CTA 사용량 판단에는 위의 맞춤 이벤트를 사용한다.

### GTM → GA4 연결

1. GTM에서 **Google 태그** 하나를 만들고 측정 ID `G-GQ068R40NN`을 넣는다. 트리거는 **Initialization – All Initialization Events**로 둔다.
2. **Google 애널리틱스: GA4 이벤트** 태그를 만든다. 이벤트 이름은 `{{Event}}`로 넣는다.
3. 새 **맞춤 이벤트** 트리거를 만들고 “정규 표현식 사용”을 켠 뒤 아래를 입력한다.

   ```text
   ^(home_translation_cta_clicked|home_translation_photo_added|home_color_picker_opened|home_simulation_opened|photo_translation_started|photo_translation_completed|translated_image_saved|photo_simulation_started|photo_simulation_completed|simulated_image_saved|color_picker_started|color_sample_added|color_sample_exported|find_my_view_started|find_my_view_completed|find_my_view_profile_saved|kofi_support_clicked)$
   ```

4. 태그의 **이벤트 매개변수**에도 아래 항목을 추가한다. 값은 같은 이름의 데이터 영역 변수(Data Layer Variable)를 새로 만들어 연결한다. `page_path`와 `locale`은 먼저 넣고, 나머지는 필요한 분석 축만 추가해도 된다.

   | 이벤트 매개변수 | 데이터 영역 변수 이름 |
   |---|---|
   | `page_path` | `page_path` |
   | `locale` | `locale` |
   | `entry_method` | `entry_method` |
   | `entry_point` | `entry_point` |
   | `vision_type` | `vision_type` |
   | `translation_strength` | `translation_strength` |
   | `simulation_strength` | `simulation_strength` |
   | `sample_count` | `sample_count` |
   | `placement` | `placement` |

   예: GTM 변수 이름은 `DLV – vision_type`, 데이터 영역 변수 이름은 `vision_type`; 이벤트 매개변수 값에는 `{{DLV – vision_type}}`를 선택한다. 값이 없는 이벤트에서는 해당 매개변수를 GA4가 비워 둔다.
5. 위 트리거를 GA4 이벤트 태그에 붙여 **제출 → 게시**한다. 미리보기에서 사진 한 장을 번역·저장한 뒤 Tag Assistant에 두 이벤트가 모두 뜨는지 확인한다.
6. GA4 관리자 → **데이터 표시 → 이벤트**에서 `translated_image_saved`, `photo_translation_completed`, `color_sample_exported`, `find_my_view_completed`, `find_my_view_profile_saved`를 **주요 이벤트로 표시**한다. 먼저 `translated_image_saved` 하나만 대표 전환으로 보는 편이 중복 해석을 피하기 쉽다.

## 3. 퍼널 정의 (GA4 탐색 보고서)

1. **사진 번역 퍼널 (North Star)**: `home_translation_cta_clicked` → `home_translation_photo_added` → `photo_translation_completed` → `translated_image_saved`
   - 대표 전환: `translated_image_saved`; 목표는 사진 추가 대비 저장 비율을 먼저 기준선으로 잡은 뒤 개선한다.
2. **색상 추출 퍼널**: `home_color_picker_opened` → `color_picker_started` → `color_sample_added` → `color_sample_exported`
3. **시야 설정 퍼널**: `find_my_view_started` → `find_my_view_completed` → `find_my_view_profile_saved`
4. **시야 시뮬레이션 퍼널**: `home_simulation_opened` → `photo_simulation_started` → `photo_simulation_completed` → `simulated_image_saved`

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
