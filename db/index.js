const mongoose = require('mongoose')
require("dotenv").config();
const { MONGO_URI } = process.env;


mongoose
    .connect(MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log("db Connected"))
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db