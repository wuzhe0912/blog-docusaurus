---
id: web-storage
title: '[Medium] 📄 cookie, sessionStorage, localStorage'
slug: /web-storage
tags: [HTML, JavaScript, Quiz, Medium]
---

## Comparação

| Propriedade | `cookie` | `sessionStorage` | `localStorage` |
| --- | --- | --- | --- |
| Ciclo de vida | Excluído por padrão ao fechar a página, a menos que um tempo de expiração (Expires) ou tempo máximo de armazenamento (Max-Age) seja definido | Excluído ao fechar a página | Armazenamento permanente até exclusão explícita |
| HTTP Request | Sim, pode ser enviado ao servidor através do header Cookie | Não | Não |
| Capacidade total | 4KB | 5MB | 5MB |
| Escopo de acesso | Entre janelas/abas | Apenas mesma aba | Entre janelas/abas |
| Segurança | JavaScript não pode acessar `HttpOnly cookies` | Nenhuma | Nenhuma |

## Explicação de termos

> O que são Persistent cookies?

Cookies persistentes são uma forma de armazenar dados por longo prazo no navegador do usuário. A implementação concreta é feita definindo um tempo de expiração como mencionado acima (`Expires` ou `Max-Age`).

## Experiência pessoal de implementação

### `cookie`

#### 1. Verificação de segurança

Alguns projetos legados tinham uma situação de segurança ruim, com problemas frequentes de roubo de contas que elevaram significativamente os custos operacionais. Primeiro foi adotada a biblioteca [Fingerprint](https://fingerprint.com/) (versão comunitária com precisão de aproximadamente 60%, versão paga com cota mensal gratuita de 20.000), identificando cada usuário logado como um visitID único através de parâmetros de dispositivo e localização. Em seguida, aproveitando a característica dos cookies de serem enviados a cada requisição HTTP, o backend verificava a situação atual do usuário (troca de dispositivo ou desvio anormal de localização). Ao detectar anomalias, era forçada a verificação OTP (email ou SMS conforme requisitos da empresa) no fluxo de login.

#### 2. URL de código promocional

Ao gerenciar sites de produtos, frequentemente eram fornecidas estratégias de marketing de afiliados, oferecendo URLs exclusivas para promotores parceiros facilitarem a captação e promoção. Para garantir que os clientes captados pertencessem ao desempenho do promotor, foi implementada usando a propriedade `expires` do `cookie`. A partir do momento em que o usuário entra no site pela captação, durante 24 horas (o prazo pode ser decidido pelo operador), o código promocional permanece obrigatoriamente válido. Mesmo que o usuário remova intencionalmente o parâmetro do código promocional da URL, ao se registrar o parâmetro correspondente é obtido do `cookie`, expirando automaticamente após 24 horas.

### `localStorage`

#### 1. Armazenamento de preferências do usuário

- Frequentemente usado para armazenar preferências pessoais do usuário, como dark mode, configuração de idioma i18n, etc.
- Ou para armazenar o token de login.
