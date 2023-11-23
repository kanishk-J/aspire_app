const User = require("../models/User");
const constants = require("../services/constants");

class UserCtrl {
    constructor() {
        this.user_service = new User();
    }

    async modifyUserType(user_id, user_type) {
        if (!constants.USER_TYPES[user_type]) throw Error("Unknown user type");
        const user = await this.user_service.getOne({ id: user_id });
        if (!user) throw Error("User not found in database");
        await this.user_service.update({ id: user_id, user_type });
    }

    async getUsers() {
        const users = await this.user_service.get({});
        return users;
    }
}

module.exports = UserCtrl;
