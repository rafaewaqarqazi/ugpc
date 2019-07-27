const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const userSchema = new mongoose.Schema({
    title:{
      type:String,
      required:true
    },
    description:{
        type:String
    },
    students:[{type:ObjectId, ref:"Users"}],
    phase:{
        type:String,
        required: true
    },
    documentation:{
        visionDocument:{
            title:String,
            abstract:String,
            scope:String,
            majorModules:[{ type:String}],
            status:String,
            docs:[{
                type:String
            }],
            comments:[
                {
                    text:String,
                    createdAt: Date,
                    author:{type:ObjectId, ref:"Users"}
                }
            ],
            marks:String
        }
    },
    details:{
        createdAt:{
            type:Date,
            default: Date.now()
        },
        supervisor:{type:ObjectId, ref:"Users"},
        internal:{
            examiners:[{type:ObjectId, ref:"Users"}],
            date:{
                type:Date
            },
            marks:String
        },
        external:{
            examiners:[{type:ObjectId, ref:"Users"}],
            date:Date,
            marks:String
        },
        acceptanceLetter:{
            file:String,
            issueDate:Date
        },
        backlogs:[{
            title: String,
            description:String,
            assignee:[{
                type:ObjectId,
                ref:"Users"
            }],
            subTasks:[{
                title:String,
                description: String
            }],
            priority:String,
            createdAt:Date,
            deadLine: Date,
            attachments:[{
                data:String
            }]

        }],
        sprints:[{
            name:String,
            startDate:Date,
            endDate:Date,
            todos:[{}],
            inProgress:[{}],
            inReview:[{}],
            done:[{}]
        }]
    }

});


module.exports = mongoose.model('Projects',  userSchema);