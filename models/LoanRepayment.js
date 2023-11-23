const BaseModel = require('./BaseModel');

const spec = {
    id: {
        type: 'number',
    },
    amount: {
        type: 'number',
        required: true,
    },
    repayment_date: {
        type: 'timestamp',
        required: true,
    },
    loan_id: {
        type: 'number',
        required: true,
    },
    status: {
        type: 'string',
        default: 'PENDING',
    },
}

class LoanRepayment extends BaseModel {
    spec = spec;
    table = 'loan_repayments';
}

module.exports = LoanRepayment;
