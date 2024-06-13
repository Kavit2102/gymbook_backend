import express from "express";
import ClassController from "../controllers/classController.js";
import FeedBackController from "../controllers/feedbackController.js";
const router = express.Router();
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

//route level middleware
//user related
router.use("/changepassword", checkUserAuth);
router.use("/loggeduser", checkUserAuth);
//user related admin task
router.use("/register", checkUserAuth);
router.use("/getalluser", checkUserAuth);
router.use("/deleteuser", checkUserAuth);

//class related
//admin task
router.use("/addclass", checkUserAuth);
router.use("/deleteclass", checkUserAuth);
//only user
router.use("/registerclass", checkUserAuth);
router.use("/deregisterclass", checkUserAuth);
//all
router.use("/getallclass", checkUserAuth);
//feedback
router.use("/createfeedback", checkUserAuth);
router.use("/getfeedback", checkUserAuth);
router.use("/updateprofile", checkUserAuth);

//public routes
router.post("/login", UserController.userLogin);

//private routes
//admins user related task
router.post("/register", UserController.userRegistration);
router.delete("/deleteuser/:id", UserController.DeleteUserById);
router.get("/getalluser", UserController.getAllUsers);
router.post("/addclass", ClassController.addClass);
router.post("/deleteclass", ClassController.deleteClass);
//user specific
router.post("/changepassword", UserController.changePassword);
router.post("/forgetpassword", UserController.forgetPassword);
// router.get("/loggeduser", UserController.loggedUser);
router.post("/registerclass", ClassController.registerClasss);
router.post("/deregisterclass", ClassController.deregisterClass);
router.post("/rescheduleclass",ClassController.rescheduleClass)
router.post("/updateprofile",  UserController.updateProfile);

router.get("/getallclass", ClassController.getAllClass);
router.post("/createfeedback", FeedBackController.createUserFeedBack);
router.get("/getfeedback", FeedBackController.getUserFeedBack);

export default router;
