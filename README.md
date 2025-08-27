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
  "title": "Think like monk",
  "author": "James Clear",
  "ISBN": "123456788",
  "publicationDate": "2021-05-01",
  "genre": "Self-help",
  "copies": 5
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
POST https://humen-1.onrender.com/graphql
Headers
Authorization: Bearer JWT_TOKEN_HERE
Content-Type: application/json
Body → raw → JSON


✅ GraphQL Query for Registration:
{
  "query": "mutation { register(name: \"Sharath\", email: \"sharath@example.com\", password: \"123456\", role: \"Admin\") { id name email role } }"
}

or

mutation {
  register(
    name: "John"
    email: "john12@example.com"
    password: "123456"
    role: "Member"
  ) {
    id
    name
    email
    role
  }
}

________________________________________________________________________________


✅ GraphQL Query for Login:
{
  "query": "mutation { login(email: \"sharath@example.com\", password: \"123456\") }"
}
It returns the JWT token as a string.

or

mutation {
  login(email: "sharath@example.com", password: "123456")
}

token: authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTMwNDlmNmM0ZTljZmY0MjgwODZjMSIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTc1NjI5Mjc0MiwiZXhwIjoxNzU2ODk3NTQyfQ.caroYiv3UINxDPXxvCLAVTrg1Ft0PyOYnqpx__sw79U


___________________________________________________________________________

✅ Other Working Queries from Your Schema:
1. Get All Books:
{
  "query": "{ books { id title author ISBN genre copies } }"
}

or 
{
  books {
    id
    title
    author
    ISBN
    genre
    copies
  }
}

__________________________________________________________________________

2. Get Single Book by ID:
{
  "query": "{ book(id: \"BOOK_ID_HERE\") { title author } }"
}

or 
{
  book(id: "6892419f701ee870b54aeef8") {
    title
    author
  }
}

_____________________________________________________________________________

3. Add Book
   ISBN number should be unique for every new book

   mutation {
  addBook(
    title: "Atomic Habits",
    author: "James Clear",
    ISBN: "123456710",
    genre: "Self-help",
    copies: 5
  ) {
    id
    title
    author
    ISBN
    genre
    copies
  }
}

___________________________________________________________________________

4.Update the Book
mutation {
  updateBook(
    id: "68aef06e5e03d4d2c922f031"
    title: "Think Like Monk"
    author: "Jay Shetty"
    ISBN: "123456788"
    genre: "Self-help"
    copies: 5
  ) {
    id
    title
    author
    ISBN
    genre
    copies
  }
}

___________________________________________________________________________

3. Get Current User Info (me):
{
  "query": "{ me { id name email role } }"
}

or 

{
  me {
    id
    name
    email
    role
  }
}

_______________________________________________________________________

4. Delete Book
   mutation {
  deleteBook(id: "68aef06e5e03d4d2c922f031") {
    id
    title
    author
  }
}

___________________________________________________________________

5.Borrow Book
mutation {
  borrowBook(bookId: "6892419f701ee870b54aeef8") {
    id
    status
    borrowDate
    book { title }
  }
}

___________________________________________________________________

6.Return book
mutation {
  returnBook(borrowId: "68aef547531261fdb2751c72") {
    id
    status
    returnDate
    book { title }
  }
}

_________________________________________________________________

7.Reports
query {
  reports {
    totalBooks
    totalBorrows
    activeMembers
  }
}

_______________________________________________________________

8. Active members
   query {
  reports {
    activeMembers
  }
}

________________________________________________________________

9.Book Availability
query {
  reports {
    totalBooks
    totalBorrows
    activeMembers
    # Note: book availability (availableBooks) isn't part of the schema yet
  }
}

Note: This requires sending the token in headers:
-------------------------------------------------




