const Annonce_CategoryController = require("../controleur/annonce_CategoryBD");
const MiddlewareId = require("../Middleware/Authorization");
const MiddlewareAuth = require("../Middleware/jwtAuth");
const Router = require("express-promise-router");

const router = new Router;

/**
 * @swagger
 *  /annonce_Category/{annonceId}:
 *   get:
 *      tags:
 *          - Annonce_Category
 *      parameters:
 *         - name: annonceId
 *           description: Id de l'annonce choisie
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *      responses:
 *          400:
 *              $ref: '#/components/responses/annonceError'
 *          500:
 *              description: erreur serveur
 */
router.get('/:annonceId', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer , Annonce_CategoryController.getCategory);

/**
 * @swagger
 *  /annonce_Category/:
 *      post:
 *          tags:
 *              - Annonce_Category
 *          summary: "permet d'ajouter une catégorie a une annonce"
 *          requestBody:
 *              $ref: '#/components/requestBodies/addCategoryToAnnonce'
 *          responses:
 *              201:
 *                  $ref: '#/components/responses/categoryAddedToAnnonce'
 *              500:
 *                  description: erreur serveur
 */

router.post('/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer , Annonce_CategoryController.addCategoryToAnnnonce);

/**
 * @swagger
 * /annonce_Category/:
 *  patch:
 *      tags:
 *          - Annonce_Category
 *      requestBody:
 *          $ref: '#/components/requestBodies/addCategoryToAnnonce'
 *      responses:
 *          201:
 *              description : categorie modifiée
 *          500:
 *              $ref: '#/components/responses/ErreurServ'
 */

router.patch('/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, Annonce_CategoryController.updateCategory);

/**
 * @swagger
 * /annonce_Category/:
 *  delete:
 *      tags:
 *          - Annonce_Category
 *      responses:
 *          201: 
 *              description: suppression réussie
 *          400:
 *              description: erreur lors de la mise a jour
 *          500:
 *              $ref: '#/components/responses/ErreurServ'
 */

router.delete('/',MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, Annonce_CategoryController.deleteAnnonceCategory);

module.exports = router;