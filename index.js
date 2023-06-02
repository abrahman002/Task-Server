const express = require('express');
const app=express();
const port=process.env.PORT || 5000;
const cors=require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');


// middleware
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6kes8os.mongodb.net/?retryWrites=true&w=majority`;

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

    const userCollection=client.db('userDB').collection('UserData');

    app.get('/userdata',async(req,res)=>{
        const corsur=userCollection.find();
        const result=await corsur.toArray();
        res.send(result)
    })

    app.get('/userdata/:id',async(req,res)=>{
     const id=req.params.id;
     const query={_id: new ObjectId(id)};
     const result=await userCollection.findOne(query);
     res.send(result)
    })

    app.post('/userdata',async(req,res)=>{
         const cursor=req.body;
         const result=await userCollection.insertOne(cursor)
        //  console.log(result)
        res.send(result)
    })

    app.put('/userdata/:id',async(req,res)=>{
      const id=req.params.id;
      const updatedUser=req.body;
      const filter={_id: new ObjectId(id)};
      const optional={upsert:true}
      const user={
        $set:{
          title:updatedUser.title,
          discription:updatedUser.discription,
          status:updatedUser.status
        }
      }

      const result=await userCollection.updateOne(filter,user,optional);
      res.send(result)
    })

    app.patch('/userdata/:id',async(req,res)=>{
      const id=req.params.id;
      const book=req.body;
      const filter={_id: new ObjectId(id)};
      const updatedBook={
        $set:{
          info:book.info
        }
      }
      const result=await userCollection.updateOne(filter,updatedBook);
      res.send(result)
    })

    app.delete('/userdata/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result=await userCollection.deleteOne(query);
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


app.get('/',(req,res)=>{
    res.send('assignment task is running');
})

app.listen(port,()=>{
    console.log('assignment server is running')
})