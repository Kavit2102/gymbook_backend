import { now } from "mongoose";
import classModel from "../models/class.js";
import UserModel from "../models/User.js";

// /**
//  * Controller function that adds a new class to the database.
//  * @param {Object} req - The request object.
//  * @param {Object} res - The response object.
//  * @returns None
//  */
class ClassController {
  static addClass = async (req, res) => {
    const currentUser = req.user;
    console.log(req.body);
    try {
      if (currentUser.role === "admin") {
        const { classTitle, description, trainerId, dateNtime, duration } =
          req.body;
        if (
          classTitle &&
          trainerId &&
          description &&
          dateNtime &&
          duration
        ) {
          const userDateNtime = new Date(dateNtime);
          console.log(userDateNtime);
          let currentTime = new Date();

          let trainer = await UserModel.findById(trainerId);
          if (
            trainer &&
            trainer.role === "trainer" &&
            currentTime <= userDateNtime
          ) {
            const classExist = await classModel.findOne({
              classTitle,
              trainerId,
              date: userDateNtime,
            });

            if (!classExist) {
              const classInput = new classModel({
                classTitle: classTitle,
                trainerId: trainerId,
                trainerName: trainer.name,
                description: description,
                date: dateNtime,
                duration: duration
              });

              await classInput.save();
              const savedClass = await classModel.findOne({
                classTitle,
                trainerId,
              });
              trainer = await UserModel.findOneAndUpdate(
                { _id: trainerId },
                { $addToSet: { classId: savedClass._id } }
              );
              // trainer.classId.push(savedClass._id);

              res.send({
                status: "success",
                message: "successfully added class",
              });
            } else {
              res.send({ status: "failed", message: "class already exists" });
            }
          } else {
            res.send({
              status: "failed",
              message: "please check trainerid and time of the class ",
            });
          }
        } else {
          res.send({ status: "failed", message: "all fields are required" });
        }
      } else {
        res.send({
          status: "failed",
          message: "Not authorized to add the class",
        });
      }
    } catch (error) {
      console.error(error);
      res.send({ status: "failed", message: "failed to add class" });
    }
  };

  // /**
  //  * Deletes a class from the database and removes it from all users who have booked it or are assigned to it.
  //  * @param {Object} req - The request object.
  //  * @param {Object} res - The response object.
  //  * @returns None
  //  * @throws {Error} If the user is not authorized to delete classes or if there is an error deleting the class.
  //  */
    static deleteClass = async (req, res) => {
      const currentUser = req.user;
      if (currentUser.role === "admin") {
        const { classTitle, _id } = req.body;
        if (classTitle && _id) {
          const classExist = await classModel.findOne({ _id });
          console.log(classExist)
          if (classExist) {
            try {
              const customer = await UserModel.updateMany({ bookedClass: { $in: [classExist._id] } }, { $pull: { bookedClass: { $in: [classExist._id] } } })
              const trainer = await UserModel.updateMany({ classId: { $in: [classExist._id] } }, { $pull: { classId: { $in: [classExist._id] } } })

              await classExist.deleteOne();

              res.send({
                status: "success",
                message: "successfully deleted class",
              });
            } catch (error) {
              console.error(error);
              res.send({ status: "failed", message: "failed to delete class" });
            }
          } else {
            res.send({ status: "failed", message: "class does not exists" });
          }
        } else {
          res.send({ status: "failed", message: "all fields are required" });
        }
      } else {
        res.send({
          status: "failed",
          message: "Not authorized to delete classes",
        });
      }
    };

  // /**
  //  * Retrieves all classes from the database and returns them in an object.
  //  * @param {Object} req - The request object.
  //  * @param {Object} res - The response object.
  //  * @returns None
  //  * @throws {Error} If the classes cannot be fetched from the database.
  //  */
  static getAllClass = async (req, res) => {
    try {
      const currentUser = req.user;

      const allClass = await classModel.find({});
      console.log(allClass);
      const allFutureClass = await classModel.find({
        date: { $gt: new Date() },
      });
      const trainerClass = await classModel.find({
        trainerId: currentUser._id,
      }).populate({ path: "memberId" })
      const userRegisteredClass = await classModel.find({
        memberId: { $elemMatch: { $eq: currentUser._id } },
      });
      res.send({
        status: "success",
        message: "all future classes successfully fetched",
        allClass,
        allFutureClass,
        trainerClass,
        userRegisteredClass,
      });
    } catch (error) {
      console.error();
      res.send({ status: "failed", message: "classes can not be fetched" });
    }
  };

  // /**
  //  * Registers a user for a class.
  //  * @param {Object} req - The request object.
  //  * @param {Object} res - The response object.
  //  * @returns None
  //  */
  static registerClasss = async (req, res) => {
    const currentUser = req.user;
    const { _id, classTitle } = req.body;
    console.log(req.body);
    try {
      if (currentUser.role === "customer") {
        if (_id && classTitle) {
          const classToBeregistered = await classModel.findById(_id);
          // console.log(classToBeregistered);
          let length;
          await classModel.findOne({ _id: _id })
            .then(doc => {

              length = doc.memberId.length;

              console.log(`Number of elements in the array: ${length}`);
            })
            .catch(err => {
              console.error(err);
            });
          console.log(length);
          if (length > 10) {
            res.send({
              status: "failed",
              message: "Class capacity is full",
            });
          } else {
            if (classToBeregistered) {
              //checks if the user is registered or not returns true or false
              const isRegistered =
                classToBeregistered.memberId.includes(currentUser._id) &&
                currentUser.bookedClass.includes(classToBeregistered._id);
              if (!isRegistered) {
                const userUpdate = await UserModel.findOneAndUpdate(
                  { _id: currentUser._id },
                  { $addToSet: { bookedClass: classToBeregistered._id } }
                );

                await classToBeregistered.memberId.addToSet(currentUser._id);
                await classToBeregistered.save();
                await userUpdate.save();
                // console.log(classToBeregistered);
                // console.log(userUpdate);
                res.send({
                  status: "success",
                  message: "You have been registered successfully",
                });
              } else {
                res.send({
                  status: "failed",
                  message: "Class already registered",
                });
              }
            } else {
              res.send({ status: "failed", message: "No such class exist" });
            }
          }
        } else {
          res.send({ status: "failed", message: "All fields are required" });
        }
      } else {
        res.send({
          status: "failed",
          message: "Unauthorized to register for the classes",
        });
      }
    } catch (error) {
      console.error(error);
      res.send({
        status: "failed",
        message: "Class cannot be registered",
      });
    }
  };

  // /**
  //  * Deregisters a class for the current user.
  //  * @param {Object} req - The request object.
  //  * @param {Object} res - The response object.
  //  * @returns None
  //  * @throws {Error} If the class cannot be deregistered.
  //  */
  static deregisterClass = async (req, res) => {
    const currentUser = req.user;
    const { _id, classTitle } = req.body;
    try {
      if (currentUser.role === "customer") {
        if (_id && classTitle) {
          const classDeregistered = await classModel.findById(_id);
          if (classDeregistered) {
            //checks if the user is registered or not returns true or false
            const isRegistered =
              classDeregistered.memberId.includes(currentUser._id) &&
              currentUser.bookedClass.includes(classDeregistered._id);
            if (isRegistered) {
              const userUpdate = await UserModel.findOneAndUpdate(
                { _id: currentUser._id },
                { $pull: { bookedClass: classDeregistered._id } }
              );
              await classDeregistered.memberId.pull(currentUser._id);
              await classDeregistered.save();
              await userUpdate.save();
              res.send({
                status: "success",
                message: "Your booking has been cancelled ",
              });
            } else {
              res.send({
                status: "failed",
                message: "Class not registered",
              });
            }
          } else {
            res.send({ status: "failed", message: "No such class exist" });
          }
        } else {
          res.send({ status: "failed", message: "All fields are required" });
        }
      } else {
        res.send({
          status: "failed",
          message: "Unauthorized to cancel the class",
        });
      }
    } catch (error) {
      console.error(error);
      res.send({
        status: "failed",
        message: "Class cannot be registered",
      });
    }
  };

  // /**
  //  * Reschedules a class by updating the date of the class with the given classId.
  //  * @param {Object} req - The request object.
  //  * @param {Object} res - The response object.
  //  * @returns None
  //  * @throws {Error} If the class cannot be rescheduled.
  //  */
  static rescheduleClass = async (req, res) => {
    try {
      const { dateNtime, classId } = req.body;
      console.log(req.body);
      const currentClass = await classModel.findOneAndUpdate({ _id: classId }, { date: new Date(dateNtime) })
      res.send({ status: "successful", message: "class rescheduled" })
    } catch (error) {
      console.error(error);
      res.send({ status: "failed", message: "class can not be rescheduled" })

    }

  }
}

export default ClassController;
