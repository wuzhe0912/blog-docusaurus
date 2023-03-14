---
id: day2-then-catch
title: '📜 Day-2 then(), catch()'
slug: /day2-then-catch
---

## Requirements Specification

```bash
請嘗試使用 Promise 的鏈式寫法 .then() .catch() 建立函式
```

```js
// check score
function correctTest(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const score = Math.round(Math.random() * 100);
      if (score >= 20) {
        resolve({
          name,
          score,
        });
      } else {
        reject(`${name}: 分數過低，即將被毒打一頓後驅逐出校。`);
      }
    }, 2000);
  });
}

// 檢查獎勵
function checkReward(data) {
  return new Promise((resolve, reject) => {
    console.log(`${data.name}的分數通過基本門檻，開始評估獎品...`);
    setTimeout(() => {
      if (data.score >= 90) {
        resolve(`${data.name} 允許放風三天`);
      } else if (data.score >= 60 && data.score < 90) {
        resolve(`${data.name}: 獲得強制進修 ${data.score} 天`);
      } else {
        reject(
          `${data.name}: 僅${data.score}分，獲得強制進修 ${data.score * 2} 天`
        );
      }
    }, 1500);
  });
}

correctTest('西門慶')
  .then((data) => checkReward(data))
  .then((result) => console.log(result))
  .catch((error) => console.log(error));

correctTest('武大郎')
  .then((data) => checkReward(data))
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
```
