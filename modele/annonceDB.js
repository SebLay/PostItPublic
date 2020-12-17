module.exports.getAnnonce = async(id, client) => {
    return await client.query("SELECT * FROM annonce WHERE id=$1",[id]);
}

module.exports.getMesAnnonces = async(userId, client) => {
    return await client.query("SELECT * FROM annonce WHERE userId = $1", [userId]);
}

module.exports.postAnnonce = async(title, content, price, userId, adressId, client) => {
    date = new Date();
    is_Done = '0';
    await client.query("INSERT INTO annonce (Title, content, price, Date_Start , is_Done, UserId, AdressId) Values($1,$2,$3,$4,$5,$6,$7)", [title,content,price,date,is_Done,userId,adressId]);
    return true;
}

module.exports.updateAnnonce = async(id, title, content, price,is_Done, client) => {
    const params = [];
    const querySet = [];

    let query ="UPDATE annonce SET ";
    if(title !== undefined){
        params.push(title);
        querySet.push(`title = $${params.length}`);
    }
    if(content !== undefined){
        params.push(content);
        querySet.push(`content = $${params.length}`);
    }
    if(price !== undefined){
        params.push(price);
        querySet.push(`price = $${params.length}`);
    }
    if(is_Done !== undefined){
        params.push(is_Done);
        querySet.push(`is_Done =$${params.length}`);
    }
    if(params.length>0){
        query += querySet.join(',');
        params.push(id);
        query += `WHERE id= $${params.length}`;
        return client.query(query, params);
    }
    else{
        throw new error("No field to update");
    }
}

module.exports.deleteAnnonce = async(id, client) => {
    await client.query("Delete from annonce where id = $1",[id]);
    return true
}

module.exports.adOwner = async (id, client) =>{
    return client.query("SELECT userId FROM annonce WHERE id = $1",[id]);
}