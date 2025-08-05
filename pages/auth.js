import express from 'express'
import { register,login } from '../controller/userAuth.js'

var route=express.Router()

route.post('/register',register)
route.post('/login',login)


export default route