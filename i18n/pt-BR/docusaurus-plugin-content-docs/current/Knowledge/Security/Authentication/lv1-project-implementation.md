---
id: login-lv1-project-implementation
title: '[Lv1] Como o mecanismo de login foi implementado em projetos anteriores?'
slug: /experience/login/lv1-project-implementation
tags: [Experience, Interview, Login, Lv1]
---

> Objetivo: explicar em 3 a 5 minutos "como o front-end lida com login, manutenção de estado e proteção de páginas", facilitando a lembranca rápida durante entrevistas.

---

## 1. Eixo principal da resposta na entrevista

1. **Três fases do fluxo de login**: enviar formulario -> verificação no back-end -> salvar Token e redirecionar.
2. **Gerenciamento de estado e Token**: Pinia com persistência, Axios Interceptor anexa automaticamente o Bearer Token.
3. **Tratamento subsequente e proteção**: inicializar dados compartilhados, guardas de rota, logout e cenários de exceção (OTP, alteracao forçada de senha).

Comece com esses três pontos-chave e expanda os detalhes conforme necessário, para que o entrevistador perceba que você possui uma visão geral.

---

## 2. Composicao do sistema e divisão de responsabilidades

| Módulo           | Localizacao                         | Funcao                                         |
| ---------------- | ----------------------------------- | ---------------------------------------------- |
| `authStore`      | `src/stores/authStore.ts`           | Armazena estado de login, persiste Token, fornece getters |
| `useAuth` Hook   | `src/common/hooks/useAuth.ts`       | Encapsula fluxo de login/logout, formato de retorno unificado |
| API de Login     | `src/api/login.ts`                  | Chama `POST /login`, `POST /logout` no back-end |
| Utilitario Axios | `src/common/utils/request.ts`       | Request/Response Interceptor, tratamento unificado de erros |
| Guarda de rota   | `src/router/index.ts`               | Verifica necessidade de login com base em `meta`, redireciona para página de login |
| Fluxo de inicialização | `src/common/composables/useInit.ts` | Na inicialização do App, verifica se já existe Token, carrega dados necessários |

> Mnemônica: **"Store gerencia estado, Hook gerencia fluxo, Interceptor gerencia canal, Guard gerencia páginas"**.

---

## 3. Fluxo de login (passo a passo)

### Step 0. Formulario e validação prévia

- Suporta dois métodos de login: senha convencional e código de verificação SMS.
- Antes de enviar, realiza validação básica (campos obrigatorios, formato, prevenção de envio duplicado).

### Step 1. Chamar API de login

```typescript
const { status, data, code } = await useApi(login, payload);
```

- `useApi` unifica tratamento de erros e gerenciamento de loading.
- Em caso de sucesso, `data` retorna o Token e informações essenciais do usuário.

### Step 2. Tratar resposta do back-end

| Cenário                                         | Comportamento                                           |
| ------------------------------------------------ | ------------------------------------------------------- |
| **Verificação adicional necessária** (ex: confirmação de identidade no primeiro login) | Define `authStore.onBoarding` como `true`, redireciona para página de verificação |
| **Alteracao forçada de senha**                   | Redireciona para fluxo de alteracao de senha conforme flag retornada, com parâmetros necessários |
| **Sucesso normal**                               | Chama `authStore.$patch()` para salvar Token e informações do usuário |

### Step 3. Acoes compartilhadas após login bem-sucedido

1. Obter dados básicos do usuário e lista de carteiras.
2. Inicializar conteúdo personalizado (ex: lista de presentes, notificações).
3. Redirecionar para página interna conforme `redirect` ou rota predefinida.

> O login bem-sucedido é apenas metade do caminho. **Os dados compartilhados subsequentes devem ser carregados neste momento**, evitando que cada página faca chamadas de API separadamente.

---

## 4. Gerenciamento do ciclo de vida do Token

### 4.1 Estratégia de armazenamento

- `authStore` com `persist: true` ativado, grava campos-chave no `localStorage`.
- Vantagem: estado restaurado automaticamente após recarregar a página; Desvantagem: necessário prestar atenção a XSS e segurança.

### 4.2 Axios Request Interceptor

```typescript
if (needToken) {
  const { access_token } = auth.value;
  config.headers.Authorization = `Bearer ${access_token}`;
}
```

- APIs que requerem autorizacao incluem automaticamente o Bearer Token.
- Se a API marcar explicitamente `needToken: false` (login, registro, etc.), o processo de inclusao é ignorado.

### 4.3 Tratamento de expiração e exceções

- Se o back-end retornar Token expirado ou inválido, o Response Interceptor converte para mensagem de erro unificada e aciona o fluxo de logout.
- Para extensão, pode-se adicionar mecanismo de Refresh Token; o projeto atual adota estratégia simplificada.

---

## 5. Protecao de rotas e inicialização

### 5.1 Guarda de rota

```typescript
router.beforeEach((to, from, next) => {
  const { needAuth, goRouteIfNoToken } = to.meta;
  if (needAuth && !authStore.isLogin) {
    return next({ name: goRouteIfNoToken || 'Login' });
  }
  next();
});
```

- Verifica o estado de login com base em `meta.needAuth`.
- Redireciona para página de login ou página pública designada quando não autenticado.

### 5.2 Inicializacao da aplicação

`useInit` trata na inicialização do App:

1. Verifica se a URL contem `login_token` ou `platform_token`; se sim, faz login automático ou configura o Token.
2. Se o Store já possui Token, carrega informações do usuário e dados compartilhados.
3. Sem Token, permanece na página pública, aguardando login manual do usuário.

---

## 6. Fluxo de logout (finalizacao e limpeza)

1. Chama `POST /logout` para notificar o back-end.
2. Executa `reset()`:
   - `authStore.$reset()` limpa informações de login.
   - Stores relacionadas (informações do usuário, favoritos, codigos de convite, etc.) são redefinidas.
3. Limpa cache do navegador (ex: cache no localStorage).
4. Redireciona para página de login ou página inicial.

> O logout e o espelho do login: não basta apenas deletar o Token, é preciso garantir que todos os estados dependentes sejam limpos para evitar dados residuais.

---

## 7. Perguntas frequentes e melhores práticas

- **Separacao de fluxo**: login e inicialização pos-login separados, mantendo o hook enxuto.
- **Tratamento de erros**: unificado via `useApi` e Response Interceptor, garantindo consistência na UI.
- **Seguranca**:
  - HTTPS em todo o processo.
  - Ao armazenar Token no `localStorage`, operações sensíveis devem considerar XSS.
  - Considerar extensão para httpOnly Cookie ou Refresh Token conforme necessidade.
- **Plano de contingencia**: cenários como OTP e alteracao forçada de senha mantem flexibilidade; o hook retorna o estado para a tela tratar.

---

## 8. Mnemônica rápida para entrevista

1. **"Entrada -> Verificação -> Armazenamento -> Redirecionamento"**: descreva o fluxo geral nesta ordem.
2. **"Store registra estado, Interceptor ajuda com headers, Guard barra intrusos"**: destaque a divisão arquitetural.
3. **"Após o login, carregue imediatamente os dados compartilhados"**: demonstre sensibilidade a experiência do usuário.
4. **"Logout e reset com um clique + retorno a página segura"**: cubra segurança e finalizacao do fluxo.
