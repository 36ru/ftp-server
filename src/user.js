class User {
    username = ''
    password = ''
    _error = []

    constructor(username, password) {
    }

    isLogin() {
        return true
    }

    getError() {
        return this._error
    }
}

module.exports = User