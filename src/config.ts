import "dotenv/config";
import { logger } from "./logger.js";

interface IDBConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

class Config {
    token: string;
    db: IDBConfig;
    constructor() {
        this.token =
            process.env.TOKEN ||
            (() => {
                logger.error("There was no `TOKEN` supplied in the .env file.");
                process.exit(1);
            })();
        this.db = {
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USER || "snowglow",
            password: process.env.DB_PASSWORD || "",
            database: process.env.DB_NAME || "snowglow",
        };
    }
}
export default new Config();
