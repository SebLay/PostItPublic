const CategoryController = require("../controleur/categoryDB");
const MiddlewareId = require("../Middleware/Authorization");
const MiddlewareAuth = require("../Middleware/jwtAuth");
const Router = require("express-promise-router");

const router = new Router;

/**
 * @swagger
 * /category/{categoryWording}:
 *  get:
 *      tags:
 *          - Category
 *      summary: "recherche une categorie précise"
 *      parameters:
 *          - name: categoryWording
 *            description: nom de la categorie
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              $ref: '#/components/responses/categoryFound'
 *          404:
 *              $ref: '#/components/responses/categoryNotFound'
 *          500:
 *              $ref: '#/components/responses/ErreurServ'
 */

router.get('/:wording', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, CategoryController.getCategory);

/**
 * @swagger
 * /category/:
 *  get:
 *      tags:
 *          - Category
 *      summary: renvoie toutes les catégorie de la DB
 *      responses:
 *          200:
 *              $ref: '#/components/responses/categoriesFound'
 *          404:
 *              $ref: '#/components/responses/categoryNotFound'
 *          500:
 *              $ref: '#/components/responses/ErreurServ'
 */

router.get('/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, CategoryController.getAllCategory);

/**
 * @swagger
 *  /category/:
 *      post:
 *          tags:
 *              - Category
 *          summary: "Ajout d'une catégory"
 *          requestBody:
 *              $ref: '#/components/requestBodies/addCategory'
 *          responses:
 *              201: 
 *                  $ref: '#/components/responses/categoryAdded'
 *              500:
 *                  $ref: '#/components/responses/ErreurServ'
 */

router.post('/', MiddlewareAuth.identification, MiddlewareId.mustbeAdmin,CategoryController.addCategory);

/**
 * @swagger
 *  /category/:
 *      patch:
 *          tags:
 *              - Category
 *          summary: mise a jour d'une catégorie
 *          requestBody:
 *              $ref: '#/components/requestBodies/majCategory'
 *          responses:
 *              204:
 *                  $ref: '#/components/responses/majCategory'
 *              500:
 *                  $ref: '#/components/responses/ErreurServ'
 */
router.patch('/', MiddlewareAuth.identification, MiddlewareId.mustbeAdmin, CategoryController.updateCategory);

/**
 * @swagger
 *  /category/{categoryWording}:
 *      delete:
 *          tags:
 *              - Category
 *          summary: "Suppression d'une catégorie"
 *          parameters:
 *              - name: categoryWording
 *                description: nom de la categorie
 *                in: path
 *                required: true
 *                schema:
 *                  type: string
 *          responses:
 *              204:
 *                  $ref: '#/components/responses/categoryDeleted'
 *              500:
 *                  $ref: '#/components/responses/ErreurServ'
 */

router.delete('/:wording', MiddlewareAuth.identification, MiddlewareId.mustbeAdmin, CategoryController.deleteCategory);

module.exports =router;