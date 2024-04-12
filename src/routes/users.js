const express = require('express')

const { 
  getUsers, 
  signUpUser, 
  logInUser, 
} = require('../controllers/users.js')

const router = express.Router()

router.get('/users', getUsers)

router.post('/signup', signUpUser)

router.post('/login', logInUser)

module.exports = router