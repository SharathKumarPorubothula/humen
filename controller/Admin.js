import Book from "../model/bookSchema.js";


export const addBook = async (req, res) => {
  try {
    const { title, author, ISBN, publicationDate, genre, copies } = req.body;

    // Validation
    if (!title || !author || !ISBN || !publicationDate || !genre || copies === undefined) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if book already exists
    const existingBook = await Book.findOne({ ISBN });
    if (existingBook) {
      return res.status(400).json({ success: false, message: "Book with this ISBN already exists" });
    }

    // Create book
    const book = await Book.create({
      title,
      author,
      ISBN,
      publicationDate,
      genre,
      copies
    });

    res.status(201).json({ success: true, message: "Book added successfully", book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};




export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and update
    const book = await Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({ success: true, message: "Book updated successfully", book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};




export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



export const listBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, genre, author } = req.query;
    const filter = {};

    if (genre) filter.genre = genre;
    if (author) filter.author = author;

    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      books
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
