const mongoose = require('mongoose');

const {Schema} = mongoose;

const Wallets = new Schema(
    {

        userID: 
        {
            type: String,
            required: true
        },
        accountHolder:
        {
            type: String,            
            default: ''
        },
        bankName:
        {
            type: String,
            default: ''
        },
        accountNumber:
        {
            type: String,
            default: ''
        },
        ifsc:
        {
            type: String,
            default: '',
            
        },
        userType:
        {
            type: String,
            default: ''
        },
        
        

    

    }
    ,{timestamps: true}
)

const Wallet = mongoose.model("Wallet", Wallets);

exports.Wallet = Wallet;