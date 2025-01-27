const express = require('express')
const cors = require('cors');
const testConnect = require('./db/testeConnect')

class AppController {
    constructor() {
      this.express = express();
      this.middlewares();
      this.routes();
      testConnect();
    }

    middlewares() {
      this.express.use(express.json());
      this.express.use(cors());
    }

    routes() {
      const apiRoutes= require('./routes/apiRoutes');
      this.express.use('/api/reservas/v1/', apiRoutes);
    }
  }

  module.exports = new AppController().express;