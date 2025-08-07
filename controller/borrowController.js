import Borrow from "../model/borrowingSchema.js";
import Book from "../model/bookSchema.js";

export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    if (book.copies <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Book not available" });
    }

    book.copies -= 1;
    await book.save();

    const borrowRecord = await Borrow.create({
      user: req.user.id,
      book: bookId,
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Book borrowed successfully",
        borrowRecord,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.params;

    const borrowRecord = await Borrow.findById(borrowId).populate("book");
    if (!borrowRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Borrow record not found" });
    }

    if (borrowRecord.status === "Returned") {
      return res
        .status(400)
        .json({ success: false, message: "Book already returned" });
    }

    // Update borrow record
    borrowRecord.status = "Returned";
    borrowRecord.returnDate = new Date();
    await borrowRecord.save();

    // Increase available copies
    borrowRecord.book.copies += 1;
    await borrowRecord.book.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Book returned successfully",
        borrowRecord,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const borrowHistory = async (req, res) => {
  try {
    const history = await Borrow.find({ user: req.user.id })
      .populate("book", "title author ISBN")
      .sort({ borrowDate: -1 });

    res.status(200).json({ success: true, history });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
