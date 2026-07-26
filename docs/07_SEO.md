# 07. SEO — 검색 전략

> v1.0 — 2026-07-08
> SEO는 이 프로젝트의 핵심 획득 채널이다 (광고 없음, 백엔드 없음 → 검색 + 공유 루프가 전부).

---

## 1. 전략 요약

1. **기능 페이지 = 검색 랜딩** — 도구형 쿼리("colorblind simulator")는 기능 페이지가 직접 랭크
2. **Learn = 정보형 쿼리 자산** — "적록색약이 보는 세상" 같은 쿼리를 Learn이 받아 기능으로 연결
3. **EN 우선, KO 동시** — 검색량은 EN이 압도적, 감성 스토리는 KO 커뮤니티에서 강함
4. 공유된 이미지/링크가 다시 검색을 만든다 (브랜드 쿼리) — OG가 첫인상

## 2. 키워드 맵 (페이지별 타깃)

### EN
| 페이지 | Primary | Secondary |
|---|---|---|
| `/translate` | colorblind friendly photo converter | daltonization tool online, colorblind color correction filter |
| `/simulate` | **color blindness simulator** (볼륨 최대) | colorblind vision simulator, see like colorblind, colorblind photo filter |
| `/live` | colorblind camera filter | live color identifier, what color is this |
| `/find-my-view` | am i colorblind quick check | colorblind type quiz (※ "color blind test"는 Ishihara 계열이 장악 — 정면승부 대신 quiz/check 롱테일) |
| `/learn/protanopia` | protanopia | protan color blindness, what does protanopia look like |
| `/learn/deuteranopia` | deuteranopia (유형 중 검색량 1위) | deutan vision, red green color blindness examples |
| `/learn/tritanopia` | tritanopia | blue yellow color blindness |
| Home | 브랜드명 + share photos with colorblind | how to show colors to colorblind person |

### KO
| 페이지 | Primary | Secondary |
|---|---|---|
| `/translate` | 색약 보정 필터 | 색약 사진 변환, 색맹 보정 |
| `/simulate` | **색약 시뮬레이터** | 색약이 보는 세상, 색맹 시야 |
| `/find-my-view` | 색약 테스트 간단 | 색약 유형 확인 |
| `/learn/*` | 적록색약 / 청황색약 / 색약 종류 | 색약 남자친구, 색약인 사람이 보는 색 |
| Home | 브랜드명 | 색약인 애인에게 꽃 보여주기 (스토리형 롱테일 — 블로그 글감) |

## 3. 페이지별 메타 템플릿

```
/translate (EN)
  title: Colorblind-Friendly Photo Converter — Show Them the Beauty | NUNBIT
  desc:  Convert your photo into colors your colorblind friend or partner
         can actually distinguish. Free, in your browser — photos never
         leave your device.

/simulate (EN)
  title: Color Blindness Simulator — See Through Their Eyes | NUNBIT
  desc:  Upload a photo and see it as someone with protanopia, deuteranopia,
         or tritanopia does. Compare side by side, free and private.

/learn/deuteranopia (KO)
  title: 적녹색약(Deutan)이 보는 세상 — 사진으로 비교해보기 | NUNBIT
  desc:  같은 사진이 어떻게 다르게 보일까요? 원본, 색약 시야, 번역된 사진을
         비교하고, 곁에 있는 사람이 할 수 있는 것들을 알아보세요.
```

규칙: title ≤ 60자, desc 140–160자, 페이지당 primary 키워드 1개, H1과 title 일치, 감성 카피는 desc 후반부에.

## 4. 기술 SEO 체크리스트

- [x] Learn/Home 완전 SSG, 에디터 페이지도 셸은 정적 HTML (크롤러가 콘텐츠를 봄)
- [x] 9개 언어별 `hreflang` 상호 링크 + `x-default` = en (next-intl + metadata API)
- [x] `sitemap.xml` / `robots.txt` 빌드 타임 생성 — 개발용 `/[locale]/dev/` 경로는 제외
- [x] Canonical: locale별 self-canonical
- [x] 9개 언어별 Home / 사진 변환 / 시야 시뮬레이션 / 이미지 색상 추출 / Live Camera / 시야 설정 / Learn / FAQ의 title·description
- [x] Structured Data: `WebApplication` (Home) — 무료, 브라우저 기반 도구임을 명시
- [ ] `FAQPage` (`/learn/faq`) — 화면에 보이는 다국어 FAQ 본문을 먼저 정비한 뒤 마크업을 확장
- [ ] `Article` (Learn 각 페이지, 블로그)
- [ ] Core Web Vitals: LCP < 2.5s — Hero 이미지 `priority` + AVIF/WebP, 폰트 self-host `font-display: swap`
- [ ] 내부 링크: Learn → 기능 페이지 CTA, 기능 → Learn 링크 (§1 전략의 실체)
- [ ] 이미지 alt: 비교 이미지에 유형 명시 ("red rose as seen with deuteranopia")

### 배포 전 필수 환경 변수

`NEXT_PUBLIC_SITE_URL`에 실제 공개 도메인을 넣는다. 예: `https://nunbit.example`. 이 값으로 canonical, hreflang, sitemap, robots의 절대 URL을 생성한다. 로컬 개발 환경에서는 `http://localhost:3000`을 사용한다.

### AEO / GEO 원칙

- 별도의 "GEO 메타태그"는 없다. AI 답변 엔진이 인용하기 쉬운 명확한 질문·답변, 사람에게도 보이는 근거, 일관된 구조화 데이터를 우선한다.
- `WebApplication`은 실제 기능(사진 변환, 시야 시뮬레이션, HEX·RGB 추출)만 적는다. 색각을 되돌리거나 의료적 판정을 한다고 주장하지 않는다.
- FAQ 구조화 데이터는 화면에 공개된 답변과 정확히 같은 내용일 때만 사용한다. 검색 결과 노출은 보장되지 않는다.

## 5. OG 이미지 정책

| 대상 | 정책 |
|---|---|
| 정적 페이지 (Home, Learn, 기능 페이지) | 페이지별 정적 OG (1200×630). 디자인: 좌우 분할 비교 이미지(그 사람의 시야 ↔ 번역 후) + 한 줄 카피 + 로고. `public/og/`에 빌드 포함 |
| 언어 | EN/KO 별도 OG (locale별 metadata) |
| 사용자 결과물 공유 | MVP: 사용자가 다운로드한 이미지 자체가 공유물 (OG 아님). 이미지 하단에 미세한 브랜드 워터마크 — 유입 경로 역할 |
| 동적 OG (결과 링크 미리보기) | v2에서 공유 URL 도입 시 `@vercel/og`로 유형별 동적 생성 ([09_Roadmap.md](09_Roadmap.md)) |

원칙: OG에 텍스트 과다 금지, "비교"가 한눈에 보이는 비주얼이 클릭을 만든다.

## 6. 콘텐츠 로드맵 (블로그 / Learn 확장)

런칭 후 월 2편 목표. 스토리형(KO 감성) + 정보형(EN 볼륨) 병행:

1. "색약인 남자친구에게 장미를 보여주고 싶었다" — 창업 스토리 (KO, 커뮤니티 공유용)
2. What does deuteranopia look like? 10 everyday photos compared (EN)
3. 디자이너를 위한 색약 접근성 체크리스트 (EN/KO — 디자이너 유입)
4. How daltonization works — the math of translating color (EN, 기술 신뢰도)
5. 색약 유형별 선물하기 좋은 색 가이드 (KO, 시즌성)

## 7. 측정

- Search Console: 쿼리별 노출/CTR/순위 — 월 1회 리뷰 ([06_Analytics.md](06_Analytics.md) Page 4)
- 목표: 3개월 내 "color blindness simulator" 20위권, 6개월 내 10위권; Learn 페이지 오가닉 주 500세션
- CTR이 낮은 페이지는 title/desc A/B 재작성
