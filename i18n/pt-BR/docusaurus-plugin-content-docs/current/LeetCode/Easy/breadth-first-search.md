---
id: breadth-first-search
title: 📄 Breadth First Search(BFS)
slug: /breadth-first-search
---

## Question Description

> Algoritmo de busca em largura

Tente usar a busca em largura para percorrer as cidades da Heptarquia anglo-saxã da Inglaterra

```js
const heptarchyTree = {
  value: 'England', // Inglaterra
  children: [
    {
      value: 'Northumbria', // Reino da Nortúmbria
      children: [
        {
          value: 'Bamburgh', // Castelo de Bamburgh
          children: [
            {
              value: 'Yeavering', // Propriedade de Yeavering
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
      value: 'Mercia', // Reino da Mércia
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
  const scroll = []; // Usar um pergaminho para registrar a ordem de visita
  scroll.push(heptarchyTree); // Adicionar a Inglaterra como ponto de partida ao pergaminho

  // Enquanto houver cidades no pergaminho, continuar percorrendo
  while (scroll.length > 0) {
    const kingdom = scroll.shift(); // Pegar do pergaminho o próximo reino ou cidade a visitar
    console.log(kingdom.value); // Registrar o nome do reino ou cidade visitada

    // Percorrer todas as sub-regiões do reino ou cidade atual e adicioná-las ao pergaminho
    for (const child of kingdom.children) {
      scroll.push(child);
    }
  }
}

travelThroughHeptarchy(heptarchyTree); // Começar a percorrer as cidades da Heptarquia anglo-saxã
```
