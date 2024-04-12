const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();

const userRoutes = require('./src/routes/users.js')

const app = express()

const isLoggedIn = (req, res, next) => {
    try {
        const user = jwt.verify(req.headers.token, process.env.JWT_PRIVATE_KEY)
        req.user = user
        next()
    } catch (error) {
        return res.send('You have not logged in. Please log in!')
    }
}

const isAdmin = (req, res, next) => {
    if(req.user.isAdmin)
        next()
    return res.send('You are not authorized to access this page!')
}

const isPremium = (req, res, next) => {
    if(req.user.isPremium)
        next()
    return res.send('You are not authorized to access this page!')
}

app.use(bodyParser.json())
app.use(userRoutes)

app.set('view engine', 'ejs')

// NON LOGGED-IN USERS
app.get('/', (req, res) => {
    res.send('LANDING PAGE')
})

// LOGGED-IN USERS
app.get('/products', isLoggedIn, (req, res) => {
    res.send({
        fullName: req.user.firstName + ' ' + req.user.lastName,
        page: 'PRODUCTS PAGE'
    })
})

// LOGGED-IN + ADMINS
app.get('/admin', isLoggedIn, isAdmin, (req, res) => {
    res.send('ADMIN PAGE')
})

// LOGGED-IN + PREMIUM USERS
app.get('/products/premium', isLoggedIn, isPremium, (req, res) => {
    res.send('PREMIUM PRODUCTS PAGE')
})

app.listen(process.env.PORT, () => {
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => console.log('Server is up :)'))
        .catch((error) => console.log(error))
})






/*
    Login/Signup

    Authentication: 
        - Who are you? 
        - Checking whether the user is having an account
    Authorization:
        - What access do you have?
        - Checking what access the user has

    Encryption:
        - Encrypt: Original Password -> Encrypted Password
        - Decrypt: Encrypted Password -> Original Password

        - Eg: 
            - Encryption Rule: N+3
                - Original Password: sahil123
                - Encrypted Password: vdklo456
            - Decryption Rule: N-3
                - Encrypted Password: vdklo456
                - Original Password: sahil123

    Packages
    - bcrypt (Encryption)
    - jsonwebtoken (Session)
*/