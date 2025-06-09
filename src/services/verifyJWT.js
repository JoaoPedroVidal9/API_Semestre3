const jwt = require("jsonwebtoken")

function verifyJWT(req, res, next) {
    const token = req.headers["authorization"]

    if(!token) {
        return res.status(401).json({
            auth: false,
            error:"Token não fornecido"
        })
    }

    jwt.verify(token, process.env.SECRET, (err, decoded)=>{
        if(err) {
            return res.status(403).json({auth: false, error: "Falha na autenticação do Token"})
        }

        req.userId = decoded.cpf
        next()
    })
}

module.exports = verifyJWT