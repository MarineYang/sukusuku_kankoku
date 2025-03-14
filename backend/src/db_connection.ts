import Container from "typedi";
import { DataSource, DataSourceOptions } from "typeorm";
import { env } from "./env";

// 전역 변수로 DataSource 인스턴스 선언
export let AppDataSource: DataSource;

export async function createDatabaseConnection(): Promise<DataSource> {
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
        
        console.log("db connection options:", connectionOpt);
        
        // DataSource 인스턴스 생성
        AppDataSource = new DataSource(connectionOpt);
        
        // DataSource 초기화
        await AppDataSource.initialize();
        console.log("db connection success");
        
        // TypeDI 컨테이너에 DataSource 등록
        Container.set(DataSource, AppDataSource);
        
        // 엔티티 확인 로그
        const entities = AppDataSource.entityMetadatas;
        console.log(`db load entities (${entities.length}개):`, entities.map(entity => entity.name));
        
        // 동기화 상태 확인
        if (connectionOpt.synchronize) {
            console.log("db schema sync success");
        }
        
        return AppDataSource;
    } catch (error) {
        console.error("db connection failed:", error);
        throw error;
    }
}

// 데이터베이스 연결 상태 확인 함수
export function checkDatabaseConnection(): boolean {
    return AppDataSource?.isInitialized || false;
}


