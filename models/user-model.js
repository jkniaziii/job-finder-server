const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        userId: { type: String, required: true },
        isVarified:  { type: Boolean, required: true },
        isSubscriber:  { type: Boolean, required: true },
        professionalInfo: {
            age: { type: Number },
            gender: { type: String },
            position: { type: String },
            industry: { type: String },
            location: { type: String },
            experience: { type: Number },
            job_type: { type: String }
        }

    },
    { timestamps: true },
)

module.exports = mongoose.model('users', User);