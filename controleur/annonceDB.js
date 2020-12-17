const AnnonceModele = require("../modele/annonceDB");
const AnnonceCategoryModel = require("../modele/annonce_CategoryDB");
const UserModele = require("../modele/userDB");
const AdressModele = require("../modele/adressDB");
const pool = require("../modele/database");
/**
 * @swagger
 * components:
 *  schemas:
 *      Annonce:
 *          type: object 
 *          properties:
 *              title:
 *                  type: string
 *              content:
 *                  type: string
 *              price:
 *                  type: number
 *                  format: float
 *              userId:
 *                  type: integer
 *              adressId:
 *                  type: integer
 */

 /**
 * @swagger
 * components:
 *  schemas:
 *      AnnonceMaj:
 *          type: object 
 *          properties:
 *              title:
 *                  type: string
 *              content:
 *                  type: string
 *              price:
 *                  type: number
 *                  format: float
 *              adressId:
 *                  type: integer
 */

 /**
  * @swagger
  *  components:
  *     responses:
  *         badId:
  *             description: l'id donné n'est pas correct
  *         annonceFound:
  *             description: renvoie une annonce
  *             content:
  *                 application/json:
  *                     schema:
  *                         $ref: '#/components/schemas/Annonce'
  *         annonceNotFound:
  *             description: annonce non trouvee
  */

module.exports.getAnnonce = async (req, res) =>{
    const client = await pool.connect();
    const idTexte = req.params.id;
    const id = parseInt(idTexte);
    try{
        if(isNaN(id)){
            res.sendStatus(400);
        }
        else{
            const {rows:annonces} = await AnnonceModele.getAnnonce(id,client);
            const annonce = annonces[0];
            if(annonce !== undefined){
                res.json(annonce)
            }
            else{
                res.sendStatus(404);
            }
        }
    }
    catch(error){
        res.sendStatus(500);
    }
    finally{
        client.release();
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *       mesAnnoncesTrouve:
 *          description: renvoie des andresses
 *          content:
 *              application/json:
 *                  schema:
 *                     $ref: '#/components/schemas/Annonce'
 *       annoncesNotFound:
 *          description: nous ne trouvons auncunes annonces
 */

module.exports.getMesAnnonces = async (req, res)=>{
    const client = await pool.connect();
    const userid = req.session.userid;
    try{
        const {rows: annonces} = await AnnonceModele.getMesAnnonces(userid, client);
        if(annonces !== undefined){
            res.json(annonces);
        }
        else{
            res.sendStatus(404)
        }
    }
    catch(error){
        res.sendStatus(500);
    }
    finally{
        client.release();
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      annonceAdded:
 *         description: "l'annonce a été ajoutée"
 *      annonceNotFound:
 *         description: "l'annonce n'as pas été trouvée" 
 *  requestBodies:
 *      addAnnonce:
 *          content:
 *              application.json:
 *                  schema:
 *                      properties:
 *                          title:
 *                              type: string
 *                          content:
 *                              type: string
 *                          price:
 *                              type: number
 *                              format: float
 *                          userId:
 *                              type: integer
 *                          adressId:
 *                              type: integer
 *                      required:
 *                          - title
 *                          - content
 *                          - price
 *                          - userId
 *                          - adressId
 */

module.exports.postAnnonce = async (req,res) => {
    const client = await pool.connect();
    const body = req.body;
    const {title, content, price, user:userObj, adress:adressObj} = body;
    try{
        await client.query("BEGIN");
        const userExist = await UserModele.userExist(userObj.id,client);
        const adressExist = await AdressModele.adressExist(adressObj.id,client)
        if(userExist &&  adressExist){
            const reponse = await AnnonceModele.postAnnonce(title,content, price, userObj.id, adressObj.id, client);
            await client.query("COMMIT");
            res.sendStatus(201);
        }
        else{
            await client.query("ROLLBACK");
            res.status(404).json({error: "l'id du user ou de l'adresse n'existe pas"})
        }
    }
    catch(error){
        await client.query("ROLLBACK;");
        res.sendStatus(500);
    }
    finally{
        client.release();
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      annonceUpdated:
 *          description: " l'annonce a été mise a jours"
 *      annonceNotFound:
 *          description: "l'annonce n'a pas été trouvée"
 *      pasDeMajAFare:
 *          description: "il n'y a pas de maj a faire"
 *  requestBodies:
 *      majAnnonce:
 *          content:
 *              application.json:
 *                  schema:
 *                      $ref: '#/components/schemas/AnnonceMaj'
 */

module.exports.updateAnnonce = async(req,res) =>{
    if(req.session){
        const userObj = req.session;
        const upToDate = req.body;
        const newData = {};
        let doUpdate = false;

        if(upToDate.title !== undefined ||
            upToDate.content !== undefined ||
            upToDate.price !== undefined ||
            upToDate.is_Done !== undefined){
                doUpdate = true;
            }
        if(doUpdate && upToDate.id!== undefined){
           newData.title = upToDate.title;
           newData.content = upToDate.content;
           newData.price = upToDate.price;
           newData.is_Done = upToDate.is_Done; 

           const client = await pool.connect();
           try{
                await client.query("BEGIN");
                const {rows : owner} = await AnnonceModele.adOwner(upToDate.id, client);
                const adOwner = owner[0].userid;
                if(adOwner == userObj.userid){
                    await AnnonceModele.updateAnnonce(
                    upToDate.id,
                    newData.title,
                    newData.content,
                    newData.price,
                    newData.is_Done,
                    client);
                    await client.query("COMMIT");
                    res.sendStatus(201);
                }
                else{
                    await client.query("ROLLBACK");
                    res.status(404).json({error: "vous ne disposez pas des droits de modification de cette annonce"});
                }
           }
           catch(error){
               res.sendStatus(500);
               console.log(error);
           }
           finally{
               client.release();
           }
        }
        else{
            res.sendStatus(401);
        }
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      badId:
 *          description: l'id donné n'est pas correct
 *      adDeleted:
 *          description: "l'annonce a bien été supprimmée"
 *      notOwner:
 *          description: "vous n'avez pas les droits pour ça"
 */

module.exports.deleteAnnonce = async(req,res) => {
    const client = await pool.connect();
    const idAd = parseInt(req.params.id);
    const userConnectedId = req.session.userid
    try{
       if(isNaN(idAd)){
           res.sendStatus(400);
       }
        await client.query("BEGIN");
        const {rows : owner} = await AnnonceModele.adOwner(idAd, client);
        const adOwner = owner[0].userid;
        if(adOwner == userConnectedId){
            const reponse1 = await AnnonceCategoryModel.deleteAllCateogry(idAd,client);
            if(reponse1){
                const reponse2 = await AnnonceModele.deleteAnnonce(idAd,client);
                if(reponse2){
                    res.sendStatus(204);
                    await client.query("COMMIT");

                }
                else{
                    await client.query("ROLLBACK");
                    res.sendStatus(500);
                }
            }
            else{
                await client.query("ROLLBACK");
                res.sendStatus(404);
            }
        }
        else{
            await client.query("ROLLBACK");
            res.status(403).json({error:"vous ne pouvez pas supprimmer cette annonce"});
        }
    }
    catch(error){

        res.sendStatus(500);
    }
    finally{
        client.release();
   }
}