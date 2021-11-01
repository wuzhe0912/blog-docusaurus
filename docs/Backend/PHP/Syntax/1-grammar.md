---
id: 1-grammar
description: PHP 基礎語法
slug: /grammar
---

# Grammar (基礎語法)

> 記錄 `PHP` 基礎語法。

## Hello PHP

先建立一個 `Demo` 資料夾，然後建立一個 `hello.php` 的檔案，並在檔案中輸入以下內容：

```php
<?php
  echo('Hello PHP!');
```

接著回到終端機，執行以下指令：

```php
php hello.php
```

這時候就會看到終端機印出 `Hello PHP!`。

## Variable & Data Type

四種資料型別：

```php
string   字串    'text'
interger 整數     15
float    浮點數   10.2
bolean   布林值   true or false
```

`php` 中，變數前方採用 `$` 符號宣告，句尾需添加 `;`：

```php
$people = 'pitt';
$number = 100;
$boolean = true;
$float = 12.7;
```

在我的理解中，`php` 的 `echo();` 近似於 `js` 的 `cosole.log();`，所以我如果想要知自己變數的值為多少，可以這樣寫：

```php
<?php
  $people = 'pitt';
  $number = 100;
  $boolean = true;
  $float = 12.7;
  echo($number);
```

執行指令 `php hello.php`，可以看到終端機印出 `100`。

## 轉型

透過轉型可以將上面的變數進行型別轉換：

```php
$people = (int) $people;      // 0
$number = (float) $number;    // 100.0
$boolean = (string) $boolean; // ''
$float = (integer) $float;    // 12
```

再配合 `var_dump` 可以印出資料的型別：

```php
<?php
  $number = (string) 100;
  var_dump($number);  // 印出 string 類型，以及有幾個字元，並印出結果'100'
```

此外，也能做四則運算：

```php
<?php
  $number1 = 12;
  $number2 = 4;
  $ans = $number1 + $number2;
  echo($ans."\r\n"); // 16
  $ans = $number1 - $number2;
  echo($ans."\r\n"); // 8
  $ans = $number1 * $number2;
  echo($ans."\r\n"); // 48
  $ans = $number1 / $number2;
  echo($ans."\r\n"); // 3
  $ans = $number1 % $number2;
  echo($ans."\r\n"); // 0
```

計算一組跳錶收費，並在 `echo()` 輸出時包含有變數和字串：

```php
<?php
  $initPrice = 80; // 起跳價格
  $perKilometerPrice = 16; // 每公里價格
  $kilometer = 12; // 跑了多少公里
  $calculatePrice = $perKilometerPrice * $kilometer;
  $finalPrice = $initPrice + $calculatePrice; // 最終價格
  echo("起跳價：{$initPrice}"."\r\n");
  echo("公里數：{$kilometer}"."\r\n");
  echo("最終收費：{$finalPrice}");
  // 起跳價：80
  // 公里數：12
  // 最終收費：272
```

## 條件判斷

```php
// if / else
<?php
  $number = 9;
  if ($number > 10) {
    echo('大於');
  } elseif ($number === 10) {
    echo('等於');
  } else {
    echo('小於');
  }
```

```php
// 增加判斷條件
<?php
  $number = 8;
  if ($number > 10 && $number > 12) {
    echo('大於');
  } elseif ($number === 10 || $number === 8) {
    echo('等於');
  } else {
    echo('小於');
  }
```

```php
// 四季判斷
<?php
  $month = 9;
  if ($month > 2 && $month <= 5) {
    echo('台灣春季');
  } elseif ($month > 5 && $month <= 10) {
    echo('台灣夏季');
  } elseif ($month === 11) {
    echo('台灣秋季');
  } else {
    echo('台灣冬季');
  }
```

## 迴圈

### while

印出數字 `0 ~ 8`：

```php
<?php
  $count = 0;
  while ($count < 10) {
    echo($count."\r\n");
    $count ++;
  }
```

### for

印出數字 `1 ~ 12`：

```php
<?php
  for ($count = 1; $count < 13; $count++) {
    echo($count."\r\n");
  }
```

將指定數字內，奇數加總總和：

```php
<?php
  $totalNumber = 0;
  for ($number = 1; $number < 151; $number ++) {
    if ($number % 2 !== 0) {
      $totalNumber = $totalNumber + $number;
    }
  }
  echo($totalNumber); // 5625
```

## 資料結構

### Array(陣列)

在 `php` 中，呈現陣列的格式寫法有下列兩種：

```php
<?php
  $list = ['player', 'wow', 'apple'];
  $numberList = array(1, 2, 3);
```

而當我想要印出陣列時，不再使用 `echo()`，而是改用 `print_r()`：

```php
<?php
  $list = ['player', 'wow', 'apple'];
  $numberList = array(1, 2, 3);
  print_r($list);
  print_r($numberList);
```

可以在終端機上看到印出的結果：

```bash
Array
(
    [0] => player
    [1] => wow
    [2] => apple
)
Array
(
    [0] => 1
    [1] => 2
    [2] => 3
)
```

字典陣列，我理解為類似帶有欄位屬性：

```php
<?php
  $player = [
    'name' => 'Pitt',
    'defence' => 100
  ];
  print_r($player);
```

在陣列操作上，和 `JS` 也是相當雷同：

```php
<?php
  $numberList = array(1, 2, 3);
  $player = [
    'name' => 'Pitt',
    'defence' => 100
  ];
  $numberList[0] = $player['defence'];
  print_r($numberList); // [0] => 100
  print_r($numberList[1] + $player['defence']); // 102
```

## 使用迴圈操作陣列

使用 `foreach` 跑迴圈：

```php
<?php
  $list = ['Ragnarok', 'Black Desert', 'League of Legends', 'Lineage'];
  foreach ($list as $index => $game) {
    echo("第{$index}個遊戲：{$game}"."\r\n");
  }
```

如果陣列改為字典式陣列，則寫法調整為對應欄位：

```php
<?php
  $list = [
    ['name' => 'Ragnarok'],
    ['name' => 'Black Desert'],
    ['name' => 'League of Legends'],
    ['name' => 'Lineage']
  ];
  foreach ($list as $index => $game) {
    echo("第{$index}個遊戲：{$game['name']}"."\r\n");
  }
```

### 實作

#### 實作 1

> 建立一組陣列，並在其中塞入五張獲利的股票，計算平均每張獲利，以及總獲利：

```php
<?php
  $stocks = [
    ['profit' => 5],
    ['profit' => 10],
    ['profit' => 20],
    ['profit' => 33],
    ['profit' => 17]
  ];
  $totalProfit = 0;
  foreach ($stocks as $index => $value) {
    $totalProfit = $totalProfit + $value['profit'];
  }
  echo($totalProfit); // 總獲利：85
  $stocksLength = count($stocks);
  $perProfit = $totalProfit / $stocksLength;
  echo($perProfit); // 平均每張獲利：17
```

#### 實作 2

> 建立一組陣列，裡面有五位操盤手，依據每個人績效 x10000，做為獎金發放，其中要有一個人無績效，並顯示對應文字，並使用 substr 清除字串最後一個字元：

```php
<?php
  $people = [
    [ 'name' => 'Alice', 'performance' => '120%' ],
    [ 'name' => 'Olive', 'performance' => '150%' ],
    [ 'name' => 'Mavis', 'performance' => '67%' ],
    [ 'name' => 'Lena', 'performance' => '250%' ],
    [ 'name' => 'Alyssa', 'performance' => null ]
  ];
  foreach ($people as $index => $value) {
    $text = substr($value['performance'], 0, -1);
    $bonus = (((float) $text) / 100) * 10000;
    if ($text) {
      echo("{$value['name']}獎金：{$bonus}元"."\r\n");
    } else {
      echo("{$value['name']}：沒有績效資料");
    }
  }
// Alice獎金：12000元
// Olive獎金：15000元
// Mavis獎金：6700元
// Lena獎金：25000元
// Alyssa：沒有績效資料
```

第二個情境，假設陣列結構調整為如下：

```php
<?php
  $girls = ['Alice', 'Olive', 'Mavis', 'Lena', 'Alyssa'];
  $report = [
    'Alice' => 1.2,
    'Olive' => 1.5,
    'Mavis' => 0.67,
    'Lena' => 2.5
  ];
```

那麼迴圈的寫法就需要調整如下，使用 `php` 的 `isset()` 過濾：

```php
<?php
  $girls = ['Alice', 'Olive', 'Mavis', 'Lena', 'Alyssa'];
  $report = [
    'Alice' => 1.2,
    'Olive' => 1.5,
    'Mavis' => 0.67,
    'Lena' => 2.5
  ];
  foreach ($girls as $index) {
    $bonus = $report[$index] * 10000;
    if (isset($report[$index])) {
      echo("{$index}獎金：{$bonus}元\r\n");
    } else {
      echo("{$index}：沒有績效資料。");
    }
  }
```

## About Closing Tag

When do I need to use closing tag.

If only php code, example `echo()`, you don't need to use closing tag.

```php
<?php
  echo('Hello PHP!');
```

But if you want to use `HTML` in php, must add closing tag.

```php
<?php
  <h2>Hello PHP!</h2>
?>
```
