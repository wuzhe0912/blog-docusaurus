---
id: day3-mongodb-add-find
title: '📜 Day-3 MongoDB(add, find)'
slug: /day3-mongodb-add-find
---

```bash
# 1. create database

use school
```

```bash
# 2. create collection

db.createCollection("students")
```

```bash
# 3. insert document to students collection

db.students.insert({
  "studentName": "Riley Parker",
  "group": "A",
  "score": 83,
  "isPaid": false
})
```

```bash
# 4. insert multiple documents to students collection

db.students.insertMany([
  {
    "studentName": "Brennan Miles",
    "group": "C",
    "score": 72,
    "isPaid": false
  },
  {
    "studentName": "Mia Diaz",
    "group": "B",
    "score": 98,
    "isPaid": true
  },
  {
    "studentName": "Caroline morris",
    "group": "B",
    "score": 55,
    "isPaid": false
  },
  {
    "studentName": "Beverly Stewart",
    "group": "B",
    "score": 60,
    "isPaid": false
  }
])
```

```bash
# 5. find students collection all data

db.students.find()
```

```bash
# 6. find students collection match group = "B"

db.students.find({
  "group": "B"
})
```

```bash
# 7. find students collection score > 60

db.students.find({
  "score": {
    "$gt": 60
  }
})
```

```bash
# 8. find students collection score < 60 || group = "B"

db.students.find({
  "$or": [
    {
      "score": {
        "$lt": 60
      }
    },
    {
      "group": "B"
    }
  ]
})
```
