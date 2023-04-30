const { body, validationResult } = require('express-validator')
const { register, verifyEmail } = require('../services/authService')
const { createToken, verifyToken } = require('../util/jwtUtil')
const { passwordRegex } = require('../variables')
const { guestOnly, nonVerifiedOnly } = require('../util/guards')
const { sendConfirmationEmail } = require('../util/emailVerification')

const authController = require('express').Router()

authController.get('/non-verified/:id', nonVerifiedOnly(), (req, res) => {
    res.render('non-verified', { email: req.user.email })
})

authController.get('/verify-email/:id', nonVerifiedOnly(), (req, res) => {
    res.render('verify-email', req.user)
})

authController.post('/verify-email/:id', nonVerifiedOnly(), async (req, res) => {
    try {
        await verifyEmail(req.params.id)
        const data = verifyToken(req.cookies.jwt)
        data.verified = true
        createToken(data, res)
        res.redirect('/')
    } catch (error) {
        res.redirect('/login')
    }
})

authController.get('/register', guestOnly(), (req, res) => {
    res.render('register')
})

authController.post('/register', guestOnly(),
    body(['username', 'email', 'password', 'gender']).trim(),
    body('username').isAlphanumeric().withMessage('The username may consist only of english letters and/or numbers!')
        .isLength({ min: 5, max: 20 }).withMessage('The password must be between 5 and 20 characters!'),
    body('email').isEmail().withMessage('The email is not valid!')
        .isLength({ min: 7, max: 30 }).withMessage('The password must be between 7 and 30 characters!'),
    body('password').matches(passwordRegex).withMessage('The password is not safe enough!')
        .isLength({ min: 10, max: 30 }).withMessage('The password must be between 10 and 30 characters!'),
    body('rePassword').custom((value, { req }) => value == req.body.password).whitelist('The passwords are not the same!'),
    async (req, res) => {
        const { errors } = validationResult(req)
        try {
            if (errors.length > 0) throw errors
            const user = await register(req.body)
            createToken(user, res)
            await sendConfirmationEmail(user)
            res.render('non-verified', { email: user.email })
        } catch (error) {
            res.render('register', {
                errorMsgs: errors.map(e => e.msg),
                user: req.body
            })
        }
    })

authController.all('/*', (req, res, next) => {
    next()
})

module.exports = authController