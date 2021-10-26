require('dotenv').config()
const {FtpSrv} = require('ftp-srv');
const CustomFileSystem = require('./custom-file-system')
const UserRepository = require('./user')
const logger = require('./logger');
const publicIp = require('public-ip');


(async () => {

    const ftpServer = new FtpSrv({
        url: 'ftp://0.0.0.0:21',
        pasv_url: await publicIp.v4(),
        pasv_min: 4000,
        pasv_max: 5000
    });

    const repository = new UserRepository();

    ftpServer.on('login', ({connection, username, password}, resolve, reject) => {
        // проверка | check
        const MODE = process.env.METHOD_AUTHORIZATION;

        // если разрешены только пользователи
        if (MODE === 'normal' && !repository.access(username, password)) {
            reject(new Error('Not authorization!'));
        }

        //если у нас разрешены анонимы и пользователи
        if (MODE === 'anonymous') {
            if (username !== 'anonymous' && !repository.access(username, password)) {
                reject(new Error('Not authorization!'));
            }
        }

        // Работа с файлами | Working with files

        // загрузка | upload
        connection.on('STOR', (error, fileName) => {
            logger.log('info', {
                event: "file:upload",
                path: fileName,
                src_ip: connection.ip
            });
        });

        // скачивание | download
        connection.on('RETR', (error, fileName) => {
            logger.log('info', {
                event: "file:download",
                path: fileName,
                src_ip: connection.ip
            });
        });

        // Установить рабочий каталог | Install the working directory
        resolve({
            fs: new CustomFileSystem(connection, {
                root: `storage`,
            })
        });

    });

    ftpServer.on('client-error', ({connection, context, error}) => {
        console.log(error.message);
    });


    repository.load().then(() => {
        return ftpServer.listen();
    });

})();


