const connect = require("../db/connect");
module.exports = class classroomController {
  static async createClassroom(req, res) {
    const { number, description, capacity } = req.body;

    // Verifica se todos os campos estão preenchidos
    if (!number || !description || !capacity) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    // Caso todos os campos estejam preenchidos, realiza a inserção na tabela
    const query = `INSERT INTO classroom (number, description, capacity) VALUES ( 
        '${number}', 
        '${description}', 
        '${capacity}'
      )`;

    try {
      connect.query(query, function (err) {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Erro ao cadastrar sala" });
          return;
        }
        console.log("Sala cadastrada com sucesso");
        res.status(201).json({ message: "Sala cadastrada com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getAllClassrooms(req, res) {
    try {
      const query = "SELECT * FROM classroom";
      connect.query(query, function (err, result) {
        if (err) {
          console.error("Erro ao obter salas:", err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        console.log("Salas obtidas com sucesso");
        res.status(200).json({ classrooms: result });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getClassroomById(req, res) {
    const classroomId = req.params.number;

    try {
      const query = `SELECT * FROM classroom WHERE number = '${classroomId}'`;
      connect.query(query, function (err, result) {
        if (err) {
          console.error("Erro ao obter sala:", err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (result.length === 0) {
          return res.status(404).json({ error: "Sala não encontrada" });
        }

        console.log("Sala obtida com sucesso");
        res.status(200).json({
          message: "Obtendo a sala com ID: " + classroomId,
          classroom: result[0],
        });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateClassroom(req, res) {
    const { number, description, capacity } = req.body;

    // Validar campos obrigatórios
    if (!number || !description || !capacity) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    try {
      // Verificar se a sala existe
      const findQuery = `SELECT * FROM classroom WHERE number = ?`;
      connect.query(findQuery, [number], function (err, result) {
        if (err) {
          console.error("Erro ao buscar a sala:", err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (result.length === 0) {
          return res.status(404).json({ error: "Sala não encontrada" });
        }

        // Atualizar a sala
        const updateQuery = `
              UPDATE classroom 
              SET description = ?, capacity = ?
              WHERE number = ?
          `;
        connect.query(
          updateQuery,
          [description, capacity, number],
          function (err) {
            if (err) {
              console.error("Erro ao atualizar a sala:", err);
              return res
                .status(500)
                .json({ error: "Erro interno do servidor" });
            }

            console.log("Sala atualizada com sucesso");
            res.status(200).json({ message: "Sala atualizada com sucesso" });
          }
        );
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async deleteClassroom(req, res) {
    const classroomId = req.params.number;
    try {
      // Verificar se há reservas associadas à sala
      const checkReservationsQuery = `SELECT * FROM schedule WHERE classroom = ?`;
      connect.query(
        checkReservationsQuery,
        [classroomId],
        function (err, reservations) {
          if (err) {
            console.error("Erro ao verificar reservas:", err);
            return res.status(500).json({ error: "Erro interno do servidor" });
          }

          // Verificar se existem reservas associadas
          if (reservations.length > 0) {
            // Impedir exclusão e retornar erro
            return res
              .status(400)
              .json({
                error:
                  "Não é possível excluir a sala, pois há reservas associadas.",
              });
          } else {
            // Deletar a sala de aula
            const deleteQuery = `DELETE FROM classroom WHERE number = ?`;
            connect.query(deleteQuery, [classroomId], function (err, result) {
              if (err) {
                console.error("Erro ao deletar a sala:", err);
                return res
                  .status(500)
                  .json({ error: "Erro ao deletar a sala" });
              }

              if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Sala não encontrada" });
              }

              console.log("Sala deletada com sucesso");
              res.status(200).json({ message: "Sala excluída com sucesso" });
            });
          }
        }
      );
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
