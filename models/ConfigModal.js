const mongoose = require('mongoose');

const {Schema} = mongoose;

const Configurations = new Schema(
    {

        reffererCommission:
        {
            type:String,
            default: '0'
        },
        refferedComissions:
        {
            type:String,
            default:'0'
        } 
    },{timestamps: true}
)

const Configuration = mongoose.model("Configuration", Configurations );

exports.Configuration = Configuration;