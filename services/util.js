const md5 = require('md5');
const config = require('../config/config.json');
const moment = require('moment');

module.exports = {
    isValidType(value, type) {
        switch (type) {
            case 'number':
                return !Number.isNaN(value);
            case 'string':
                return typeof value === 'string';
            case 'boolean':
                return [0, 1].indexOf(value) > -1;
            case 'timestamp':
                return moment(value).isValid();
            default: return false;
        }
    },
    encryptPass(password) {
        return md5(password, config.auth_salt);
    },
    sendSuccessResponse(res, data) {
        return res.status(200).json({
            status: 'success',
            data,
        })
    },
sendErrorResponse(res, error) {
        console.error(error);
        return res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
}