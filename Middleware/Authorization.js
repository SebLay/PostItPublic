/**
 * @swagger
 *  components:
 *      responses:
 *          pasLesDroits:
 *              description: vous ne correspondes pas aux critere pour acceder a cette fonction
 */

module.exports.mustbeAdmin = (req, res, next) => {
    if( req.session && req.session.authLevel === "admin"){
        next();
    }
    else{
        res.sendStatus(403);
    }
}

module.exports.mustbeAtLeastUSer = (req, res, next) =>{
    if(req.session && (req.session.authLevel ==="user" || req.session.authLevel === "admin" )){
        next();
    }
    else{
        res.sendStatus(403);
    }
}

