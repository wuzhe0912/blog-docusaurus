---
id: php-function-object
title: Function & Object
slug: /php-function-object
---

## Function

其實和 `js` 差異不大，建立一個 `function`，並在當中聲明一些變數，回傳執行結果，並印出來：

```php
<?php
  function getHeight()
  {
    $myHeight = 183;
    $shoes = 5;
    return $myHeight + $shoes;
  }
  echo(getHeight());
```

改寫為傳入參數：

```php
<?php
  function getHeight($shoes)
  {
    $myHeight = 183;
    return $myHeight + $shoes;
  }
  echo(getHeight(8));
```

## Object (物件)

使用 `class` 建立共用的物件，慣例採用大寫開頭，這邊 `$this` 會指向到整個 `class` 本身：

```php
<?php
  class People
  {
    public $height = 180;
    public function getHeight()
    {
      return $this -> height;
    }
    public function wear($shoes)
    {
      $this -> height += $shoes;
      return $this -> height;
    }
  }
  $people = new People;
  echo("{$people -> getHeight()}\r\n");
  echo("{$people -> wear(20)}\r\n");
  echo("{$people -> getHeight()}\r\n");
```

因為 `$height` 這個物件已經被 `function` 所改變，所以在第三次 `echo()` 印出來時會是 `200`。

## 繼承

當我建立好父物件的條件下，我可以透過搭建其他子物件來調用上層物件的方法：

```php
<?php
  class People
  {
    public $height = 180;
    public function getHeight()
    {
      return $this -> height;
    }
    public function wear($shoes)
    {
      $this -> height += $shoes;
      return $this -> height;
    }
  }
  $people = new People;
  echo("{$people -> getHeight()}\r\n");
  echo("{$people -> wear(20)}\r\n");
  echo("{$people -> getHeight()}\r\n");

  class Pitt extends People
  {
    public $height = 183;
  }
  $pitt = new Pitt;
  echo("{$pitt -> getHeight()}\r\n");
  echo("{$pitt -> wear(5)}\r\n");
```

因此在物件導向的邏輯下，同樣的事情在同樣的區塊進行處理，可以有效減少程式碼。

## 實作練習

建立一個 `class Pokemon{}` 並且調用它，需各執行一次攻擊和治癒的動作，攻擊時需減少血量，治癒時則恢復一定血量，最終印出當前血量：

```php
<?php
  class Pokemon
  {
    public $hp = 100;
    public $attack = 30;
    public function attacked($value)
    {
      return $this -> hp -= $value;
    }
    public function eveolve()
    {
      $this -> hp *= 2;
      $this -> attack *= 2;
    }
    public function getHp()
    {
      return $this -> hp;
    }
  }
  $pikachu = new Pokemon;
  $pikachu -> attacked(17);
  $pikachu -> eveolve();
  echo("{$pikachu -> getHp()}");
```
