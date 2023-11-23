const util = require('../services/util');
const LoanCtrl = require('../controllers/loan');

const router = require('express').Router();

router.get('/loans', async (req, res) => {
    try {
        const loan_service = new LoanCtrl();
        const loans = await loan_service.getAllLoans();
        return util.sendSuccessResponse(res, loans);
    } catch (err) {
        return util.sendErrorResponse(res, err);
    }
});

router.patch('/loans/:id/update_status', async (req, res) => {
    try {
        const loan_service = new LoanCtrl();
        const { status } = req.body;
        const loan_id = req.params.id;
        await loan_service.modifyLoan(loan_id, status);
        return util.sendSuccessResponse(res, "success");
    } catch (err) {
        return util.sendErrorResponse(res, err);
    }
});

module.exports = router;
