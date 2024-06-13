import { now } from "mongoose";
import FeedbackModel from "../models/feedback.js";

// /**
//  * Controller for getting user feedback from the database.
//  * @param {Object} req - The request object.
//  * @param {Object} res - The response object.
//  * @returns None
//  */
class FeedBackController {
  static getUserFeedBack = async (req, res) => {
    const loggedUserData = req.user;
    try {
      if (loggedUserData._id) {
        let userFeedback;
        if (loggedUserData.role === "admin") {
          userFeedback = await FeedbackModel.find({});
        } else {
          userFeedback = await FeedbackModel.find({
            userId: loggedUserData._id,
          });
        }
        if (userFeedback) {
          res.send({
            status: "success",
            message: "Data fetched",
            data: userFeedback,
          });
        } else {
          res.send({ status: "failed", message: "No feedback provided" });
        }
      } else {
        res.send({ status: "failed", message: "login is required" });
      }
    } catch (error) {
      console.error(error);
      res.send({
        status: "failed",
        message: "Internal server error, please try after sometime.",
      });
    }
  };

  // /**
  //  * Creates a new user feedback object and saves it to the database.
  //  * @param {Object} req - The request object.
  //  * @param {Object} res - The response object.
  //  * @returns None
  //  * @throws {Error} If there is an error saving the feedback to the database.
  //  */
  static createUserFeedBack = async (req, res) => {
    const { name, email, feedBack } = req.body;
    const loggedUser = req.user
    if (loggedUser && name && email && feedBack) {
      try {
        if (loggedUser.email === email) {
          const alreadyExist = await FeedbackModel.findOne({ userId:loggedUser._id, feedBack  })
          if (alreadyExist) {
            res.send({ status: "failed", message: "feedback already exist" })
          } else {
            const newFeedback = new FeedbackModel({
              userId: loggedUser._id,
              name: name,
              email: email,
              feedBack: feedBack
            });
            await newFeedback.save();
            const isSaved = await FeedbackModel.findOne({userId:loggedUser._id, feedBack})
            if (isSaved) {
              res.send({ status: "success", message: "feedback saved" })
            } else {
              res.send({ status: "failed", message: "failed to save feedback" })
            }
          }
        } else {
          res.send({ status: "failed", message: "authentication error" })

        }
      } catch (error) {
        console.error(error);
        res.send({ status: "failed", message: "Internal server error, please try after sometime." })
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" })

    }
  }
}

export default FeedBackController;