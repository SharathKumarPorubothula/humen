import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Borrowed", "Returned"],
      default: "Borrowed",
    },
  },
  { timestamps: true }
);

/**
 * ====== AGGREGATION HELPERS ======
 * These static methods can be used for reports.
 */

// Most Borrowed Books
borrowSchema.statics.getMostBorrowedBooks = function (limit = 5) {
  return this.aggregate([
    { $group: { _id: "$book", borrowCount: { $sum: 1 } } },
    { $sort: { borrowCount: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "bookDetails",
      },
    },
    { $unwind: "$bookDetails" },
  ]);
};

// Most Active Members
borrowSchema.statics.getMostActiveMembers = function (limit = 5) {
  return this.aggregate([
    { $group: { _id: "$user", borrowCount: { $sum: 1 } } },
    { $sort: { borrowCount: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" },
  ]);
};

// Book Availability Summary
borrowSchema.statics.getBookAvailabilitySummary = async function () {
  const totalBooks = await mongoose.model("Book").countDocuments();
  const borrowedBooks = await this.countDocuments({ status: "Borrowed" });
  const availableBooks = totalBooks - borrowedBooks;
  return { totalBooks, borrowedBooks, availableBooks };
};

export default mongoose.model("Borrow", borrowSchema);
