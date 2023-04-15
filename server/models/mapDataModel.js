const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed;
const ObjectId = Schema.Types.ObjectId
/*
    This is where we specify the format of the data we're going to put into
    the database.
*/
const mapDataSchema = new Schema(
    {
        type: { type: String, required: true },
        features: { type: [{
            type: String,
            properties: Object,
            geometry: { type:[{
                type: String,
                coordinates:{ type:Mixed, default:[]}
            }]},
            // borderColor: String,
            // subRegionColor: String
        }], required: false },
        // mapProperties: { type: Object, required: true },
        // graphicalData:{type:{
        //     backgroundColor:String,
        //     textOverlay:{type:[{
        //         overlayText:String,
        //         coordinates:{type: Mixed,default:[]}
        //     }]},
        //     legend:{type:[{
        //         color: String,
        //         legendText: String
        //     }]}
        // }, required: false }
    },
    { timestamps: true },
)

module.exports = mongoose.model('MapData', mapDataSchema)
