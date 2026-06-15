import { Client } from "pg";

async function query(queryObject) {
  const client = await getNewClient();
  const result = await client.query(queryObject);
  await client.end();
  return result;
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });
  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;
