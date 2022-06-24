import "dotenv/config";

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
    useLogs: boolean;
    constructor() {
        this.token =
            process.env.TOKEN ||
            (() => {
                console.error(
                    "There was no `TOKEN` supplied in the .env file."
                );
                process.exit(1);
            })();
        this.db = {
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USER || "snowglow",
            password: process.env.DB_PASSWORD || "",
            database: process.env.DB_NAME || "snowglow",
        };
        this.useLogs = process.env.USE_LOGS == "1";
    }
}
export default new Config();
