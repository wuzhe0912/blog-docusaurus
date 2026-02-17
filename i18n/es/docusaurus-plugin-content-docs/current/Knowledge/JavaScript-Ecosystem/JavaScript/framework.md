---
id: framework
title: '[Hard] 📄 Framework'
slug: /framework
tags: [JavaScript, Quiz, Hard]
---

## 1. Please explain and compare the advantages and disadvantages of SPA and SSR

> Explique y compare las ventajas y desventajas de SPA y SSR

### SPA (Aplicacion de Pagina Unica)

#### Ventajas de SPA

1. Experiencia de usuario: La esencia de SPA es una sola pagina que carga datos dinamicamente y combina el enrutamiento frontend para dar al usuario la impresion de cambiar de pagina, cuando en realidad solo se cambian components. Esta experiencia es naturalmente mas fluida y rapida.
2. Separacion frontend-backend: El frontend solo se encarga del renderizado de pagina e interaccion, mientras que el backend solo proporciona APIs de datos. Esto reduce la carga de desarrollo de ambos lados y facilita el mantenimiento.
3. Optimizacion de red: Solo necesita cargar la pagina una vez, a diferencia de la estructura multi-pagina tradicional que requiere recargar en cada cambio de pagina, reduciendo asi las solicitudes y la carga del servidor.

#### Desventajas de SPA

1. SEO: Las paginas SPA se cargan dinamicamente, por lo que los motores de busqueda no pueden capturar directamente el contenido (aunque Google afirma estar mejorando esto). Frente a los rastreadores de busqueda, sigue siendo inferior al HTML tradicional.
2. Tiempo de carga inicial: SPA necesita cargar y ejecutar JavaScript en el cliente antes de renderizar la pagina, por lo que el tiempo de carga inicial es mas largo, especialmente con malas condiciones de red.

### SSR (Renderizado del Lado del Servidor)

#### Ventajas de SSR

1. SEO: SSR renderiza la pagina con datos en el servidor, por lo que los motores de busqueda pueden capturar directamente el contenido. Esta es la mayor ventaja de SSR.
2. Tiempo de carga: SSR transfiere la carga de renderizado al servidor, lo que puede acortar el tiempo de renderizado en la primera visita.

#### Desventajas de SSR

1. Costo de aprendizaje y complejidad: Tomando Next y Nuxt como ejemplo, aunque se basan en React y Vue, han desarrollado sus propios ecosistemas, aumentando el costo de aprendizaje. Viendo la reciente revision de Next.js 14, no todos los desarrolladores pueden aceptar tales cambios.
2. Carga del servidor: Al transferir el trabajo de renderizado al servidor, puede causar mayor carga, especialmente en escenarios de alto trafico.

### Conclusion

En principio, para sistemas de backoffice sin necesidad de SEO, no es necesario usar frameworks SSR. Para paginas web de productos que dependen de motores de busqueda, vale la pena evaluar la adopcion de un framework SSR.

## 2. Describa los Web Frameworks que ha utilizado y compare sus ventajas y desventajas

**Ambos convergen hacia el "desarrollo de componentes basado en funciones":**

> Vue 3 divide la logica en composables reutilizables a traves de Composition API; React tiene Hooks como nucleo. La experiencia de desarrollo es muy similar, aunque en general Vue tiene menor costo de entrada, mientras que React es mas fuerte en ecosistema y flexibilidad.

### Vue (principalmente Vue 3)

**Ventajas:**

- **Curva de aprendizaje mas suave**: SFC (Single File Component) agrupa template / script / style, siendo muy amigable para desarrolladores que vienen del frontend tradicional (plantillas backend).
- **Convenciones oficiales claras, beneficioso para equipos**: La guia de estilo y convenciones oficiales son claras, facilitando a nuevos miembros mantener la consistencia al heredar proyectos.
- **Ecosistema central completo**: Oficialmente se mantienen Vue Router, Pinia (o Vuex), CLI / Vite Plugin, etc., con "soluciones oficiales" desde la creacion del proyecto hasta gestion de estado y enrutamiento.
- **Composition API mejora la mantenibilidad**: Se puede separar la logica por funcionalidad en composables (ej: useAuth, useForm), compartiendo logica y reduciendo codigo duplicado en proyectos grandes.

**Desventajas:**

- **Ecosistema y comunidad ligeramente menor que React**: La cantidad y diversidad de paquetes de terceros es menor, y algunas herramientas o integraciones de vanguardia priorizan React.
- **Mercado laboral relativamente concentrado en regiones/industrias especificas**: Comparado con React, los equipos internacionales o multinacionales usan predominantemente React, lo que es relativamente desventajoso en flexibilidad de carrera (aunque en el mundo sinoparlante es mitad y mitad).

---

### React

**Ventajas:**

- **Ecosistema enorme con actualizaciones tecnologicas rapidas**: Casi todas las nuevas tecnologias frontend, sistemas de diseno o servicios de terceros ofrecen prioridad a la version React.
- **Alta flexibilidad, libre combinacion del stack tecnologico**: Compatible con Redux / Zustand / Recoil y otros gestores de estado, ademas de Meta Frameworks como Next.js, Remix, con soluciones maduras desde SPA hasta SSR, SSG, CSR.
- **Integracion madura con TypeScript e ingenieria frontend**: Mucha discusion comunitaria sobre tipado y mejores practicas para proyectos grandes, util para proyectos de mantenimiento a largo plazo.

**Desventajas:**

- **Alta libertad requiere normas propias del equipo**: Sin estilo de codigo claro ni convenciones de arquitectura, diferentes desarrolladores pueden usar estilos y metodos de gestion de estado completamente diferentes, aumentando los costos de mantenimiento.
- **La curva de aprendizaje no es realmente baja**: Ademas de React (JSX, pensamiento de Hooks), hay que enfrentar Router, gestion de estado, obtencion de datos, SSR, etc., y los principiantes se pierden facilmente en "que library elegir".
- **Cambios de API y evolucion de mejores practicas son rapidos**: De Class Component a Function Component + Hooks, luego a Server Components, cuando proyectos antiguos y nuevos estilos coexisten, se necesitan costos adicionales de migracion y mantenimiento.
