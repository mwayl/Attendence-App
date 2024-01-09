import { nanoid } from 'nanoid'
import express from 'express';
import {client} from '../../mongodb.mjs' 
import { ObjectId } from 'mongodb'
import OpenAI from "openai";
let router = express.Router()

const db = client.db("cruddb")
const col =db.collection("posts")
const userDB = db.collection("users");

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.get('/search', async (req, res,next) => {
    // alert('Please enter')
    try{
        const response = await openaiClient.embeddings.create({
            model: "text-embedding-ada-002",
            input: req.query.p
        })
        const vector=response?.data[0]?.embedding
        console.log(vector)
        

   // [ 0.0023063174, -0.009358601, 0.01578391, ... , 0.01678391, ]

        // Query for similar documents.
        const documents = await post.aggregate([
            {
                "$search": {
                    "index": "default",
                    "knnBeta": {
                        "vector": vector,
                        "path": "embedding",
                        "k": 10 // number of documents
                    },
                    "scoreDetails": true

                }
            },
            {
                "$project": {
                    "embedding": 0,
                    "score": { "$meta": "searchScore" },
                    "scoreDetails": { "$meta": "searchScoreDetails" }
                }
            }
        ]).toArray();

        documents.map(eachMatch => {
            console.log(`score ${eachMatch?.score?.toFixed(3)} => ${JSON.stringify(eachMatch)}\n\n`);
        })
        console.log(`${documents.length} records found `);

        res.send(documents);

    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
     
})


router.get('/post',async (req, res, next) => {
    console.log('this is signup!', new Date());

    
    const cursor = col.find() .sort({ _id: -1 })
    .limit(100);
    try{
        let postArray =await cursor.toArray();
        console.log('result', postArray)
        res.send(postArray);
    }
    catch(error){
        console.log('error getting in mongodb', error)
        res.status(500).send({message :"server does not respond! please try again later"});
    }
    

})




router.use((req, res) =>{
    res.status(500).send({message:"invalid token "})
})

export default router
