import Message from "../models/Message.js";

export const getMessagesByConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const messages = await Message.find({ conversationId })
            .sort({ timestamp: 1, createdAt: 1 });

        res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
            error: error.message,
        });
    }
};