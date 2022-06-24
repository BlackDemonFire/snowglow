import { existsSync, mkdirSync } from "fs";
import winston, { createLogger } from "winston";
import config from "./config.js";

if (config.useLogs && !existsSync("logs")) mkdirSync("logs");

export const logger = createLogger({
    level: "info",
    transports: [
        new winston.transports.Console({
            format: winston.format.cli(),
        }),
    ],
});

if (config.useLogs) {
    [
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
            format: winston.format.json(),
        }),
        new winston.transports.File({
            filename: "logs/debug.log",
            level: "debug",
            format: winston.format.json(),
        }),
        new winston.transports.File({
            filename: "logs/info.log",
            level: "info",
            format: winston.format.json(),
        }),
        new winston.transports.File({
            filename: "logs/warn.log",
            level: "warn",
            format: winston.format.json(),
        }),
    ].forEach(logger.add);
}
