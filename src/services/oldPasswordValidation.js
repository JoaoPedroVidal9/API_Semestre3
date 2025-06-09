const connect = require("../db/connect");
const bcrypt = require("bcrypt");

module.exports = async function oldPasswordValidation(
  { password, password2, oldPassword },
  userId
) {
  console.log(password, ", ", password2, ", ", oldPassword, ",", userId);

  if (!oldPassword) {
    return { error: "Preencha o campo da senha atual" };
  }

  const query = `SELECT password FROM user WHERE cpf = ?`;

  const results = await new Promise((resolve, reject) => {
    connect.query(query, [userId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });

  if (!results || results.length === 0) {
    return { error: "Usuário não encontrado" };
  }

  const comparatividade = bcrypt.compareSync(
    oldPassword,
    results[0].password
  );

  if (!comparatividade) {
    return { error: "Senha Incorreta" };
  } else {
    if (!password && !password2) {
      return { result: "put_sem_senha" };
    } else if (!password || !password2) {
      return {
        error: "Insira uma senha nos dois campos de senha nova",
      };
    } else {
      if (password !== password2) {
        return {
          error: "Insira a mesma senha nos dois campos de senha nova",
        };
      }
      if (password === oldPassword) {
        return {
          error: "Coloque uma senha diferente da atual nos campos de senha nova",
        };
      }
      return { result: "put_com_senha" };
    }
  }
};