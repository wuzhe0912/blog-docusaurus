---
id: php-array-operating
title: Array Operating
slug: /php-array-operating
---

## array_column

我的理解是，類似於 `js` 中的解構方式，將字典陣列中對應的屬性欄位抽出來，重新組成陣列：

```php
<?php
  $list = [
    ['id' => 1, 'name' => 'Calista'],
    ['id' => 2, 'name' => 'Daphne'],
    ['id' => 3, 'name' => 'Eileen'],
    ['id' => 4, 'name' => 'Fanny'],
    ['id' => 5, 'name' => 'Iris']
  ];
  $nameList = array_column($list, 'name');
  print_r($nameList);
```

印出結果如下：

```php
Array
(
    [0] => Calista
    [1] => Daphne
    [2] => Eileen
    [3] => Fanny
    [4] => Iris
)
```

## array_keys

可以找出指定資料中所有欄位，譬如我查找陣列中的第一筆資料，會回傳給第一筆資料中的屬性欄位：

```php
<?php
  $list = [
    ['id' => 1, 'name' => 'Calista'],
    ['id' => 2, 'name' => 'Daphne'],
    ['id' => 3, 'name' => 'Eileen'],
    ['id' => 4, 'name' => 'Fanny'],
    ['id' => 5, 'name' => 'Iris']
  ];
  print_r(array_keys($list[0]));
```

印出結果：

```php
Array
(
  [0] => id
  [1] => name
)
```

## array_values

和 `key` 相反，`value` 自然是取欄位的內容：

```php
<?php
  $list = [
    ['id' => 1, 'name' => 'Calista'],
    ['id' => 2, 'name' => 'Daphne'],
    ['id' => 3, 'name' => 'Eileen'],
    ['id' => 4, 'name' => 'Fanny'],
    ['id' => 5, 'name' => 'Iris']
  ];
  print_r(array_values($list[2]));
```

印出結果：

```php
Array
(
    [0] => 3
    [1] => Eileen
)
```

## array_map

和 `js` 的 `map()` 方法相同，針對陣列跑迴圈，可以在 `function` 中對某些欄位進行處理後，回傳重組新的陣列：

```php
<?php
  $list = [
    ['id' => 1, 'name' => 'Calista'],
    ['id' => 2, 'name' => 'Daphne'],
    ['id' => 3, 'name' => 'Eileen'],
    ['id' => 4, 'name' => 'Fanny'],
    ['id' => 5, 'name' => 'Iris']
  ];
  $newList = array_map(function ($value) {
    $value['id'] *= 2;
    return $value;
  }, $list);
  print_r($newList);
```

印出結果：

```php
Array
(
    [0] => Array
        (
            [id] => 2
            [name] => Calista
        )
    [1] => Array
        (
            [id] => 4
            [name] => Daphne
        )
    [2] => Array
        (
            [id] => 6
            [name] => Eileen
        )
    [3] => Array
        (
            [id] => 8
            [name] => Fanny
        )
    [4] => Array
        (
            [id] => 10
            [name] => Iris
        )
)
```

## array_filter

既然有 `map()` 自然也有 `filter()`，過濾條件回傳需要的內容：

```php
<?php
  $list = [
    ['id' => 1, 'name' => 'Calista'],
    ['id' => 2, 'name' => 'Daphne'],
    ['id' => 3, 'name' => 'Eileen'],
    ['id' => 4, 'name' => 'Fanny'],
    ['id' => 5, 'name' => 'Iris']
  ];
  $newList = array_filter($list, function ($value) {
    return $value['id'] > 3;
  });
  print_r($newList);
```

印出結果：

```php
Array
(
    [3] => Array
        (
            [id] => 4
            [name] => Fanny
        )
    [4] => Array
        (
            [id] => 5
            [name] => Iris
        )
)
```

### 比較兩者差異

`array_map()` 和 `array_filter` 相同處在於，兩者都會回傳新的陣列，但是書寫格式上，`array_map()` 中函式在前，陣列的變數則在後，`array_filter` 則相反，陣列變數在前。

## array_push

新增資料到陣列中的最後一筆：

```php
<?php
  $nums = [1, 2, 3, 4];
  array_push($nums, 7);
  print_r($nums);
```

## array_pop

清除陣列中最後一筆資料：

```php
<?php
  $nums = [1, 2, 3, 4];
  array_pop($nums);
  print_r($nums);
```

## array_merge

合併兩組陣列，若有重複屬性的欄位，則新陣列的資料覆蓋舊陣列：

```php
<?php
  $nums = [
    'id' => 1,
    'name' => 'Koa'
  ];
  $nums = array_merge($nums, [
    'name' => 'Yumi',
    'age' => 24
  ]);
  print_r($nums);
```

## sort

針對陣列進行排序：

```php
<?php
  $nums = [2, 1, 34, 11, 23, 90, 5];
  sort($nums);
  print_r($nums);
```

## asort

針對 `value` 進行排序，主要用於字典陣列，依照英文字母順序：

```php
<?php
  $nums = [
    'b' => 'Miranda',
    'd' => 'Wendy',
    'c' => 'Apple',
    'a' => 'Novia'
  ];
  asort($nums);
  print_r($nums);
```

## ksort

和前者相同，只是改為採用 `key` 值排序：

```php
<?php
  $nums = [
    'b' => 'Miranda',
    'd' => 'Wendy',
    'c' => 'Apple',
    'a' => 'Novia'
  ];
  ksort($nums);
  print_r($nums);
```

## array_search

找出資料在陣列中的索引位置：

```php
<?php
  $nums = ['Miranda', 'Wendy', 'Apple', 'Novia', 'Apple', 'Miranda'];
  echo(array_search('Apple', $nums));
```

## array_unique

過濾陣列中重複的值：

```php
<?php
  $nums = ['Miranda', 'Wendy', 'Apple', 'Novia', 'Apple', 'Miranda'];
  print_r(array_unique($nums));
```

## array_sum

若陣列中皆為數字，計算加總：

```php
<?php
  $nums = [7, 6, 12, 55, 31];
  echo(array_sum($nums));
```

## count

取得陣列長度：

```php
<?php
  $nums = ['Miranda', 'Wendy', 'Apple', 'Novia', 'Apple', 'Miranda'];
  echo(count($nums));
```
