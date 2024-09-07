import { createLogger, transports, format } from 'winston';

const errorFilter = format((info) => {
    return info.level === 'error' ? info : false;
});

const otherErrorFilter = format((info) => {
    return info.level !== 'error' ? info : false;
});

const options = {
    file: {
        dirname: 'logs',
        filename: `app.log`,
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD hh:mm:ss',
            }),
            format.align(),
            format.metadata(),
            format.splat(),
            otherErrorFilter(),
            format.printf(({ level, message, metadata }) => {
                return `[${level}]: ${message}. ${JSON.stringify(metadata)}`;
            }),
        ),
    },
    error: {
        level: 'error',
        dirname: 'logs',
        filename: `error.log`,
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD hh:mm:ss',
            }),
            format.align(),
            format.metadata(),
            format.splat(),
            errorFilter(),
            format.printf(({ level, message, metadata }) => {
                return `[${level}]: ${message}. ${JSON.stringify(metadata)}`;
            }),
        ),
    },
    admin: {
        dirname: 'logs',
        filename: `admin.log`,
        defaultMeta: {
            service: 'admin-service',
        },
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD hh:mm:ss',
            }),
            format.align(),
            format.metadata(),
            format.splat(),
            otherErrorFilter(),
            format.printf(({ level, message, metadata }) => {
                return `[${level}]: ${message}. ${JSON.stringify(metadata)}`;
            }),
        ),
    },
    console: {
        handleExceptions: true,
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD hh:mm:ss',
            }),
            format.colorize(),
            format.align(),
            format.metadata(),
            format.printf(({ level, message, metadata }) => {
                return `[${level}]: ${message}. ${JSON.stringify(metadata)}`;
            }),
        ),
    },
};

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [
        new transports.Console(options.console),
        new transports.File(options.error),
        new transports.File(options.file),
    ],
    exitOnError: false,
});

// Créer un logger séparé pour les actions d'administration
const adminLogger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [
        new transports.File(options.admin),
    ],
    exitOnError: false,
});

export { logger, adminLogger };
