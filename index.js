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
            const result = await booksCollection.insertOne({newBook , createdAt: new Date()});
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
             if (!userEmail) {
             return res.status(400).send({ error: "Email is required" });}
             const filteredBooks = await booksCollection.find({ userEmail }).toArray();
             res.send(filteredBooks);
         });

        //  delete the book
        app.delete("/AllBooks/:id" , async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await booksCollection.deleteOne(query);
            res.send(result);
        })

        // update book
        app.put("/Update/:id" , async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            const result = await booksCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedData }
            );
            res.send(result);
        })

        // add comments
        app.post("/comments" , async (req, res) => {
            const { bookId, commentText, userEmail , userPhoto, userName} = req.body;
             const UserId = new ObjectId();
            // console.log(req.body);

            const existingDoc = await commentsCollection.findOne({ bookId });
            if (existingDoc) {
                const result = await commentsCollection.updateOne(
                    { bookId },
                    { $push: { data : { userEmail, userPhoto, userName, commentText, UserId } } }
                );
                res.send(result);
            }
            else {
                const result = await commentsCollection.insertOne({
                    bookId,
                    data: [ { userEmail, userPhoto, userName, commentText, UserId } ]
                });
                res.send(result);
            }
           
        });

        // get comments
        app.get("/comments/:bookId" , async (req, res) => {
            const bookId = req.params.bookId;
            const query = { bookId: bookId };
            const result = await commentsCollection.findOne(query);
            res.send(result);
        });

        // delete comment
        app.delete('/comments/:bookId/:userId', async (req, res) => {
          const { bookId, userId } = req.params;

          const result = await commentsCollection.updateOne(
              { bookId },
              {  $pull: {  data: { UserId: new ObjectId(userId) }  }}
             );

        res.send(result);
       });



    } finally{

    }
}
run().catch(console.dir);



app.listen(port, () => {});