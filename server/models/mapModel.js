const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
/*
    This is where we specify the format of the data we're going to put into
    the database.
*/
const mapSchema = new Schema(
    {
        title: { type: String, required: true, unique: true },
        owner: { type: ObjectId, required: true },
        mapData: { type: ObjectId, required: false },
        mapData: { type: ObjectId, required: false },
        published: {type: Boolean, required: false},
        publishDate:{type:Date,required:false},
        lastModifiedDate:{type:Date,required:false},
        
    },
    { timestamps: true },
)

module.exports = mongoose.model('Map', mapSchema)
