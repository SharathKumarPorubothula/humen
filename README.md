render url : https://humen-1.onrender.com

Test REST API Endpoints
🔹 Authentication
Register
POST https://humen-1.onrender.com/api/auth/register
Body → raw → JSON
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "Member"
}

_______________________________________________
Login
POST https://humen-1.onrender.com/api/auth/login
Body → raw → JSON
{
  "email": "john@example.com",
  "password": "123456"
}

Response Example
{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member"
  }
}
________________________________________________________

🔹 Books (Admin Only)
Add Book
POST https://humen-1.onrender.com/api/books
Headers
Authorization: Bearer JWT_TOKEN_HERE
Body → raw → JSON
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "ISBN": "123456789",
  "publicationDate": "2021-05-01",
  "genre": "Self-help",
  "copies": 5
}
_______________________________________________________
Update Book
PUT https://humen-1.onrender.com/api/books/BOOK_ID
Headers
Authorization: Bearer JWT_TOKEN_HERE
Body
{
  "copies": 10
}

______________________________________________________
Delete Book
DELETE https://humen-1.onrender.com/api/books/BOOK_ID
Headers
Authorization: Bearer JWT_TOKEN_HERE

______________________________________________________
List Books
GET https://humen-1.onrender.com/api/books?page=1&limit=10
🔹 Borrowing System (Member Only)
Borrow Book
POST https://humen-1.onrender.com/api/borrow/BOOK_ID
Headers
Authorization: Bearer JWT_TOKEN_HERE
_____________________________________________________
Return Book
POST https://humen-1.onrender.com/api/borrow/return/BORROW_ID
Headers
Authorization: Bearer JWT_TOKEN_HERE
_____________________________________________________
Borrow History
GET https://humen-1.onrender.com/api/borrow/history
Headers
Authorization: Bearer JWT_TOKEN_HERE
____________________________________________________
🔹 Reports (Admin Only)
Most Borrowed Books
GET https://humen-1.onrender.com/api/reports/most-borrowed-books
_____________________________________________________
Active Members
GET https://humen-1.onrender.com/api/reports/active-members
______________________________________________________

Book Availability
GET https://humen-1.onrender.com/api/reports/book-availability

________________________________________________________
3️⃣ Test GraphQL API
Open Postman → Create a new request:
POST http://localhost:3000/graphql
Headers
Authorization: Bearer JWT_TOKEN_HERE
Content-Type: application/json
Body → raw → JSON


✅ GraphQL Query for Registration:
{
  "query": "mutation { register(name: \"Sharath\", email: \"sharath@example.com\", password: \"123456\", role: \"Admin\") { id name email role } }"
}


✅ GraphQL Query for Login:
{
  "query": "mutation { login(email: \"sharath@example.com\", password: \"123456\") }"
}
It returns the JWT token as a string.



✅ Other Working Queries from Your Schema:
1. Get All Books:
{
  "query": "{ books { id title author ISBN genre copies } }"
}


2. Get Single Book by ID:
{
  "query": "{ book(id: \"BOOK_ID_HERE\") { title author } }"
}


3. Get Current User Info (me):
{
  "query": "{ me { id name email role } }"
}

Note: This requires sending the token in headers:
-------------------------------------------------
Authorization: Bearer <JWT_TOKEN>

{
  "query": "mutation { addBook(title: \"1984\", author: \"George Orwell\", ISBN: \"1234567890\", genre: \"Dystopian\", copies: 10, publicationDate: \"1949-06-08\") { id title publicationDate } }"
}

