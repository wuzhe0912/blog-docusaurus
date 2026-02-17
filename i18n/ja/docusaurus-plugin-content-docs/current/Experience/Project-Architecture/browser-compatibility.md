---
id: project-architecture-browser-compatibility
title: 'ブラウザ互換性の対応'
slug: /experience/project-architecture/browser-compatibility
tags: [Experience, Interview, Project-Architecture]
---

> クロスブラウザの互換性問題への対応、特に Safari とモバイル端末の特殊な処理。

---

## ブラウザ互換性

> 小型ビューポート単位 (Small Viewport Units)：svh
> 大型ビューポート単位 (Large Viewport Units)：lvh
> 動的ビューポート単位 (Dynamic Viewport Units)：dvh

特定のシナリオでは、新しい構文 dvh を使用して、Safari の設計が不十分なフローティングバーの問題を解決することが許可されています。マイナーまたは古いブラウザとの互換性が必要な場合は、JS を使用して高さを検出します。

## iOS Safari の自動テキストサイズ調整を防止する

```css
-webkit-text-size-adjust: none;
text-size-adjust: none;
```

## ベンダープレフィックス

手動設定と Autoprefixer の自動設定を組み合わせてベンダープレフィックスを処理します。
