import mongoose from "mongoose";

// /**
//  * Connects to a MongoDB database using the provided URL and options.
//  * @param {string} DATABASE_URL - The URL of the MongoDB database to connect to.
//  * @returns None
//  * @throws {Error} If there is an error connecting to the database.
//  */
const connectDB = async (DATABASE_URL) => {
    try {
        const DB_OPTIONS = {
            dbName: "gymbook"
        }

        await mongoose.connect(DATABASE_URL, DB_OPTIONS)
        console.log("connection established")
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;