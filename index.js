const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

//mongodb+srv://Sam-travels-A10:VmuDt4rv3jsUAT7B@cluster0.ti5xab5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ti5xab5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const touristSpotCollection = client.db('SAMtravelsDB').collection('touristSpot');

    app.get('/touristSpot', async(req,res)=>{
      const cursor = touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/touristSpot/:id', async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await touristSpotCollection.findOne(query);
      res.send(result);
    })


    app.post('/touristSpot', async(req,res) =>{
      const newSpot = req.body;
      console.log(newSpot);
      const result = await touristSpotCollection.insertOne(newSpot);
      res.send(result);
  })

  app.put('/touristSpot/:id', async(req,res)=>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = { upsert: true};
    const updateSpot = req.body;
    const Spot = {
      $set: {
        average_cost: updateSpot.average_cost,
         country_Name: updateSpot.country_Name,
         travel_time: updateSpot.travel_time,
         image: updateSpot.image,
         location: updateSpot.location,
         seasonality: updateSpot.seasonality,
         short_description: updateSpot.short_description,
         totalVisitorsPerYear: updateSpot.totalVisitorsPerYear,
         tourists_spot_name: updateSpot.tourists_spot_name,
         user_email: updateSpot.user_email,
         user_name: updateSpot.user_name
      }
    }

    const result = await touristSpotCollection.updateOne(filter, Spot, options)
    res.send(result);
  })


  app.delete('/touristSpot/:id', async(req,res)=>{
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await touristSpotCollection.deleteOne(query);
    res.send(result);
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


app.get('/',(req,res)=>{
    res.send('SAM travel server is running');
})

app.listen(port,()=>{
    console.log(`SAM Travel server is running on port: ${port}`)
})