require('dotenv').config();
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from 'config';

const postgresConfig = config.get<{
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}>('postgresConfig');
  
export const myDataSource = new DataSource({
    ...postgresConfig,
    type: "postgres",
    entities: ['src/entity/**/*.entity{.js,.ts}'],
    migrations: ['src/migrations/**/*{.ts,.js}'],
    logging: false,
    synchronize: true,
})  