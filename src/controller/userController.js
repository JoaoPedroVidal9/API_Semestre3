const connect = require("../db/connect");
module.exports = class userController {
  static async createUser(req, res) {
    const { cpf, email, password, name } = req.body;

    // Verifica se todos os campos estão preenchidos
    if (!cpf || !email || !password || !name) {
      return res.status(400).json({ error: "Todos os campos devem ser preenchidos" });
    }

    // Verifica se o CPF é numérico e tem exatamente 11 dígitos
    else if (isNaN(cpf) || cpf.length !== 11) {
      return res.status(400).json({ error: "CPF inválido. Deve conter exatamente 11 dígitos numéricos" });
    }

    // Verifica se o email contém o caractere @
    else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    }

    else {
      const query = `INSERT INTO user (cpf, password, email, name) VALUES ( 
        '${cpf}', 
        '${password}', 
        '${email}', 
        '${name}'
      )`;

      try {
        connect.query(query, function (err) {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') { 
              console.log("err.code")
              console.log(err)
              console.log('code')
              console.log(err.code)
              // Verifica se é um erro de chave primária duplicada
                return res.status(400).json({ error: "CPF já cadastrado" });
            } else {
                console.error(err);
                return res.status(500).json({ error: "Erro interno do servidor" });
            }
        }
        console.log("Inserido no Mysql");
        return res.status(201).json({ message: "Usuário criado com sucesso" });
        });
      } catch (error) {
        console.error("Erro ao executar a consulta:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    } 
  }

  static async postLogin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const query = `SELECT * FROM user WHERE email = '${email}' AND password = '${password}'`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "Credenciais inválidas" });
        }

        return res.status(200).json({ message: "Login realizado com sucesso", user: results[0] });
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

        return res.status(200).json({ message: "Obtendo todos os usuários", users: results });
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

        return res.status(200).json({ message: "Obtendo usuário com ID: " + userId, user: results[0] });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateUser(req, res) {
    const userId = req.params.id;
    const { cpf, email, password, name } = req.body;
    // Verifica se todos os campos estão preenchidos
    if (!cpf || !email || !password || !name) {
      return res.status(400).json({ error: "Todos os campos devem ser preenchidos" });
    }
    else
    {
    const query = `UPDATE user SET cpf = ?, email = ?, password = ?, name = ? WHERE cpf = ?`;
    const values = [cpf, email, password, name, userId];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res.status(200).json({ message: "Usuário atualizado com ID: " + userId });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  }
 
  static async deleteUser(req, res) {
    const userId = req.params.id;
    const query = `DELETE FROM user WHERE cpf = ?`;
    const values = [userId];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res.status(200).json({ message: "Usuário excluído com ID: " + userId });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};