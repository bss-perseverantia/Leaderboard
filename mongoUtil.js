const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://admin:youshallnotpass@persev.kljqat8.mongodb.net/?retryWrites=true&w=majority&appName=persev";
const dbName = "persev";
const collectionName = "backup";

async function loadFromMongo() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const doc = await db.collection(collectionName).findOne({});
  await client.close();
  return doc ? doc.data : null;
}

async function saveToMongo(data) {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  await db.collection(collectionName).updateOne(
    {},
    { $set: { data } },
    { upsert: true }
  );
  await client.close();
}

module.exports = { loadFromMongo, saveToMongo };