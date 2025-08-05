import express from "express";
import { borrowBook, returnBook, borrowHistory } from "../controller/borrowController.js";
import { protect, memberOnly } from "../middleware/authMiddleware.js";

const route = express.Router();

route.post("/:bookId", protect, memberOnly, borrowBook);
route.post("/return/:borrowId", protect, memberOnly, returnBook);
route.get("/history", protect, memberOnly, borrowHistory);

export default route;
