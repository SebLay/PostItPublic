const UserModele = require("../modele/userDB");
const ConnectInfoModel= require("../modele/connectionInfo");
const pool = require("../modele/database");
/**
 * @swagger
 *  components:
 *      schemas:
 *          User:
 *              type: object
 *              properties:
 *                  id: 
 *                      type: integer
 *                  firstName:
 *                      type: string
 *                  lastName:
 *                      type: string
 *                  birthday:
 *                      type: object
 *                  street:
 *                      type: string
 *                  number_adr:
 *                      type: string
 *                  postalCode: 
 *                      type: string
 *                  city:
 *                      type: string
 *                  country:
 *                      type: string
 *                  picture:
 *                      type: string
 *                  Bio:
 *                      type: string
 *                  sex: 
 *                      type: string
 */

/**
 * @swagger
 *  components:
 *      responses:
 *          notAId:
 *              description: "l'id reçu n'est pas un id"
 *          userFound:
 *              description: retourne un utilisateur (enfin pas physiquement, ça donnes ses infos en resume)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          userNotFound:
 *              description: utilisateur inexistant
 *              
 */

module.exports.getSpecifiedUser = async(req,res) =>{
    const client = await pool.connect();
    const id = parseInt(req.params.id);
    const connectedId = req.session.userid;
    const authLevel = req.session.authLevel;
    try{
        if(isNaN(id)){
            res.sendStatus(400);
        }
        else{
            if((id===connectedId)|| authLevel==="admin"){
                const {rows:users} = await UserModele.getUser(id,client);
                const user = users[0];
                if(user!== undefined){
                    res.json(user);
                }
                else{
                    console.log("utilisateur non trouvé");
                    res.sendStatus(404);
                }
           }
           else{
               console.log("vous n'avez pas les droit pour consulter ce profil")
               res.status(500).json({error: "vous n'avez pas les droit pour consulter ce profil"});
           }
        }
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
    finally{
        client.release();
    }
}



module.exports.getUser = async(req,res) =>{
    const client = await pool.connect();
    const connectedId = req.session.userid;
    try{
            if((connectedId)){
                const {rows:users} = await UserModele.getUser(connectedId,client);
                const user = users[0];
                if(user!== undefined){
                    res.json(user);
                }
                else{
                    res.sendStatus(404);
                }
           }
           else{
               console.log("vous n'avez pas les droit pour consulter ce profil");
               res.status(500).json({error: "vous n'avez pas les droit pour consulter ce profil"});
           }
        }
    catch(error){
        console0log(error);
        res.sendStatus(500);
    }
    finally{
        client.release();
    }
}

/**
 * @swagger
 * components:
 *  requestBodies:
 *      addUser: 
 *          content:
 *              application.json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *  responses:
 *      userAdded:
 *          description: "l'utilisateur a ete ajouté"
*/

module.exports.createUser = async(req, res) => {
    const client  = await pool.connect();
    const body = req.body;
    const {first_name, last_name, birthday,email, street, number_adr ,postalcode, city, country, picture, bio, sex} = body;
  try{
        await client.query("BEGIN");
        const emailExist = await UserModele.emailExist(email, client);
        if(!emailExist){
            const reponse = await UserModele.createUser(first_name, last_name,birthday,email,street,number_adr,postalcode, city,country, picture, bio,sex, client);
            await client.query("COMMIT");
            res.sendStatus(201);
        }
        else{
            await client.query("ROLLBACK");
            console.log("un utilisateur a déja utilisé votre email");
            res.status(404).json({error:"un utilisateur utilise déja votre email."});
        }
    }
    catch(error){
        await client.query("ROLLBACK");
        console.log(error);
        res.sendStatus(500);
    }
    finally{ 
        client.release();
    }
}

module.exports.createUserWithPseudo = async(req, res) => {
    const client  = await pool.connect();
    const body = req.body;
    const {pseudo, password ,first_name, last_name, birthday,email, street, number_adr ,postalcode, city, country, picture, bio, sex} = body;
  try{
        await client.query("BEGIN");
        const emailExist = await UserModele.emailExist(email, client);
        if(!emailExist){
            const reponse = await UserModele.createUser(first_name, last_name,birthday,email,street,number_adr,postalcode, city,country, picture, bio,sex, client);
            if(reponse){
                const pseudoExist = await ConnectInfoModel.pseudoExist(pseudo, client);
                if(!pseudoExist){
                    const {rows:userIds} = await UserModele.getLastUserAdd(client);
                    const userId = userIds[0].max;
                    const reposne2 = await ConnectInfoModel.addConnectionInfo(pseudo,password, userId, client);
                    if(reposne2){
                        await client.query("COMMIT");
                        res.sendStatus(201);
                    }
                    else{
                        await client.query("ROLLBACK");
                        res.sendStatus(400);
                    }
                }
                else{
                    await client.query("ROLLBACK");
                    res.sendStatus(400);
                }
            }
            else{
                await client.query("ROLLBACK");
                res.sendStatus(400);
            }
        }
        else{
            await client.query("ROLLBACK");
            res.status(400).json({error:"un utilisateur utilise déja votre email."});
        }
    }
    catch(error){
        await client.query("ROLLBACK");
        console.log(error);
        res.sendStatus(500);
    }
    finally{ 
        client.release();
    }
}

/**
 * @swagger
 *  components:
 *      responses:
 *          userUpdated:
 *              description: utilisateur mis a jour
 *          noMaj1:
 *              description: pas possible de mettre a jour
 *          noMaj2:
 *              description: pas de mise a jour a effectuer
 *      requestBodies:
 *          majUser: 
 *              content:
 *                  application.json:
 *                      schema:
 *                          properties:
 *                              id: 
 *                                  type: integer
 *                              firstName:
 *                                  type: string
 *                              lastName:
 *                                  type: string
 *                              birthday:
 *                                  type: object
 *                              street:
 *                                  type: string
 *                              number_adr:
 *                                  type: string
 *                              postalCode: 
 *                                  type: string
 *                              city:
 *                                  type: string
 *                              country:
 *                                  type: string
 *                              picture:
 *                                  type: string
 *                              Bio:
 *                                  type: string
 *                              sex: 
 *                                  type: string
 */

module.exports.updateUser = async (req, res) =>{
    if(req.session){
        const userObj = req.session;
        const upToDate = req.body;
        const newData = {};
        let doUpdate = false;

        if(upToDate.first_name !== undefined || 
            upToDate.last_name !== undefined ||
            upToDate.birthday !== undefined ||
            upToDate.email !== undefined ||
            upToDate.street !== undefined ||
            upToDate.number_adr !== undefined ||
            upToDate.postalcode !== undefined ||
            upToDate.city !== undefined ||
            upToDate.country !== undefined ||
            upToDate.picture !== undefined ||
            upToDate.bio !== undefined ||
            upToDate.sex !== undefined){
                doUpdate =true;
            }
        if(doUpdate){
            newData.first_name = upToDate.first_name;
            newData.last_name = upToDate.last_name;
            newData.birthday = upToDate.birthday;
            newData.email = upToDate.email;
            newData.street = upToDate.street;
            newData.number_adr = upToDate.number_adr;
            newData.postalcode = upToDate.postalcode;
            newData.city = upToDate.city;
            newData.country = upToDate.country;
            newData.picture = upToDate.picture;
            newData.bio = upToDate.bio;
            newData.sex = upToDate.sex;

            const client = await pool.connect();
            try{
                await UserModele.updateUser(
                    newData.first_name,
                    newData.last_name,
                    newData.birthday,
                    newData.email,
                    newData.street,
                    newData.number_adr,
                    newData.postalcode,
                    newData.city,
                    newData.country,
                    newData.picture,
                    newData.bio,
                    newData.sex,
                    userObj.userid,
                    client
                    );
                    res.sendStatus(204);
                }
                catch(error){
                    console.log(error)
                    res.sendStatus(500);
                }
                finally{
                    client.release();
                }
            }
            else{
                res.sendStatus(400);
            }
        }
        else{
            res.sendStatus(401);
        }
    }

    module.exports.updateOtherUser= async(req,res)=>{
        const upToDate = req.body;
        const id = parseInt(req.params.id);
        const newData = {};
        let doUpdate = false;
        if(id!== undefined &&(
            upToDate.first_name !== undefined || 
            upToDate.last_name !== undefined ||
            upToDate.birthday !== undefined ||
            upToDate.email !== undefined ||
            upToDate.street !== undefined ||
            upToDate.number_adr !== undefined ||
            upToDate.postalcode !== undefined ||
            upToDate.city !== undefined ||
            upToDate.country !== undefined ||
            upToDate.picture !== undefined ||
            upToDate.bio !== undefined ||
            upToDate.sex !== undefined)){
                doUpdate =true;
            }
        if(doUpdate){
            newData.first_name = upToDate.first_name;
            newData.last_name = upToDate.last_name;
            newData.birthday = upToDate.birthday;
            newData.email = upToDate.email;
            newData.street = upToDate.street;
            newData.number_adr = upToDate.number_adr;
            newData.postalcode = upToDate.postalcode;
            newData.city = upToDate.city;
            newData.country = upToDate.country;
            newData.picture = upToDate.picture;
            newData.bio = upToDate.bio;
            newData.sex = upToDate.sex;

            const client = await pool.connect();
            try{
                await UserModele.updateUser(
                    newData.first_name,
                    newData.last_name,
                    newData.birthday,
                    newData.email,
                    newData.street,
                    newData.number_adr,
                    newData.postalcode,
                    newData.city,
                    newData.country,
                    newData.picture,
                    newData.bio,
                    newData.sex,
                    id,
                    client
                    );
                    res.sendStatus(204);
                }
                catch(error){
                    console.log(error)
                    res.sendStatus(500);
                }
                finally{
                    client.release();
                }
            }
            else{
                res.sendStatus(400);
            }
        }


/**
 * @swagger
 *  components:
 *      responses:
 *          userDeleted:
 *              description: "l'utilisateur a ete supprimé"
 *          PasLesDroits:
 *              description: "vous n'avez pas les droits pour faire ça"
 */
module.exports.deleteUser = async (req,res) => {
    const client = await pool.connect();
    const id = parseInt(req.params.id);
    try{
        if(isNaN(id)){
            res.sendStatus(400);
        }
        client.query("BEGIN");
        const {rows:pseudos} = await ConnectInfoModel.getPseudo(id, client);
        const pseudo = pseudos[0];
        const reponse1 = await ConnectInfoModel.deleteConnectionInfo(pseudo,client)
        if(reponse1){
            const reponse2 = await UserModele.deleteUser(id,client);
            if (reponse2){
                res.sendStatus(204);
                client.query("COMMIT")
            }
            else{
                res.sendStatus(500);
                client.query("ROLLBACK");
            }
        }
        else{
            res.sendStatus(403);
            client.query("ROLLBACK");
        }
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
    finally{
        client.release();
    }
}