const ReviewModel =require ("../modele/reviewDB");
const pool = require ("../modele/database");

/**
 * @swagger
 *  components:
 *      schemas:
 *          Review:
 *              type: object
 *              properties:
 *                  userId_Sender:
 *                      type: integer
 *                  note:
 *                      type: string
 *                  descriptionReview:
 *                      type: string
 *                  userId_receiver:
 *                      type: integer
 */

/**
 * @swagger
 *  components:
 *      responses:
 *          reviewFound:
 *              description: retourne les review de cet utilisateur
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Review'
 *          reviewNotFound:
 *              description: aucune reviewTrouvee
 *                  
 */

module.exports.getReview = async(req, res) => {
    const client = await pool.connect();
    const userId_Receiver = req.body.id;
    try{
        const {rows: reviews} =await ReviewModel.getReview(userId_Receiver,client);
        reviewsTrouble = false;
        reviews.forEach(review => {
            check = (review !== undefined);
            if(!check){
                reviewsTrouble = true;
            }
        });
        if(!reviewsTrouble){
            res.json(reviews)
        }
        else{
            res.sendStatus(400);
        }
    }
    catch(error){
        res.sendStatus(500);
    }
    finally{
        client.release();
    }
}



module.exports.getReviewISend = async(req,res)=>{
    const client = await pool.connect();
    const userid_sender = req.body.id;
    try{
        const{rows: reviews} = await ReviewModel.getReviewsISend(userid_sender, client);
        reviewsTrouble = false;
        reviews.forEach(review => {
            check = (review !== undefined);
            if(!check){
                reviewsTrouble = true;
            }
        });
        if(!reviewsTrouble){
            res.json(reviews)
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
 *      requestBodies:
 *          addReview:
 *              content:
 *                  application.json:
 *                      schema:
 *                          properties:
 *                              userid_receiver:
 *                                  type: integer
 *                              note:
 *                                  type: string
 *                              descriptionReview:
 *                                  type: string
 *                          required:
 *                              - userid_receiver
 *      responses:
 *          reviewAdded:
 *              description: la review a ete ajoutee
 *          reviewTrouble:
 *              description: "il y a eu une erreur lors de l'ajout de la review"
 *              
 */

module.exports.addReview = async (req, res) =>{
    const client = await pool.connect();
    const {userid_receiver, note, descriptionreview} = req.body;
    const userid_sender = req.session.userid;
    try{
        client.query("BEGIN");
        const {rows:checks} = await ReviewModel.getReviewsISend(userid_sender, client);
            faildCheck = false;
        checks.forEach(check =>{
            if(check.id == userid_receiver){
                faildCheck = true;
            }
        });
        if(!faildCheck){
            const reponse = await ReviewModel.addReview(userid_receiver,userid_sender, note, descriptionreview, client);
            if(reponse){
                client.query("COMMIT")
                res.sendStatus(201);
            }
            else{
                client.query("ROLLBACK");
                res.sendStatus(400);
            }
        }
        else{
            client.query("ROLLBACK");
            res.status(400).json({error:"Vous avez déja jugé cette personne "});
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
 *  requestBodies:
 *      majReview:
 *          content:
 *              application.json:
 *                  schema:
 *                      properties:
 *                          note:
 *                              type: string
 *                          descriptionReview:
 *                              type: string
 *                          userId_Receiver:
 *                              type: integer
 *  responses:
 *      updated:
 *          description: la mise a jour a ete effectuee
 *      pasPossible:
 *          description: pas possible de modifier cette review
 */

module.exports.updateReview = async (req, res) => {
    if(req.session){
        const userObj = req.session;
        const upToDate = req.body;
        const newData = {};
        let doUpdate = false;
        
        if(upToDate.note !== undefined ||upToDate.descriptionreview !== undefined){
                doUpdate = true;
        }
        
        if(doUpdate && upToDate.userid_receiver !== undefined){
            newData.note = upToDate.note;
            newData.descriptionreview = upToDate.descriptionreview;
            const client = await pool.connect();
            try{
                client.query("BEGIN");
                const {rows : reviewIds} = await ReviewModel.getReviewId(upToDate.userid_receiver,userObj.userid , client);
                const reviewId = reviewIds[0].id;
                console.log(reviewId)
                if(reviewId){
                    await ReviewModel.updateReview(
                        reviewId,
                        newData.note,
                        newData.descriptionreview,
                        client
                    );
                    client.query("COMMIT");
                    res.sendStatus(201);

                }
                else{
                    client.query("ROLLBACK");
                    res.status(401).json({error: "Aucun avis trouvé"});
                }
           }
            catch(error){
                client.query("ROLLBACK");
                res.sendStatus(500);
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
 *  components:
 *      responses:
 *          reviewDeleted:
 *              description: la review a ete supprimmee
 *          reviewNotFound:
 *              description: pas de review trouvee
 *          
 */
module.exports.deleteReview = async (req,res) =>{
    const client = await pool.connect();
    const userid_sender = req.session.userid
    const{userid_receiver} = req.params.userId_Receiver;
    try{
        const reponse = await ReviewModel.deleteReview(userid_receiver, userid_sender, client);
        if(reponse){
               res.sendStatus(204);
        }
        else{
             res.sendStatus(404);
           
        }
    }
    catch(error){
            res.sendStatus(500)
    }
    finally{
        client.release();
   }
}