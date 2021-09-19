require('dotenv').config();
require('ts-node/register');

module.exports = {
  client: 'postgresql',
  connection: {
    host: process.env.DATABASE_HOSTNAME,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
  },
  pool: {
    min: process.env.DATABASE_POOL_MIN || 1,
    max: process.env.DATABASE_POOL_MAX || 5,
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
