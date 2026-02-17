---
id: breadth-first-search
title: 📄 Breadth First Search(BFS)
slug: /breadth-first-search
---

## Question Description

> Breitensuchalgorithmus

Versuche, die Breitensuche zu verwenden, um die Städte der angelsächsischen Heptarchie zu durchqueren

```js
const heptarchyTree = {
  value: 'England', // England
  children: [
    {
      value: 'Northumbria', // Königreich Northumbria
      children: [
        {
          value: 'Bamburgh', // Bamburgh Castle
          children: [
            {
              value: 'Yeavering', // Yeavering Anwesen
              children: [],
            },
          ],
        },
        {
          value: 'Lindisfarne', // Lindisfarne
          children: [],
        },
      ],
    },
    {
      value: 'Mercia', // Königreich Mercia
      children: [
        {
          value: 'Tamworth', // Tamworth
          children: [],
        },
        {
          value: 'Repton', // Repton
          children: [],
        },
      ],
    },
  ],
};

function travelThroughHeptarchy(heptarchyTree) {
  const scroll = []; // Pergament verwenden, um die Besuchsreihenfolge festzuhalten
  scroll.push(heptarchyTree); // England als Startpunkt zum Pergament hinzufügen

  // Solange noch Städte auf dem Pergament stehen, weiter durchqueren
  while (scroll.length > 0) {
    const kingdom = scroll.shift(); // Das nächste zu besuchende Königreich oder die Stadt vom Pergament nehmen
    console.log(kingdom.value); // Den Namen des besuchten Königreichs oder der Stadt aufzeichnen

    // Alle Unterregionen des aktuellen Königreichs oder der Stadt durchqueren und zum Pergament hinzufügen
    for (const child of kingdom.children) {
      scroll.push(child);
    }
  }
}

travelThroughHeptarchy(heptarchyTree); // Beginne die Durchquerung der Städte der angelsächsischen Heptarchie
```
