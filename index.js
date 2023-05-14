const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


//Gm4RELoCZDVE6ZWj
//coffeeDB

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yc3f8jy.mongodb.net/?retryWrites=true&w=majority`;

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
    const database = client.db("coffeeDB")
    const haiku = database.collection("newCoffee")


    app.get('/newCoffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const coffee = await haiku.findOne(query)
      res.send(coffee)
    })

    app.put('/newCoffee/:id', async (req, res) => {
      const id = req.params.id;
      const coffee = req.body;
      // console.log(coffee);
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedCoffee = {
        $set: {
          name: coffee.name,
          chef: coffee.chef,
          supplier: coffee.supplier,
          category: coffee.category,
          photo: coffee.photo,
          taste: coffee.taste,
          details: coffee.details,
        }
      }

      const result = await haiku.updateOne(filter, updatedCoffee, options)
      res.send(result)
    })
    app.post('/newCoffee', async (req, res) => {
        const addCoffee = req.body
        // console.log(addCoffee);

        const result = await haiku.insertOne(addCoffee)
        res.send(result)
    })


    app.delete('/newCoffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await haiku.deleteOne(query)
      res.send(result)
    })


    app.get('/newCoffee', async (req, res) => {
        const cursor = haiku.find()
        const result = await cursor.toArray()
        res.send(result)
    })
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
    res.send('Coffee server is running')
})

app.listen(port, () => {
    console.log(`Coffee server is running on port, ${port}`);
})