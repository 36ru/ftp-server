const path = require('path');
const fs = require('fs-extra');

class UserRepository {
    _users = [];
    _file = '';

    constructor(usersFile = '/users/users.dat') {
        this._file = path.resolve(usersFile);
    }

    async load() {
        let data = await fs.readFile(this._file);
        this._users = data.toString().split(/\r\n|\r|\n/g).map((line) => {
            line = line.split(':');
            if (!line.length) {
                return null;
            }
            return {
                login: line[0],
                password: line[1]
            }
        }).filter(Boolean);
    }

    access(login, password) {
        return this._users.some((user) => {
            return user.login === login && user.password === password;
        })
    }
}

module.exports = UserRepository;