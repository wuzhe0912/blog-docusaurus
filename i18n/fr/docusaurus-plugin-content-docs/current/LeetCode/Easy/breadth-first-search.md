---
id: breadth-first-search
title: 📄 Breadth First Search(BFS)
slug: /breadth-first-search
---

## Question Description

> Algorithme de recherche en largeur

Essayez d'utiliser la recherche en largeur pour parcourir les villes de l'Heptarchie anglo-saxonne d'Angleterre

```js
const heptarchyTree = {
  value: 'England', // Angleterre
  children: [
    {
      value: 'Northumbria', // Royaume de Northumbrie
      children: [
        {
          value: 'Bamburgh', // Château de Bamburgh
          children: [
            {
              value: 'Yeavering', // Domaine de Yeavering
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
      value: 'Mercia', // Royaume de Mercie
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
  const scroll = []; // Utiliser un parchemin pour enregistrer l'ordre de visite
  scroll.push(heptarchyTree); // Ajouter l'Angleterre comme point de départ au parchemin

  // Tant qu'il reste des villes sur le parchemin, continuer la traversée
  while (scroll.length > 0) {
    const kingdom = scroll.shift(); // Prendre du parchemin le prochain royaume ou ville à visiter
    console.log(kingdom.value); // Enregistrer le nom du royaume ou de la ville visitée

    // Parcourir toutes les sous-régions du royaume ou de la ville actuelle et les ajouter au parchemin
    for (const child of kingdom.children) {
      scroll.push(child);
    }
  }
}

travelThroughHeptarchy(heptarchyTree); // Commencer la traversée des villes de l'Heptarchie anglo-saxonne
```
