const { ChatModel } = require('../db/models')
module.exports = function (server) {
    const ChatModel = require('../db/models').ChatModel

    const io = require('socket.io')(server)

    io.on('connection', function (socket) {
        console.log('client connected');

        socket.on('sendMsg', function ({ from, to, content }) {
            console.log('Server received data ', { from, to, content });

            const chat_id = [from, to].sort().join('_')
            const create_time = Date.now()
            const chatModel = new ChatModel({ chat_id, from, to, create_time, content })
            chatModel.save(function (err, chatMsg) {
                io.emit('receiveMsg', chatMsg)
                console.log('send message to all of clients connected ', chatMsg);
            })
        })
    })
}