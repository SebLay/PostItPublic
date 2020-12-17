const AnnonceController = require("../controleur/annonceDB");
const MiddlewareId = require("../Middleware/Authorization");
const MiddlewareAuth = require("../Middleware/jwtAuth");
const Router = require("express-promise-router");

const router = new Router;

/**
 * @swagger
 * /annonce/{id}:
 *  get:
 *      tags:
 *          - Annonce
 *      summary: "permet de rechercher une annonce précise"
 *      parameters:
 *          - name: id
 *            description: id de l'annonce
 *            in: path
 *            required: true
 *            schema:
 *                type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/annonceFound'
 *          400:
 *              $ref: '#/components/responses/badId'
 *          404:
 *              $ref: '#/components/responses/annonceNotFound'
 */

router.get('/:id', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, AnnonceController.getAnnonce);

/**
 * @swagger
 * /annonce:
 *  get:
 *      tags: 
 *          - Annonce
 *      summary: "Recherche les annonces de l'utlisateur actif"
 *      parameters:
 *          - name: id
 *            description: id de l'utilisateurs connecté
 *            in: header
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/mesAnnoncesTrouve'
 *          404:
 *              $ref: '#/components/responses/annoncesNotFound'
 *          500:
 *              description: Erreur serveur
 */
router.get('/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, AnnonceController.getMesAnnonces);

/**
 * @swagger
 * /annonce:
 *  post:
 *      tags:
 *          - Annonce
 *      summary: "Ajoute une annonce dans la BD"
 *      parameters:
 *          - name: id
 *            description: id de l'utilisateurs connecté
 *            in: header
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          201: 
 *              $ref: '#/components/responses/annonceAdded'
 *          404: 
 *              $ref: '#/components/responses/annonceNotFound'
 *          500:
 *              description: erreur serveur
 */
router.post('/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, AnnonceController.postAnnonce);

/**
 * @swagger
 * /annonce:
 *  patch:
 *      tags:
 *          - Annonce
 *      summary: "Met à jour une annonce"
 *      parameters:
 *          - name: idUser
 *            description: "id de l'utilisateur connecté"
 *            in: header
 *            required: true
 *            schema:   
 *              type: integer
 *      requestBody:
 *          $ref: '#/components/requestBodies/majAnnonce'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/annonceUpdated'
 *          404:
 *              $ref: '#/components/responses/annonceNotFound' 
 *          500:
 *              description: erreur serveur
 */

router.patch('/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, AnnonceController.updateAnnonce);

/**
 * @swagger
 * /annonce/{id}:
 *  delete:
 *      tags: 
 *          - Annonce
 *      summary: "Supprime une annonce de la base de donnée"
 *      parameters:
 *          - name: id
 *            description: "identifiant de l'annonce"
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *          - name: connectedId
 *            description: "identifiant de l'utilisateur connecté"
 *            in: header
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/adDeleted'
 *          500:
 *              description: Erreur Serveur
 *          404: 
 *              $ref: '#/components/responses/annonceNotFound'
 *          403:
 *              $ref: '#/components/responses/notOwner'
 */
router.delete('/:id',MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, AnnonceController.deleteAnnonce);

module.exports=router;