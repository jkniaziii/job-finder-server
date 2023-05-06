const mongoose = require('mongoose')

mongoose
    .connect('mongodb+srv://jabbaswork:jabbaswork@jobfinder.5llb2iq.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(() => console.log("db Connected"))
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db