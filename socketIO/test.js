module.exports = function (server) {
    const io = require('socket.io')(server)

    io.on('connection', function (socket) {
        console.log('soketio connected');

        socket.on('sendMsg', function (data) {
            console.log('Server received the messages from browser', data);

            io.emit('receiveMsg', data.name + '_' + data.date)
            console.log('Server sent messages to browser', data);
        })
    })
}