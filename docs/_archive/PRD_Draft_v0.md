# PRD Draft - Color Vision Experience Web

> Working Draft (MVP)

## 1. Project Overview

### Why

프로젝트는 색약인 사용자가 세상을 더 잘 보기 위한 도구에서 시작하지
않았다.

오히려 **색약이 아닌 사람이 색약인 가족, 친구, 연인이 보는 세상을
이해하고 싶다**는 경험에서 시작되었다.

직접 색약인 남자친구에게 꽃 사진을 보여주고 싶었지만, 기존 서비스들은
대부분 오래된 UI와 불편한 UX를 가지고 있었고, 웹에서 쉽게 사용할 수 있는
서비스도 거의 없었다.

이 프로젝트는 '공감(Empathy)'을 가장 중요한 가치로 둔다.

------------------------------------------------------------------------

## Vision

> See the world through someone else's eyes.

한국어

> 누군가의 눈으로 세상을 바라보는 가장 쉬운 방법.

------------------------------------------------------------------------

## Target Users

### Primary

-   색약인 가족/연인/친구가 있는 사람
-   자신의 사진을 색약 시야로 보고 싶은 사람
-   디자이너
-   연구자

### Secondary

-   색약 사용자
-   접근성에 관심 있는 사람

------------------------------------------------------------------------

# 2. Product Philosophy

## Core Values

-   Empathy
-   Understanding
-   Connection
-   Simplicity
-   Beautiful Experience

## We are NOT

-   의료 서비스
-   장애 진단 서비스
-   병원 느낌의 접근성 도구

## We ARE

-   서로의 시각을 이해하는 서비스

------------------------------------------------------------------------

# 3. Branding

## Tone

-   Warm
-   Calm
-   Minimal
-   Honest

## Keywords

-   Eyes
-   World
-   Together
-   Perspective
-   Share

## Color Direction

Background - #F8F6F2

Primary - #243447

Accent - #E6B17E

Neutral - Soft Gray

------------------------------------------------------------------------

# 4. Domain Strategy

메인 프로젝트는

    emotion-name.withint.com

예)

    eyes.withint.com

모든 기능은 Route 기반

    /
     /simulator
     /live
     /find-my-view
     /learn

------------------------------------------------------------------------

# 5. Information Architecture

    Home
    │
    ├── Simulator
    │
    ├── Live Camera
    │
    ├── Find My View
    │
    └── Learn

Learn

    /learn/protanopia
    /learn/deuteranopia
    /learn/tritanopia
    /blog

------------------------------------------------------------------------

# 6. User Flow

## First Visit

사진 업로드

↓

색약 유형 선택

↓

"내 유형을 잘 모르겠어요"

↓

Find My View

↓

추정 결과 저장

↓

Simulator 자동 적용

↓

다운로드 / 공유

------------------------------------------------------------------------

# 7. Screen Definition

## Home

-   Hero
-   Upload Image
-   Live Camera
-   Find My View
-   Learn

------------------------------------------------------------------------

## Simulator

기능

-   Upload
-   Drag & Drop
-   Compare Slider
-   Simulation Type
-   Download
-   Share

------------------------------------------------------------------------

## Live Camera

기능

-   실시간 카메라
-   중앙 Color Picker
-   HEX
-   RGB
-   Color Name

------------------------------------------------------------------------

## Find My View

목적

의료 진단이 아닌

서비스 기본 설정을 위한

Quick Check

결과

    Most likely

    Deutan

    (Not a medical diagnosis)

↓

기본값 저장

------------------------------------------------------------------------

## Learn

설명

-   Protan
-   Deutan
-   Tritan

FAQ

------------------------------------------------------------------------

# 8. UX Principles

1.  

One Upload

사진 한 장이면 시작

2.  

Comparison First

항상 비교 중심

3.  

Emotion before Technology

기술보다 경험

4.  

No Learning

설명 없이 사용 가능

------------------------------------------------------------------------

# 9. Technical Plan

Framework

-   Next.js
-   TypeScript
-   Tailwind

Image

-   Canvas API

Camera

-   getUserMedia

Deploy

-   Vercel

Localization

-   next-intl

Storage

-   LocalStorage

------------------------------------------------------------------------

## Local Storage

    visionType
    severity
    language
    completedOnboarding

------------------------------------------------------------------------

# 10. Analytics

초기에는 백엔드 없이 운영

Tracking

-   Google Tag Manager
-   GA4
-   Microsoft Clarity
-   Google Search Console

Events

-   image_upload
-   simulation_selected
-   compare_slider
-   download
-   share
-   live_camera
-   color_pick
-   onboarding_start
-   onboarding_complete

------------------------------------------------------------------------

# 11. MVP Scope

-   Image Simulator
-   Compare Slider
-   Live Camera Color Picker
-   Find My View
-   Local Storage
-   Responsive Web
-   English / Korean

------------------------------------------------------------------------

# 12. Future

-   PWA
-   Native App
-   AI Scene Explanation
-   GIF Export
-   More Languages

------------------------------------------------------------------------

# Notes

Color Blind Pal에서 느낀 개선점

-   오래된 UI
-   기능 중심 UX
-   웹 사용성 부족
-   감성적인 경험 부족
-   결과 공유 경험 부족

우리의 차별점

-   공감 중심
-   현대적인 UX
-   웹 우선
-   검색(SEO) 중심
-   사진 기반 경험
-   이후 앱으로 자연스럽게 확장
