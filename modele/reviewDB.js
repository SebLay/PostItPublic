const pool = require("./database");

// fonction crud
module.exports.getReview = async ( userId_Receiver, client) =>{
    return await client.query("SELECT * from Review WHERE  userId_Receiver = $1", [userId_Receiver]);
}

module.exports.getReviewsISend = async (userid_sender, client) =>{
    return await client.query("SELECT * from Review WHERE userId_Sender =$1", [userid_sender]);
}

module.exports.addReview = async (userId_Receiver, userId_Sender, note, descriptionReview, client) =>{
    await client.query("INSERT INTO Review(userId_receiver, userId_Sender, note,descriptionReview) VALUES ($1,$2,$3,$4)",[userId_Receiver, userId_Sender,note,descriptionReview]);
    return true;
}

module.exports.updateReview = async(id, note, descriptionReview,client) =>{
    const params = [];
    const querySet = [];
    let query = "UPDATE Review SET ";
    if(note !== undefined){
        params.push(note);
        querySet.push(`note =$${params.length}`);
    }
    if(descriptionReview !== undefined){
        params.push(descriptionReview);
        querySet.push(`descriptionReview =$${params.length}`);
    }
    if(params.length>0){
        query += querySet.join(',');
        params.push(id)
        query += ` Where id = $${params.length}`;
        return client.query(query, params); 
    }
    else{
        throw new error("No field to update");
    }
}

module.exports.deleteReview = async(userId_Receiver,userId_Sender, client) =>{
    await client.query("DELETE FROM Review WHERE userId_receiver = $1 and userId_Sender = $2",[userId_Receiver,userId_Sender]);
    return true;
}

module.exports.getReviewId = async(userid_receiver, userid_sender, client) =>{
    return await client.query("SELECT id FROM Review WHERE userId_receiver = $1 and userId_Sender = $2",[userid_receiver, userid_sender]);
}