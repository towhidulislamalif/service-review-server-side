// * require

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// ! middlewares
app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;
// console.log('🚀 ~ file: index.js ~ line 16 ~ uri', uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db('test').collection('devices');
  // perform actions on the collection object
  client.close();
});

app.get('/', (req, res) => {
  res.send('This API was created by Towhidul Islam');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
