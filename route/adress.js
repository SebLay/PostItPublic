


const AdressController = require("../controleur/adressDB");
const MiddlewareId = require("../Middleware/Authorization");
const MiddlewareAuth = require("../Middleware/jwtAuth");
const Router = require("express-promise-router");

const router = new Router;

/**
 * @swagger
 *  /adress/{id}:
 *   get:
 *      tags:
 *          - Adress
 *      summary: "permet de rechercher une adresse précise"
 *      parameters:
 *          - name: id
 *            description: ID d'une Adress
 *            in: path
 *            required: true
 *            schema:
 *              type : integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/produitFound'
 *          404:
 *              $ref: '#/components/responses/adressNotFound'
 *          500:
 *              $ref: '#/components/responses/badId'
 *      
 */

router.get('/:id', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, AdressController.getAdress);

/**
 * @swagger
 * /adress:
 *  post:
 *      tags:
 *          - Adress
 *      summary: "Ajoute une adresse a une annonce"
 *      requestBody:
 *          $ref: '#/components/requestBodies/addAdress'
 *      responses:
 *          201: 
 *              $ref: '#/components/responses/adressAdded'
 *          500: 
 *              description: "Erreur serveur"
 */
router.post('/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, AdressController.addAdress);

/**
 * @swagger
 * /adress:
 *  patch:
 *      tags:
 *          - Adress
 *      summary: "Met a jour une adresse"
 *      requestBody:
 *          $ref: '#/components/requestBodies/updateAdress'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/adressUpdated'
 *          500:
 *              description: "Erreur serveur"
 */
router.patch('/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, AdressController.updateAdress);

/**
 * @swagger
 * /adress/{id}:
 *  delete:
 *      tags:
 *          - Adress
 *      summary: "supprime l'adresse ciblée"
 *      parameters:
 *          - name: "Token"
 *            in: header
 *            required: true
 *            schema:
 *              type: string
 *          - name: id
 *            in: path
 *            description: id de l'adresse a supprimmer
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          400:
 *              $ref: '#/components/responses/badId'
 *          204:
 *              $ref: '#/components/responses/adressDeleted'
 *          500:
 *              description: Erreur Serveur
 */
router.delete('/:id', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, AdressController.deleteAdress);

module.exports = router;