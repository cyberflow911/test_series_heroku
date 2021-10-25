const mongoose = require('mongoose');

const {Schema} = mongoose;

const Questions = new Schema(
    {
        testID:
        {
            type: String,
            default: ''

        },
        question:
        {
            type: String,
            default: ''
        }
        // questionData:
        
        // {
        //     inputType: 
        //     {
        //         type: String,
        //         default: 'Text'
        //     },
        //     question: 
        //     {
        //         type: String,
        //         default: ''
        //     }
            
        // },
        ,
        optionFormat: 
        {
            type: String,
            enum: ['Text', 'File'],
            default: 'Text'

        },
        options:
        [
            {
                optionType: 
                {
                    type: String
                },
                option:
                {
                    type: String
                }
                
            }
            

        ]

        ,
       answer:
       {
           type: String,
           default: ''
       },
       answerExplanation: 
       {
           type: String,
           default: ''
       }
       
    },{timestamps: true}
)

const Question = mongoose.model("Question", Questions );

exports.Question = Question;