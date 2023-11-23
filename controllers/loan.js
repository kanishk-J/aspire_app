const Loan = require('../models/Loan');
const LoanRepayment = require('../models/LoanRepayment');
const constants = require('../services/constants');
const db = require('../services/database');
const moment = require('moment');
const _ = require('lodash');

class LoanCtrl {
    constructor() {
        this.loan_service = new Loan();
        this.loan_repayment_service = new LoanRepayment();
    }

    async createLoan(loan_details, user) {
        const trx = await db.transaction();
        try {
            loan_details.created = moment().format('YYYY-MM-DD');
            loan_details.user_id = user.id;
            const id = await this.loan_service.insert(loan_details, trx);
            loan_details.id = id;
            await this.createRepayments(loan_details, trx);
            await trx.commit();
            return loan_details;
        } catch (err) {
            await trx.rollback();
            throw err;
        }
    }

    async createRepayments(loan, trx) {
        const repayments = this.#buildLoanRepaymentSchedule(loan);
        await this.loan_repayment_service.insertMany(repayments, trx);
    }

    #buildLoanRepaymentSchedule(loan) {
        const repayments = [];
        for (const week of _.range(loan.term)) {
            repayments.push({
                amount: Math.round(loan.amount * 100 / loan.term) / 100,
                repayment_date: moment(loan.created).add((week + 1) * 7, 'days').format('YYYY-MM-DD'),
                loan_id: loan.id,
            });
        }
        return repayments;
    }

    async getUserLoans(user_id) {
        const loans = await this.loan_service.get({ user_id });
        return loans;
    }

    async getRepayments(loan_id, user_id) {
        const loan = await this.loan_service.getOne({ id: loan_id, user_id });
        if (!loan) throw Error("Resource not present or not accessible");
        const repayments = await this.loan_repayment_service.get({ loan_id });
        return repayments;
    }

    async repay(loan_id, repayment_id, user_id) {
        const loan = await this.loan_service.getOne({ id: loan_id, user_id });
        if (!loan) throw Error("Resource not present or not accessible");
        if (loan.status !== constants.LOAN.STATUS.APPROVED) {
            throw Error("Cannot repay loan until it's approved");
        }
        const repayment = await this.loan_repayment_service.getOne({id: repayment_id});
        if (!repayment) throw Error("Resource not present or not accessible");
        if (repayment.status === constants.LOAN_REPAYMENT.STATUS.PAID) {
            throw Error("EMI already paid");
        }
        const trx = await db.transaction();
        try {
            await this.loan_repayment_service.update({ status: constants.LOAN_REPAYMENT.STATUS.PAID, id: repayment_id }, trx);
            const repayments = await this.loan_repayment_service.get({ loan_id }, trx);
            let is_paid = true;
            repayments.forEach(repayment => {
                if (repayment.status != constants.LOAN_REPAYMENT.STATUS.PAID) {
                    is_paid = false;
                    return;
                }
            });
            if (is_paid) {
                this.loan_service.update({ id: loan_id, status: constants.LOAN.STATUS.PAID }, trx);
            }
            await trx.commit();
            return "success";
        } catch (err) {
            await trx.rollback();
            throw err;
        }
    }

    async getAllLoans() {
        const loans = await this.loan_service.get({});
        return loans;
    }

    async modifyLoan(loan_id, status) {
        if (!constants.LOAN.STATUS[status]) throw Error("Unknown loan status");
        await this.loan_service.update({ id: loan_id, status: status });
        return "success";
    }
}

module.exports = LoanCtrl;
