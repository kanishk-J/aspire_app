const authentication_service = require('../services/authentication');
const constants = require('../services/constants');
const ADMIN_API = '/v1/admin';
const USER_API = '/v1/app';

module.exports = {
    validateToken: () => async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization) return next(Error("Unauthorized"));
        const token = authorization.split(' ')[1];
        if (!token) return next(Error("Unauthorized"));
        try {
            const payload = await authentication_service.validateToken(req, res, token);
            req.user = payload;
            next();
        } catch (err) {
            next(Error("Unauthorized"));
        }
    },
    validateRoute: () => async (req, res, next) => {
        switch(req.user.user_type) {
            case constants.USER_TYPES.USER:
                if(req.originalUrl.includes(USER_API)) return next();
                return next(Error("Unauthorized"));
            case constants.USER_TYPES.ADMIN:
                if(req.originalUrl.includes(ADMIN_API)) return next();
                return next(Error("Unauthorized"));
            default: 
                return next(Error("Invalid user type"));
        }
    }
};