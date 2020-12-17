const pool = require("./database");

// fonction CRUD
module.exports.getAnnonceCategory = async (annonceId, client) =>{
    return await client.query("SELECT * from AnnonceCategory WHERE annonceId = $1",[annonceId]);
}

module.exports.addAnnonceCategory = async (annonceId,categoryWording, client) =>{
    await client.query("INSERT INTO AnnonceCategory(annonceId, categoryWording) VALUES($1,$2)",[annonceId,categoryWording]);
    return true;
}

module.exports.deleteAnnonceCatgory = async (annonceId,CategoryWording, client)=>{
    await client.query("DELETE FROM AnnonceCategory WHERE annonceId = $1 and categoryWording = $2",[annonceId,CategoryWording]);
    return true;
}

module.exports.deleteAllCateogry = async (annonceId, client) =>{
    await client.query("DELETE FROM AnnonceCategory WHERE annonceId =$1", [annonceId]);
    return true;
}