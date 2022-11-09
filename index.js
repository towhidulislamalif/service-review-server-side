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

// * mongodb
const uri = process.env.DB_URI;
// console.log('🚀 ~ file: index.js ~ line 16 ~ uri', uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    // console.log('database connected');
  } catch (error) {
    console.log(error.name);
    console.log(error.message);
  }
}
run();
// client.connect((err) => {
//   const collection = client.db('test').collection('devices');
// perform actions on the collection object
//   client.close();
// });
const Services = client.db('servicereview').collection('services');

// * end point
app.get('/', (req, res) => {
  res.send('This API was created by Towhidul Islam');
});

app.get('/services', async (req, res) => {
  try {
    const cursor = Services.find({});
    const services = await cursor.toArray();

    res.send({
      success: true,
      message: 'Congratulations! You got the data.',
      data: services,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
