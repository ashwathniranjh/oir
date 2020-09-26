const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    rollno:{
        type: String,
        required: true,
        unique: true
    },
    dept:{
        type: String,
        required: true
       
    },
    caption:{
        type: String,
    },
    password: {
        type: String,
        required: true
      }
});

module.exports = mongoose.model('User', userSchema);
