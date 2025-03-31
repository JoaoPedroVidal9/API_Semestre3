module.exports = function splitDays(results) {
    // Objeto para armazenar os agendamentos organizados por dia da semana
    const schedulesByDay = {
      Seg: [],
      Ter: [],
      Qua: [],
      Qui: [],
      Sex: [],
      Sab: [],
    };
  
    // Organiza os agendamentos pelos dias da semana
    results.forEach((schedule) => {
      const days = schedule.days.split(", ");
      days.forEach((day) => {
        if(day.includes("Seg") || day.includes("Ter") || day.includes("Qua") || day.includes("Qui") || day.includes("Sex") || day.includes("Sab")){
        schedulesByDay[day].push(schedule);
        }
      });
    });
  
    // Ordena os agendamentos dentro de cada lista com base no timeStart
    Object.keys(schedulesByDay).forEach((day) => {
      schedulesByDay[day].sort((a, b) => {
        const timeStartA = new Date(`1970-01-01T${a.timeStart}`);
        const timeStartB = new Date(`1970-01-01T${b.timeStart}`);
        return timeStartA - timeStartB;
      });
    });
  
    return schedulesByDay; // Retorna o objetos de arrays separados por dias da semana
  };
  