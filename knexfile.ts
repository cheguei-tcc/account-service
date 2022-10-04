require('dotenv').config();
require('ts-node/register');

module.exports = {
  client: 'postgresql',
  connection: {
    host: process.env.DATABASE_HOSTNAME || 'localhost',
    database: process.env.DATABASE_NAME || 'postgres', 
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'docker',
    port: process.env.DATABASE_PORT || 5432,
  },
  pool: {
    min: process.env.DATABASE_POOL_MIN || 1,
    max: process.env.DATABASE_POOL_MAX || 10,
    idleTimeoutMillis: process.env.DATABASE_POOL_IDLE || 15000,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './database/migrations',
  },
  seeds: {
    directory: './database/seeds',
  },
};
