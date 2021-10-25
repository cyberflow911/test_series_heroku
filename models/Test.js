const mongoose = require('mongoose');

const {Schema} = mongoose;

const Tests = new Schema(
    {
        name: {
            required: true,
            type: String,
            min:3
        },
        description: {

            required: true,
            type: String,
            min:3

        },
        subCategoryID:
        {
            type: String,
            required: true
        },
        minimumMarks:
        {
            type: Number,
            default: 0
        },
        selectedDate:
        {
            type: String,
            default: ''
            
        },
        QuestionCount:
        {
            type: Number,
            default: 0
        },
        selectedTime:
        {
            type: String,
            default: ''

        },
        testType:
        {
            type: String,
            enum: ['Practice','Test'],
            default: 'Practice'
        },
        negativeMarking:
        {
            type: Number,
            default: 0
        },
        correctAnswerMarking:
        {
            type: Number,
            default: 0
        },
        totalMarks:
        {
            type: Number,
            default: 0
        },
        duration:
        {
            type: String,
            requireed: true
        },
        mainContent: 
        [
            
            { 
                type: Schema.Types.ObjectId, 
                ref: 'Question'
            }
        ],
        
        
        paidStatus: 
        {
            type: Boolean,
            default: false
        },
       
        

    },{timestamps: true}
)

const Test = mongoose.model("Test", Tests);

exports.Test = Test;


// {
            //     questionData:
                
            //     {
            //         inputType: 
            //         {
            //             type: String,
            //             default: 'Text'
            //         },
            //         question: 
            //         {
            //             type: String,
            //             default: ''
            //         }
            //     },
            //     options:
            //     {
            //         optionType: String,
            //         option1:
            //         {
            //             type: String
            //         },
            //         option2: 
            //         {
            //             type: String
            //         },
            //         option3: 
            //         {
            //             type: String
            //         },
            //         option4: 
            //         {
            //             type: String
            //         }

            //     }

            //     ,
            //     answerData:
                
            //     {
            //         inputType: 
            //         {
            //             type: String,
            //             default: 'Text'
            //         },
            //         answer: 
            //         {
            //             type: String,
            //             default: ''
            //         }
            //     }
               
            // }