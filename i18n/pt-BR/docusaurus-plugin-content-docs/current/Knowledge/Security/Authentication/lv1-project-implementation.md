---
id: login-lv1-project-implementation
title: '[Lv1] Como o mecanismo de login foi implementado em projetos anteriores?'
slug: /experience/login/lv1-project-implementation
tags: [Experience, Interview, Login, Lv1]
---

> Objetivo: explicar em 3 a 5 minutos "como o front-end lida com login, manutencao de estado e protecao de paginas", facilitando a lembranca rapida durante entrevistas.

---

## 1. Eixo principal da resposta na entrevista

1. **Tres fases do fluxo de login**: enviar formulario -> verificacao no back-end -> salvar Token e redirecionar.
2. **Gerenciamento de estado e Token**: Pinia com persistencia, Axios Interceptor anexa automaticamente o Bearer Token.
3. **Tratamento subsequente e protecao**: inicializar dados compartilhados, guardas de rota, logout e cenarios de excecao (OTP, alteracao forcada de senha).

Comece com esses tres pontos-chave e expanda os detalhes conforme necessario, para que o entrevistador perceba que voce possui uma visao geral.

---

## 2. Composicao do sistema e divisao de responsabilidades

| Modulo           | Localizacao                         | Funcao                                         |
| ---------------- | ----------------------------------- | ---------------------------------------------- |
| `authStore`      | `src/stores/authStore.ts`           | Armazena estado de login, persiste Token, fornece getters |
| `useAuth` Hook   | `src/common/hooks/useAuth.ts`       | Encapsula fluxo de login/logout, formato de retorno unificado |
| API de Login     | `src/api/login.ts`                  | Chama `POST /login`, `POST /logout` no back-end |
| Utilitario Axios | `src/common/utils/request.ts`       | Request/Response Interceptor, tratamento unificado de erros |
| Guarda de rota   | `src/router/index.ts`               | Verifica necessidade de login com base em `meta`, redireciona para pagina de login |
| Fluxo de inicializacao | `src/common/composables/useInit.ts` | Na inicializacao do App, verifica se ja existe Token, carrega dados necessarios |

> Mnemonica: **"Store gerencia estado, Hook gerencia fluxo, Interceptor gerencia canal, Guard gerencia paginas"**.

---

## 3. Fluxo de login (passo a passo)

### Step 0. Formulario e validacao previa

- Suporta dois metodos de login: senha convencional e codigo de verificacao SMS.
- Antes de enviar, realiza validacao basica (campos obrigatorios, formato, prevencao de envio duplicado).

### Step 1. Chamar API de login

```typescript
const { status, data, code } = await useApi(login, payload);
```

- `useApi` unifica tratamento de erros e gerenciamento de loading.
- Em caso de sucesso, `data` retorna o Token e informacoes essenciais do usuario.

### Step 2. Tratar resposta do back-end

| Cenario                                         | Comportamento                                           |
| ------------------------------------------------ | ------------------------------------------------------- |
| **Verificacao adicional necessaria** (ex: confirmacao de identidade no primeiro login) | Define `authStore.onBoarding` como `true`, redireciona para pagina de verificacao |
| **Alteracao forcada de senha**                   | Redireciona para fluxo de alteracao de senha conforme flag retornada, com parametros necessarios |
| **Sucesso normal**                               | Chama `authStore.$patch()` para salvar Token e informacoes do usuario |

### Step 3. Acoes compartilhadas apos login bem-sucedido

1. Obter dados basicos do usuario e lista de carteiras.
2. Inicializar conteudo personalizado (ex: lista de presentes, notificacoes).
3. Redirecionar para pagina interna conforme `redirect` ou rota predefinida.

> O login bem-sucedido e apenas metade do caminho. **Os dados compartilhados subsequentes devem ser carregados neste momento**, evitando que cada pagina faca chamadas de API separadamente.

---

## 4. Gerenciamento do ciclo de vida do Token

### 4.1 Estrategia de armazenamento

- `authStore` com `persist: true` ativado, grava campos-chave no `localStorage`.
- Vantagem: estado restaurado automaticamente apos recarregar a pagina; Desvantagem: necessario prestar atencao a XSS e seguranca.

### 4.2 Axios Request Interceptor

```typescript
if (needToken) {
  const { access_token } = auth.value;
  config.headers.Authorization = `Bearer ${access_token}`;
}
```

- APIs que requerem autorizacao incluem automaticamente o Bearer Token.
- Se a API marcar explicitamente `needToken: false` (login, registro, etc.), o processo de inclusao e ignorado.

### 4.3 Tratamento de expiracao e excecoes

- Se o back-end retornar Token expirado ou invalido, o Response Interceptor converte para mensagem de erro unificada e aciona o fluxo de logout.
- Para extensao, pode-se adicionar mecanismo de Refresh Token; o projeto atual adota estrategia simplificada.

---

## 5. Protecao de rotas e inicializacao

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
- Redireciona para pagina de login ou pagina publica designada quando nao autenticado.

### 5.2 Inicializacao da aplicacao

`useInit` trata na inicializacao do App:

1. Verifica se a URL contem `login_token` ou `platform_token`; se sim, faz login automatico ou configura o Token.
2. Se o Store ja possui Token, carrega informacoes do usuario e dados compartilhados.
3. Sem Token, permanece na pagina publica, aguardando login manual do usuario.

---

## 6. Fluxo de logout (finalizacao e limpeza)

1. Chama `POST /logout` para notificar o back-end.
2. Executa `reset()`:
   - `authStore.$reset()` limpa informacoes de login.
   - Stores relacionadas (informacoes do usuario, favoritos, codigos de convite, etc.) sao redefinidas.
3. Limpa cache do navegador (ex: cache no localStorage).
4. Redireciona para pagina de login ou pagina inicial.

> O logout e o espelho do login: nao basta apenas deletar o Token, e preciso garantir que todos os estados dependentes sejam limpos para evitar dados residuais.

---

## 7. Perguntas frequentes e melhores praticas

- **Separacao de fluxo**: login e inicializacao pos-login separados, mantendo o hook enxuto.
- **Tratamento de erros**: unificado via `useApi` e Response Interceptor, garantindo consistencia na UI.
- **Seguranca**:
  - HTTPS em todo o processo.
  - Ao armazenar Token no `localStorage`, operacoes sensiveis devem considerar XSS.
  - Considerar extensao para httpOnly Cookie ou Refresh Token conforme necessidade.
- **Plano de contingencia**: cenarios como OTP e alteracao forcada de senha mantem flexibilidade; o hook retorna o estado para a tela tratar.

---

## 8. Mnemonica rapida para entrevista

1. **"Entrada -> Verificacao -> Armazenamento -> Redirecionamento"**: descreva o fluxo geral nesta ordem.
2. **"Store registra estado, Interceptor ajuda com headers, Guard barra intrusos"**: destaque a divisao arquitetural.
3. **"Apos o login, carregue imediatamente os dados compartilhados"**: demonstre sensibilidade a experiencia do usuario.
4. **"Logout e reset com um clique + retorno a pagina segura"**: cubra seguranca e finalizacao do fluxo.
