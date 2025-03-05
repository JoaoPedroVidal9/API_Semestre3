# Projeto Base - API Node.js

Este repositório fornece a estrutura inicial para uma API de gerenciamento de reserva de salas de aula. Ele foi desenvolvido para servir como base para o projeto dos alunos.

## Objetivo da Sprint

- Implementar serviços para reaproveitamento de código (Clean Code).
- Refatorar o código, separando lógicas repetidas e criando serviços reutilizáveis.
- Criar a base para a API de reserva de salas de aula com autenticação de usuários e controle de agendamentos.

## Instalação do Projeto Base

1. Clone o repositório:
   ```sh
   git clone https://github.com/EullerF/codigoProjetoBaseAlunos2025.git
   cd codigoProjetoBaseAlunos2025

2. Instale as dependências:
   ```sh
   npm i

3. Crie o banco de dados. O modelo do banco de dados está disponível no arquivo mysql-init/init.sql na raiz do projeto. Certifique-se de criar o banco de dados antes de rodar o projeto.

4. Configure a conexão com o banco de dados. No arquivo connect.js, ajuste as configurações de conexão com o seu banco de dados:

<!--
const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'db', // IP ou localhost
  user: 'root', // Seu usuário do MySQL
  password: '?', // Sua senha do MySQL
  database: 'test' // Nome do banco de dados
});

module.exports = pool;
-->

## Rotas da API

### User Routes
- **POST /user/**: Cria um novo usuário.
- **POST /user/login**: Realiza login de um usuário.
- **GET /user/**: Obtém todos os usuários.
- **GET /user/:id**: Obtém um usuário pelo ID.
- **PUT /user/:id**: Atualiza os dados de um usuário.
- **DELETE /user/:id**: Deleta um usuário.

### Classroom Routes
- **POST /classroom/**: Cria uma nova sala de aula.
- **GET /classroom/**: Obtém todas as salas de aula.
- **GET /classroom/:number**: Obtém uma sala de aula pelo número.
- **PUT /classroom/**: Atualiza uma sala de aula.
- **DELETE /classroom/:number**: Deleta uma sala de aula.

### Schedule Routes
- **POST /schedule/**: Cria um novo agendamento.
- **GET /schedule/**: Obtém todos os agendamentos.
- **GET /schedule/:id**: Obtém os agendamentos de uma sala de aula específica pelo ID.
- **GET /schedule/ranges/:id**: Obtém os agendamentos de uma sala de aula específica em intervalos de tempo.
- **DELETE /schedule/:id**: Deleta um agendamento.
