const router = require('express').Router();

const SignUpCtrl = require('../controllers/signup');
const util = require('../services/util');

router.post('/', async (req, res) => {
    try {
        const signup_ctrl = new SignUpCtrl();
        const user_details = req.body;
        const response = await signup_ctrl.signup(user_details);
        return util.sendSuccessResponse(res, response);
    } catch (err) {
        return util.sendErrorResponse(res, err);
    }
});

module.exports = router;
