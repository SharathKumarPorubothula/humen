import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
};

export const memberOnly = (req, res, next) => {
  if (req.user && req.user.role === "Member") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Members only" });
  }
};
