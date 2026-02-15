---
id: network-protocols
title: "\U0001F4C4 Protocolos de Rede"
slug: /network-protocols
---

## 1. Descreva TCP, HTTP, HTTPS e WebSocket

1. **TCP (Transmission Control Protocol)**:
   TCP é um protocolo confiável e orientado a conexão, usado para transmitir dados de forma confiável entre dois computadores na internet. Ele garante a ordem e a confiabilidade dos pacotes de dados -- isso significa que, independentemente das condições da rede, os dados chegarão ao destino intactos.

2. **HTTP (Hypertext Transfer Protocol)**:
   HTTP é o protocolo usado para transmitir hipertexto (ou seja, páginas web). Ele é construído sobre o protocolo TCP e fornece uma forma para navegadores e servidores se comunicarem. O HTTP é stateless (sem estado), o que significa que o servidor não salva nenhuma informação sobre o usuário.

3. **HTTPS (Hypertext Transfer Protocol Secure)**:
   HTTPS é a versão segura do HTTP. Ele criptografa a transmissão de dados HTTP através do protocolo SSL/TLS, protegendo a segurança dos dados trocados e prevenindo ataques man-in-the-middle, garantindo assim a privacidade e integridade dos dados.

4. **WebSocket**:
   O protocolo WebSocket fornece uma maneira de estabelecer uma conexão persistente entre o cliente e o servidor, permitindo que ambas as partes realizem transmissão de dados bidirecional em tempo real após a conexão ser estabelecida. Isso difere das requisições HTTP tradicionais, onde cada transmissão requer o estabelecimento de uma nova conexão. O WebSocket é mais adequado para comunicação instantânea e aplicações que necessitam de atualizações rápidas de dados.

## 2. O que é Three Way Handshake?

O Three Way Handshake (aperto de mão de três vias) refere-se ao processo de estabelecimento de conexão entre o servidor e o cliente em uma rede `TCP/IP`. Durante o processo, há três etapas para confirmar que as capacidades de envio e recebimento de ambas as partes estão normais, e também para sincronizar e garantir a segurança dos dados através do número de sequência inicial (ISN).

### Tipos de Mensagem TCP

Antes de entender as etapas, é necessário compreender a função principal de cada tipo de mensagem:

| Mensagem | Descrição                                                                    |
| -------- | ---------------------------------------------------------------------------- |
| SYN      | Usado para iniciar e estabelecer conexão, e também para sincronizar números de sequência entre dispositivos |
| ACK      | Usado para confirmar ao outro lado que o SYN foi recebido                    |
| SYN-ACK  | Confirmação de sincronização, envia o próprio SYN e também um ACK           |
| FIN      | Encerrar a conexão                                                           |

### Etapas

1. O cliente inicia a conexão com o servidor e envia uma mensagem SYN, informando ao servidor que está pronto para começar a comunicação e qual é o número de sequência que está enviando.
2. Após receber a mensagem SYN, o servidor prepara a resposta para o cliente, incrementa o número de sequência SYN recebido em +1 e o envia de volta via ACK, ao mesmo tempo que também envia sua própria mensagem SYN.
3. O cliente confirma que o servidor respondeu, ambas as partes estabeleceram uma conexão estável e começam a transmitir dados.

### Example

O Host A envia um pacote TCP SYN ao servidor, que contém um número de sequência aleatório, aqui assumimos como 1000.

```bash
Host A ===(SYN=1000)===> Server
```

O servidor precisa responder ao número de sequência fornecido pelo Host A, então incrementa o número de sequência em +1 e também envia seu próprio SYN.

```bash
Host A <===(SYN=2000 ACK=1001)=== Server
```

Após receber o SYN do servidor, o Host A precisa enviar um número de sequência de confirmação em resposta, então incrementa o número de sequência do servidor em +1.

```bash
Host A ===(ACK=2001)===> Server
```

### Duas etapas de handshake seriam suficientes?

1. O propósito do three-way handshake é confirmar que as capacidades de envio e recebimento de ambos os lados, cliente e servidor, estão normais. Se houvesse apenas duas etapas, o servidor não conseguiria verificar a capacidade de recebimento do cliente.
2. Devido à falta da terceira etapa, o cliente não receberia o número de sequência do servidor e, naturalmente, não poderia enviar confirmação, o que poderia comprometer a segurança dos dados.
3. Em ambientes de rede fraca, o tempo de chegada dos dados pode variar. Se dados novos e antigos chegarem fora de ordem e uma conexão for estabelecida sem a confirmação SYN da terceira etapa, erros de rede podem ocorrer.

### O que é ISN?

ISN significa Initial Sequence Number (Número de Sequência Inicial), usado para informar ao receptor qual é o número de sequência que o remetente usará ao enviar dados. Trata-se de um número de sequência gerado aleatoriamente de forma dinâmica, para evitar que terceiros invasores adivinhem e consigam forjar mensagens.

### Em que momento do three-way handshake a transmissão de dados começa?

O propósito do primeiro e do segundo handshake é confirmar as capacidades de envio e recebimento de ambas as partes, e não podem transmitir dados. Se fosse possível transmitir dados já no primeiro handshake, terceiros maliciosos poderiam enviar grandes volumes de dados falsos, forçando o servidor a consumir espaço de memória para cache, criando uma oportunidade de ataque.

Somente no terceiro handshake, quando ambas as partes já confirmaram a sincronização e estão em estado de conexão, é que a transmissão de dados é permitida.

### Reference

- [TCP 3-Way Handshake (SYN, SYN-ACK,ACK)](https://www.guru99.com/tcp-3-way-handshake.html)
- [淘宝二面，面试官居然把 TCP 三次握手问的这么详细](https://www.eet-china.com/mp/a44399.html)

## 3. Descreva o mecanismo de cache HTTP

O mecanismo de cache HTTP é uma técnica no protocolo HTTP usada para armazenar temporariamente (ou "cachear") dados de páginas web, com o objetivo de reduzir a carga do servidor, diminuir a latência e melhorar a velocidade de carregamento das páginas. Existem várias estratégias principais de cache:

1. **Cache forte (Freshness)**: Ao definir os headers de resposta `Expires` ou `Cache-Control: max-age`, indica que os dados podem ser considerados frescos dentro de um período específico, e o cliente pode usá-los diretamente sem precisar confirmar com o servidor.

2. **Cache de validação (Validation)**: Usando os headers de resposta `Last-Modified` e `ETag`, o cliente pode enviar uma requisição condicional ao servidor. Se os dados não foram modificados, retorna o código de status 304 (Not Modified), indicando que os dados em cache local podem ser usados.

3. **Cache de negociação (Negotiation)**: Este método depende do header de resposta `Vary`. O servidor decide se fornece diferentes versões do conteúdo em cache com base na requisição do cliente (como `Accept-Language`).

4. **Sem cache (No-store)**: Se `Cache-Control: no-store` estiver definido, indica que os dados não devem ser cacheados, e cada requisição precisa obter os dados mais recentes do servidor.

A escolha da estratégia de cache é determinada por fatores como o tipo de dados e a frequência de atualização. Uma estratégia de cache eficaz pode melhorar significativamente a performance de aplicações web.

### Service Worker

Na minha experiência pessoal, após configurar o PWA para uma Web App, é possível registrar no service-worker.js alguns estilos básicos, o logo, e até preparar um offline.html para uso offline. Dessa forma, mesmo quando o cliente estiver desconectado, através desse mecanismo de cache, é possível informar sobre o estado atual do site ou da rede, mantendo um certo nível de experiência do usuário.
