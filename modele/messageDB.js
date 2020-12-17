const pool = require("./database");

//fonction
module.exports.getMessage= async (userId_Receiver, userId_Sender, client) =>{
    return await client.query("SELECT * FROM Messages WHERE userId_Receiver =$1 and userId_Sender = $2",[userId_Receiver,userId_Sender]);
}

module.exports.addMessage = async (userId_Receiver, userId_Sender, content, client) =>{
    await client.query("INSERT INTO Messages(userId_Receiver, userId_Sender, content) VALUES ($1,$2,$3)",[userId_Receiver,userId_Sender,content]);
    return true;
}

module.exports.updateMessage = async (id, userId_Receiver,userId_Sender,content, client) =>{
    await client.query("UPDATE Messages SET content =$4 WHERE id=$1 and userId_Receiver =$2 and userId_Sender = $3 ", [id,userId_Receiver, userId_Sender, content]);
    return true;
} 

module.exports.deleteMessage = async (id, userId_Receiver, userId_Sender ,client) =>{
    await client.query("DELETE FROM Messages WHERE id =$1 and userId_Receiver= $2 and userId_Sender =$3", [id, userId_Receiver, userId_Sender]);
    return true;
}