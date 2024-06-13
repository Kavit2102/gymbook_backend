import mongoose, { Schema } from "mongoose";

//defining schema
// /**
//  * Defines the schema for a class in the MongoDB database.
//  * @param {Object} classSchema - The schema object for a class.
//  * @param {string} classSchema.classTitle - The title of the class.
//  * @param {string} classSchema.description - A description of the class.
//  * @param {string} classSchema.trainerName - The name of the trainer for the class.
//  * @param {Schema.Types.ObjectId} classSchema.trainerId - The ID of the trainer for the class.
//  * @param {Date} classSchema.date - The date of the class.
//  * @param {string} classSchema.duration - The duration of the class.
//  * @param {Schema.Types.ObjectId[]} classSchema.memberId
//  */
const classSchema = new mongoose.Schema({
  classTitle: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  trainerName: { type: String, required: true, trim: true },
  trainerId: { type: Schema.Types.ObjectId, ref: "user" },
  date: { type: Date, required: false, trim: true },
  duration:{type: String, required:true, trim: true},
  memberId: [{ type: Schema.Types.ObjectId, ref: "user" }],
});

// /**
//  * A Mongoose model for the "class" collection in the MongoDB database.
//  * @type {mongoose.Model<mongoose.Document<any, {}>, {}>}
//  */
const classModel = mongoose.model("class", classSchema);

export default classModel;
