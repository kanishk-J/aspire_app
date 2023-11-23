var express = require('express');
var router = express.Router();
const auth_middleware = require('../middlewares/auth_middleware');

router.use('/signup', require('./signup'));
router.use('/login', require('./login'));
router.use('/v1', auth_middleware.validateToken(), auth_middleware.validateRoute());
router.use('/v1/app', require('./app'));
router.use('/v1/admin', require('./admin'), require('./users'));

module.exports = router;
