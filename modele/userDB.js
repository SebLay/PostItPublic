// fonctions du CRUD 
module.exports.getUser = async(id,client)=>{
    return await client.query("Select * from users where id = $1", [id]);
}

module.exports.createUser = async(first_name,Last_Name,Birthday,Email,Street,adrNumber,PostalCode,City,Country,Picture,Bio,Sex, client) =>{
    await client.query("INSERT INTO users(first_Name,last_Name,birthday,email,street,number_adr,postalCode,city,country,picture,bio,sex,userrole) Values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
    [first_name,Last_Name,Birthday,Email,Street,adrNumber,PostalCode,City, Country, Picture,Bio,Sex,"user"]);
    return true;
}

module.exports.updateUser = async(first_name,Last_Name,Birthday,Email,Street,adrNumber,PostalCode,City,Country,Picture,Bio,Sex, id, client) =>{
    const params = [];
    const querySet = [];
    let query = "UPDATE users SET ";
    if(first_name !== undefined){
        params.push(first_name);
        querySet.push(`first_Name = $${params.length}`);
    }
    if(Last_Name !== undefined){
        params.push(Last_Name);
        querySet.push(`Last_Name = $${params.length}`);
    }
    if(Birthday !== undefined){
        params.push(Birthday);
        querySet.push(`Birthday = $${params.length}`);
    }
    if(Email !== undefined){
        params.push(Email);
        querySet.push(`Email = $${params.length}`);
    }
    if(Street !== undefined){
        params.push(Street);
        querySet.push(`Street = $${params.length}`);
    }
    if(adrNumber !== undefined){
        params.push(adrNumber);
        querySet.push(`number_adr = $${params.length}`);
    }
    if(PostalCode !== undefined){
        params.push(PostalCode);
        querySet.push(`PostalCode = $${params.length}`);
    }
    if(City !== undefined){
        params.push(City);
        querySet.push(`City = $${params.length}`);
    }
    if(Country !== undefined){
        params.push(Country);
        querySet.push(`Country = $${params.length}`);
    }
    if(Picture !== undefined){
        params.push(Picture);
        querySet.push(`Picture = $${params.length}`);
    }
    if(Bio !== undefined){
        params.push(Bio);
        querySet.push(`Bio = $${params.length}`);
    }
    if(Sex !== undefined){
        params.push(Sex);
        querySet.push(`Sex = $${params.length}`)
    }

    if(params.length >0){
        query += querySet.join(',');
        params.push(id);
        query += `WHERE id = $${params.length}`;
        return client.query(query, params);
    }
    else{
        throw new error ("No fied to update");
    }
}

module.exports.deleteUser =async(id, client)=>{
    await client.query("Delete FROM users WHERE id = $1", [id]);
    return true;
}

// fonction de maj des catégorie d'infode l'utilisateur
module.exports.updateUserPersoInfo = async(first_name,Last_Name,Birthday,Email, id, client) =>{
    await client.query("UPDATE users SET first_Name = $1, Last_Name = $2, Birthday = $3, Email=$4 WHERE id = $5", 
    [first_name,Last_Name,Birthday,Email,id]);
    return true;
}

module.exports.updateUserAdress = async(Street,adrNumber,PostalCode,City,Country,id,client) =>{
    await client.query("UPDATE users SET Street =$1, number_adr=$2, PostalCode=$3, City=$4, Country=$5 WHERE id =$6",
    [Street,adrNumber,PostalCode,City,Country,id]);
    return true;
}


// vérifiction si le client existe (utilisé lors quand on crée une nouvelle annonce par exemple)
module.exports.userExist = async(id,client)=>{
    const {rows} = await client.query(
        "SELECT count(id) AS nbr FROM users WHERE id = $1",[id]);
    return rows[0].nbr>0
}

// vérification d'unicité de l'adresse mail (Utilisé lors de la création d'un utilisateurs pour pas que 2 comptes aient la même eMail.)
module.exports.emailExist = async(email, client) => {
    const {rows} = await client.query(
        "SELECT count(email) AS nbr FROM users WHERE email = $1",[email]);
    return rows[0].nbr != 0;
}

// obtention du role d'un user précis
module.exports.getUserRole = async(id, client) =>{
    return client.query("SELECT userRole FROM users where id = $1",[id]);
}

module.exports.getLastUserAdd = async(client) =>{
    return client.query("SELECT MAX(id) FROM users");
}
