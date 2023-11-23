const jsonwebtoken = require('jsonwebtoken');
const config = require('../config/config.json');

function generateToken(user_details) {
    const secret = config.jwt.secret;
    const options = {
        expiresIn: '30d',
        audience: config.jwt.aud,
        algorithm: config.jwt.algo,
    }
    return new Promise((resolve, reject) => {
        jsonwebtoken.sign(user_details, secret, options, (err, token) => {
            if (err)
                return reject(err);
            return resolve(token);
        });
    });
}

function decodeToken(token) {
    if (!token) {
        throw new Error('jwt must be provided');
    } else if (typeof token !== 'string') {
        throw new Error('jwt must be a string');
    } else if (token.split('.').length !== 3) {
        throw new Error('not a standard jwt');
    }
    const decoded_token = jwtDecode(token);
    return decoded_token;
}

function validateToken(req, res, token) {
    if (!token) {
        throw new Error('jwt must be provided');
    } else if (typeof token !== 'string') {
        throw new Error('jwt must be a string');
    } else if (token.split('.').length !== 3) {
        throw new Error('not a standard jwt');
    }
    const payload = jsonwebtoken.verify(token, config.jwt.secret, { headers: true });
    return payload;
}

module.exports = {
    generateToken,
    validateToken,
}