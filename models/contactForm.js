const mongoose = require('mongoose');

const {Schema} = mongoose;

const Contacts = new Schema(
    {
      nameCustomer:
      {
          type: String,
          required: true
      },
      emailCustomer:
      {
          type: String,
          required: true
      },
      query:
      {
          type: String,
          required: true
      },
      replyStatus:
      {
          type: Boolean,
          default: false

      },
      reply:
      {
          type: String,
          default: ''
      }


    },{timestamps: true}
)

const Contact = mongoose.model("Contact", Contacts );

exports.Contact = Contact;