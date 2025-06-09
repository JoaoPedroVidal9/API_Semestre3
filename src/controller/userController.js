const connect = require("../db/connect");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
const validateUser = require("../services/validateUser");
const validateCpf = require("../services/validateCpf");
const oldPasswordValidation = require("../services/oldPasswordValidation");

async function CheckServiceSenha(corpo, id) {
  return passwordResponse;
}

module.exports = class userController {
  static async createUser(req, res) {
    const { cpf, email, password, name } = req.body;

    const validationError = validateUser(req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    try {
      const cpfError = await validateCpf(cpf);
      if (cpfError) {
        return res.status(400).json(cpfError);
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const query = `call cadastro_user(?, ?, ?, ?);`;

      const values = [cpf, name, email, hashedPassword];

      connect.query(query, values, (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            if (err.sqlMessage.includes("email")) {
              return res.status(400).json({ error: "Email já cadastrado" });
            }
          } else {
            console.error(err);
            return res.status(500).json({ error: "Erro interno do servidor" });
          }
        }

        const token = jwt.sign({ cpf: cpf }, process.env.SECRET, {
          expiresIn: "1h",
        });

        return res.status(201).json({
          message: "Usuário criado com sucesso",
          token,
        });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async postLogin(req, res) {
    const { cpf, password } = req.body;

    if (!cpf || !password) {
      return res.status(400).json({ error: "CPF e senha são obrigatórios" });
    }

    const query = `SELECT * FROM user WHERE cpf = ?`;

    const values = [cpf];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "Credenciais inválidas" });
        }

        const user = results[0];

        const passwordOK = bcrypt.compareSync(password, user.password);
        if (!passwordOK) {
          return res.status(403).json({ error: "Senha Incorreta" });
        }

        const token = jwt.sign({ cpf: cpf }, process.env.SECRET, {
          expiresIn: "1h",
        });

        // remove um atributo de um objeto (password removido antes de retornar a requisição)
        delete user.password;

        return res.status(200).json({
          message: "Login bem-sucedido",
          user,
          token,
        });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getAllUsers(req, res) {
    const query = `SELECT * FROM user`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        return res
          .status(200)
          .json({ message: "Obtendo todos os usuários", users: results });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getUserById(req, res) {
    const userId = req.params.id;
    const query = `SELECT * FROM user WHERE cpf = ?`;
    const values = [userId];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }

        delete results[0].password;

        return res.status(200).json({
          message: "Obtendo usuário com ID: " + userId,
          user: results[0],
        });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateUser(req, res) {
    const userId = req.params.id;
    const idCorreto = req.userId;
    const { cpf, email, password, oldPassword, name } = req.body;

    console.log(idCorreto);
    console.log(userId);
    if (idCorreto !== userId) {
      return res
        .status(400)
        .json({ error: "Você não tem permissão de atualizar esta conta" });
    }
    const passwordResponse = await oldPasswordValidation(req.body, userId);
    console.log(passwordResponse);
    if (passwordResponse.result === "put_com_senha") {
      const validationError = validateUser(req.body);
      if (validationError) {
        return res.status(400).json(validationError);
      }

      try {
        const cpfError = await validateCpf(cpf, userId);
        if (cpfError) {
          return res.status(400).json(cpfError);
        }
        const query =
          "UPDATE user SET cpf = ?, email = ?, password = ?, name = ? WHERE cpf = ?";

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        connect.query(
          query,
          [cpf, email, hashedPassword, name, userId],
          (err, results) => {
            if (err) {
              if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ error: "Dados já cadastrados" });
              }
              if (err.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(400).json({
                  error:
                    "Não é possível atualizar o CPF do usuário, pois ele tem reservas registradas.",
                });
              }
              return res
                .status(500)
                .json({ error: "Erro interno do servidor: " + err.code });
            }
            if (results.affectedRows === 0) {
              return res.status(404).json({ error: "Usuário não encontrado" });
            }

            const token = jwt.sign({ cpf: cpf }, process.env.SECRET, {
              expiresIn: "1h",
            });
            return res
              .status(200)
              .json({
                message: "Usuário atualizado com sucesso",
                token: token,
              });
          }
        );
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Erro interno do servidor: " + error });
      }
    } else if (passwordResponse.result === "put_sem_senha") {
      try {
        const cpfError = await validateCpf(cpf, userId);
        if (cpfError) {
          return res.status(400).json(cpfError);
        }
        const query =
          "UPDATE user SET cpf = ?, email = ?, password = ?, name = ? WHERE cpf = ?";

        console.log(query, userId);
        const oldHashed = await bcrypt.hash(oldPassword, SALT_ROUNDS);
        connect.query(
          query,
          [cpf, email, oldHashed, name, userId],
          (err, results) => {
            if (err) {
              if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ error: "Dados já cadastrados" });
              }
              if (err.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(400).json({
                  error:
                    "Não é possível atualizar o CPF do usuário, pois ele tem reservas registradas.",
                });
              }
              return res
                .status(500)
                .json({ error: "Erro interno do servidor: " + err.code });
            }
            if (results.affectedRows === 0) {
              return res.status(404).json({ error: "Usuário não encontrado" });
            }

            const token = jwt.sign({ cpf: cpf }, process.env.SECRET, {
              expiresIn: "1h",
            });

            return res
              .status(200)
              .json({
                message: "Usuário atualizado com sucesso",
                token: token,
              });
          }
        );
      } catch (error) {
        return res
          .status(500)
          .json({ error: "Erro interno do servidor: " + error });
      }
    } else {
      return res.status(400).json(passwordResponse);
    }
  }

  static async deleteUser(req, res) {
    const userId = req.params.id;
    const idCorreto = req.userId;

    console.log(idCorreto);
    console.log(userId);

    if (idCorreto !== userId) {
      return res
        .status(400)
        .json({ error: "Você não tem permissão de apagar esta conta" });
    }

    const query = `CALL deletar_user(?, @resultado)`;

    try {
      connect.query(query, [userId], function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res
          .status(200)
          .json({ message: "Usuário excluído com ID: " + userId });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
