const MessageController = require("../controleur/messagesDB");
const MiddlewareId = require("../Middleware/Authorization");
const MiddlewareAuth = require("../Middleware/jwtAuth");
const Router = require("express-promise-router");

const router = new Router;

router.get('/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer ,MessageController.getMessage);
router.post('/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer,MessageController.addMessage);
router.patch('/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, MessageController.updateMessage);
router.delete('/', MiddlewareAuth.identification, MiddlewareId.mustbeAtLeastUSer, MessageController.deleteMessage);

module.exports = router;