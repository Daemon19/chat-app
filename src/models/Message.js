const mongoose = require('mongoose');

const messageSchema = require('../schemas/message-schema');

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
