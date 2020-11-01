const winston = require ('winston');
const config = require('../config');

const incluirFecha = winston.format((info)=>{
    info.message = `${new Date().toISOString()} ${info.message}`
    return info;
})

const logger = winston.createLogger({
    transports:[
        new winston.transports.Console({
            level: config.suprimirLogs ? 'error' : 'debug', // ajusto el nivel según el ambiente
            handleExceptions:true,
            format:winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            level:'info',
            handleExceptions:true,
            format: winston.format.combine(
                incluirFecha(),
                winston.format.simple()
            ),
            maxsize:5120000,
            maxFiles:5,
            filename:`${__dirname}/../logs/logs-de-aplicacion.log`
        })
    ]
})

module.exports = logger;