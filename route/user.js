const UserController = require("../controleur/userDB");
const MiddlewareId = require("../Middleware/Authorization");
const MiddlewareAuth = require("../Middleware/jwtAuth");
const Router = require("express-promise-router");

const router = new Router;

/**
 * @swagger
 *  /user/{id}:
 *      get:
 *          tags:
 *              - User
 *          summary: recupere un utilisateur precis
 *          parameters:
 *              - name: id
 *                description: " id de l'utilisateur recherche"
 *                in: path
 *                required: true
 *                schema:
 *                  type: integer
 *          responses: 
 *              400:
 *                  $ref: '#/components/responses/notAId'
 *              200:
 *                  $ref: '#/components/responses/userFound'
 *              404:
 *                  $ref: '#/components/responses/userNotFound'
 *          
 */
router.get('/:id', MiddlewareAuth.identification, MiddlewareId.mustbeAdmin, UserController.getSpecifiedUser);
/**
 * @swagger
 *  /user/:
 *      get:
 *          tags:
 *              - User
 *          summary: recupere un utilisateur precis
 *          parameters:
 *              - name: id
 *                description: " id de l'utilisateur recherche"
 *                in: header
 *                required: true
 *                schema:
 *                  type: integer
 *          responses: 
 *              400:
 *                  $ref: '#/components/responses/notAId'
 *              200:
 *                  $ref: '#/components/responses/userFound'
 *              404:
 *                  $ref: '#/components/responses/userNotFound'
 *          
 */
router.get('/', MiddlewareAuth.identification,MiddlewareId.mustbeAtLeastUSer,UserController.getUser);

/**
 * @swagger
 *  /user/:
 *      post:
 *          tags: 
 *              - User
 *          requestBody:
 *              $ref: '#/components/requestBodies/addUser'
 *          responses:
 *              201:
 *                  $ref: '#/components/responses/userAdded'
 *              404:
 *                  $ref: '#/components/responses/userNotFound'
 *              500:
 *                  $ref: '#/components/responses/ErreurServ'
 */

//router.post('/', UserController.createUser);
router.post('/', UserController.createUserWithPseudo);
/**
 * @swagger
 *  /user/:
 *      patch:
 *          tags:
 *              - User
 *          requestBody:
 *              $ref: '#/components/requestBodies/majUser'
 *          responses:
 *              201:
 *                  $ref: '#/components/responses/userUpdated'
 *              500:
 *                  $ref: '#/components/responses/ErreurServ'
 *              400:
 *                  $ref: '#/components/responses/noMaj1'
 *              401:
 *                  $ref: '#/components/responses/noMaj2'
 */
router.patch('/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, UserController.updateUser);

/**
 * /user/otherUser/:
 *  patch:
 *      tags:
 *          - User
 *      requestBody:
 *          $ref: '#/components/requestBodies/majUser'
 *      response:
  *         500:
 *              $ref: '#/components/responses/ErreurServ'
 *          400:
 *              $ref: '#/components/responses/noMaj1'
 *          401:
*               $ref: '#/components/responses/noMaj2'
 */
router.patch('/otherUser/', MiddlewareAuth.identification,MiddlewareId.mustbeAdmin,UserController.updateOtherUser);
/**
 * @swagger
 * /user/{id}:
 *  delete:
 *      tags:
 *          - User
 *      parameters:
 *          - name: id
 *            description: id du user a supprimmer
 *            in: path
 *            required: true
 *            schema:       
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/userDeleted'
 *          401:
 *              $ref: '#/components/responses/notAId'
 *          403:
 *              $ref: '#/components/responses/PasLesDroits'
 *          500: 
 *              $ref: '#/components/responses/ErreurServ'
 *          
 */
router.delete('/:id', MiddlewareAuth.identification, MiddlewareId.mustbeAdmin, UserController.deleteUser);
module.exports = router;