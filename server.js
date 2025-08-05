import express from 'express';
import connect from './config/connect.js';
import auth from './pages/auth.js';
import book from './pages/books.js';
import Report from './pages/Reports.js';
import borrowRoutes from './pages/borrow.js';

// GraphQL imports
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schema.js';
import { graphqlAuth } from './graphql/auth.js';

var app = express();

// Connect to DB
connect();

// Middleware
app.use(express.json());

// REST API routes
app.use('/api/auth', auth);
app.use('/api/books', book);
app.use('/api/reports', Report);
app.use('/api/borrow', borrowRoutes);

// GraphQL endpoint
app.use(
  '/graphql',
  graphqlHTTP(async (req) => ({
    schema,
    graphiql: true, // UI for testing in browser
    context: { user: await graphqlAuth(req) }, // Pass logged-in user to resolvers
  }))
);

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
  console.log('REST API available at: http://localhost:3000/api');
  console.log('GraphQL available at: http://localhost:3000/graphql');
});
