const Annonce_CategoryModel = require("../modele/annonce_CategoryDB");
const pool = require("../modele/database");

/**
 * @swagger
 *  components:
 *  schemas:
 *      Annonce_Category:
 *          type: object
 *          properties:
 *              annonceId:
 *                  type: integer
 *              categoryWording:
 *                  type: string
 */

 /**
  * @swagger
  * components:
  *    responses:
  *         annonceError:
  *             description: l'id donnée n'est pas correct
  */

module.exports.getCategory = async(req,res) =>{
    const client = await pool.connect();
    const annonceId = parseInt(req.params.annonceId);
    try{
        if(isNaN(annonceId)){
            res.sendStatus(400);
        }
        else{
            const {rows:categories}= await Annonce_CategoryModel.getAnnonceCategory(annonceId,client);
            categoryTrouble = false;
            categories.forEach(category => {
                check = (category !==undefined);
                if(!check){
                    categoryTrouble = true;
                }
            });
            if(!categoryTrouble){
                res.json(categories);
            }
            else{
                res.sendStatus(400)
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
 *  components:
 *      responses:
 *          categoryAddedToAnnonce:
 *              description: la catégorie a été ajoutée a l'annonce
 *      requestBodies:
 *          addCategoryToAnnonce:
 *              content:
 *                  application.json:
 *                      schema:
 *                          $ref: '#/components/schemas/Annonce_Category'
 */

module.exports.addCategoryToAnnnonce = async (req, res) =>{
    const client = await pool.connect();
    const {annonceId, categoryWording}= req.body;
    try{
        const reponse = await Annonce_CategoryModel.addAnnonceCategory(annonceId, categoryWording, client);
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

module.exports.updateCategory = async(req,res) =>{
    const client = await pool.connect();
    const {annonceId, categoryWording} = req.body;
    try{
        const reponse = await Annonce_CategoryModel.updateCategory(annonceId, categoryWording);
        if(reponse){
            res.sendStatus(201);
        }
        else{
            res.sendStatus(400);
        }
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }finally{
        client.release();
    }
}


module.exports.deleteAnnonceCategory = async (req,res) =>{
    const client = await pool.connect();
    const {annonceId, categoryWording} = req.body;
    try{
        if(isNaN(annonceId)){
            res.sendStatus(400);
        }
        const reponse = await Annonce_CategoryModel.deleteAnnonceCatgory(annonceId,categoryWording, client);
        if(reponse){
            res.sendStatus(204);
        }
        else{
            res.sendStatus(500)
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