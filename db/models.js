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

const chatSchema = mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    chat_id: { type: String, required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    create_time: { type: Number }
})

const ChatModel = mongoose.model('chat', chatSchema)

exports.UserModel = UserModel

exports.ChatModel = ChatModel