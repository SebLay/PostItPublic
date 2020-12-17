const CategoryModel = require("../modele/categoryDB");
const pool = require ("../modele/database");

/**
 * @swagger
 *  components:
 *      schemas:
 *          Category:
 *              type: object
 *              properties:
 *                  categoryWording:
 *                      type: string
 *                  descriptionCategory:
 *                      type: string
 *              required:
 *                  - categoryWording
 *                  - descriptionCategory
 */

 /**
 * @swagger
 *  components:
 *      schemas:
 *          MajCategory:
 *              type: object
 *              properties:
 *                  categoryWording:
 *                      type: string
 *                  descriptionCategory:
 *                      type: string
 *              required:
 *                  - categoryWording
  */

/**
 * @swagger
 * components:
 *  responses: 
 *      categoryFound:
 *          description: renvoie une categorie
 *          content:
 *              application.json:
 *                  schema:
 *                      $ref: '#/components/schemas/Category'
 *      categoryNotFound:
 *          description: Aucune categorie trouvee
 *      ErreurServ:
 *          description: Erreur serveur
 */

module.exports.getCategory = async(req,res) =>{
    const client = await pool.connect();
    const wording = req.params.wording;
    try{
        const {rows:categoies} = await CategoryModel.getCategrory(wording,client);
        const category = categoies[0];
        
        if(category!== undefined){
            res.json(category);
            }
        else{
            res.sendStatus(404);
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
 *  components:
 *      responses:
 *          categoriesFound:
 *              description: Renvoie toutes les categories
 *              content:
 *                  application.json:
 *                      schema:
 *                          $ref: '#/components/schemas/Category'
 */


module.exports.getAllCategory = async(req, res) => {
    const client = await pool.connect();
    try { 
        const {rows:categories} = await CategoryModel.getAllCategory(client);
        if(categories !== undefined){
            res.json(categories);
        }
        else{
            res.sendStatus(404);
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
 *      categoryAdded:
 *          description: "La catégorie a été ajoutée" 
 *  requestBodies:
 *      addCategory:
 *          content:
 *              application.json:
 *                  schema:
 *                      $ref: '#/components/schemas/Category'
 *      
 */

module.exports.addCategory = async(req,res) =>{
    const client = await pool.connect();
    const {wording, descriptionCategory} = req.body;
    try{
        const reponse = await CategoryModel.addCategory(wording, descriptionCategory, client);
        res.sendStatus(201);
    }
    catch(error){
        res.sendStatus(500);
        console.log(error);
    }
    finally{
        client.release();
    }
}

/**
 * @swagger
 *  components:
 *      responses:
 *          majCategory:
 *              description: la categorie a ete mise a jour
 *      requestBodies:
 *          majCategory:
 *              content:
 *                  application.json:
 *                      schema:
 *                         $ref: '#/components/schemas/MajCategory'
 *              
 */

module.exports.updateCategory = async (req,res) => {
    const client = await pool.connect();
    const {wording, descriptionCategory} =req.body;
    try{
        const reponse =await CategoryModel.updateCategory(wording,descriptionCategory,client);
        res.sendStatus(204);
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
 *  components:
 *      responses:
 *          categoryDeleted:
 *              description: "la categorie a ete supprimmée"
 */

module.exports.deleteCategory = async (req,res) => {
    const client = await pool.connect();
    const wording = req.params.wording;
    try{
        const reponse = await CategoryModel.deleteCategory(wording,client);
        if(reponse){
            res.sendStatus(204);
        }
        else{
            res.sendStatus(500);
        }
    }
    catch(error){
        res.sendStatus(500);
    }
    finally{
        client.release();
    }
}