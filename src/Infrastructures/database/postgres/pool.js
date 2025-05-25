/* istanbul ignore file */
const { Pool } = require('pg');

const testConfig = {
  host: process.env.PGHOST_TEST || process.env.PGHOST,
  port: parseInt(process.env.PGPORT_TEST || process.env.PGPORT, 10),
  user: process.env.PGUSER_TEST || process.env.PGUSER,
  password: process.env.PGPASSWORD_TEST || process.env.PGPASSWORD,
  database: process.env.PGDATABASE_TEST || process.env.PGDATABASE,
};

const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool();
module.exports = pool;
