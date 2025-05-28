const connect = require("../db/connect");
const jwt = require("jsonwebtoken")
const validateUser = require("../services/validateUser");
const validateCpf = require("../services/validateCpf");

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

      const query = `call cadastro_user('?', '?', '?', '?');`;

      const values = [cpf, name, email, password]

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

        const token = jwt.sign(
          {cpf: cpf}, 
          process.env.SECRET, 
          {expiresIn: "1h",}
        )

        return res.status(201).json({
          message: "Usuário criado com sucesso",
          token,
          
        })
       
      });
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async postLogin(req, res) {
    const { cpf, password } = req.body;

    if (!cpf || !password) {
      return res.status(400).json({ error: "CPF e senha são obrigatórios" });
    }

    const query = `SELECT * FROM user WHERE cpf = ? AND password = ?`;

    const values = [cpf, password]

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

        const token = jwt.sign(
          {cpf: cpf}, 
          process.env.SECRET, 
          {expiresIn: "1h",}
        )
        
        // remove um atributo de um objeto (password removido antes de retornar a requisição)
        delete user.password

        return res.status(200).json({
          message: "login bem-sucedido",
          user,
          token
        })

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

        return res
          .status(200)
          .json({
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
    const { cpf, email, password, name } = req.body;

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
      connect.query(
        query,
        [cpf, email, password, name, userId],
        (err, results) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              return res.status(400).json({ error: "Email já cadastrado" });
            }
            if (err.code === "ER_ROW_IS_REFERENCED_2"){
              return res.status(400).json({error:"Não é possível atualizar o CPF do usuário, pois ele tem reservas registradas."});
            }
            return res.status(500).json({ error: "Erro interno do servidor: "+err.code });
          }
          if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Usuário não encontrado" });
          }
          return res
            .status(200)
            .json({ message: "Usuário atualizado com sucesso" });
        }
      );
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor: " + error  });
    }
  }

  static async deleteUser(req, res) {
    const userId = req.params.id;
    const query = `CALL deletar_user('?', @resultado)`;

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
