const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
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

    // ================== client site handel start =================== 

    const cameraShop = client.db("camera-shop").collection("camera");

    // ------------- toy post ------------ 
    app.post('/cameras', async (req, res) => {
      const product = req.body;
      product.price = parseInt(req.body.price)
      const result = await cameraShop.insertOne(product)
      res.send(result)
    })

    // ------ get all data ----------
    app.get('/cameras', async (req, res) => {
      const result = await cameraShop.find().limit(20).toArray()
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

    // ------------- cetagory data get --------------
    app.get('/cetagorys', async (req, res) => {
      let query = {}
      if (req.query?.subCategory) {
        query = { subCategory: req.query.subCategory }
      }
      const result = await cameraShop.find(query).toArray()
      res.send(result)
    })


    // ------------- searcing data get --------------
    app.get('/searching', async (req, res) => {
      let query = {}
      if (req.query?.productName) {
        query = { productName: req.query.productName }
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
      newData.price = parseInt(req.body.price)
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

    // --------- delet post -----------
    app.delete('/cameras/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cameraShop.deleteOne(query)
      res.send(result)
    })


    // app.get('/drone', async(req, res) => {
    //   const query = {subCategory: 'DSLR'}
    //   const result = await cameraShop.find(query).toArray()
    //   res.send(result)
    // })


    // ---------- Descending data ----------
    app.get('/descending', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await cameraShop.find(query).sort({ price: 1 }).toArray()
      res.send(result)
    })

    // ---------- Ascending data ----------
    app.get('/ascending', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await cameraShop.find(query).sort({ price: -1 }).toArray()
      res.send(result)
    })


    // ================== client site handel start ===================


    // Send a ping to confirm a successful connection
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