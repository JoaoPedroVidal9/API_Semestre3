# Projeto Base - API Node.js

Este repositório fornece a estrutura da API de gerenciamento de reserva de salas de aula do grupo de João Pedro Vidal, Pedro Bonini, e Guilherme Negrijo.

## Objetivo da Sprint

- Implantação da api via Docker. 
- Criar serviços baseados em PROCEDURES, FUCTIONS e TRIGGERS.

## Instalação do Projeto

1. Clone o repositório:
   ```sh
   git clone https://github.com/JoaoPedroVidal9/API_Semestre3.git
   cd API_Semestre3

2. Rode o Docker para simular a API e o Banco de Dados (Docker Necessário):

   ```sh
   docker-compose up --build
   ```

3. Caso não use Docker:

Instale as dependências:

   ```sh
   npm i
   ```

4. Configure a conexão com o banco de dados. Crie o arquivo .env e ajuste as configurações de conexão pelas variáveis de ambiente:

```sh
SECRET= Chave_Secreta
DB_HOST= banco
DB_USER= root
DB_PASSWORD= root
DB_NAME= semestre3
```

5. Adendo: Como criar um backup a partir do Docker:

- Abra um Terminal de Comando novo, acesse a pasta em que você deseja guardar o backup e execute o seguinte comando:

   ```sh
   "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe" -u root -p semestre3 > init.sql


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
- **POST /schedule/ranges**: Obtém os horários agendados para uma sala específica
- **POST /schedule/available**: Obtém os horários livres de agendamento para uma sala específica.
- **POST /schedule/days**: Processa as datas fornecidas no cadastro da reserva para disponibilizar a escolha de dias da semana.
- **DELETE /schedule/:id**: Deleta um agendamento.
