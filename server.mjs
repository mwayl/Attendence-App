import express from "express";
import path from "path";
// require("dotenv").config();
import "dotenv/config";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
const __dirname = path.resolve();
import cors from "cors";
// import mongodb from 'mongodb';

// import apiv1Router from './apiv1/index.mjs'
// import apiv1Router from './apiv1/indexV1.mjs'
// import apiv2Router from './apiv2/indexV2.mjs'

import authRouter from "./apiv1/routes/auth.mjs";
import studentRouter from "./apiv1/routes/student.mjs";

import unAuthProfileRouter from './apiv1/unAuthRoutes/frontpost.mjs'
import { decode } from "punycode";
// import commentRouter from './routes/comment.mjs'
// import feedRouter from './routes/feed.mjs'

const app = express();
app.use(express.json()); // body parser
app.use(cookieParser()); //cookie parser and its middleware function
// app.use(cors())

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);



app.use("/api/v1", authRouter);


app.use("/api/v1",(req, res, next) => {
  // const cookie = req.cookies;
  // const cookies = JSON.stringify(cookie);
  // console.log("cookie from : " + cookies);
  // console.log("cookie from : " + req.cookies);
  console.log("cookie from browser: " + req.cookies.token);

  const token = req.cookies.token;
  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    console.log("decoded: " + JSON.stringify(decoded));
    console.log("decoded: " + new Date(decoded.exp));

    // const now=new Date().getTime()
    // console.log("decoded: " + new Date(now))
    //  if(decoded.expires > now ){
    req.body.decoded = {
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      email: decoded.email,
      isAdmin: decoded.isAdmin,
      course: decoded.course,
      _id:decoded._id
    };
    next();
    //  }
    //  else{
    //     res.status(403).send({message : "Invalid token"})
    //  }
  } catch (err) {
    unAuthProfileRouter(req,res)
    return
  }
});

app.use("/api/v1", studentRouter);



// app.get("/", (req, res, next) => {
//   res.sendFile(path.join(__dirname, "main.html"));
// });
// // app.use(express.static(path.join(__dirname,'main.html')))
// app.get("/post", (req, res, next) => {
//   res.sendFile(path.join(__dirname, "html and css v1/postaddv1.html"));
// });
// app.use(express.static(path.join(__dirname,'html and css v1')))

/** the first request of / is hit the first url and fetch index.html from build folder by default. 
in index.html many URL is found so index.html is request those pages like /manifesto.json and other we all 
fetch this reuest from second URL because it have use request in use request if partially reuest url is 
hit it give access to go inside and in last when we send URL /login so he search login page in build when 
it not found it give error so we use third request of * and give path of login page after that our site is 
proper run */

app.get('/', express.static(path.join(__dirname,'my-app/build')))    
app.use('/', express.static(path.join(__dirname, 'my-app/build')))
app.get("*",(req,res)=>{
   res.sendFile(path.join(__dirname,'my-app/build/index.html'))
  // res.redirect('/')      //using redirect we refresh at  any page we come on home page
})



const port = process.env.PORT || 5002;

app.listen(port, () => {
  console.log(`listning the port ${port}`);
});
