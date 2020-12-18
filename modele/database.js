require("dotenv").config();
const process = require("process");
const pg = require("pg");
const Pool = pg.Pool;
const user=process.env.DB_USER;
const host=process.env.DB_HOST;
const database= process.env.DB_DATABASE;
const password=process.env.DB_PASSWORD;
const port= process.env.DB_PORT;

const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`

const pool = new Pool({
    connectionString
});

module.exports = pool;