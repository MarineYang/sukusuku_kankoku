import Container from "typedi";
import { DataSource, DataSourceOptions } from "typeorm";
import { env } from "./env";

export async function createDatabaseConnection(): Promise<void> {
    try {
        let connectionOpt: DataSourceOptions = {
            type: 'mysql',
            host: env.database_local.host,
            port: env.database_local.port,
            username: env.database_local.username,
            password: env.database_local.password,
            database: env.database_local.name,
            synchronize: env.database_local.synchronize,
            logging: env.database_local.logging,
            entities: [__dirname + "/entities/*{.ts,.js}"],
            dateStrings: true,
            connectTimeout: 60 * 1000,
            acquireTimeout: 60 * 1000,
            timezone: 'Z',
            //migrations: [__dirname + "/Migrations/*{.ts,.js}"],
            // cli: 
            // {
            //     "migrationsDir": __dirname + "/migrations"
            // }
        }
        
        console.log(connectionOpt);
        
        const dataSource = new DataSource(connectionOpt);
        await dataSource.initialize();

    } catch (error) {
        throw error;
    }
}


