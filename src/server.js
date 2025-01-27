const app = require("./index");
const cors = require('cors');

// Configuração do CORS com origens permitidas
const corsOptions = {
  origin: '*', // IP de origens permitidas
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.listen(5000);