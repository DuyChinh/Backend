const userRepository = require("../repository/user.repository");
const userRepository = new UserRepository();
module.exports = {
    login: (email, password) => {
        return;
    },
    register:(attributes =  {}) => {
        return;
    },
    add: (data) => {
        return userRepository.create(data);
    }
}