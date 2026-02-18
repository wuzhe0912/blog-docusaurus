---
slug: rebuilding-blog-with-ai
title: 'Reconstruire mon blog entier avec Claude Code'
authors: wuzhe0912
tags: [ai-tools, engineering]
---

Avant 2023-2024, les blogs techniques perso avaient encore pas mal de valeur à mes yeux. On pouvait y compiler ses notes, ses expériences d'entretien, les questions rencontrées, et même les pièges dans lesquels on était tombé avec tous les détails.

Mais à partir de mi-2025, les modèles ont commencé à itérer de plus en plus vite, et à devenir de plus en plus puissants. Même Cursor, que je trouvais plutôt bien comme AI Code Editor au premier semestre 2025, s'est fait visiblement écraser par Claude Code au second semestre. J'ai compris qu'il fallait s'adapter à l'époque et refondre tout le blog (en espérant qu'il garde un minimum de valeur).

<!--truncate-->

## Les données

Je commence par les chiffres, parce que ce volume de travail fait à la main, ça prendrait une éternité, et je suis quasiment certain que la procrastination m'aurait achevé bien avant la fin. Mais avec l'aide des outils IA, c'était bouclé en 10 jours (pendant le Nouvel An chinois, en plus). La qualité est correcte. Un petit miracle, quoi.

| Metric                      | Value                     |
| --------------------------- | ------------------------- |
| Duration                    | 10 days (Feb 8–18, 2026)  |
| Total commits               | 104                       |
| Files changed               | 1,078                     |
| Lines inserted              | 263,000+                  |
| Lines deleted               | 21,000+                   |
| Locales                     | 4 → 10                    |
| Docs translated to English  | 89                        |
| Translation files generated | 801 (89 docs × 9 locales) |
| Blog posts with full i18n   | 5                         |
| Tools used                  | Claude Code               |

## Ce que j'ai concrètement fait

### Phase 1 : Fondations (8–9 fév.) — 8 commits

Redesign complet de la page d'accueil et de la page About, en partant de zéro. Mise en place de `CLAUDE.md` comme constitution du projet — format de commit, règles i18n, conventions de structure de fichiers. Extension de 4 à 6 locales. Le tout en interaction avec Claude Code.

Cette phase, c'était surtout des décisions d'architecture : à quoi doit ressembler la page d'accueil ? Comment organiser la page About ? Quelles conventions pour tout le projet ? Toutes ces questions ont été travaillées en échangeant avec Claude, notamment pour établir le plan d'exécution. Moi, je me contentais de relire et d'ajuster.

### Phase 2 : Montée en puissance (11–12 fév.) — 14 commits

Ajout de 4 locales supplémentaires (pt-BR, de, fr, vi) pour arriver à 10. Génération des fichiers de traduction du thème. Refonte de la navbar et du sidebar pour mieux organiser le contenu. Passage du `defaultLocale` à `en` avec le routing i18n de Vercel. Mise à jour des dépendances. L'expansion des locales, c'est quasiment que du travail mécanique — pile le genre de truc où l'IA excelle. Ça consomme énormément de Token, mais en termes de main-d'œuvre humaine, c'est quasi impossible à faire en si peu de temps.

### Phase 3 : Contenu (13–14 fév.) — 14 commits

Nettoyage des vieux articles de blog. Rédaction d'une rétrospective annuelle. Traduction de tous les articles de blog dans les 10 locales. Création d'une page vitrine Projects. Finalisation de l'i18n de la page d'accueil. Correction de bugs UI (alignement des boutons ShowcaseCard, problème de rognage du dropdown).

Ce qui est ressorti à cette phase : l'IA n'est pas douée pour repérer les problèmes de rendu (problèmes UI) du premier coup. Il a fallu de nombreux allers-retours où c'est moi (l'humain) qui devais pointer la direction à corriger pour que l'affichage soit enfin bon.

### Phase 4 : Sidebar + Blog (15 fév.) — 7 commits

Réorganisation complète de la structure du sidebar des docs. Traduction des labels de catégories du sidebar pour les 10 locales. Suppression de 206 clés de traduction mortes, vestiges d'une restructuration précédente. Rédaction et traduction de l'article sur la négociation de licenciement dans toutes les locales.

### Phase 5 : i18n des docs (16–17 fév.) — 14 commits

Le plus gros batch : traduction de 89 docs dans les 9 locales non-anglophones, produisant 801 fichiers de traduction. Ça couvrait les sections Knowledge (JavaScript, TypeScript, CSS, Vue, React, Browser, Security, Engineering), Experience et Coding.

Cette phase et la suivante ont été extrêmement gourmandes en Token. Tout le travail de traduction hautement mécanique a été balancé à l'IA pour qu'elle se défoule (de toute façon, je ne comprends pas la plupart de ces langues).

### Phase 6 : Corrections qualité (17–18 fév.) — 24 commits

Cette phase existe parce que la production de la Phase 5 n'était pas assez propre. Vingt-quatre commits entièrement consacrés à corriger les traductions générées par l'IA :

- **Allemand** : les Umlauts rendus en ASCII (`ue` au lieu de `ü`, `ae` au lieu de `ä`)
- **Français** : les accents supprimés (`e` au lieu de `é`, `a` au lieu de `à`)
- **Vietnamien** : les diacritiques totalement absents (du vietnamien sans tons, c'est quasiment illisible)
- **Espagnol/Portugais** : les accents omis dans tout le texte
- **Chinois simplifié** : des caractères traditionnels mélangés dedans (l'IA confond parfois les deux systèmes d'écriture)
- **Résidus CJK** : des commentaires en chinois non traduits dans les blocs de code pour es, pt-BR, ja, ko, vi

Chaque correction en faisait surgir d'autres. En corrigeant les accents portugais, les sur-corrections ont cassé les champs `id` et `slug` du frontmatter. En corrigeant les tons vietnamiens, un fichier a été oublié. La correction des accents espagnols contenait des faux positifs, nécessitant un commit de correction supplémentaire.

Honnêtement, à cette phase, à moins de parler couramment une de ces langues, l'humain ne peut pas vraiment intervenir. On est obligé de se fier entièrement à la validation croisée entre différents modèles.

**Ce que l'IA ne sait pas bien faire** :

```markdown
// Example：

- Gérer correctement les diacritiques et les tons du premier coup (accents, umlauts, tonal marks)
- Distinguer de manière fiable le chinois traditionnel du simplifié
- Décider si les commentaires dans le code doivent rester en VO ou être traduits
- Préserver les champs du frontmatter intacts pendant les transformations de contenu
```

## Les pièges

**La catastrophe des accents et des tons.** L'IA a remplacé les caractères non-ASCII par des approximations ASCII dans cinq langues. Résultat : 24 commits de correction — presque un quart du total. Le vietnamien était le pire : sans les diacritiques, la langue devient quasiment méconnaissable.

**Le mélange traditionnel/simplifié.** Les traductions `zh-cn` contenaient des caractères chinois traditionnels dans les commentaires de code et les références en ligne. L'IA n'arrive pas à distinguer de manière fiable les deux systèmes d'écriture.

**Frontmatter corrompu.** En traduisant les docs, l'IA modifiait parfois les champs `id` et `slug` du frontmatter, ce qui cassait le routing Docusaurus. Un commit était spécifiquement dédié à corriger les `id` et `slug` portugais bousillés pendant les corrections d'accents.

**L'effet domino des sur-corrections.** Corriger un problème en créait souvent un autre. La correction des accents portugais a sur-corrigé certains termes techniques. La correction des tons vietnamiens a raté un fichier. Chaque commit de « correction » avait une probabilité non nulle de fabriquer un nouveau problème.

## Là où l'humain peut encore intervenir

**Les décisions d'architecture.** Quelles 10 locales supporter. Comment organiser le sidebar. Ce qui va dans le dropdown de la navbar, ce qui reste au premier niveau. Ces décisions conditionnent tout le reste en aval.

**Le jugement qualité.** Est-ce que l'UI est cassée, est-ce que ça respecte les specs de design ? Est-ce que les traductions ont des erreurs évidentes, par exemple est-ce que le changement de locale par défaut est correctement pris en compte ?

**Le fichier `CLAUDE.md`.** C'est fondamentalement une constitution de repo, qui sert à enseigner à l'IA les conventions de votre projet : format de commit, structure de fichiers, règles i18n, ce qu'il ne faut absolument jamais faire. Plus ce fichier est complet, moins l'IA fait d'erreurs, moins l'humain doit intervenir. D'où la nécessité de l'itérer et de le mettre à jour fréquemment.

## Ce que j'en retiens

**Commencez par un `CLAUDE.md` solide.** Chaque convention que vous y inscrivez vous épargne des dizaines de cycles de correction par la suite. Le mien est passé de quelques lignes à un document complet, couvrant le format de commit, les règles i18n, la structure du projet, et des interdictions explicites.

**Regroupez le travail similaire, relisez par batch.** Ne traduisez pas un fichier à la fois. Balancez 15 fichiers similaires à l'IA d'un coup, puis relisez le tout par lot. Ça évite d'avoir à valider trop de détails un par un.

**Utilisez les outils en parallèle autant que possible.** Faire tourner Claude Code pour le travail interactif, puis transférer le travail vers Gemini, Codex et compagnie pour les tâches batch, c'est le plus gros gain d'efficacité. Ne sérialisez pas ce qui peut être parallélisé.

**Documentez tout.** Chaque message de commit, chaque frontière de phase, chaque correction — tout est dans l'historique. Si vous menez un gros projet assisté par IA, le commit history, c'est votre documentation.
