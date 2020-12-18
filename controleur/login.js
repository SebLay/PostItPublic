require("dotenv").config();
const process= require('process');
const jwt = require('jsonwebtoken');

const pool = require('../modele/database');
const LoginModel= require('../modele/login');

/**
 * @swagger
 *  components:
 *      requestBodies:
 *          login:
 *              content:
 *                  application.json:
 *                      schema:
 *                          properties:
 *                              pseudo:
 *                                  type: string
 *                              password:
 *                                  type: string
 *      responses:
 *          loginInconnu:
 *              description: aucun utilisateurs sous ce login existe
 *          loginOk:
 *              description: retourne un jwtToken
 *              content:
 *                  application/json:
 *                       schema:
 *                           properties:
 *                               token:
 *                                   type: string
 */

module.exports.login = async (req, res)=>{
    const {pseudo, password}= req.body;
    if(pseudo ===undefined || password ===undefined){
        res.sendStatus(400);
    }
    else{
        const client = await pool.connect();
        try{
            const result=await LoginModel.getUserLog(pseudo, password,client);
            const{userType , value} =result;
            if(userType === 'inconnu'){
                res.sendStatus(404);
            }
            else if(userType === "admin"){
                const {userid,pseudo} = value;
                const payload = {status : userType, value: {userid, pseudo}};
                const token = jwt.sign(payload, process.env.SECRET_TOKEN,{expiresIn:'1d'});
                res.json(token);
            }
            else{
                const {userid, pseudo} = value;
                const payload = {status: userType, value:{userid, pseudo}};
                const token =jwt.sign(payload,process.env.SECRET_TOKEN,{expiresIn:'1d'});
                res.json(token);
            }
        } catch(error){
            console.log(error);
            res.sendStatus(500);

        } finally{
            client.release();
       }
    }
}