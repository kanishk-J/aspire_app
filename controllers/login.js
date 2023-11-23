const User = require('../models/User');
const util = require('../services/util');
const authentication_service = require('../services/authentication');

class LoginCtrl {
    constructor() {
        this.user_service = new User();
    }

    async login(email, password) {
        const user = await this.#getUser(email);
        if (!user.password === util.encryptPass(password)) throw Error("Incorrect email and password combination");
        const token = await authentication_service.generateToken(user);
        return token;
    }

    #getUser(email) {
        try {
            const user = this.user_service.getOne({email});
            return user;
        } catch (err) {
            throw Error("User not found in database");
        }
    }
}

module.exports = LoginCtrl;
