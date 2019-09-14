const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const projectsSchema = new mongoose.Schema({
    groupName:{
      type:String,
      required:true
    },
    students:[{type:ObjectId, ref:"Users"}],
    phase:{
        type:String,
        required: true
    },
    department:String,
    documentation:{
        visionDocument:[
            {
            title:String,
            abstract:String,
            scope:String,
            majorModules:[],
            status:String,
            documents:[],
            comments:[
                {
                    text:String,
                    createdAt: Date,
                    author:{type:ObjectId, ref:"Users"}
                }
            ],
            uploadedAt:Date,
            updatedAt:Date,
            meetingDate:Date
        }]
    },
    details:{
        marks:{
          visionDocument: String,
          internal: String,
          external: String
        },
        createdAt:{
            type:Date,
            default: Date.now()
        },
        supervisor:{type:ObjectId, ref:"Users"},
        internal:{
            examiners:[{type:ObjectId, ref:"Users"}],
            date:Date,
        },
        external:{
            examiners:[{type:ObjectId, ref:"Users"}],
            date:Date,
        },
        acceptanceLetter:{
            name:String,
            issueDate:Date
        },
        estimatedDeadline:Date,
        backlog:[{
            title: String,
            description:String,
            assignee:[{
                type:ObjectId,
                ref:"Users"
            }],
            subTasks:[{
                title:String,
                description: String,
                status:String
            }],
            priority:String,
            createdAt:Date,
            createdBy:{
                type:ObjectId,
                ref:"Users"
            },
            storyPoints: String,
            attachments:[{}]

        }],
        sprint:{
            name:String,
            startDate:Date,
            endDate:Date,
            todos:[{}],
            inProgress:[{}],
            inReview:[{}],
            done:[{}]
        }
    }

});


module.exports = mongoose.model('Projects',  projectsSchema);