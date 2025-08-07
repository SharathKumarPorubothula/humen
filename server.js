import express from "express";
import connect from "./config/connect.js";
import auth from "./pages/auth.js";
import book from "./pages/books.js";
import Report from "./pages/Reports.js";
import borrowRoutes from "./pages/borrow.js";
import cors from "cors";

import { graphqlHTTP } from "express-graphql";
import dotenv from "dotenv";
import schema from "./graphql/schema.js";
import graphqlAuth from "./middleware/graphqlAuth.js";

var app = express();

connect();

app.use(express.json());
app.use(cors());

app.use("/api/auth", auth);
app.use("/api/books", book);
app.use("/api/reports", Report);
app.use("/api/borrow", borrowRoutes);

dotenv.config();

app.use(
  "/graphql",
  graphqlHTTP(async (req) => {
    const user = await graphqlAuth(req);
    return {
      schema,
      graphiql: true,
      context: { user },
    };
  })
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log("REST API available at: http://localhost:3000/api");
  console.log("GraphQL available at: http://localhost:3000/graphql");
});
