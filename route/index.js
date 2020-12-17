const AnnonceRouter= require('./annonce');
const UserRouter = require('./user');
const AdressRouter = require('./adress');
const CategoryRouter = require('./category');
const AnnonceCategoryRouter = require('./annonce_Category');
const ReviewRouter = require('./review');
const MessagesRouter = require('./message');
const ConnectionInfoRouter = require('./connectionInfo');
const LoginRouter = require('./login');
const UtilsAdminRouter = require('./utilsAdmin');
const router = require("express").Router();

router.use("/annonce",AnnonceRouter);
router.use("/user", UserRouter); 
router.use("/adress",AdressRouter);
router.use("/category",CategoryRouter);
router.use("/annonce_Category",AnnonceCategoryRouter);
router.use("/review",ReviewRouter);
router.use("/message", MessagesRouter);
router.use("/connect_Info", ConnectionInfoRouter);
router.use("/login", LoginRouter);
router.use("/utilsAdmin",UtilsAdminRouter);

module.exports=router;