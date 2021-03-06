const mongoose = require('mongoose');

const {Schema} = mongoose;

const Checkouts = new Schema(
    {
      amount:
      {
          type: Number,
          default: 0
      },
      userID:
      {
          type: Schema.Types.ObjectId,
          ref: 'admins'

      },
      statusRequest:
      {
          type: String,
          enum: ['Pending', 'Success'],
          default: 'Pending'
      }
      
      


    },{timestamps: true}
)

const Checkout = mongoose.model("Checkout", Checkouts);

exports.Checkout = Checkout;