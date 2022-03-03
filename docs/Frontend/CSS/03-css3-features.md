---
id: 03-css3-features
title: '📜 CSS3 Features'
slug: /css3-features
---

> [關聯 : TikTok Questions](../Interview/Jobs/00-tiktok.md/#css)

## 1. 新選擇器

| Select             | example             | description                                                                                        |
| ------------------ | ------------------- | -------------------------------------------------------------------------------------------------- |
| :first-of-type     | p:first-of-type     | 找到 p 標籤中的第一個並調整樣式                                                                    |
| :last-of-type      | p:last-of-type      | 找到 p 標籤中的最後一個並調整樣式                                                                  |
| :only-of-type      | main:only-of-type   | 尋找 main 標籤底下沒有相同類型的標籤                                                               |
| :only-child        | div:only-child      | 尋找所有 div 標籤中，若是子元素只有一個的則受其影響                                                |
| :nth-child(n)      | p:nth-child(2)      | 尋找所有 p 標籤中，擁有 2 個以上的子元素，其中第二個子元素受其影響                                 |
| :nth-last-child(n) | p:nth-last-child(n) | 同上，改由最後一個開始計算                                                                         |
| :nth-of-type       |                     |                                                                                                    |
| :nth-last-of-type  |                     |                                                                                                    |
| :last-child        | ul li:last-child    | [尋找 ul 標籤底下的最後一個 li 標籤](https://developer.mozilla.org/en-US/docs/Web/CSS/:last-child) |
| element1~element2  | p~span              | 尋找父元素為 p 標籤的所有 span 標籤                                                                |
| [attribute^=value] | a[src^="https"]     | 選擇 src 屬性中，以 "https" 開頭的每個 a 標籤                                                      |
| [attribute$=value] | a[src$=".text"]     | 選擇 src 屬性中，以 ".text" 結尾的每個 a 標籤                                                      |
| [attribute*=value] | a[src*="test"]      | 選擇 src 屬性中，包含 "test" string 的每個 a 標籤                                                  |

## 2. 新樣式

### border

```css
border-radius // 將元素轉為圓角邊框

box-shadow    // 元素增加陰影

border-image  // 改用圖片來繪製邊框
```

- [box-shadow demo](https://www.w3schools.com/cssref/playdemo.asp?filename=playcss_box-shadow)

### 背景

> background-clip、background-origin、background-size、background-break，個人常用 background-size 來縮放調整背景圖片大小。

### 文字

選擇是否採用瀏覽器默認的文字換行，或是依照單字換行等，[word-break](https://developer.mozilla.org/en-US/docs/Web/CSS/word-break)。

當文字過長時，也可以使用 ellipsis 來做省略符號，text-shadow 則是添加陰影，text-decoration 可以增加樣式渲染，包含填充顏色或是調整寬度。

### 顏色

允許使用兩種方式來渲染顏色，分別是 rgba 和 hsla。

- 在 rgba 中，rgb 為顏色值，a 為透明度。
- hsla 中，h 為色相，s 為飽和度，l 為亮度，a 為透明度。

## 3. transitions

替元素的樣式變化增加一個過渡效果，譬如 hover 時放大或平移等，默認要求兩種條件，一為效果，二是延遲時間。

```css
div {
  width: 100px;
  height: 100px;
  background: blue;
  transition: width 1s;
}

div:hover {
  width: 300px;
}
```

## 4. transform

允許旋轉，縮放或是平移傾斜元素。

```css
div {
  width: 150px;
  height: 80px;
  background-color: blue;
  transform: rotate(20deg);
}
```

## 5. animations

透過幀數(@keyframes)來替某些元素指定動畫效果，可以決定執行的時間，進度多少時如何變化等等。

```css
div {
  width: 100px;
  height: 100px;
  background-color: red;
  animation-name: animation;
  animation-duration: 4s;
}

@keyframes animation {
  0% {
    background-color: red;
  }
  25% {
    background-color: yellow;
  }
  50% {
    background-color: blue;
  }
  100% {
    background-color: green;
  }
}
```

## 6. gradient

在設計上，提供讓複數顏色可以平滑過渡的選擇，包含兩個屬性 linear-gradient, radial-gradient。

```css
background-image: linear-gradient(direction, color1, color2);

# or

linear-gradient(0deg, blue, green);
```

## Reference

- [面试官：CSS3 新增了哪些新特性？ #106](https://github.com/febobo/web-interview/issues/106)
