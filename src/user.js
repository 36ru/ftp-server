class User {
    username = ''
    password = ''
    _error = []

    constructor(username, password) {
        this.username = username
        this.password = password
    }

    isLogin() {
        return true
    }

    getError() {
        return this._error
    }
}

module.exports = User