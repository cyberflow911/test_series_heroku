const mongoose = require('mongoose');

const {Schema} = mongoose;

const socialLogins = new Schema(
    {
        
        
        email: 
        {
            required: true,
            type: String,
            unique:true,
            min: 8
        },
        typeUser:
        {
            type: Number,
            enum: [0,1,2],
            default: 2

        },
        profileImage:
        {
            type: String,
            default: ''
        },
        name:

        {
            type: String,
            default: ''
        },
        mobileNumber:

        {
            type: String,
            default: ''
            
        },
        about:
        {
            type: String,
            default: ''
        },
        
        isActive: 
        {
            type: Boolean,
            default: true
        },
        paidStatus: 
        {
            type: Boolean,
            default: false
        },
       
        // password: 
        // {
        //     type: String,
        //     required : true,
        //     min: 8
        // },
        
        // salt : {
        //     type: String,
        //     required: true,
            

        // },
       
        
        otp:
        {
            token:
            {
                type: String,
                default: ""
            },
            secret:
            {
                type: String,
                default: ""
            },
            time:
            {
                type: Date,
                default: ""
            }


        }
       
    

    },{timestamps: true}
)

const socialLogin = mongoose.model("socialLogin", socialLogins);

exports.socialLogin = socialLogin;
