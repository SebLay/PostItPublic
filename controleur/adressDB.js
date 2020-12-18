const AdressModel = require("../modele/adressDB");
const pool = require("../modele/database");

/**
 *@swagger
 * components:
 *  schemas:
 *      Adress:
 *          type: object
 *          properties:
 *              street:
 *                  type: string
 *              number_adr:
 *                  type: string
 *              postalCode:
 *                  type: string
 *              city:
 *                  type: string
 *              country:
 *                  type: string
 */

 /**
 *@swagger
 * components:
 *  schemas:
 *      AdressWithId:
 *          type: object
 *          properties:
 *              street:
 *                  type: string
 *              number_adr:
 *                  type: string
 *              postalCode:
 *                  type: string
 *              city:
 *                  type: string
 *              country:
 *                  type: string
 *              id:
 *                  type: integer
 *          required:
 *              - id
 */

/**
 * @swagger
 * components:
 *  responses:
 *      badId:
 *          description: l'id donné n"est pas correct
 *      adressNotFound:
 *          description: nous ne trouvons pas d'adresse correspondant a l'id donné
 *      produitFound:
 *          description: renvoie une adresse
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Adress'
 */

module.exports.getAdress = async(req,res) =>{
    const client = await pool.connect();
    const id = parseInt(req.params.id);
    try{
        if(isNaN(id)){
            console.log("l'id reçu n'est pas une fonction");
            res.sendStatus(400);
        }
        else{
            const {rows:adresses} = await AdressModel.getAdress(id,client);
            const adress = adresses[0];
            if(adress!== undefined){
                res.json(adress);
            }
            else{
                console.log("adresse non trouvée");
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



/**
 * @swagger
 * components:
 *  responses:
 *      adressAdded:
 *          description: "l'adresse a été ajoutée"
 *  requestBodies:
 *      addAdress:
 *          content:
 *              application.json:
 *                  schema:
 *                      properties:
 *                          street:
 *                              type: string
 *                          number_adr:
 *                              type: string
 *                          postalCode:
 *                              type: string
 *                          city:
 *                              type: string
 *                          country:
 *                              type: string
 *                      required:
 *                          - street
 *                          - number_adr
 *                          - postalCode
 *                          - city
 *                          - coutnry
 */

module.exports.addAdress = async(req,res)=>{
    const client = await pool.connect();
    const {street, number_adr, postalCode, city, country} = req.body;
    try{
        const reponse = await AdressModel.addAdress(street, number_adr, postalCode, city, country, client);
        res.sendStatus(201);
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
 * components:
 *  responses:
 *      adressUpdated:
 *          description: l'adresse a bien été mise a jour
 *  requestBodies:
 *      updateAdress:
 *          content:
 *              application.json:
 *                  schema:
 *                      $ref: '#/components/schemas/AdressWithId'
 */

module.exports.updateAdress = async (req,res)=>{
    const client = await pool.connect();
    const {street, number_adr, postalCode, city, country, id} = req.body;
    try{
        const reponse = await AdressModel.updateAdress(street, number_adr, postalCode, city, country, id, client);
        res.sendStatus(204);
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
 * components:
 *  responses:
 *      badId:
 *          description: l'id donné n'est pas correct
 *      adressDeleted:
 *          description: l'adresse a été supprimmé
 */

module.exports.deleteAdress = async (req,res) =>{
    const client = await pool.connect();
    const id = parseInt(req.params.id);
    try{
        if(isNaN(id)){
            console.log("id n'est pas un nombre");
            res.sendStatus(400);
        }
        const reponse = await AdressModel.deleteAdress(id,client);
        if( reponse){
            res.sendStatus(204);
        }
        else{
            console.log("erreur lors de la supperssion");
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