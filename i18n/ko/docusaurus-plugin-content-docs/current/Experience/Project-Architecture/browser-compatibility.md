---
id: project-architecture-browser-compatibility
title: '브라우저 호환성 처리'
slug: /experience/project-architecture/browser-compatibility
tags: [Experience, Interview, Project-Architecture]
---

> 크로스 브라우저 호환성 문제 처리, 특히 Safari 및 모바일 단말의 특수 처리.

---

## 브라우저 호환성

> 소형 뷰포트 단위 (Small Viewport Units): svh
> 대형 뷰포트 단위 (Large Viewport Units): lvh
> 동적 뷰포트 단위 (Dynamic Viewport Units): dvh

특정 시나리오에서는 새로운 구문 dvh를 사용하여 Safari의 설계 결함으로 인한 플로팅 바 문제를 해결할 수 있습니다. 비주류 또는 구형 브라우저와의 호환성이 필요한 경우, JS를 사용하여 높이를 감지합니다.

## iOS Safari 자동 텍스트 크기 조정 방지

```css
-webkit-text-size-adjust: none;
text-size-adjust: none;
```

## 벤더 프리픽스

수동 설정과 Autoprefixer 자동 설정을 결합하여 벤더 프리픽스를 처리합니다.
