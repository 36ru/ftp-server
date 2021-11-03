const {FileSystem} = require('ftp-srv');
const fs = require('fs')
const util = require('util');
const fsStatAsync = util.promisify(fs.stat);
const logger = require('./logger');

class CustomFileSystem extends FileSystem {
    constructor(connection, path) {
        super(connection, path);
    }

    async mkdir(path) {
        const res = await super.mkdir(path);
        logger.log('info', {
            event: "dir:create",
            path: res,
            src_ip: this.connection.ip
        });
        return res;
    }

    async delete(path) {
        const { fsPath } = this._resolvePath(path);
        const stat = await fsStatAsync(fsPath);
        logger.log('info', {
            event: stat.isDirectory() ? "dir:delete" : "file:delete",
            path: fsPath,
            src_ip: this.connection.ip
        });
        return super.delete(path);
    }

    async rename(from, to) {
        const { fsPath } = this._resolvePath(from);
        const stat = await fsStatAsync(fsPath);
        logger.log('info', {
            event: stat.isDirectory() ? "dir:rename" : "file:rename",
            path: fsPath,
            src_ip: this.connection.ip
        });
        return super.rename(from, to);
    }
}

module.exports = CustomFileSystem;