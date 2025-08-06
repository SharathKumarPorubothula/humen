1️⃣ Authentication
Register
POST /api/auth/register
Registers a new user (Admin or Member).
Request Body:
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "123456",
  "role": "Admin"
}

---------------------------------------------------------------------------------------------------------

Login
POST /api/auth/login
Logs in a user and returns a JWT token.

Request Body:
{
  "email": "admin@example.com",
  "password": "123456"
}

Response Example:
{
  "success": true,
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": "USER_ID",
    "name": "Admin User",
    "role": "Admin"
  }
}
-----------------------------------------------------------------------------------------
2️⃣ Book Management (Admin Only)
Add Book
POST /api/books
Headers:
Authorization: Bearer <token>
Request Body:
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "ISBN": "1234567890",
  "publicationDate": "2021-05-01",
  "genre": "Self-help",
  "copies": 3
}


List Books
GET /api/books

GET /api/books?page=1&limit=5&genre=Self-help
--------------------------------------
Update Book
PUT /api/books/:id
Headers:
Authorization: Bearer <token>
Request Body:
{
  "copies": 5
}
--------------------------------------
Delete Book
DELETE /api/books/:id
Headers:
Authorization: Bearer <token>

----------------------------------------
3️⃣ Borrowing System (Member Only)
Borrow Book
POST /api/borrow/:bookId
Borrows a book if copies > 0.
Headers:
Authorization: Bearer <token>
--------------------------------------
Return Book
POST /api/borrow/return/:borrowId

-------------------------------------
Returns a borrowed book.
Headers:
Authorization: Bearer <token>
Borrow History
GET /api/borrow/history
----------------------------------------
Retrieves logged-in member’s borrowing history.
Headers:
Authorization: Bearer <token>
4️⃣ Reports (Admin Only)
Most Borrowed Books
GET /api/reports/most-borrowed-books
Lists top 5 most borrowed books.

Headers:
Authorization: Bearer <token>
Active Members
GET /api/reports/active-members
Lists top 5 members who borrowed the most books.

Headers:
Authorization: Bearer <token>
Book Availability
GET /api/reports/book-availability
Returns summary of total, borrowed, and available books.
Authorization: Bearer <token>
5️⃣ GraphQL API
POST /graphql
Example Query:

json
Copy
Edit
{
  "query": "{ mostBorrowedBooks { title author borrowCount } }"
}
Example Response:

json
Copy
Edit
{
  "data": {
    "mostBorrowedBooks": [
      { "title": "Atomic Habits", "author": "James Clear", "borrowCount": 5 },
      { "title": "Deep Work", "author": "Cal Newport", "borrowCount": 3 }
    ]
  }
}
Authentication Notes
Use the Login API to get a JWT token.

Pass the token in Authorization header for protected routes:

Authorization: Bearer <your_token_here>
