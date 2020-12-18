const ConnectionInfo = require ("../modele/connectionInfo");
const pool = require ("../modele/database");

/**
 * @swagger
 *  components:
 *      schemas:
 *          ConnectInfo:
 *              type: object
 *              properties:
 *                  pseudo:
 *                      type: string
 *                  password:
 *                      type: string
 *                  userId:
 *                      type: integer
 */

/**
 * @swagger
 *  components:
 *      responses:
 *          infoFound:
 *              description: renvoie une object connectionInfo
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ConnectInfo'
 *          infoNotFound:
 *              description: "les informations n'ont pas ete trouvées"    
 */
module.exports.getPrecisedConnectionInfo = async (req,res) =>{
    const client = await pool.connect();
    const pseudoget = req.params.pseudo;
    try{
        const {rows: pseudos} = await ConnectionInfo.getConnectionInfo(pseudoget, client);
        const pseudo = pseudos[0];
        if(pseudo !== undefined){
            res.json(pseudo);
        }
        else{
            console.log("pas de pseudo trouvés");
            res.sendStatus(404);
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

module.exports.getConnectionInfo = async(req,res) =>{
    const client = await pool.connect();
    const connectedPseudo = req.session.pseudo;
    try{
            if((connectedPseudo)){
                const {rows:connectInf} = await ConnectionInfo.getConnectionInfo(connectedPseudo,client);
                const connected = connectInf[0];
                if(connected!== undefined){
                    res.json(connected);
                }
                else{
                    console.log("pas de connexionInfo trouvées");
                    res.sendStatus(404);
                }
           }
           else{
               console.log("vous ne pouvez pas acceder à ces infos");
               res.status(500).json({error: "vous n'avez pas les droits pour consulter ces informations"});
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

module.exports.getPrecisedPseudo = async(req,res) =>{
    const client = await pool.connect();
    const id = parseInt(req.params.id);
    try{
        if(isNaN(id)){
            console.log("l'id reçu n'est pas un nombre");
            res.sendStatus(400);
        }
        else{
            const {rows:pseudos} = await ConnectionInfo.getPseudo(id, client);
            pseudo= pseudos[0];
            if(pseudo !== undefined){
                res.json(pseudo);
            }
            else{
                console.log("pas de pseudos trouvés");
                res.sendStatus(404);
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

module.exports.getAllPseudo  = async(req,res)=>{
    const client = await pool.connect();
    try{
        const {rows:pseudos} = await ConnectionInfo.getAllPseudo(client);
        if(pseudos !== undefined){
            res.json(pseudos);
        }
        else {
            console.log("pas de pseudos trouves");
            res.sendStatus(404);
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

/**
 * @swagger
 *  components:
 *      requestBodies:
 *          addConnectInfo:
 *              content:
 *                  application.json:
 *                      schema:
 *                          properties:
 *                              pseudo:
 *                                  type: string
 *                              password:
 *                                  type: string
 *                              userId: 
 *                                  type: integer
 *                          required:
 *                              - pseudo
 *                              - password
 *                              - userId
 *      responses:
 *          infoAdded:
 *              description: les infos de connection ont ete ajoutee
 */

module.exports.addConnectionInfo = async (req , res) =>{
    const client = await pool.connect();
    const {pseudo, password, userId} = req.body;
    try{
        await client.query("BEGIN");
        const pseudoExist = await ConnectionInfo.pseudoExist(pseudo, client);
        const userIdAlreadyUsed = await ConnectionInfo.userIdAlreadyUsed(userId, client);
        if(!pseudoExist){
            if(!userIdAlreadyUsed){
                const reponse = await ConnectionInfo.addConnectionInfo(pseudo, password, userId, client)
                if(reponse){
                    await client.query("COMMIT");
                    res.sendStatus(201)
                }
                else{
                  await client.query("ROLLBACK");
                  console.log("erreur lors de l'ajouts de infos de connection");
                    res.sendStatus(500);
                }
            }
            else{
                await client.query("ROLLBACK");
                console.log("cet utilisateur a déja des infos de connnextion");
                res.status(500).json({error: "cet utilisateur dispose déja d'information de connection"})
            }
        }
        else{
            await client.query("ROLLBACK");
            console.log("psuedo déja utilisé")
            res.status(500).json({error: "votre pseudo est déja utilisé"});
        }
    }
    catch(error){
        await client .query("ROLLBACK");
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
 *      requestBodies:
 *          majMdp:
 *              content:
 *                  application.json:
 *                      schema:
 *                          properties:
 *                              password:
 *                                  type: string
 *                          required: 
 *                              - password
 *      responses:
 *          passwordUpdated:
 *              description: le mot de pass a ete mis a jour
 *          pasLesDroit:
 *              description: "vous n'avez pas les droits pour faire ça" 
 */

module.exports.updatePassword = async (req, res) =>{
   if(req.session){
       const connectObj = req.session;
       const uptoDate = req.body;
       const newData = {};
       let doUpdate = false;

        if(uptoDate.password !== undefined){
            doUpdate = true;
        }

       if(doUpdate){
           newData.password = uptoDate.password;
           const client = await pool.connect();
           try{
               await ConnectionInfo.updateConnectionInfo(connectObj.pseudo, newData.password, client);
               res.sendStatus(201);
           }
           catch(error){
               console.log(error);
               res.sendStatus(500)
           }
           finally{
               client.release();
           }
       }
       else{
           console.log("pas de besoin d'update");
           res.sendStatus(401);
       } 
   }
}



module.exports.deleteConnectionInfo = async (req,res) =>{
     const client = await pool.connect();
     const pseudo =req.params.pseudo;
     try{
         const reponse = await ConnectionInfo.deleteConnectionInfo(pseudo, client);
         if(reponse){
             res.sendStatus(204);
         }
         else{
             console.log("pas possible de supprimer cela")
             res.sendStatus(500);
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