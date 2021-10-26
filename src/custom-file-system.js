const {FileSystem} = require('ftp-srv');
const fs = require('fs')

class CustomFileSystem extends FileSystem {
    constructor() {
        super(...arguments);
    }

    mkdir(path) {
        super.mkdir(...arguments);
        const {fsPath} = this._resolvePath(path);
        console.log('создание каталога:', fsPath)
    }

    delete(path) {
        super.delete(...arguments);
        const {fsPath} = this._resolvePath(path);
        fs.stat(fsPath, (err, stats) => {
            if (err) {
                console.error(err)
                return
            }

            if (stats.isDirectory()) {
                console.log('удаление каталога:', fsPath)
            } else {
                console.log('удаление файла:', fsPath)
            }
        })
    }
}

module.exports = CustomFileSystem