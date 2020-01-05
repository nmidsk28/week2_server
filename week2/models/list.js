const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name : String,
    phone : String,
    photo : Number,
    id : Number
})

const userSchema = new Schema({
    content_id : Number,
    username : String,
    // username : {type : String, unique : true},
    password : String,
    contacts : [contactSchema],
    // gallery : [{
    //     photo : Number, //점 경로
    //     path : String //device에 저장된 사진 url경로
    // }],
    paths : [{
        path : String
    }],
    points : [{
        x : Number,
        y : Number,
        check : Boolean,
        color : Number
    }],
    score : Number,
    isOn : Boolean,
    problem : String

})

var User = mongoose.model('user', userSchema);

module.exports = User;