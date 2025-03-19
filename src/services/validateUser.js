module.exports = function validateUser({
  cpf,
  email,
  password,
  password2,
  name
}) {
  if (!cpf || !email || !password || !password2 || !name) {
    return { error: "Todos os campos devem ser preenchidos" };
  }

  if (isNaN(cpf) || cpf.length !== 11) {
    return {
      error: "CPF inválido. Deve conter exatamente 11 dígitos numéricos",
    };
  }

  if (!email.includes("@")) {
    return { error: "Email inválido. Deve conter @" };
  }

  if(password !== password2){
    return { error: "As senhas devem ser idênticas" }
  }

  return null; // Retorna null se não houver erro
};