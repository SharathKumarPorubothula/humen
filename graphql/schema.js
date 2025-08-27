import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} from "graphql";
import User from "../model/userSchema.js";
import Book from "../model/bookSchema.js";
import Borrow from "../model/borrowingSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * USER TYPE
 */
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString },
  }),
});

/**
 * BOOK TYPE
 */
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    author: { type: GraphQLString },
    ISBN: { type: GraphQLString },
    genre: { type: GraphQLString },
    copies: { type: GraphQLInt },
  }),
});

/**
 * BORROW TYPE
 */
const BorrowType = new GraphQLObjectType({
  name: "Borrow",
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: UserType },
    book: { type: BookType },
    status: { type: GraphQLString },
    borrowDate: { type: GraphQLString },
    returnDate: { type: GraphQLString },
  }),
});

/**
 * ROOT QUERY
 */
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    books: {
      type: new GraphQLList(BookType),
      resolve: async (parent, args, context) => {
        if (!context.user) throw new Error("Unauthorized");
        return Book.find();
      },
    },
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve: async (parent, args, context) => {
        if (!context.user) throw new Error("Unauthorized");
        return Book.findById(args.id);
      },
    },
    me: {
      type: UserType,
      resolve: (parent, args, context) => {
        if (!context.user) throw new Error("Unauthorized");
        return context.user;
      },
    },
  },
});

/**
 * MUTATIONS
 */
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // User registration
    register: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const existing = await User.findOne({ email: args.email });
        if (existing) throw new Error("Email already registered");

        const hashedPassword = await bcrypt.hash(args.password, 10);
        const user = await User.create({
          name: args.name,
          email: args.email,
          password: hashedPassword,
          role: args.role || "Member",
        });
        return user;
      },
    },

    // User login
    login: {
      type: GraphQLString, // return JWT
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const user = await User.findOne({ email: args.email }).select(
          "+password"
        );
        if (!user) throw new Error("Invalid credentials");

        const isMatch = await bcrypt.compare(args.password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );
        return token;
      },
    },

    // Add book (Admin only)
    addBook: {
      type: BookType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        author: { type: new GraphQLNonNull(GraphQLString) },
        ISBN: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLString },
        copies: { type: GraphQLInt },
      },
      resolve: async (parent, args, context) => {
        if (!context.user || context.user.role !== "Admin") {
          throw new Error("Admin access required");
        }
        return Book.create(args);
      },
    },

    //Update book
    // Inside Mutation
updateBook: {
  type: BookType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    author: { type: GraphQLString },
    ISBN: { type: GraphQLString },
    genre: { type: GraphQLString },
    copies: { type: GraphQLInt },
  },
  resolve: async (parent, args, context) => {
    if (!context.user || context.user.role !== "Admin") {
      throw new Error("Admin access required");
    }

    const updatedBook = await Book.findByIdAndUpdate(
      args.id,
      { $set: { ...args } },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      throw new Error("Book not found");
    }

    return updatedBook;
  },
},

    //delete
deleteBook: {
  type: BookType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (parent, args, context) => {
    if (!context.user || context.user.role !== "Admin") {
      throw new Error("Admin access required");
    }

    const deletedBook = await Book.findByIdAndDelete(args.id);

    if (!deletedBook) {
      throw new Error("Book not found");
    }

    return deletedBook;
  },
},

    //borrow book
    borrowBook: {
  type: BorrowType,
  args: {
    bookId: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (parent, args, context) => {
    if (!context.user) throw new Error("Authentication required");

    const book = await Book.findById(args.bookId);
    if (!book || book.copies <= 0) {
      throw new Error("Book not available");
    }

    // Decrease available copies
    book.copies -= 1;
    await book.save();

    const borrow = await Borrow.create({
      user: context.user.id,
      book: args.bookId,
      status: "Borrowed",
      borrowDate: new Date(),
    });

    return borrow;
  },
},

    //Return a Book
    returnBook: {
  type: BorrowType,
  args: {
    borrowId: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (parent, args, context) => {
    if (!context.user) throw new Error("Authentication required");

    const borrow = await Borrow.findById(args.borrowId).populate("book");
    if (!borrow) throw new Error("Borrow record not found");
    if (borrow.status === "Returned") throw new Error("Book already returned");

    // Update book copies
    const book = await Book.findById(borrow.book.id);
    book.copies += 1;
    await book.save();

    // Update borrow record
    borrow.status = "Returned";
    borrow.returnDate = new Date();
    await borrow.save();

    return borrow;
  },
},


    //Borrow History
    borrowHistory: {
  type: new GraphQLList(BorrowType),
  resolve: async (parent, args, context) => {
    if (!context.user) throw new Error("Unauthorized");

    // Admin can see all, user sees their own
    if (context.user.role === "Admin") {
      return Borrow.find().populate("user").populate("book");
    } else {
      return Borrow.find({ user: context.user.id }).populate("book");
    }
  },
},

    //Reports (Admin Only)
    reports: {
  type: new GraphQLObjectType({
    name: "Report",
    fields: {
      totalBooks: { type: GraphQLInt },
      totalBorrows: { type: GraphQLInt },
      activeMembers: { type: GraphQLInt },
    },
  }),
  resolve: async (parent, args, context) => {
    if (!context.user || context.user.role !== "Admin") {
      throw new Error("Admin access required");
    }

    const totalBooks = await Book.countDocuments();
    const totalBorrows = await Borrow.countDocuments();
    const activeMembers = await User.countDocuments({ role: "Member" });

    return { totalBooks, totalBorrows, activeMembers };
  },
},


    
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
