// ENV Config
require('dotenv').config()

const app = require('./app')

const server = app.listen(process.env.SERVER_PORT);
console.log(`The server is on port ${process.env.SERVER_PORT}`)

module.exports = server