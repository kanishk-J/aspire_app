const BaseModel = require('./BaseModel');

const spec = {
    id: {
        type: 'number',
    },
    amount: {
        type: 'number',
        required: true,
    },
    term: {
        type: 'number',
        required: true,
    },
    user_id: {
        type: 'number',
        required: true,
    },
    status: {
        type: 'string',
        default: 'PENDING',
    },
    created: {
        type: 'timestamp',
        required: true,
    }
}

class Loan extends BaseModel {
    spec = spec;
    table = 'loans';
}

module.exports = Loan;
