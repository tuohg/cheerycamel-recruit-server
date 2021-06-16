const md5 = require('blueimp-md5')

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/recruit_users')

const conn = mongoose.connection

conn.on('connected', function () {
    console.log('MongoDB connects successfully!!!');
})

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true }, // user type: candidate/boss
    avatar: { type: String },
    post: { type: String },
    profile: { type: String },
    company: { type: String },
    salary: { type: String }
})

const UserModel = mongoose.model('user', userSchema)

exports.UserModel = UserModel