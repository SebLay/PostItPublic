const pool = require("./database");

// fonction du CRUD
module.exports.getAdress = async(id,client)=>{
    return await client.query("Select * from Adress where id = $1", [id]);
}

module.exports.addAdress = async(street, number_adr,postalCode, city, country, client) =>{
    await client.query("INSERT INTO adress(street, number_adr, postalCode, city, country) VALUES ($1,$2,$3,$4,$5)",[street,number_adr,postalCode,city,country]);
    return true;
}

module.exports.updateAdress = async(street,number_adr,postalCode,city,country, id, client) =>{
    await client.query("UPDATE adress SET street =$1 , number_adr = $2, postalCode = $3, city=$4, country = $5 WHERE id = $6",[street, number_adr,postalCode,city, country,id]);
    return true;
}

module.exports.deleteAdress = async(id, client)=>{
    await client.query("DELETE FROM adress WHERE id = $1", [id]);
    return true;
}

// Fonctions de vérifications et utilitaires
module.exports.adressExist = async(id,client)=>{
    const {rows} = await client.query(
        "SELECT count(id) AS nbr FROM adress WHERE id = $1",[id]
    );
    return rows[0].nbr>0
}