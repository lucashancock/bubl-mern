const { MongoClient } = require("mongodb");

const hostname = "localhost";

const uri = `mongodb://${hostname}:27017`;
let client;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db("bubl-mern");
}

module.exports = connectToDatabase;
