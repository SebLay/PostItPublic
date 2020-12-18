const ConnectionInfoController = require("../controleur/connectionInfo");
const MiddlewareId = require("../Middleware/Authorization");
const MiddlewareAuth = require("../Middleware/jwtAuth");
const Router = require("express-promise-router");

const router = new Router;

/**
 * @swagger
 * /connect_info/{pseudo}:
 *  get:
 *      tags:
 *          - Connection_Info
 *      summary: recupere les infos de connection (pour les admins)
 *      parameters:
 *          - name: pseudo
 *            description: pseudo d'utilisateur
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          201:
 *              $ref: '#/components/responses/infoFound'
 *          404:
 *              $ref: '#/components/responses/infoNotFound'
 *          500:
 *              $ref: '#/components/responses/ErreurServ'
 */

router.get('/:pseudo',MiddlewareAuth.identification, MiddlewareId.mustbeAdmin ,ConnectionInfoController.getPrecisedConnectionInfo);

/**
 * @swagger
 * /connect_info/:
 *  get:
 *      tags:
 *          - Connection_Info
 *      summary: recupere les infos de connection
 *      parameters:
 *          - name: pseudo
 *            description: pseudo d'utilisateur
 *            in: header
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          201:
 *              $ref: '#/components/responses/infoFound'
 *          404:
 *              $ref: '#/components/responses/infoNotFound'
 *          500:
 *              $ref: '#/components/responses/ErreurServ'
 */

router.get('/',MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, ConnectionInfoController.getConnectionInfo);

/**
 * @swagger
 * /connect_info/{id}:
 *  get:
 *      tags:
 *          - Connection_Info
 *      summary: recupere les infos
 *      parameters:
 *          - name: id
 *            description: id de l'utilisateurs
 *            in: path
 *            required : true
 *            schema:
 *              type: integer
 *      responses:
 *          201:
 *              $ref: '#/components/responses/infoFound'
 *          400:
 *              description: "l'id reçu n'est pas un nombre"
 *          404:
 *              description: pas de pseudo trouve
 *          500:
 *              $ref: '#/components/responses/ErreurServ'        
 */

router.get('/pseudo/:id',MiddlewareAuth.identification, MiddlewareId.mustbeAdmin, ConnectionInfoController.getPrecisedPseudo);

/**
 * @swagger
 * /connection_info/all:
 *      get:
 *          tags:
 *              - Connection_Info
 *          summary: recupere tous les pseudos
 *          responses:
 *              201:
 *                  description: renvoie tous les pseudos de la DB
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type : array
 *                              items: 
 *                                  type: string
 *                              
 *              400:
 *                  description: "l'id reçu n'est pas un nombre"
 *              404:
 *                  description: pas de pseudo trouve
 *              500:
 *                  $ref: '#/components/responses/ErreurServ' 
 */

router.get('/all', MiddlewareAuth.identification, MiddlewareId.mustbeAdmin, ConnectionInfoController.getAllPseudo);
/**
 * @swagger
 *  /connect_info/:
 *      post:
 *          tags:
 *              - Connection_Info
 *          summary: ajoute les infos de connection a son utilisateur
 *          requestBody:
 *              $ref: '#/components/requestBodies/addConnectInfo'
 *          responses:
 *              201:
 *                  $ref: '#/components/responses/infoAdded'
 *              500:
 *                  $ref: '#/components/responses/ErreurServ'
 */
router.post('/', ConnectionInfoController.addConnectionInfo);
/**
 * @swagger
 *  /connect_info/:
 *      patch:
 *          tags: 
 *              - Connection_Info
 *          summary: change le mot de passe 
 *          parameters:
 *              - name:  userId
 *                description: "id de l'utilisateur connecte"
 *                in: header
 *                required: true
 *                schema: 
 *                  type: string
 *          requestBody:
 *              $ref: '#/components/requestBodies/majMdp'
 *          responses:
 *              201:
 *                  $ref: '#/components/responses/passwordUpdated'
 *              401:
 *                  $ref: '#/components/responses/pasLesDroit'
 *              500:
 *                  $ref: '#/components/responses/ErreurServ'
 */

router.patch('/',MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer ,ConnectionInfoController.updatePassword);

module.exports = router;