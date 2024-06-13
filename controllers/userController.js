import UserModel from "../models/User.js";
import classModel from "../models/class.js";
import FeedbackModel from "../models/feedback.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


class UserController {

  // /**
  //  * Registers a new user with the given information.
  //  * @param {Object} req - The request object.
  //  * @param {Object} res - The response object.
  //  * @returns None
  //  * @throws {Error} If the user is not an admin or if the user is already registered.
  //  */
  static userRegistration = async (req, res) => {
    const admin = req.user;
    if (admin.role !== "admin") {
      res.send({ status: "failed", message: "only admin can add members" });
    } else {
      const {
        name,
        email,
        mobileNo,
        address,
        password,
        role
      } = req.body;
      const user = await UserModel.findOne({ email: email });
      if (user) {
        res.send({
          status: "failed",
          message: "Already registered with this email",
        });
      } else {
        if (name && email && mobileNo && address && password && role) {
          try {
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);
            const userInput = new UserModel({
              name: name,
              email: email,
              mobileNo: mobileNo,
              address: address,
              role: role,
              password: hashedPassword
            });
            await userInput.save();
            //accessing  the data if the current registration was succesful
            const savedUser = await UserModel.findOne({ email: email });
            //generating token for the registered user
            const token = jwt.sign(
              { userID: savedUser._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );

            res.send({
              status: "success",
              message: "successfully registered",
              token: token,
            });
          } catch (error) {
            console.log(error);
            res.send({ status: "failed", message: "Failed to register" });
          }
        } else {
          res.send({
            status: "failed",
            message: "All the fields are required",
          });
        }
      }
    }
  };

  // /**
  //  * Authenticates a user by checking if the email and password provided match a user in the database.
  //  * @param {Object} req - The request object containing the email and password in the body.
  //  * @param {Object} res - The response object that will be sent back to the client.
  //  * @returns None
  //  */
  static userLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        console.log(user);
        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isMatch) {
            const token = jwt.sign(
              { userID: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );
            res.send({
              status: "success",
              message: "Login Successful",
              token: token,
              user: user.toJSON(),
            });
          } else {
            res.send({
              status: "failed",
              message: "wrong email or password, try again",
            });
          }
        } else {
          res.send({ status: "failed", message: "user not registered" });
        }
      } else {
        res.send({ status: "failed", message: "all fields are required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "login failed" });
    }
  };

  // /**
  //  * Updates the user profile with the given information.
  //  * @param {Object} req - The request object containing the user ID and profile information.
  //  * @param {Object} res - The response object to send back to the client.
  //  * @returns None
  //  */
  static updateProfile = async (req,res) =>{
    const userId = req.user;
    const {name,email,mobileNo} =req.body;
    

    if(name){
      await UserModel.findOneAndUpdate({_id:userId}, {
        $set: { name: name },
      });
    }if(email){
      await UserModel.findOneAndUpdate({_id:userId}, {
        $set: { email: email },
      });
    }
    if(mobileNo){
      await UserModel.findOneAndUpdate({_id:userId}, {
        $set: { mobileNo: mobileNo },
      });
    }
    res.send({status:"success", message:"profile updated"} )

  }


  // /**
  //  * Changes the password for a user with the given email address.
  //  * @param {Object} req - The request object.
  //  * @param {Object} res - The response object.
  //  * @returns None
  //  */
  static forgetPassword = async (req,res)=>{
    const {email, password, confirmPassword} = req.body;
    console.log(req.body);
    try {
      if(email && password && confirmPassword){
        const userData = await UserModel.findOne({email:email});
        if(userData){
            if (password !== confirmPassword) {
              res.send({
                status: "failed",
                message: "Password and confirm password do not match",
              });
            } else {
              const salt = await bcrypt.genSalt(12);
              const newHashedPassword = await bcrypt.hash(password, salt);
              await UserModel.findOneAndUpdate({email:email}, {
                $set: { password: newHashedPassword },
              });
            }
            res.send({ status: "success", message: "password changed successfully" });
          
        }else{
          res.send({status:"failed",message:"User not registered with this email"})
        }}else{
          res.send({status:"failed",message:"all fields are required"})
          
        }
    } catch (error) {
      console.error(error)
      res.send({status:"failed", message:"can not change password"})
    }
    
  
  }

  // /**
  //  * Changes the password of the user associated with the given request object.
  //  * @param {Object} req - The request object containing the user ID and the new password.
  //  * @param {Object} res - The response object to send the result of the password change.
  //  * @returns None
  //  */
  static changePassword = async (req, res) => {
    const { password, confirmPassword } = req.body;
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        res.send({
          status: "failed",
          message: "Password and confirm password do not match",
        });
      } else {
        const salt = await bcrypt.genSalt(12);
        const newHashedPassword = await bcrypt.hash(password, salt);
        await UserModel.findByIdAndUpdate(req.user._id, {
          $set: { password: newHashedPassword },
        });
        // await UserModel.save();
      }
      res.send({ status: "success", message: "password changed successfully" });
    } else {
      res.send({ status: "failed", message: "Both fields are required" });
    }
  };

  // static loggedUser = async (req, res) => {
  //   res.send({ user: req.user });
  // };

  // /**
  //  * Retrieves all users from the database, excluding the admin user, and sends the data as a response.
  //  * @param {Object} req - The request object.
  //  * @param {Object} res - The response object.
  //  * @returns None
  //  * @throws {Error} If the user is not authorized to access this endpoint.
  //  */
  static getAllUsers = async (req, res) => {
    if (req.user.role === "admin") {
      const allUser = await UserModel.find({ role: { $ne: "admin" } }).select(
        "-password -feedback -__v"
      );
      res.send({ allUser, status: "success", message: "users data fetched" });
    } else {
      res.send({ status: "failed", message: "Unauthorized user" });
    }
  };

  // /**
  //  * Deletes a user from the database by their ID.
  //  * @param {Object} req - The request object.
  //  * @param {Object} res - The response object.
  //  * @returns None
  //  */
  static DeleteUserById = async (req, res) => {
    const user_id = req.params.id;
    const user = await UserModel.findById(user_id);
    console.log(user_id);
    if (user_id) {
      try {
        if (req.user.role === "admin") {
          if(user.role ==="trainer"){
            const trainerClasses = await classModel.find({trainerId:user_id});
            const classIDs = [];
            trainerClasses.forEach((classes)=>{
              classIDs.push(classes._id)
            });
            classIDs.forEach(async (classID) => {
              await UserModel.updateMany({bookedClass:{$in:[classID]}},{$pull:{bookedClass:classID}});
            });           
            await classModel.deleteMany({trainerId:user_id});

          }else if(user.role === "customer"){
            await classModel.updateMany({memberId:{$in:[user_id]}},{$pull:{memberId:user_id}}); 
          }

          await UserModel.deleteOne({ _id: user_id });

          res.send({ status: "success", message: "User successfully removed" });
        } else {
          res.send({ status: "failed", message: "Unauthorized user" });
        }
      } catch (error) {
        console.log(error);
        res.send({ status: "failed", message: "invalid ID" });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  };
}

export default UserController;
