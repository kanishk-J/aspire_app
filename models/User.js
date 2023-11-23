const BaseModel = require('./BaseModel');

const spec = {
    id: {
        type: 'number',
    },
    name: {
        type: 'string',
        required: true
    },
    email: {
        type: 'string',
        required: true,
    },
    password: {
        type: 'string',
        required: true,
    },
    user_type: {
        type: 'string',
    }
}

class User extends BaseModel {
    spec = spec;
    table = 'users';
}

module.exports = User;
