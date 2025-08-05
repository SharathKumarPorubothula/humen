import express from 'express'
import { addBook,updateBook,deleteBook,listBooks } from '../controller/Admin.js'
var route=express.Router()


var route=express.Router()

route.post('/',addBook)

route.put('/:id',updateBook)

route.delete('/:id',deleteBook)

route.get('/',listBooks)

export default route