---
id: 2023-experience
title: 📄 2023 Experience
slug: /2023-experience
---

## What is the most challenging technical problem you have solved ?

> 당신이 해결한 가장 어려운 기술적 문제는 무엇인가요?

### Webauthn

최근 처리한 것 중 비교적 새롭고 관련 경험이 적었던 기술적 문제는 Webauthn 로그인 구현이었습니다. 요구사항 측에서는 사용자가 웹사이트에 로그인할 때 앱과 동일한 Face ID / Touch ID 메커니즘을 트리거할 수 있도록 하여 더 매끄럽고 원활한 사용자 경험을 제공하고자 했습니다.

구현 전 참고 자료:

- https://webauthn.io/
- https://medium.com/@herrjemand/introduction-to-webauthn-api-5fd1fb46c285

초기 실현 가능성 확인 후, PM 측과 첫 로그인 시 생체 인증 트리거 여부 및 판정 메커니즘 등을 포함한 전체 로그인 및 등록 흐름을 확인했습니다. 구현 과정에서 가장 큰 난제는 참고할 수 있는 자료가 아직 너무 적어 많은 파라미터의 의미가 명확하지 않았기 때문에 다양한 입력 파라미터를 끊임없이 미세 조정해야 했다는 것입니다. 기기 측면에서 iOS 폰은 비교적 처리하기 쉬웠지만, Android 폰에서는 Touch ID가 트리거되기 어려운 문제가 발생하여 백엔드의 협조를 받아 일부 파라미터를 호환성을 위해 수정해야 했습니다. 최종적으로 기능 완성 후, 이전에 도입했던 PWA와 결합하여 전체 웹사이트가 앱에 더 가까운 사용 경험을 제공할 수 있게 되었습니다.
