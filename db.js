/*const {Pool} = require("pg");
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'qnx_data',
  password: 'Admin123',
  port: 5432,
})
module.exports = pool;
*/

const { Client } = require('pg');
require('dotenv').config();
const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  })
  client.connect()
  module.exports = client;
