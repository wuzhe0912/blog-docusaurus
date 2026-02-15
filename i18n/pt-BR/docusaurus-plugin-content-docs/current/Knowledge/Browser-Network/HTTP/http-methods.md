---
id: http-methods
title: "\U0001F4C4 Métodos HTTP"
slug: /http-methods
---

## 1. O que é a RESTful API?

Escrever uma RESTful API adota um conjunto padronizado de estilos de design para facilitar a comunicação entre diferentes sistemas na rede. Para seguir os princípios REST, a API deve ser previsível e fácil de entender. Como desenvolvedor frontend, o foco principal está nos seguintes três pontos:

- **Caminho da URL (URL path)**: Determina o escopo da requisição do cliente, por exemplo:
  - `/products`: Pode retornar uma lista de produtos
  - `/products/abc`: Fornece detalhes do produto com ID abc
- **Métodos HTTP**: Definem a forma específica de execução:
  - `GET`: Usado para obter dados
  - `POST`: Usado para criar novos dados
  - `PUT`: Usado para atualizar dados existentes
  - `DELETE`: Usado para excluir dados
- **Código de status (status code)**: Fornece uma indicação rápida sobre se a requisição foi bem-sucedida e, caso contrário, onde pode estar o problema. Os códigos de status comuns incluem:
  - `200`: Sucesso
  - `404`: Recurso solicitado não encontrado
  - `500`: Erro do servidor

## 2. Se o GET também pode transportar dados em uma requisição, por que devemos usar POST?

> Já que o `GET` também pode enviar requisições com dados, por que ainda precisamos usar o `POST`?

Principalmente baseado nestas quatro considerações:

1. Segurança: Como os dados do `GET` são anexados à URL, dados sensíveis ficam naturalmente expostos, enquanto o `POST` coloca os dados no `body` da requisição, o que é relativamente mais seguro.
2. Limite de tamanho dos dados: Com o `GET`, como navegadores e servidores têm limitações no comprimento da URL (embora varie ligeiramente entre navegadores, geralmente gira em torno de 2048 bytes), a quantidade de dados é limitada. Embora o `POST` nominalmente não tenha limite, na prática, para evitar ataques maliciosos com grandes volumes de dados, geralmente se utiliza algum middleware para limitar o tamanho dos dados, como o `body-parser` do `express`.
3. Clareza semântica: Garante que os desenvolvedores possam entender claramente o propósito da requisição. O `GET` é tipicamente usado para obter dados, enquanto o `POST` é mais adequado para criar ou atualizar dados.
4. Imutabilidade (Immutability): No protocolo HTTP, o método `GET` é projetado como "seguro" -- independentemente de quantas requisições sejam feitas, não há preocupação de que isso cause alterações nos dados do servidor.

## 3. O que o método PUT faz no HTTP?

> Qual é o propósito do método `PUT`?

Tem principalmente dois usos:

1. Atualizar dados que já existem (por exemplo, modificar informações de um usuário)
2. Se os dados não existirem, criar novos dados

### Example

```js
const axios = require('axios');

async function updateUser(userId, newName) {
  const url = `https://api.example.com/users/${userId}`; // api URL
  const data = {
    name: newName,
  };

  try {
    const response = await axios.put(url, data); // Executa a requisição PUT
    console.log('User updated:', response.data); // Exibe as informações do usuário atualizadas
  } catch (error) {
    console.log('Error updating user:', error); // Exibe a mensagem de erro
  }
}

updateUser(1, 'Pitt Wu');
```
