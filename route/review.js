const ReviewController = require("../controleur/reviewDB");
const MiddlewareId = require("../Middleware/Authorization");
const MiddlewareAuth = require("../Middleware/jwtAuth");
const Router = require("express-promise-router");


const router = new Router;

/**
 * @swagger
 *  /review/MyReview/:
 *      get:
 *          tags:
 *              - Review
 *          parameters:
 *              - name: userIdReceiver
 *                description: "c'est le user id de l'utilisateur connecté"
 *                in: header
 *                required: true
 *                schema:
 *                  type: integer
 *          responses:
 *              201:
 *                  $ref: '#/components/responses/reviewFound'
 *              404:
 *                  $ref: '#/components/responses/reviewNotFound'
 *              500:
 *                  $ref: '#/components/responses/ErreurServ'
 */


router.get('/ReviewUserGet/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, ReviewController.getReview);

/**
 * @swagger
 * /review/ReviewISend/:
 *  get:
 *      tags:
 *          - Review
 *      parameters:
 *          - name: userIdSender
 *            description: "id de l'utilisateur connecte"
 *            in: header
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *              201:
 *                  $ref: '#/components/responses/reviewFound'
 *              404:
 *                  $ref: '#/components/responses/reviewNotFound'
 *              500:
 *                  $ref: '#/components/responses/ErreurServ'
 *              
 */
router.get('/ReviewUserSend/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, ReviewController.getReviewISend);

/**
 * @swagger
 * /review/:
 *  post:
 *      tags:
 *          - Review
 *      summary: ajoute une review a un utilisateur cible
 *      parameters:
 *          - name: userid_sender
 *            description: "id de l'utilisateur connecté"
 *            in: header
 *            required: true
 *            schema:
 *              type: integer
 *      requestBody:
 *          $ref: '#/components/requestBodies/addReview'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/reviewAdded'
 *          404:
 *              $ref: '#/components/responses/reviewTrouble'
 *          500:
 *              $ref: '#/components/responses/ErreurServ'
 */
router.post('/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer,  ReviewController.addReview);

/**
 * @swagger
 *  /review/:
 *      patch:
 *          tags:
 *              - Review
 *          parameters:
 *              - name: userid_Sender
 *                description: "id de l'utilisasteur connecte"
 *                in: header
 *                required: true
 *                schema:
 *                  type: integer
 *          requestBody:
 *              $ref: '#/components/requestBodies/majReview'
 *          responses:
 *              201:
 *                  $ref: '#/components/responses/updated'
 *              401:
 *                  $ref: '#/components/responses/pasPossible'
 */

router.patch('/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, ReviewController.updateReview);


/**
 * @swagger
 *  /review/{userId_Receiver}:
 *      delete:
 *          tags:
 *              - Review
 *          parameters:
 *              - name: userId_Receiver
 *                description: "id de l'utilisateur cible par la review"
 *                in: path
 *                required: true
 *                schema: 
 *                  type: integer
 *              - name: userId_Sender
 *                description: "id de l'utilisateur connecte"
 *                in: header
 *                schema:
 *                  type: integer
 *          responses:
 *              204:
 *                  $ref: '#/components/responses/reviewDeleted'
 *              404:
 *                  $ref: '#/components/responses/reviewNotFound'
 *              500: 
 *                  $ref: '#/components/responses/ErreurServ'
 */
router.delete('/:userId_Receiver',MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, ReviewController.deleteReview);

module.exports = router;