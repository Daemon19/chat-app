const mongoose = require('mongoose');

async function connectMongoose(mongodbUri) {
  mongoose.set('strictQuery', false);
  const mongo = await mongoose.connect(mongodbUri);
  console.log('Mongoose connected');
  return mongo.connection.getClient();
}

module.exports = connectMongoose;
