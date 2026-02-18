---
id: framework
title: '[Hard] 📄 Framework'
slug: /framework
tags: [JavaScript, Quiz, Hard]
---

## 1. Please explain and compare the advantages and disadvantages of SPA and SSR

> Explique y compare las ventajas y desventajas de SPA y SSR

### SPA (Aplicación de Página Única)

#### Ventajas de SPA

1. Experiencia de usuario: La esencia de SPA es una sola página que carga datos dinámicamente y combina el enrutamiento frontend para dar al usuario la impresión de cambiar de página, cuando en realidad solo se cambian components. Esta experiencia es naturalmente más fluida y rápida.
2. Separación frontend-backend: El frontend solo se encarga del renderizado de página e interacción, mientras que el backend solo proporciona APIs de datos. Esto reduce la carga de desarrollo de ambos lados y facilita el mantenimiento.
3. Optimización de red: Solo necesita cargar la página una vez, a diferencia de la estructura multi-página tradicional que requiere recargar en cada cambio de página, reduciendo así las solicitudes y la carga del servidor.

#### Desventajas de SPA

1. SEO: Las páginas SPA se cargan dinámicamente, por lo que los motores de búsqueda no pueden capturar directamente el contenido (aunque Google afirma estar mejorando esto). Frente a los rastreadores de búsqueda, sigue siendo inferior al HTML tradicional.
2. Tiempo de carga inicial: SPA necesita cargar y ejecutar JavaScript en el cliente antes de renderizar la página, por lo que el tiempo de carga inicial es más largo, especialmente con malas condiciones de red.

### SSR (Renderizado del Lado del Servidor)

#### Ventajas de SSR

1. SEO: SSR renderiza la página con datos en el servidor, por lo que los motores de búsqueda pueden capturar directamente el contenido. Esta es la mayor ventaja de SSR.
2. Tiempo de carga: SSR transfiere la carga de renderizado al servidor, lo que puede acortar el tiempo de renderizado en la primera visita.

#### Desventajas de SSR

1. Costo de aprendizaje y complejidad: Tomando Next y Nuxt como ejemplo, aunque se basan en React y Vue, han desarrollado sus propios ecosistemas, aumentando el costo de aprendizaje. Viendo la reciente revisión de Next.js 14, no todos los desarrolladores pueden aceptar tales cambios.
2. Carga del servidor: Al transferir el trabajo de renderizado al servidor, puede causar mayor carga, especialmente en escenarios de alto tráfico.

### Conclusión

En principio, para sistemas de backoffice sin necesidad de SEO, no es necesario usar frameworks SSR. Para páginas web de productos que dependen de motores de búsqueda, vale la pena evaluar la adopción de un framework SSR.

## 2. Describa los Web Frameworks que ha utilizado y compare sus ventajas y desventajas

**Ambos convergen hacia el "desarrollo de componentes basado en funciones":**

> Vue 3 divide la lógica en composables reutilizables a través de Composition API; React tiene Hooks como núcleo. La experiencia de desarrollo es muy similar, aunque en general Vue tiene menor costo de entrada, mientras que React es más fuerte en ecosistema y flexibilidad.

### Vue (principalmente Vue 3)

**Ventajas:**

- **Curva de aprendizaje más suave**: SFC (Single File Component) agrupa template / script / style, siendo muy amigable para desarrolladores que vienen del frontend tradicional (plantillas backend).
- **Convenciones oficiales claras, beneficioso para equipos**: La guía de estilo y convenciones oficiales son claras, facilitando a nuevos miembros mantener la consistencia al heredar proyectos.
- **Ecosistema central completo**: Oficialmente se mantienen Vue Router, Pinia (o Vuex), CLI / Vite Plugin, etc., con "soluciones oficiales" desde la creación del proyecto hasta gestión de estado y enrutamiento.
- **Composition API mejora la mantenibilidad**: Se puede separar la lógica por funcionalidad en composables (ej: useAuth, useForm), compartiendo lógica y reduciendo código duplicado en proyectos grandes.

**Desventajas:**

- **Ecosistema y comunidad ligeramente menor que React**: La cantidad y diversidad de paquetes de terceros es menor, y algunas herramientas o integraciones de vanguardia priorizan React.
- **Mercado laboral relativamente concentrado en regiones/industrias específicas**: Comparado con React, los equipos internacionales o multinacionales usan predominantemente React, lo que es relativamente desventajoso en flexibilidad de carrera (aunque en el mundo sinoparlante es mitad y mitad).

---

### React

**Ventajas:**

- **Ecosistema enorme con actualizaciones tecnológicas rápidas**: Casi todas las nuevas tecnologías frontend, sistemas de diseño o servicios de terceros ofrecen prioridad a la versión React.
- **Alta flexibilidad, libre combinación del stack tecnológico**: Compatible con Redux / Zustand / Recoil y otros gestores de estado, además de Meta Frameworks como Next.js, Remix, con soluciones maduras desde SPA hasta SSR, SSG, CSR.
- **Integración madura con TypeScript e ingeniería frontend**: Mucha discusión comunitaria sobre tipado y mejores prácticas para proyectos grandes, útil para proyectos de mantenimiento a largo plazo.

**Desventajas:**

- **Alta libertad requiere normas propias del equipo**: Sin estilo de código claro ni convenciones de arquitectura, diferentes desarrolladores pueden usar estilos y métodos de gestión de estado completamente diferentes, aumentando los costos de mantenimiento.
- **La curva de aprendizaje no es realmente baja**: Además de React (JSX, pensamiento de Hooks), hay que enfrentar Router, gestión de estado, obtención de datos, SSR, etc., y los principiantes se pierden fácilmente en "qué library elegir".
- **Cambios de API y evolución de mejores prácticas son rápidos**: De Class Component a Function Component + Hooks, luego a Server Components, cuando proyectos antiguos y nuevos estilos coexisten, se necesitan costos adicionales de migración y mantenimiento.
