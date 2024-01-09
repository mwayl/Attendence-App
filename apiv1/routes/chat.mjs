import path from 'path'
const __dirname = path.resolve();
import { nanoid } from 'nanoid'
import express from 'express';
import {client} from './../../mongodb.mjs' 
import { ObjectId } from 'mongodb'
import OpenAI from "openai";
import admin from 'firebase-admin'
import multer from 'multer';
import bodyParser from 'body-parser';
import fs from 'fs';

let router=express.Router()
const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const db = client.db("cruddb");
const col = db.collection("users");
const post =db.collection("posts")


router.get("/allUser",async (req,res,next)=>{

    // console.log("helooooooooooooooooooooooooooooooooooooooooo")
    const allUsersCursor = col.find().sort({_id :-1})
    try{
     let users =await allUsersCursor.toArray()
     res.send(users)
     console.log("user Result : "+users)
    }
    catch(err){
        console.log('error getting in mongodb', err)
        res.status(500).send({message :"server does not respond! please try again later"});
    }

    // res.sendFile(path.join(__dirname,'html and css v1/feedv1.html'))
})

  //------------------------ search specific user  --------------------------


  router.get("/searchName", async (req, res, next) => {
    let query = req.query.p;

    try {
        const response = await openaiClient.embeddings.create({
            model: "text-embedding-ada-002",
            input: query
        }).catch(error => {
            console.error("OpenAI error:", error);
            res.send("not found this name")
            
        });

        const vector = response?.data?.[0]?.embedding;
//         console.log("Query:", query);
// console.log("Vector:", vector);

        const documents = await col.aggregate([
            {
                "$search": {
                    "index": "default1",
                    "knnBeta": {
                        "vector": vector,
                        "path": "embedding",
                        "k": 10
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

        documents.forEach(eachMatch => {
            console.log(`Score ${eachMatch?.score?.toFixed(3)} => ${JSON.stringify(eachMatch)}\n\n`);
        });

        console.log(`${documents.length} records found`);
        res.status(200).send(documents);
    } catch (e) {
        console.log("Error:", e);
        res.status(500).send('Server error, please try later');
    }
});


export default router

// GET     /feed/:userId