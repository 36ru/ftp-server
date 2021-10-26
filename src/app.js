require('dotenv').config()
const {FtpSrv} = require('ftp-srv');
const CustomFileSystem = require('./custom-file-system')
const UserRepository = require('./user')
const winston = require('winston');

const ftpServer = new FtpSrv();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({filename: 'src/storage/logs/events.log'}),
    ],
});

const repository = new UserRepository()

ftpServer.on('login', ({connection, username, password}, resolve, reject) => {
    // проверка | check
    if (!repository.access(username, password)) {
        reject(new Error('Not authorization!'))
    }

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
        fs: new CustomFileSystem(connection, {
            root: `src/storage/disk`,
        })
    })

})

ftpServer.on('client-error', ({connection, context, error}) => {
    console.log(error.message)
});


repository.load().then(() => {
    return ftpServer.listen();
});

