const config = require('../config/config.json');
const { knex } = require('knex');
const debug = config.env === 'dev';

const db = knex({
    client: 'mysql2',
    connection: {
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.db,
        decimalNumbers: true,
    },
    debug: debug,
    pool: {
        min: 0,
        max: 3,
    },
    acquireConnectionTimeout: 3600 * 1000
});

module.exports = db;
