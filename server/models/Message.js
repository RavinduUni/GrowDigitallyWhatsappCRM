import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        senderType: {
            type: String,
            enum: ["customer", "admin", "bot", "system"],
            required: true,
        },
        messageType: {
            type: String,
            enum: ["text", "image", "audio", "video", "document", "button", "template"],
            default: "text",
        },
        text: String,
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
        timestamp: Date,
    },
    { timestamps: true }
);


const Message = mongoose.model('Message', messageSchema);

export default Message;