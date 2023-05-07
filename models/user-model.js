const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
    {
        name: { type: String },
        email: { type: String },
        userId: { type: String },
        isVarified: { type: Boolean },
        isSubscriber: { type: Boolean },
        professionalInfo: {
            age: { type: String },
            gender: { type: String },
            position: { type: String },
            industry: { type: String },
            location: { type: String },
            experience: { type: String },
            nameProfessional: { type: String },
            country: { type: String },
            number: { type: String },
            gender: { type: String },
            job_type: { type: String },
            cv: { type: String }
        }

    },
    { timestamps: true },
)

module.exports = mongoose.model('users', User);