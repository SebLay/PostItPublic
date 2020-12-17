const pool = require ("./database");
const {getHash} = require("../utils/utils");

// fonction crud
module.exports.getConnectionInfo = async (pseudo, client) =>{
    return await client.query("SELECT * from ConnexionInfo WHERE pseudo = $1",[pseudo]);
}

module.exports.getAllPseudo = async (client) =>{
    return await client.query("SELECT pseudo from ConnexionInfo");
}

module.exports.getPseudo = async(userId, client)=>{
    return await client.query("Select pseudo from ConnexionInfo WHERE userId=$1",[userId]);
}

module.exports.addConnectionInfo = async (pseudo, password, userId, client) =>{
    hashedPassword= await getHash(password);
    await client.query("INSERT INTO ConnexionInfo(pseudo, passwordUser, userId) VALUES ($1, $2, $3)", [pseudo, hashedPassword, userId]);
    return true;
}


module.exports.updateConnectionInfo =async (pseudo, password, client) =>{
    hashedPassword = await getHash(password);
    await client.query("UPDATE ConnexionInfo SET passwordUser =$1 WHERE pseudo= $2",[hashedPassword, pseudo]);
    return true;

}

module.exports.deleteConnectionInfo = async(pseudo, client) => {
    await client.query("DELETE FROM ConnexionInfo where pseudo = $1", [pseudo]);
    return true;
}


// utilitaires
module.exports.pseudoExist = async(pseudo,client)=>{
    const {rows} = await client.query("SELECT count(pseudo) AS nbr FROM ConnexionInfo WHERE pseudo = $1",[pseudo]);
    return rows[0].nbr>0;
}

module.exports.userIdAlreadyUsed = async(userId,client) =>{
    const {rows} = await client.query("SELECT count(userId) AS nbr FROM connexionInfo WHERE userId=$1",[userId]);
    return rows[0].nbr>0;
}

module.exports.getUserId = async (pseudo, passwordUser , client) =>{
    return client.query("SELECT userId AS nbr FROM ConnexionInfo WHERE pseudo=$1 and passwordUser = $2", [pseudo, passwordUser]);
}

