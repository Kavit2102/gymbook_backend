import mongoose, { Schema } from "mongoose";

//defining schema
// /**
//  * Defines the schema for a user in the MongoDB database.
//  * @param {Object} userSchema - The schema object for a user.
//  * @param {string} userSchema.name - The name of the user.
//  * @param {string} userSchema.email - The email of the user.
//  * @param {number} userSchema.mobileNo - The mobile number of the user.
//  * @param {string} userSchema.address - The address of the user.
//  * @param {string} userSchema.password - The password of the user.
//  * @param {string} userSchema.role - The role of the user.
//  * @param {Array} userSchema.classId - An array of class IDs that the user is associated with.
//  */
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  mobileNo: { type: Number, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  classId: { type: Array, required: false, ref: "class" }, //for trainer
  bookedClass: [{ type: Schema.Types.ObjectId, ref: "class" }],
});

// /**
//  * A Mongoose model for the "user" collection in the MongoDB database.
//  * @param {string} "user" - The name of the collection in the database.
//  * @param {userSchema} userSchema - The schema for the "user" collection.
//  * @returns A Mongoose model for the "user" collection.
//  */
const UserModel = mongoose.model("user", userSchema);

export default UserModel;
