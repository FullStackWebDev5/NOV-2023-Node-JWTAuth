const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.json({
      status: 'SUCCESS',
      data: users
    })
  } catch (error) {
    res.status(500).json({
      status: 'FAILED',
      message: 'Something went wrong'
    })
  }
}

const signUpUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, isAdmin, isPremium } = req.body
    const encryptedPassword = await bcrypt.hash(password, 10)
    await User.create({ firstName, lastName, email, password: encryptedPassword, isAdmin, isPremium })
    const token = jwt.sign(req.body, process.env.JWT_PRIVATE_KEY, { expiresIn: 30 })
    res.status(201).json({
      status: 'SUCCESS',
      message: 'User signed up successfully',
      token
    })
  } catch (error) {
    res.status(500).json({
      status: 'FAILED',
      message: 'Something went wrong'
    })
  }
}

const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if(user) {
      const doesPasswordMatch = await bcrypt.compare(password, user.password)

      if(doesPasswordMatch) {
        const token = jwt.sign(user.toJSON(), process.env.JWT_PRIVATE_KEY, { expiresIn: 30 })

        return res.json({
          status: 'SUCCESS',
          message: 'User logged in successfully',
          token
        })
      }
    }

    res.status(401).json({
      status: 'FAILED',
      message: 'Invalid credentials'
    })
  } catch (error) {
    res.status(500).json({
      status: 'FAILED',
      message: 'Something went wrong'
    })
  }
}

module.exports = {
  getUsers,
  signUpUser,
  logInUser
}