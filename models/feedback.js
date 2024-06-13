import mongoose from "mongoose";

// /**
//  * Defines the schema for a feedback document in the MongoDB database.
//  * @param {mongoose.Schema.Types.ObjectId} userId - The ID of the user who submitted the feedback.
//  * @param {string} name - The name of the user who submitted the feedback.
//  * @param {string} email - The email of the user who submitted the feedback.
//  * @param {string} feedBack - The feedback message submitted by the user.
//  * @returns A Mongoose schema object for the feedback document.
//  */
const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  feedBack: { type: String, required: true, trim: true },
});

// /**
//  * A Mongoose model for the "feedbackSchema" collection in MongoDB.
//  * @param {string} name - The name of the model.
//  * @param {Schema} schema - The schema to use for the model.
//  * @returns A Mongoose model for the "feedbackSchema" collection.
//  */
const FeedbackModel = mongoose.model("feedbackSchema", feedbackSchema);

export default FeedbackModel;
