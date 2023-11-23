const db = require('./services/database');
const config = require('./config/config.json');
const util = require('./services/util');
const constants = require('./services/constants');

const data = {
    users: [
        {
            name: 'kanishk',
            email: 'kanishk@gmail.com',
            password: util.encryptPass('12345678'),
            user_type: constants.USER_TYPES.USER,
        },
        {
            name: 'aspire',
            email: 'admin@aspire.com',
            password: util.encryptPass('12345678'),
            user_type: constants.USER_TYPES.ADMIN,
        }
    ]
}

async function seedData() {
    if (!config.seed) return;
    await db('users').del();
    await db('users').insert(data.users);
}

module.exports = {
    seedData
}