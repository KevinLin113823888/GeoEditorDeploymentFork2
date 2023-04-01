const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
/*
    This is where we specify the format of the data we're going to put into
    the database.
*/
const mapSchema = new Schema(
    {
        title: { type: String, required: true },
        mapImages:{type: String,required: true},
        classification:{type:[String],required:true},
        lastModifiedDate:{type:Date, required:true},
        map:{type: ObjectId,required:true},
        communityPreview:{type: ObjectId,required:true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Map', mapSchema)
