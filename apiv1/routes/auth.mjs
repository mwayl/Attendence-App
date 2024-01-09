import express from "express";
import path from "path";
import { client } from "./../../mongodb.mjs";
import { stringToHash, verifyHash } from "bcrypt-inzi";
import jwt from "jsonwebtoken";
import OpenAI from "openai";
import { ObjectId } from 'mongodb'

let router = express.Router();
const __dirname = path.resolve();

const db = client.db("cruddb");
const col = db.collection("usersAttendence");
// const post =db.collection("posts")


// const openaiClient = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });


// https://baseurl.com/search?q=car


// router.get('/search', async (req, res,next) => {
//     // alert('Please enter')
//     try{
//         const response = await openaiClient.embeddings.create({
//             model: "text-embedding-ada-002",
//             input: req.query.p                 //make a trigger , set openai key in values part in mongodb ,
//             //                                   and make a index in mongodb 
//         })
//         const vector=response?.data[0]?.embedding
//         // console.log(vector)
        

//    // [ 0.0023063174, -0.009358601, 0.01578391, ... , 0.01678391, ]

//         // Query for similar documents.
//         const documents = await post.aggregate([
//             {
//                 "$search": {
//                     "index": "default",
//                     "knnBeta": {
//                         "vector": vector,
//                         "path": "embedding",
//                         "k": 10 // number of documents
//                     },
//                     "scoreDetails": true

//                 }
//             },
//             {
//                 "$project": {
//                     "embedding": 0,
//                     "score": { "$meta": "searchScore" },
//                     "scoreDetails": { "$meta": "searchScoreDetails" }
//                 }
//             }
//         ]).toArray();

//         documents.map(eachMatch => {
//             console.log(`score ${eachMatch?.score?.toFixed(3)} => ${JSON.stringify(eachMatch)}\n\n`);
//         })
//         console.log(`${documents.length} records found `);

//         res.send(documents);

//     } catch (e) {
//         console.log("error getting data mongodb: ", e);
//         res.status(500).send('server error, please try later');
//     }
     
// })






// post     /api/v1/signup
// router.post("/signup", async (req, res, next) => {
//   console.log("this is signup!", new Date());

//   if (
//     !req.body?.firstName ||
//     !req.body?.lastName ||
//     !req.body?.email ||
//     !req.body?.password
//   ) {
//     res.status(403);
//     res.send({
//       message: `required parameters missing, 
//         example request body:
//         {
//             firstName: "First Name",
//             lastName: "Last Name",
//             email: "abc@example.com",
//             password: "password",
            

//         } `,
//     });
//     return;
//   }
//   req.body.email = req.body.email.toLowerCase();

//   try {
//     const result = await col.findOne({ email: req.body.email });

//     // convert password into Hash
//     const hashPassword = await stringToHash(req.body.password);

//     // console.log("the result is this"+result.password);
//     if (!result) {
//       // if email is not found in db like email is given by user

//       await col.insertOne({
//         isAdmin: false,
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         password: hashPassword,
//         createdOn: new Date(),
//       });

//       res.send({ message: "User Is Added Successfully In Database" });
//       // console.log('User is added successfully in database');
//     } else {
//       //if email is already found
//       res
//         .status(403)
//         .send({ message: "User is Already Exists For This Email Address" });
//       //   console.log('User already exists from this email address');
//     }
//   } catch (err) {
//     console.log("Error Getting In MongoDB", err);
//     res
//       .status(500)
//       .send({ message: "Server Does Not Respond! Please Try Again Later" });
//   }

//   // res.sendFile(path.join(__dirname,'html and css v1/signinv1.html'))
// });

router.post("/login", async (req, res, next) => {
  if (!req.body?.email || !req.body?.password) {
    res.status(403);
    res.send({
      message: `required parameters missing, 
        example request body:
        {
            email: "abc@example.com",
            password: "password",
            

        } `,
    });
    return;
  }

  req.body.email = req.body.email.toLowerCase();

  try {
    const result = await col.findOne({ email: req.body.email });

    if (!result) {
      //result is empty or user not found

      res.send({ message: "Email and password is incorrect" });
      return;
    } else {
      //result is found and user found
      const isMatch = await verifyHash(req.body.password, result.password);
      //let hours24AfterLoginInMilliSecond =( new Date().getTime + (1 * 60 *1000));
      if (isMatch) {
        console.log("enter in box");
        // console.log("the course is "+ result.course)

        const token = jwt.sign(
          {
            isAdmin: result.isAdmin,
            firstName: result.firstName,
            lastName: result.lastName,
            email: req.body.email,
            course :result.course,
            _id:result._id,
            createdOn: new Date().getTime(),
            // expires: new Date(Date.now() + 86400000).getTime(),
            // expires: new Date(Date.now() + 120000).getTime(),
          },
          process.env.SECRET,
          {
            expiresIn: "24h",
          }
        );

        console.log("token " + token);
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          expires: new Date(Date.now() + 86400000),
          //    expires: new Date(Date.now() + 120000)
          // expires: new Date(hours24AfterLoginInMilliSecond)
        });

        res.send({
          message: "Login successfully",
          data: {
            isAdmin: result.isAdmin,
            firstName: result.firstName,
            lastName: result.lastName,
            email: req.body.email,
            course: result.course,
          },
        });
        return;
      } else {
        res.send({ message: "Email and password is incorrect" });
        return;
      }
    }
  } catch (err) {
    console.log("error getting in mongodb", err);
    res.status(500)
      .send({ message: "server does not respond! please try again later" });
  }

  // res.sendFile(path.join(__dirname,'html and css v1/loginv1.html'))
});

router.get("/ping",(req,res,next)=>{
  res.send("ok")
})

router.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.status(200).send({ message: "Logout Sucessfull" });
  } catch (err) {
    console.log("error in logout api" + err);
  }
});


             //----------------update Account Password --------------------------------------

// router.post("/updateLoginPassword", async (req, res, next) => {
//   if (!req.body?.oldPasword || !req.body?.newPassword || !req.body?.confirmPassword || !req.body?.email) {
//     res.status(403);
//     res.send({
//       message: `required parameters missing, 
//         example request body:
//         {
//             oldPasword: "Old Pasword",
//             newPassword: "New Password",
//             confirmPassword: "Confirm Password"

//         } `,
//     });
//     return;
//   }



//   try {
//     const result = await col.findOne({ email: req.body.email });

//     if (!result) {
//       //result is empty or user not found

//       res.send({ message: "Old password is incorrect" });
//       return;
//     } else {
//       //result is found and user found
//       const isMatch = await verifyHash(req.body.oldPasword, result.password);
//       //let hours24AfterLoginInMilliSecond =( new Date().getTime + (1 * 60 *1000));
//       if (isMatch) {
//         console.log("enter in box");
//         const hashPassword = await stringToHash(req.body.newPassword);
//         const updatePasswordObject ={password:hashPassword}

//        const update =await col.updateOne({email: req.body.email},{$set:updatePasswordObject})
//         console.log("updatd dddddddddddddddddddddddddddddddddddddddddddddddd" +update)
//         res.send({
//           message: "Login successfully",
//           data: update,
//         });
//         return;
//       } else {
//         res.send({ message: "Email and password is incorrect" });
//         return;
//       }
//     }
//   } catch (err) {
//     console.log("error getting in mongodb", err);
//     res.status(500)
//       .send({ message: "server does not respond! please try again later" });
//   }

//   // res.sendFile(path.join(__dirname,'html and css v1/loginv1.html'))
// });
            

export default router;
