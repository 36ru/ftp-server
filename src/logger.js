const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({filename: 'src/storage/logs/events.log'}),
    ],
});

module.exports = logger