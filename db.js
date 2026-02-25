const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI; // tu URI guardada en variable de entorno
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('miBaseDeDatos'); // nombre de tu BD
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (err) {
    console.error('❌ Error conectando a MongoDB', err);
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database no está inicializada. Llama a connectDB() primero.');
  }
  return db;
}

module.exports = { connectDB, getDB };