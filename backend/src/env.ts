import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

export const env = {
    app: {
        port: Number(process.env.PORT) || 3000,
        apiPrefix: process.env.API_PREFIX || "/api",
        jwtAccessSecret: process.env.JWT_SECRET_ACCESS_KEY,
        jwtRefreshSecret: process.env.JWT_SECRET_REFRESH_KEY,
    },
    database_local: {
        host: process.env.LOCAL_DB_HOST,
        port: Number(process.env.LOCAL_DB_PORT) || 3306,
        username: process.env.LOCAL_DB_USER,
        password: process.env.LOCAL_DB_PASSWORD,
        name: process.env.LOCAL_DB_NAME,
        synchronize: process.env.TYPEORM_SYNCHRONIZE === "true",
        logging: process.env.TYPEORM_LOGGING === "false",
        connectTimeout: 1000,
    },
    Redis_local: {
        local_host: process.env.REDIS_LOCAL_HOST,
        local_port: Number(process.env.REDIS_LOCAL_PORT) || 6379,
    },
}