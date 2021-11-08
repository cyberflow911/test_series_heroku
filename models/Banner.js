const mongoose = require('mongoose');

const {Schema} = mongoose;

const Banners = new Schema(
    {

        bannerImage:
        {
            type: String,
            default: ''
        },
        bannerLink:
        {
            type: String,
            default: ''
        }
      

    },{timestamps: true}
)

const Banner = mongoose.model("Banner", Banners );

exports.Banner = Banner;