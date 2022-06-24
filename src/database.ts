import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "./config.js";
import { ReactionRole } from "./entity/ReactionRole.js";

export const database = new DataSource({
    type: "postgres",
    synchronize: true,
    logging: true,
    entities: [ReactionRole],
    migrations: [],
    subscribers: [],
    applicationName: "snowglow",
    ...config.db,
});
await database.initialize();
