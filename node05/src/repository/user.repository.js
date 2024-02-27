const Repository = require("../../core/repository");
const { User } = require("../models/index");
module.exports = class extends Repository {
    getModel() {
        return User;
    }
}