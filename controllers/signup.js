const User = require('../models/User');
const constants = require('../services/constants');
const util = require('../services/util');

class SignUpCtrl {

    constructor() {
        this.user_service = new User();
    }

    async signup(user_details) {
        this.#validatePayload(user_details);
        this.#validatePassword(user_details.password);
        if (await this.#userExists(user_details.email)) throw Error("A user with this email already exists");
        const { password } = user_details;
        user_details.password = util.encryptPass(password);
        const id = await this.user_service.insert(user_details);
        user_details.id = id;
        return user_details;
    }

    #validatePayload(params) {
        if (!(params.name && params.email && params.password)) throw Error('Invalid Payload');
    }

    #validatePassword(password) {
        if (password && password.length < constants.MIN_PASS_LENGTH) throw Error(`Password should be atleast ${constants.MIN_PASS_LENGTH} characters`);
    }

    async #userExists(email) {
        try {
            const user = await this.user_service.getOne({email});
            if (user) {
                return true;
            }
        } catch (err) {
            return false;
        }
    }
}

module.exports = SignUpCtrl;
