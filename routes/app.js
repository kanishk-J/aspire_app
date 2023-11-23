const util = require('../services/util');
const LoanCtrl = require('../controllers/loan');

const router = require('express').Router();

router.get('/loans', async (req, res) => {
    try {
        const {id} = req.user;
        const loan_service = new LoanCtrl();
        const loans = await loan_service.getUserLoans(id);
        return util.sendSuccessResponse(res, loans);
    } catch (err) {
        return util.sendErrorResponse(res, err);
    }
});

router.post('/loans', async (req, res) => {
    const loan = req.body;
    const user = req.user;
    const loan_service = new LoanCtrl();
    try {
        const response = await loan_service.createLoan(loan, user);
        return util.sendSuccessResponse(res, response);
    } catch (err) {
        return util.sendErrorResponse(res, err);
    }
});

router.patch('/loans/:id/repay/:payment_id', async (req, res) => {
    try {
        const loan_id = req.params.id;
        const payment_id = req.params.payment_id;
        const { id: user_id } = req.user;
        const loan_service = new LoanCtrl();
        const response = await loan_service.repay(loan_id, payment_id, user_id);
        return util.sendSuccessResponse(res, response);
    } catch (err) {
        return util.sendErrorResponse(res, err);
    }
});

router.get('/loans/:id/repayments', async (req, res) => {
    try {
        const loan_id = req.params.id;
        const { id: user_id } = req.user;
        const loan_service = new LoanCtrl();
        const response = await loan_service.getRepayments(loan_id, user_id);
        return util.sendSuccessResponse(res, response);
    } catch (err) {
        return util.sendErrorResponse(res, err);
    }
});

module.exports = router;
