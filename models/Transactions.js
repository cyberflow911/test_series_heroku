const mongoose = require('mongoose');

const {Schema} = mongoose;

const Transactions = new Schema(
    {
       wallet: 
       {
           type: Number,
           default: 0
       },
       transactionType: 
       {
           type: String,
           enum: ['Referral', 'Normal', 'Redeem', 'Debit'],
           default: 'Referral',
           required: true


       },
       userID: 
       {
           type: String,
           default: ''
       },
       email: 
       {
           type: String,
           default: ''
       },
       userType: 
       {
           type: Number,
           default: 2
       },
       previousWallet:
       {
           type: Number,
           default: 0
       }
       ,
       now:
       {
           type: Number,
           default: 0
       },
       studentID:
       {
           type: String,
           default: ''
       },
       log:
       {
           type: String,
           default: ''
       },
       studentName:
       {
           type: String,
           default: ''
       },
       description:
       {
           type: String,
           default: ''
       },
       

    //    creditLog:
    //    [
    //        {
    //            previous:
    //            {
    //                type: Number,
    //                default: ''
    //            },
    //            now:
    //            {
    //                type: Number,
    //                default: ''
    //            },
               
    //            studentID:
    //            {
    //                type: String,
    //                default: ''
    //            },
    //            log:
    //            {
    //                type: String,
    //                default: 'Debit'
    //            },
    //            studentName:
    //            {
    //                type: String,
    //                default: ''
    //            },
    //            description:
    //            {
    //                type: String,
    //                default: ''
    //            },
    //            createdAt:
    //            {
    //                type: Date,

    //            }

    //        }
    //    ]
       
       

    },{timestamps: true}
)

const Transaction = mongoose.model("Transaction", Transactions);

exports.Transaction = Transaction;