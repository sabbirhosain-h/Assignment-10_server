const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;  
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const e = require('express');



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
        const commentsCollection = db.collection("comments");




        // ALL Books
        app.get("/AllBooks" , async (req, res) => {
            const result = await booksCollection.find({}).toArray();
            res.send(result);
        });
        
        
        //  add new books
        app.post("/AllBooks" , async (req, res) =>{
            const newBook = req.body;
            const result = await booksCollection.insertOne(newBook);
            res.send(result);
        });

        // Get single book
        app.get("/BookDetails/:id" , async (req,res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await booksCollection.findOne(query)
            res.send(result);
        })

        // personal books of user
        app.post("/mybooks", async (req, res) => {
             const { userEmail } = req.body; 
             console.log(userEmail);
             if (!userEmail) {
             return res.status(400).send({ error: "Email is required" });}
             const filteredBooks = await booksCollection.find({ userEmail }).toArray();
             res.send(filteredBooks);
         });


    } finally{

    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
   
});