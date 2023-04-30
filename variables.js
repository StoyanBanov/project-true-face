module.exports = {
    port: 3000,
    dbConn: 'mongodb://localhost:27017/true-face',
    jwtSecret: 'true-face-secret',
    passwordRegex: /^(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]{10,}$/
}