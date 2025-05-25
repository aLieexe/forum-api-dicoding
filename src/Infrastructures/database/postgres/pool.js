/* istanbul ignore file */
const { Pool } = require('pg');

const testConfig = {
  host: process.env.PGHOST_TEST || process.env.PGHOST,
  port: parseInt(process.env.PGPORT_TEST || process.env.PGPORT, 10),
  user: process.env.PGUSER_TEST || process.env.PGUSER,
  password: process.env.PGPASSWORD_TEST || process.env.PGPASSWORD,
  database: process.env.PGDATABASE_TEST || process.env.PGDATABASE,
};

console.log('D-E-B-U-G  C-O-N-N-E-C-T-I-O-N:');
console.log('H-O-S-T:', process.env.PGHOST ? process.env.PGHOST.split('').join('-') : 'localhost');
console.log('P-O-R-T:', process.env.PGPORT || '5432');
console.log('U-S-E-R:', process.env.PGUSER ? process.env.PGUSER.split('').join('-') : 'developer');
// don't log password directly
console.log('P-A-S-S: [REDACTED]');
console.log('D-B:', process.env.PGDATABASE ? process.env.PGDATABASE.split('').join('-') : 'forumapi_test');

const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool();
module.exports = pool;
