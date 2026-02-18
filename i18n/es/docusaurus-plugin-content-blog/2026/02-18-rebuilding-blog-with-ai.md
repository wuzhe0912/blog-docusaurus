---
slug: rebuilding-blog-with-ai
title: 'Reconstruyendo mi blog entero con Claude Code'
authors: wuzhe0912
tags: [ai-tools, engineering]
---

Antes de 2023-2024, personalmente creo que los blogs técnicos tradicionales todavía tenían bastante valor. Al final, podías recopilar tus apuntes, experiencias de entrevistas, problemas que te habían salido, e incluso trampas y detalles en los que habías caído.

Pero a partir de mediados de 2025, los modelos empezaron a iterar cada vez más rápido y a volverse cada vez más potentes. Incluso Cursor, que en la primera mitad de 2025 me parecía un AI Code Editor bastante decente, en la segunda mitad ya se notaba claramente que no podía competir con Claude Code. Ahí supe que tenía que ir con los tiempos y reconstruir el blog entero desde cero (con la esperanza de que conservara algo de valor).

<!--truncate-->

## Datos

Empiezo con los datos, porque este volumen de trabajo, hecho puramente a mano, habría sido eterno — y puedo asegurar que la procrastinación me habría derrotado por completo. Pero con la ayuda de herramientas de IA, lo terminé en 10 días (y eso que fue durante el Año Nuevo Lunar chino). La calidad es aceptable. Un pequeño milagro, diría yo.

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

## Qué hice realmente

### Fase 1: Cimientos (Feb 8–9) — 8 commits

Rediseñé la página de inicio y la página About desde cero. Creé `CLAUDE.md` como la constitución del proyecto — formato de commits, reglas de i18n, convenciones de estructura de archivos. Expandí los idiomas de 4 a 6. Todo fue hecho interactuando con Claude Code.

Esta fase fue principalmente de decisiones de arquitectura: ¿Cómo debería verse la página de inicio? ¿Cómo se organiza la página About? ¿Qué convenciones sigue todo el proyecto? Todas estas preguntas se resolvieron a través de la interacción con Claude, especialmente al definir el plan de ejecución. Yo solo me encargué de revisar y ajustar.

### Fase 2: Escalar (Feb 11–12) — 14 commits

Añadí 4 idiomas más (pt-BR, de, fr, vi) para completar 10. Generé archivos de traducción del tema. Rediseñé la navbar y el sidebar para mejorar la organización del contenido. Cambié el `defaultLocale` a `en` y configuré el i18n routing en Vercel. Actualicé dependencias. La expansión de idiomas fue casi todo trabajo mecánico — justo donde la IA brilla. Consume un montón de Token, sí, pero a mano habría sido prácticamente imposible hacerlo en tan poco tiempo.

### Fase 3: Contenido (Feb 13–14) — 14 commits

Limpié posts viejos del blog. Escribí una reflexión de fin de año. Traduje todos los posts del blog a los 10 idiomas. Construí una página de Projects showcase. Completé el i18n de la página de inicio. Corregí bugs de componentes UI (alineación de botones en ShowcaseCard, problemas de recorte en dropdown).

Lo que descubrí en esta fase es que la IA en realidad no es buena detectando problemas de maquetación rota (problemas de UI) a la primera. Se necesitaron varias rondas de interacción donde yo (el humano) iba señalando la dirección de las correcciones para que la pantalla quedara bien.

### Fase 4: Sidebar + Blog (Feb 15) — 7 commits

Reorganicé toda la estructura del sidebar de docs. Traduje todas las etiquetas de categoría del sidebar para los 10 idiomas. Eliminé 206 claves de traducción inútiles que habían quedado de reestructuraciones anteriores. Escribí y traduje el post sobre negociación de despido a todos los idiomas.

### Fase 5: i18n de docs (Feb 16–17) — 14 commits

El batch más grande: traducir 89 documentos a 9 idiomas no ingleses, generando 801 archivos de traducción. Abarcó las secciones de Knowledge (JavaScript, TypeScript, CSS, Vue, React, Browser, Security, Engineering), Experience y Coding.

Esta fase y la siguiente fueron extremadamente intensivas en Token. El trabajo de traducción, altamente mecánico, se lo lancé entero a la IA para que se luciera (total, yo no entiendo la mayoría de esos idiomas de todas formas).

### Fase 6: Correcciones de calidad (Feb 17–18) — 24 commits

Esta fase existe porque la producción de la Fase 5 no salió limpia. Los 24 commits fueron enteramente para arreglar traducciones generadas por IA:

- **Alemán**: Umlauts renderizados como ASCII (`ue` en vez de `ü`, `ae` en vez de `ä`)
- **Francés**: Acentos eliminados (`e` en vez de `é`, `a` en vez de `à`)
- **Vietnamita**: Marcas tonales completamente ausentes (el vietnamita sin tonos es prácticamente ilegible)
- **Español/Portugués**: Acentos desaparecidos en todo el texto
- **Chino simplificado**: Caracteres de chino tradicional colados (la IA a veces no distingue entre los dos sistemas de escritura)
- **Residuos CJK**: Comentarios en chino sin traducir en bloques de código de es, pt-BR, ja, ko, vi

Cada corrección hacía brotar más problemas. Al arreglar los acentos del portugués, la sobrecorrección rompió los campos `id` y `slug` del frontmatter. Al arreglar los tonos del vietnamita, se les escapó un archivo. La corrección de acentos del español tuvo falsos positivos y necesitó otro commit de corrección.

La verdad es que, en esta fase, a menos que domines un idioma específico, un humano realmente no puede intervenir — solo queda confiar en la verificación cruzada entre distintos modelos.

**Cosas que la IA no maneja bien**:

```markdown
// Example:

- Acertar los diacríticos y marcas tonales a la primera (accents, umlauts, tonal marks)
- Distinguir de forma consistente entre chino tradicional y simplificado
- Decidir si los comentarios en el código deben quedarse en el idioma original o traducirse
- Preservar los campos del frontmatter intactos durante la transformación de contenido
```

## Trampas

**El desastre de los acentos y tonos.** La IA reemplazó caracteres no ASCII con aproximaciones ASCII en cinco idiomas. Eso generó 24 commits de corrección — casi una cuarta parte del total. El vietnamita fue el caso más grave: sin marcas tonales, el idioma entero es prácticamente irreconocible.

**Mezcla de chino tradicional y simplificado.** Las traducciones de `zh-cn` tenían caracteres de chino tradicional en comentarios de código y citas inline. La IA no distingue de forma fiable entre los dos sistemas de escritura.

**Frontmatter corrupto.** Al traducir documentos, la IA a veces tocaba los campos `id` y `slug` del frontmatter, rompiendo el routing de Docusaurus. Hay un commit dedicado exclusivamente a arreglar los `id` y `slug` del portugués que se rompieron durante las correcciones de acentos.

**Reacción en cadena de sobrecorrecciones.** Arreglar un problema muchas veces creaba otro. La corrección de acentos del portugués sobrecorrigió algunos términos técnicos. La corrección de tonos del vietnamita se saltó un archivo. Cada commit de "corrección" tenía una probabilidad no despreciable de crear un nuevo problema.

## Dónde los humanos todavía pueden intervenir

**Decisiones de arquitectura.** Qué 10 idiomas soportar. Cómo organizar el sidebar. Qué va en el dropdown de la navbar y qué va en el nivel superior. Estas decisiones afectaron todo el trabajo posterior.

**Juicio de calidad.** ¿Se rompió la UI? ¿Cumple con las especificaciones de diseño? ¿Las traducciones tienen errores obvios? Por ejemplo, si el ajuste del idioma predeterminado se reflejó correctamente.

**El archivo `CLAUDE.md`.** Es esencialmente una constitución del repositorio, para enseñarle a la IA las convenciones de tu proyecto: formato de commits, estructura de archivos, reglas de i18n, cosas que jamás debe hacer. Cuanto mejor está este archivo, menos errores comete la IA y menos tiene que intervenir un humano. Así que hay que iterarlo y actualizarlo con frecuencia.

## Reflexiones

**Empieza con un `CLAUDE.md` sólido.** Cada convención que escribes ahí te ahorra docenas de ciclos de corrección después. El mío creció de unas pocas líneas a un documento completo, cubriendo formato de commits, reglas de i18n, estructura del proyecto, y prohibiciones explícitas.

**Agrupa trabajo similar, revisa en batch.** No traduzcas un archivo a la vez. Lánzale 15 archivos similares a la IA de una vez y revisa el resultado en bloque. Así evitas que un humano tenga que aprobar demasiados detalles uno por uno.

**Usa herramientas en paralelo siempre que puedas.** Dejar que Claude Code maneje el trabajo interactivo y luego delegar el trabajo por lotes a Gemini, Codex y compañía fue la mayor ganancia de eficiencia. No serialices trabajo que se puede paralelizar.

**Documenta todo.** Cada mensaje de commit, cada límite de fase, cada corrección — todo queda en el historial. Si estás haciendo un proyecto grande asistido por IA, el historial de commits ES tu documentación.
