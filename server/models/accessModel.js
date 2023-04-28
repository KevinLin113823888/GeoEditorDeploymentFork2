const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
/*
    expires in 5 hours
*/
const accessSchema = new Schema(
    { 
        token: { type: String, required: true, expires: 18000 }
    },
    { timestamps: true },
)

module.exports = mongoose.model('acess', accessSchema)