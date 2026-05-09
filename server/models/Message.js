import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    senderType: {
        type: String,
        enum: ["customer", "agent", "Admin"],
        required: true
    },  
    messageType: {
        type: String,
        enum: ["text", "image", "audio", "video", "document", "button", "template"],
        default: "text",
    },
    media: {
        url: String,
        mimeType: String,
        filename: String,
        caption: String,
    },
    status: {
        type: String,
        enum: ["received", "sent", "delivered", "read", "failed"],
        default: "received",
    },
    direction: {
        type: String,
        enum: ["inbound", "outbound"],
        required: true,
    },

}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;