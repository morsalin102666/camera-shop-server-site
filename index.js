const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mewurzb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // ================== client site handel start =================== 

    const cameraShop = client.db("camera-shop").collection("camera");

    // ------------- toy post ------------ 
    app.post('/cameras', async (req, res) => {
      const product = req.body;
      const result = await cameraShop.insertOne(product)
      res.send(result)
    })

    // ------ get all data ----------
    app.get('/cameras', async (req, res) => {
      const result = await cameraShop.find().toArray()
      res.send(result)
    })

    // ------------ my toy data get -----------
    app.get('/camera', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await cameraShop.find(query).toArray()
      res.send(result)
    })

    // ------------- all toy detail data ----------

    app.get('/cameras/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cameraShop.findOne(query);
      res.send(result)
    })

    // --------------- update my toy -------------
    app.put('/cameras/:id', async (req, res) => {
      const newData = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...newData
        },
      };
      const result = await cameraShop.updateOne(filter, updateDoc, options);
      res.send(result)
    })


    // ================== client site handel start ===================


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('toys server site is ranning')
})

app.listen(port, () => {
  console.log(`to server site ranning is ${port}`)
})