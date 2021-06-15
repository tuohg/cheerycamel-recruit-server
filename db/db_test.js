const md5 = require('blueimp-md5')

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/recruit_test2')

const conn = mongoose.connection

conn.on('connected', function () {
    console.log('MongoDB connects successfully!!!');
})

//define schema
const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true }
})

//define Model
const UserModel = mongoose.model('user', userSchema)
console.log(UserModel);

function testSave() {
    const user = {
        username: 'xfzhang',
        password: md5('1234'),
        type: 'candidate'

    }
    const userModel = new UserModel(user)

    userModel.save(function (err, user) {
        console.log('save', err, user);
    })
}
// testSave()
function testFind() {
    UserModel.find(function (err, users) {
        console.log('find() ', err, users);
    })

    UserModel.findOne({ _id: '60c8ebfb798f560da54e8d5c' }, function (err, user) {
        console.log('findOne() ', err, user);
    })
}
// testFind()
function testUpdate() {
    UserModel.findByIdAndUpdate({ _id: '60c8ebfb798f560da54e8d5c' }, { username: 'yyy' }, function (err, user) {
        console.log('findByIdAndUpdate() ', err, user);
    })
}
// testUpdate()

function testDelete() {
    UserModel.remove({ _id: '60c8ebfb798f560da54e8d5c' }, function (err, result) {
        console.log('remove()', err, result)
    })
}
testDelete()