module.exports = function validateSchedule({
    dateStart,
    dateEnd,
    days,
    user,
    classroom,
    timeStart,
    timeEnd
}) {
    if (!dateStart || !dateEnd || !days || !user || !classroom || !timeStart || !timeEnd ) {
        return { error: "Todos os campos devem ser preenchidos" };
      }
    return null;
}