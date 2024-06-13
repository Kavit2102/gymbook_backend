import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/connectdb.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

//cors policy
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));

app.use(express.json());

app.get('/', (req, res) => res.send("Welcome to the backend of GymBook !!!!"))

//load routes
app.use("/api/gymbook", userRoutes);

// /**
//  * Connects to the database using the provided URL and starts the server listening on the specified port.
//  * @returns None
//  */

const main = async () => {
  await connectDB(DATABASE_URL);
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

main();
