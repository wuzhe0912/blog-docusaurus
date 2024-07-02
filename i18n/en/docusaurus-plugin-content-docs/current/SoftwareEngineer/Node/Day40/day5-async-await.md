---
id: day5-async-await
title: '📜 Day-5 Async/Await'
slug: /day5-async-await
---

## Requirements Specification

> 流程：批改作業 → 檢查獎勵 → 給予獎勵 → 退學或懲罰

```js
// 批改作業
function correctTest(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const score = Math.round(Math.random() * 100);
      if (score >= 60) {
        resolve({
          name,
          score,
        });
      } else {
        reject('您已達退學門檻');
      }
    }, 2000);
  });
}
// 檢查獎勵
function checkReward(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.score >= 90) {
        resolve(`${data.name} 獲得電影票`);
      } else if (data.score >= 60 && data.score < 90) {
        resolve(`${data.name} 獲得嘉獎`);
      } else {
        reject(`您沒有獎品`);
      }
    }, 2000);
  });
}
```

將原先的 Promise 語法改寫成 Async/Await

```js
correctTest('John Doe')
  .then((data) => checkReward(data))
  .then((reward) => console.log(reward))
  .catch((error) => console.log(error));
```

Example:

```js
const init = async function () {
  /* answer */
};
init();
```

## Refactor

```js
const init = async function () {
  try {
    const data = await correctTest('John Doe');
    const reward = await checkReward(data);
    console.log(reward);
  } catch (error) {
    console.log(error);
  }
};

init();
```
