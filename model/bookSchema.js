import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    ISBN: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
    },
    publicationDate: {
      type: Date
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      trim: true,
    },
    copies: {
      type: Number,
      required: [true, "Number of copies is required"],
      min: [0, "Copies cannot be negative"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
