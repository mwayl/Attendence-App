import { MongoClient, ServerApiVersion } from 'mongodb';

//const uri = "mongodb+srv://mwayl:Ufrkhi0028import { MongoClient, ServerApiVersion } from 'mongodb';@cluster0.1nfsqa8.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version


const uri = "mongodb+srv://mwayl:Ufrkhi00@cluster0.nyw5mws.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client=new MongoClient(uri)

async function run(){
  try{
    await client.connect();
    console.log("Connected to Mongodb server")
  }
  catch(error){
      console.log("Error is " + error);
      client.close();     // close connection to Mongodb server
      process.exit(1);   //for this app is not crashed 
  }
}
run().catch(console.dir)

//***********sigint function :in this function when we terminate our app its run ****************** */

process.on('SIGINT',async function (){
     console.log('app is terminating');
     client.close();
     process.exit(0);  //here we right 0 because action perform perfectly we write 1 when error is come
});
