const ConnectionInfoController = require("../controleur/connectionInfo");
const MiddlewareId = require("../Middleware/Authorization");
const MiddlewareAuth = require("../Middleware/jwtAuth");
const Router = require("express-promise-router");

const router = new Router;

router.get('/getAllPseudos', MiddlewareAuth.identification, MiddlewareId.mustbeAdmin, ConnectionInfoController.getAllPseudo);


module.exports = router;