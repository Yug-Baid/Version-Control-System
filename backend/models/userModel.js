const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
    },
    repositories:[
        {
            default:[],
            type:Schema.Types.ObjectId,
            ref:'Repository',
        }
    ],
    followedUser : [
        {
             default:[],
             type:Schema.Types.ObjectId,
             ref:'User'
        }
    ],

    StarRepos:[{
        default:[],
        type:Schema.Types.ObjectId,
        ref:'Repository'
    }]
})

const User = mongoose.model('User',userSchema)
module.exports = User