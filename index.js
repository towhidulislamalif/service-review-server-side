// * require

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
// const { query } = require('express');

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
const Reviews = client.db('servicereview').collection('reviews');

// * end point
app.get('/', (req, res) => {
  res.send('This API was created by Towhidul Islam');
});

app.get('/services', async (req, res) => {
  try {
    const cursor = Services.find({});

    const services = await cursor.limit(3).toArray();

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

app.get('/services/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const service = await Services.findOne(query);
    res.send({
      success: true,
      message: 'Congratulations! You got the data.',
      data: service,
    });
  } catch (error) {
    success: false;
    error: error.message;
  }
});

app.get('/servicefeed', async (req, res) => {
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

// * JWT
app.post('/jwt', (req, res) => {
  const user = req.body;
  // console.log(user);
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '60d',
  });
  res.send({ token });
});

app.post('/services', async (req, res) => {
  try {
    const result = await Services.insertOne(req.body);

    if (result.insertedId) {
      res.send({
        success: true,
        message: `Successfully created the ${req.body.title} with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't create the service",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// ! verifyJwt
function verifyJwt(req, res, next) {
  const authHead = req.headers.authorization;

  if (!authHead) {
    return res.status(401).send({ message: 'unauthorized access' });
  }
  const token = authHead.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (error, decoded) {
    if (error) {
      return res.status(401).send({ message: 'unauthorized access' });
    }
    req.decoded = decoded;

    next();
  });
}
// verifyJwt,
app.get('/reviews', async (req, res) => {
  try {
    let query = {};

    if (req.query.name) {
      query = {
        reviewer: req.query.name,
      };
      console.log(query);
    }
    const cursor = Reviews.find(query);
    const reviews = await cursor.toArray();
    res.send({
      success: true,
      message: 'Congratulations! You got the data.',
      data: reviews,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.post('/reviews', async (req, res) => {
  try {
    const result = await Reviews.insertOne(req.body);

    if (result.insertedId) {
      res.send({
        success: true,
        message: `Successfully created the ${req.body.service_name} with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't create the service",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// ! delete
app.delete('/reviews/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Reviews.deleteOne({ _id: ObjectId(id) });
    if (result.deletedCount) {
      res.send({
        success: true,
        message: 'This review was deleted!',
      });
    } else {
      res.send({
        success: false,
        message: 'This review was not deleted!',
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.get('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Reviews.findOne({ _id: ObjectId(id) });

    res.send({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.patch('/reviews/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Reviews.updateOne(
      { _id: ObjectId(id) },
      { $set: req.body }
    );

    if (result.modifiedCount) {
      res.send({
        success: true,
        message: 'Successfully updated',
      });
    } else {
      res.send({
        success: false,
        message: 'Could not updated',
      });
    }
  } catch (error) {
    res.send({
      success: true,
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
