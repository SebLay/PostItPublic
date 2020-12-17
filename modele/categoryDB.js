const pool = require("./database");

// CRUD
module.exports.getCategrory = async (wording,client) =>{
    return await client.query("SELECT * from category where wording = $1",[wording]);
}

module.exports.getAllCategory = async (client) => {
    return await client.query("SELECT * from category");
}

module.exports.addCategory = async (wording, descriptionCategory, client) =>{
    await client.query("INSERT INTO category(wording, descriptionCategory) VALUES ($1,$2)",[wording, descriptionCategory]);
    return true;
}

module.exports.updateCategory = async (wording, descriptionCategory, client) =>{
    await client.query("UPDATE category SET descriptionCategory = $2 WHERE wording = $1",[wording, descriptionCategory]);
    return true;
}

module.exports.deleteCategory = async(wording, client) =>{
    await client.query("DELETE FROM category where wording = $1 ", [wording]);
    return true;
}