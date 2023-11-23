const router = require('express').Router();
const LoginCtrl = require('../controllers/login');
const util = require('../services/util');

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) throw Error("Invalid email id");
        if (!password) throw Error("Invalid password");
        const login_service = new LoginCtrl();
        const token = await login_service.login(email, password);
        return util.sendSuccessResponse(res, token);
    } catch (err) {
        util.sendErrorResponse(res, err);
    }
});

module.exports = router;