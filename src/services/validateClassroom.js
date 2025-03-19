module.exports = function validateClassroom({
    number,
    description,
    capacity
}) {
    if(!number || !description || !capacity){
        return { error: "Todos os campos devem ser preenchidos" };
    }

    return null;
}