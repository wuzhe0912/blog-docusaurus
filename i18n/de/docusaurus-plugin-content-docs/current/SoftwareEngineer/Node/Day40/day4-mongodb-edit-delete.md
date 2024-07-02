---
id: day4-mongodb-edit-delete
title: '📜 Day-4 MongoDB(edit, delete)'
slug: /day4-mongodb-edit-delete
---

```bash
# 1. select _id, and edit document group => D

db.students.updateOne(
    { _id: ObjectId("6409fc4c95f2b059ac23a7fe") },
    { $set: { group: "D" } }
)
```

```bash
# Change `isPaid` to true for multiple documents with group B

db.students.updateMany(
    { group: "B" },
    { $set: { isPaid: true } }
)
```

```bash
# 3. Delete the document with the keyword Brennan from the studentName(use Fuzzy Search)

db.students.deleteMany(
  { studentName: { $regex: /Brennan/ } }
)
```

```bash
# 4. Delete multiple documents where isPaid is true

db.students.deleteMany(
  { isPaid: true }
)
```
