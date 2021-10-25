require('dotenv').config()
const {FtpSrv, FileSystem} = require('ftp-srv');
const User = require('./user')
const winston = require('winston');

const ftpServer = new FtpSrv({
    blacklist: []
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({filename: 'src/storage/logs/events.log'}),
    ],
});

class MyFileSystem extends FileSystem {
    constructor() {
        super(...arguments);
    }

    mkdir(path) {
        super.mkdir(...arguments);
        logger.log('info', {
            event: "catalog:delete",
            path: path,
            src_ip: '',
            src_port: ''
        });
    }
}

ftpServer.on('login', ({connection, username, password}, resolve, reject) => {
    if (process.env.METHOD_AUTHORIZATION === 'normal') {
        const user = new User(username, password)


        // проверка | check
        if (user.isLogin()) {

            // Работа с файлами | Working with files

            // загрузка | upload
            connection.on('STOR', (error, fileName) => {
                logger.log('info', {
                    event: "file:upload",
                    path: fileName,
                    src_ip: connection.ip,
                    src_port: ''
                });
            });

            // скачивание | download
            connection.on('RETR', (error, fileName) => {
                logger.log('info', {
                    event: "file:download",
                    path: fileName,
                    src_ip: '',
                    src_port: ''
                });
            });

            // удаление | delete
            connection.on('DELE', (error, fileName) => {
                logger.log('info', {
                    event: "file:delete",
                    path: fileName,
                    src_ip: '',
                    src_port: ''
                });
            });

            // Работа с каталогами | Working with catalogs

            // создать | create
            connection.on('MKD', (error, fileName) => {
                console.log('Создать каталог')
            });

            // удалить | delete
            connection.on('RMD', (error, fileName) => {
                console.log('Удалить каталог')
            });

            // переименовать во что | rename
            connection.on('RNTO', (error, fileName) => {
                console.log('Переименовано')
            });

            // Установить рабочий каталог | Install the working directory
            resolve({
                fs: new MyFileSystem(connection,{
                    root: `src/storage/disk`,
                })
            })

        } else {
            reject({message: user.getError()})
        }
    } else {
        resolve({root: `src/disk`})
    }
})

ftpServer.on('client-error', ({connection, context, error}) => {
    console.log(error.message)
});


ftpServer.listen().then(() => {

});