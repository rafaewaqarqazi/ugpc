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
            title:{
                type:String,
                required: true
            },
            abstract:{
                type:String,
                required: true
            },
            scope:{
                type:String,
                required: true
            },
            majorModules:[{ type:String, required: true}],
            status:String,
            docs:[{
                type:String,
                required: true
            }],
            comments:[
                {
                    text:String,
                    createdAt: {
                        type:Date,
                        default: Date.now()
                    },
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
                type:Date,
                default: Date.now()
            },
            marks:String
        },
        external:{
            examiners:[{type:ObjectId, ref:"Users"}],
            date:{
                type:Date,
                default: Date.now()
            },
            marks:String
        },
        acceptanceLetter:{
            file:String,
            issueDate:{
                type:Date,
                default: Date.now()
            }
        },
        backlogs:[{
            title: {
                type:String,
                required:true
            },
            description:{
                type:String,
                required:true
            },
            assignee:[{
                type:ObjectId,
                ref:"Users"
            }],
            subTasks:[{
                title:{
                    type:String,
                    required:true
                },
                description: {
                    type: String,
                    required: true
                }
            }],
            priority:{
                type:String,
                required:true
            },
            createdAt:{
                type:Date,
                default:Date.now()
            },
            deadLine:{
                type:Date
            },
            attachments:[{
                data:String
            }]

        }],
        sprints:[{
            name:{
                type:String,
                required:true
            },
            startDate:{
                type:Date,
                default:Date.now()
            },
            endDate:Date,
            todos:[{}],
            inProgress:[{}],
            inReview:[{}],
            done:[{}]
        }]
    }

});


module.exports = mongoose.model('Projects',  userSchema);