---
id: breadth-first-search
title: 📄 Breadth First Search(BFS)
slug: /breadth-first-search
---

## Question Description

> Algoritmo de búsqueda en amplitud

Intenta usar la búsqueda en amplitud para recorrer las ciudades de la Heptarquía anglosajona de Inglaterra

```js
const heptarchyTree = {
  value: 'England', // Inglaterra
  children: [
    {
      value: 'Northumbria', // Reino de Northumbria
      children: [
        {
          value: 'Bamburgh', // Castillo de Bamburgh
          children: [
            {
              value: 'Yeavering', // Finca de Yeavering
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
      value: 'Mercia', // Reino de Mercia
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
  const scroll = []; // Usar un pergamino para registrar el orden de visita
  scroll.push(heptarchyTree); // Agregar Inglaterra como punto de inicio al pergamino

  // Mientras haya ciudades en el pergamino, seguir recorriendo
  while (scroll.length > 0) {
    const kingdom = scroll.shift(); // Tomar del pergamino el siguiente reino o ciudad a visitar
    console.log(kingdom.value); // Registrar el nombre del reino o ciudad visitada

    // Recorrer todas las subregiones del reino o ciudad actual y agregarlas al pergamino
    for (const child of kingdom.children) {
      scroll.push(child);
    }
  }
}

travelThroughHeptarchy(heptarchyTree); // Comenzar a recorrer las ciudades de la Heptarquía anglosajona
```
