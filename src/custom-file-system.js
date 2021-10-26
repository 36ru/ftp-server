const {FileSystem} = require('ftp-srv');
const fs = require('fs')
const util = require('util');
const fsStatAsync = util.promisify(fs.stat);
const logger = require('./logger');

class CustomFileSystem extends FileSystem {
    constructor(connection, path) {
        super(connection, path);
    }

    mkdir(path) {
        return super.mkdir(path).then(res => {
            logger.log('info', {
                event: "dir:create",
                path: res,
                src_ip: this.connection.ip,
                src_port: ''
            });
            return res;
        });
    }

    delete(path) {
        const {fsPath} = this._resolvePath(path);
        return fsStatAsync(fsPath).then((stat) => {
            logger.log('info', {
                event: stat.isDirectory() ? "dir:delete" : "file:delete",
                path: fsPath,
                src_ip: this.connection.ip,
                src_port: ''
            });
        }).then(() => {
            return super.delete(path);
        });
    }

    rename(from, to) {
        const {fsPath} = this._resolvePath(from);
        return fsStatAsync(fsPath).then((stat) => {
            logger.log('info', {
                event: stat.isDirectory() ? "dir:rename" : "file:rename",
                path: fsPath,
                src_ip: this.connection.ip,
                src_port: ''
            });
        }).then(() => {
            return super.rename(from, to);
        });
    }
}

module.exports = CustomFileSystem;