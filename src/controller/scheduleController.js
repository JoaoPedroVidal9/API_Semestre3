const connect = require("../db/connect");
const splitDays = require("../services/splitDays");

// Verificar se o horário de início de um agendamento está dentro de um intervalo de tempo
function isInTimeRange(timeStart, timeRange) {
  const [start, end] = timeRange.split(" - ");
  const startTime = new Date(`1970-01-01T${start}`).getTime();
  const endTime = new Date(`1970-01-01T${end}`).getTime();
  const scheduleTime = new Date(`1970-01-01T${timeStart}`).getTime();
  return scheduleTime >= startTime && scheduleTime < endTime;
}

module.exports = class scheduleController {
  static async createSchedule(req, res) {
    const { dateStart, dateEnd, days, user, classroom, timeStart, timeEnd } =
      req.body;

    // Converte horário no formato "HH:MM" para minutos
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    // Verificar se todos os campos estão preenchidos
    if (
      !dateStart ||
      !dateEnd ||
      !days ||
      !user ||
      !classroom ||
      !timeStart ||
      !timeEnd
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (dateStart > dateEnd) {
      return res.status(400).json({ error: "Coloque datas válidas" });
    } else if (timeToMinutes(timeStart) >= timeToMinutes(timeEnd)) {
      return res.status(400).json({ error: "Coloque horários válidos" });
    }

    // Converter o array days em uma string separada por vírgulas
    const daysString = days.map((day) => `${day}`).join(", ");

    // Verificar se o tempo está dentro do intervalo permitido
    const isWithinTimeRange = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes;
      return (
        (totalMinutes >= 7.5 * 60 && totalMinutes <= 11.5 * 60) ||
        (totalMinutes >= 12.5 * 60 && totalMinutes <= 23 * 60)
      );
    };

    // Verificar se o tempo de início e término está dentro do intervalo permitido
    if (!isWithinTimeRange(timeStart) || !isWithinTimeRange(timeEnd)) {
      return res.status(400).json({
        error:
          "A sala de aula só pode ser reservada dentro do intervalo de 7:30 às 11:30 e 12:30 às 23:00",
      });
    }

    try {
      const overlapQuery = `
    SELECT * FROM schedule
    WHERE 
        classroom = '${classroom}'
        AND (
            (dateStart <= '${dateEnd}' AND dateEnd >= '${dateStart}')
        )
        AND (
            (timeStart <= '${timeEnd}' AND timeEnd >= '${timeStart}')
        )
        AND (
            (days LIKE '%Seg%' AND '${daysString}' LIKE '%Seg%') OR
            (days LIKE '%Ter%' AND '${daysString}' LIKE '%Ter%') OR
            (days LIKE '%Qua%' AND '${daysString}' LIKE '%Qua%') OR 
            (days LIKE '%Qui%' AND '${daysString}' LIKE '%Qui%') OR
            (days LIKE '%Sex%' AND '${daysString}' LIKE '%Sex%') OR
            (days LIKE '%Sab%' AND '${daysString}' LIKE '%Sab%')
        )`;

      connect.query(overlapQuery, function (err, results) {
        if (err) {
          return res
            .status(500)
            .json({ error: "Erro ao verificar agendamento existente" });
        }

        // Se a consulta retornar algum resultado, significa que já existe um agendamento
        if (results.length > 0) {
          return res.status(400).json({
            error:
              "Já existe um agendamento para os mesmos dias, sala e horários",
          });
        }

        // Caso contrário, prossegue com a inserção na tabela
        const insertQuery = `CALL cadastro_schedule(?, ?, ?, ?, ?, ?, ?);`;
        const values = [
          dateStart,
          dateEnd,
          timeStart,
          timeEnd,
          daysString,
          user,
          classroom,
        ];

        // Executa a consulta de inserção
        connect.query(insertQuery, values, function (err) {
          if (err) {
            if (err.code === "ER_NO_REFERENCED_ROW_2") {
              return res.status(404).json({ error: "Sala não encontrada" });
            }
            console.error(err);
            return res
              .status(500)
              .json({ error: "Erro ao cadastrar agendamento" });
          }
          return res
            .status(201)
            .json({ message: "Agendamento cadastrado com sucesso" });
        });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getAllSchedules(req, res) {
    try {
      // Consulta SQL para obter todos os agendamentos
      const query = `
      SELECT schedule.*, user.name AS userName
      FROM schedule
      JOIN user ON schedule.user = user.cpf
    `;

      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        // Objeto para armazenar os agendamentos organizados por dia da semana
        const schedulesByDay = splitDays(results);
        return res.status(200).json({ schedulesByDay });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getSchedulesByIdUser(req, res) {
    const idUser = req.params.id;

    const query = `select *, calcula_user_reserva(?) as contagem from schedule where user = ?`;
    const values = [idUser, idUser];
    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        let contagem = 0;
        try {
          if (results.length < 1) {
            return res
              .status(200)
              .json({ message: "Nenhuma reserva para este usuário", results: [], contagem : 0 });
          }
          contagem = results[0].contagem;
        } catch (err) {
          console.error(err);
          return res
            .status(404)
            .json({ error: "Nenhuma reserva para este usuário" });
        }
        const resultados = results;
        return res.status(200).json({
          message: `Reservas recuperadas com sucesso`,
          results: resultados,
          contagem: contagem,
        });
      });
    } catch (err) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getSchedulesByIdClassroom(req, res) {
    const classroomID = req.params.id;

    // Consulta SQL para obter todos os agendamentos para uma determinada sala de aula
    const query = `
  SELECT schedule.*, user.name AS userName
  FROM schedule
  JOIN user ON schedule.user = user.cpf
  WHERE classroom = '${classroomID}'
`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        // Objeto para armazenar os agendamentos organizados por dia da semana
        const schedulesByDay = splitDays(results);
        return res.status(200).json({ schedulesByDay });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async postSchedulesByIdClassroomRanges(req, res) {
    const { weekStart, weekEnd, classroomID } = req.body; // Variavel para armazenar o dia de início e dia de fim
    // Consulta SQL para obter todos os agendamentos para uma determinada sala de aula

    if (!weekStart || !weekEnd || !classroomID) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    if (weekStart > weekEnd) {
      return res.status(400).json({ error: "Coloque datas validas" });
    }

    const query = `
    SELECT schedule.*, user.name AS userName
    FROM schedule
    JOIN user ON schedule.user = user.cpf
    WHERE classroom = '${classroomID}'
    AND (dateStart <= '${weekEnd}' AND dateEnd >= '${weekStart}')`;

    try {
      // Executa a consulta
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        // Objeto para armazenar os agendamentos organizados por dia da semana e intervalo de horário
        const schedulesByDayAndTimeRange = {
          Seg: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
          Ter: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
          Qua: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
          Qui: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
          Sex: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
          Sab: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
        };

        // Organiza os agendamentos pelos dias da semana e intervalo de horário
        results.forEach((schedule) => {
          const days = schedule.days.split(", ");
          const timeRanges = [
            "07:30 - 09:30",
            "09:30 - 11:30",
            "12:30 - 15:30",
            "15:30 - 17:30",
            "19:00 - 22:00",
          ];
          days.forEach((day) => {
            timeRanges.forEach((timeRange) => {
              if (isInTimeRange(schedule.timeStart, timeRange)) {
                schedulesByDayAndTimeRange[day][timeRange].push(schedule);
              }
            });
          });
        });

        // Ordena os agendamentos dentro de cada lista com base no timeStart
        Object.keys(schedulesByDayAndTimeRange).forEach((day) => {
          Object.keys(schedulesByDayAndTimeRange[day]).forEach((timeRange) => {
            schedulesByDayAndTimeRange[day][timeRange].sort((a, b) => {
              const timeStartA = new Date(`1970-01-01T${a.timeStart}`);
              const timeStartB = new Date(`1970-01-01T${b.timeStart}`);
              return timeStartA - timeStartB;
            });
          });
        });

        // Retorna os agendamentos organizados por dia da semana e intervalo de horário
        return res.status(200).json({ schedulesByDayAndTimeRange });
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async postSchedulesByIdClassroomRangesAvailable(req, res) {
    const { weekStart, weekEnd, classroomID } = req.body;

    if (!weekStart || !weekEnd || !classroomID) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    const startDate = new Date(weekStart);
    const endDate = new Date(weekEnd);

    if (startDate > endDate) {
      return res.status(400).json({
        error: "Coloque datas válidas (início deve ser antes do fim).",
      });
    }

    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays != 6) {
      return res.status(400).json({
        error:
        "Selecione um intervalo de uma semana (Ex.: Seg a Dom).",
      });
    }

    try {
      const classroomQuery = `SELECT 1 FROM classroom WHERE number = ?`;
      connect.query(classroomQuery, [classroomID], function (err, results) {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "Erro ao verificar a sala no banco de dados" });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ error: "Sala não encontrada no banco de dados" });
        }

        // Consulta os agendamentos da sala
        const scheduleQuery = `
          SELECT schedule.*
          FROM schedule
          WHERE classroom = ?
          AND (dateStart <= ? AND dateEnd >= ?)
        `;

        connect.query(
          scheduleQuery,
          [classroomID, weekEnd, weekStart],
          function (err, results) {
            if (err) {
              console.error(err);
              return res
                .status(500)
                .json({ error: "Erro interno do servidor" });
            }

            const allTimeRanges = [
              "07:30 - 09:30",
              "09:30 - 11:30",
              "12:30 - 15:30",
              "15:30 - 17:30",
              "19:00 - 22:00",
            ];

            const available = {
              Seg: [...allTimeRanges],
              Ter: [...allTimeRanges],
              Qua: [...allTimeRanges],
              Qui: [...allTimeRanges],
              Sex: [...allTimeRanges],
              Sab: [...allTimeRanges],
            };

            results.forEach((schedule) => {
              // Separa os dias do agendamento (ex: "Seg, Qua" → ["Seg", "Qua"])
              const days = schedule.days.split(", ");

              // Percorre todas as faixas de horários padrão
              allTimeRanges.forEach((timeRange) => {
                // Verifica se o horário de início do agendamento cai dentro da determinada faixa de horário
                if (isInTimeRange(schedule.timeStart, timeRange)) {
                  // Para cada dia do agendamento
                  days.forEach((day) => {
                    // Verifica se a faixa de horário ainda está disponível naquele dia
                    const index = available[day].indexOf(timeRange);

                    // Se estiver disponível, remove da lista de horários livres
                    if (index !== -1) {
                      available[day].splice(index, 1); // Remove 1 item no índice encontrado
                    }
                  });
                }
              });
            });

            return res.status(200).json({ available });
          }
        );
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async postDaysForSchedules(req, res) {
    const { dateStart, dateEnd } = req.body;

    const listOfDays = {
      1: "Seg",
      2: "Ter",
      3: "Qua",
      4: "Qui",
      5: "Sex",
      6: "Sab",
    };

    const query = `select diferenca_datas(?, ?)`;
    const values = [dateStart, dateEnd];
    connect.query(query, values, (err, result) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ error: "Erro interno de servidor" });
      }
    
    let diaFirst = new Date(dateStart).getDay();
    let diaLast = new Date(dateEnd).getDay();
    let diasFinal = [];

    if(diaFirst === diaLast){
      return res.status(200).json({days:[listOfDays[diaFirst]]});
    }
    if (result >= 6) {
      return res
        .status(200)
        .json({ days: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"] });
    } else {
      const totalDias = Object.keys(listOfDays).map(Number);

      if (diaFirst === 0) diaFirst = 1;
      if (diaLast === 0) diaLast = 1;

      let i = diaFirst;
      while (true) {
        if (listOfDays[i]) {
          diasFinal.push(listOfDays[i]);
        }

        if (i === diaLast && diaFirst <= diaLast) break; // intervalo normal (dentro de 1 semana)
        if (i === diaLast && diaFirst > diaLast) break; // intervalo circular (fim de uma, começo da outra)

        i++;
        if (i > Math.max(...totalDias)) { //Se o dia selecionado é maior que o maior dia da semana:
          i = Math.min(...totalDias); // reinicia pro primeiro dia
        }
      }
      
    }

    return res.status(200).json({days: diasFinal});
  });
  }

  static async deleteSchedule(req, res) {
    const scheduleId = req.params.id;
    const query = `CALL deletar_schedule(?, @resultado);`;

    try {
      connect.query(query, [scheduleId], function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.message === "reserva não encontrada") {
          return res.status(404).json({ error: "Agendamento não encontrado" });
        }

        return res
          .status(200)
          .json({ message: "Agendamento excluído com ID: " + scheduleId });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
