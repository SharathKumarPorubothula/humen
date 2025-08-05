import express from 'express'
import {most_borrowed_books,active_members,book_availability} from '../controller/ReportsController.js'
var route=express.Router()

route.get('/most-borrowed-books',most_borrowed_books)
route.get('/active-members',active_members)
route.get('/book-availability',book_availability)

export default route