const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;  
const { MongoClient, ServerApiVersion } = require('mongodb');

// require('dotenv').config();

app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@crud.7q5wtjc.mongodb.net/?appName=CRUD`;



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
    try {
        await client.connect();
        const db = client.db("bookHeaven");
        const booksCollection = db.collection("books");

        
        
    } finally{

    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
   
});