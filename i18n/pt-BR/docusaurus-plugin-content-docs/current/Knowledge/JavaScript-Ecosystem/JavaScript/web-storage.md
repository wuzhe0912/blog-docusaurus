---
id: web-storage
title: '[Medium] 📄 cookie, sessionStorage, localStorage'
slug: /web-storage
tags: [HTML, JavaScript, Quiz, Medium]
---

## Comparacao

| Propriedade | `cookie` | `sessionStorage` | `localStorage` |
| --- | --- | --- | --- |
| Ciclo de vida | Excluido por padrao ao fechar a pagina, a menos que um tempo de expiracao (Expires) ou tempo maximo de armazenamento (Max-Age) seja definido | Excluido ao fechar a pagina | Armazenamento permanente ate exclusao explicita |
| HTTP Request | Sim, pode ser enviado ao servidor atraves do header Cookie | Nao | Nao |
| Capacidade total | 4KB | 5MB | 5MB |
| Escopo de acesso | Entre janelas/abas | Apenas mesma aba | Entre janelas/abas |
| Seguranca | JavaScript nao pode acessar `HttpOnly cookies` | Nenhuma | Nenhuma |

## Explicacao de termos

> O que sao Persistent cookies?

Cookies persistentes sao uma forma de armazenar dados por longo prazo no navegador do usuario. A implementacao concreta e feita definindo um tempo de expiracao como mencionado acima (`Expires` ou `Max-Age`).

## Experiencia pessoal de implementacao

### `cookie`

#### 1. Verificacao de seguranca

Alguns projetos legados tinham uma situacao de seguranca ruim, com problemas frequentes de roubo de contas que elevaram significativamente os custos operacionais. Primeiro foi adotada a biblioteca [Fingerprint](https://fingerprint.com/) (versao comunitaria com precisao de aproximadamente 60%, versao paga com cota mensal gratuita de 20.000), identificando cada usuario logado como um visitID unico atraves de parametros de dispositivo e localizacao. Em seguida, aproveitando a caracteristica dos cookies de serem enviados a cada requisicao HTTP, o backend verificava a situacao atual do usuario (troca de dispositivo ou desvio anormal de localizacao). Ao detectar anomalias, era forcada a verificacao OTP (email ou SMS conforme requisitos da empresa) no fluxo de login.

#### 2. URL de codigo promocional

Ao gerenciar sites de produtos, frequentemente eram fornecidas estrategias de marketing de afiliados, oferecendo URLs exclusivas para promotores parceiros facilitarem a captacao e promocao. Para garantir que os clientes captados pertencessem ao desempenho do promotor, foi implementada usando a propriedade `expires` do `cookie`. A partir do momento em que o usuario entra no site pela captacao, durante 24 horas (o prazo pode ser decidido pelo operador), o codigo promocional permanece obrigatoriamente valido. Mesmo que o usuario remova intencionalmente o parametro do codigo promocional da URL, ao se registrar o parametro correspondente e obtido do `cookie`, expirando automaticamente apos 24 horas.

### `localStorage`

#### 1. Armazenamento de preferencias do usuario

- Frequentemente usado para armazenar preferencias pessoais do usuario, como dark mode, configuracao de idioma i18n, etc.
- Ou para armazenar o token de login.
