require('dotenv').config()
const {FtpSrv, FileSystem} = require('ftp-srv');
const CustomFileSystem = require('./custom-file-system')
const User = require('./user')
const winston = require('winston');

const ftpServer = new FtpSrv();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({filename: 'src/storage/logs/events.log'}),
    ],
});

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

            // Установить рабочий каталог | Install the working directory
            resolve({
                fs: new CustomFileSystem(connection,{
                    root: `src/storage/disk`,
                })
            })

        } else {
            reject({message: user.getError()})
        }
    } else {
        resolve({
            fs: new CustomFileSystem(connection,{
                root: `src/storage/disk`,
            })
        })
    }
})

ftpServer.on('client-error', ({connection, context, error}) => {
    console.log(error.message)
});


ftpServer.listen().then(() => {

});