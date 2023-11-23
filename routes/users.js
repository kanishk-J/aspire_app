var express = require('express');
const UserCtrl = require('../controllers/user');
const util = require('../services/util');
var router = express.Router();

router.get('/users', async (req, res) => {
    try {
        const user_service = new UserCtrl();
        const users = await user_service.getUsers();
        return util.sendSuccessResponse(res, users);
    } catch (err) {
        return util.sendErrorResponse(res, err);
    }
});

router.patch('/users/:id/modify_user_type', async (req, res) => {
    try {
        const { id: user_id } = req.params;
        const { user_type } = req.body;
        const user_service = new UserCtrl();
        await user_service.modifyUserType(user_id, user_type);
        return util.sendSuccessResponse(res, "success");
    } catch (err) {
        return util.sendErrorResponse(res, err);
    }
});

module.exports = router;
