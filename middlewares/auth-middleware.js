import jwt from "jsonwebtoken";
import UserController from "../controllers/userController.js";
import UserModel from "../models/User.js";

// /**
//  * Middleware function to check if the user is authorized to access a protected route.
//  * @param {Object} req - The request object.
//  * @param {Object} res - The response object.
//  * @param {Function} next - The next middleware function.
//  * @returns None
//  * @throws {Error} If the user is not authorized, an error is thrown.
//  */
const checkUserAuth = async (req, res, next) => {
  let token;
  // console.log(req.body);
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      //get the token from the header
      token = authorization.split(" ")[1];

      //verify the token
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);

      //get user info
      req.user = await UserModel.findById(userID).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401).send({ status: "failed", message: "Unauthorized user" });
    }
  }
  if (!token) {
    res.status(401).send({
      status: "failed",
      message: "Unauthorized user, no token available",
    });
  }
};

export default checkUserAuth;
