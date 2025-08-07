import Borrow from "../model/borrowingSchema.js";
import Book from "../model/bookSchema.js";
import User from "../model/userSchema.js";

export const most_borrowed_books = async (req, res) => {
  try {
    const results = await Borrow.aggregate([
      { $group: { _id: "$book", borrowCount: { $sum: 1 } } },
      { $sort: { borrowCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          _id: 0,
          bookId: "$bookDetails._id",
          title: "$bookDetails.title",
          author: "$bookDetails.author",
          borrowCount: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, mostBorrowedBooks: results });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const active_members = async (req, res) => {
  try {
    const results = await Borrow.aggregate([
      { $group: { _id: "$user", borrowCount: { $sum: 1 } } },
      { $sort: { borrowCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          userId: "$userDetails._id",
          name: "$userDetails.name",
          email: "$userDetails.email",
          borrowCount: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, activeMembers: results });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const book_availability = async (req, res) => {
  try {
    const [totalBooks, borrowedBooks] = await Promise.all([
      Book.estimatedDocumentCount(),
      Borrow.countDocuments({ status: "Borrowed" }),
    ]);

    res.status(200).json({
      success: true,
      summary: {
        totalBooks,
        borrowedBooks,
        availableBooks: totalBooks - borrowedBooks,
      },
    });
  } catch (error) {
    console.error("Availability Error:", error);
    res.status(500).json({
      success: false,
      message: "Database operation failed",
      error: error.message,
    });
  }
};
