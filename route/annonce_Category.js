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

router.patch('/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, Annonce_CategoryController.updateCategory);

router.delete('/',MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, Annonce_CategoryController.deleteAnnonceCategory);

module.exports = router;