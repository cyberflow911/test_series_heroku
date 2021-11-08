const mongoose = require('mongoose');

const {Schema} = mongoose;

const Admins = new Schema(
    {
        userName: {
            required: true,
            type: String,
            min:3
        },
        
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
        purchasedTest:
        [
            {
                type: Schema.Types.ObjectId,
                ref: 'Test'
            }
            

        ],
        purchasedSubCategories:
        [
            {
                type: Schema.Types.ObjectId,
                ref: 'subCategory'
            }

        ],
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
        referral:
        {
            type: String,
            default: ''
        },
        password: 
        {
            type: String,
            required : true,
            min: 8
        },
        referralStatus:
        {
            type: Boolean,
            default: false
        },
        commisionPercent:
        {
            type: Number,
            default: 50

        },
        
        salt : {
            type: String,
            required: true,
            

        },
        referralCode:
        {
            type: String,
            default: ''
        },
        referralUsed:
        
        {
               type: Boolean,
               default: false
        }
        ,
        
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

const Admin = mongoose.model("Admin", Admins);

exports.Admin = Admin;

const AdminSessionSchema = new Schema({
    token : {
        type : String,
        minLength : 256,
    
        required : true
    },
    userID : {
        type: Schema.Types.ObjectId,
        ref: 'Teacher' 
    },
    lastAccessedAt : {
        type : Date,
        default : new Date()
    },
    isActive : {
        type : Boolean,
        default : true
    },
    tokenCreationDetails : {
        ip : {
            type : String,
            default : ''
        },
        useragent : {
            type : String,
            default : ''
        },
        os : {
            type : String,
            default : ''
        }
    },
    sessionLogs : [
        {
            type : String
        }
    ]
}, {timestamps : true});
const AdminSessionModel = mongoose.model("admin-session", AdminSessionSchema);
exports.AdminSessionModel = AdminSessionModel;