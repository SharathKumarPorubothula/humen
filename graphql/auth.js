import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";
import dotenv from "dotenv";

dotenv.config();

export const graphqlAuth = async (req) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      return user;
    } catch (error) {
      return null; // No auth
    }
  }
  return null;
};
