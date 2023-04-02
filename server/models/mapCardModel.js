const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
/*
    This is where we specify the format of the data we're going to put into
    the database.
*/
const mapCardSchema = new Schema(
    {
        title: { type: String, required: true, unique: true },
        mapImages:{type: String,required: false},
        classification:{type:[String],required:false},
        lastModifiedDate:{type:Date, required:false},
        map:{type: ObjectId,required:true},
        communityPreview:{type: ObjectId,required:false}
    },
    { timestamps: true },
)

module.exports = mongoose.model('MapCard', mapCardSchema)
