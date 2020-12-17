const Router = require("express-promise-router");
const router = new Router;
const LoginController = require('../controleur/Login');

/**
 * @swagger
 *  /login/:
 *      post:
 *          tags:
 *              - Login
 *          summary: "genere un jwt token de 24h pour utiliser l'api"
 *          requestBody:
 *              $ref: '#/components/requestBodies/login'
 *          responses:
 *              404:
 *                  $ref: '#/components/responses/loginInconnu'
 *              201: 
 *                  $ref: '#/components/responses/loginOk'
 *              500: 
 *                  $ref: '#/components/responses/ErreurServ'
 */

router.post('/',  LoginController.login);

module.exports = router;