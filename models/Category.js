const mongoose = require('mongoose');

const {Schema} = mongoose;

const Categories = new Schema(
    {
       nameCategory: 
       {
           type: String,
           default: ''
       },
       subCategory:       

       [
           {
               type: Schema.Types.ObjectId,
               ref: 'subCategory'
           }
       ],
       descriptionCategory:
       {
           type: String,
           default: ''

       }

    },{timestamps: true}
)

const Category = mongoose.model("Category", Categories);

exports.Category = Category;