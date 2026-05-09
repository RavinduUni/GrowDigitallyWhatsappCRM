import Conversation from "../models/Conversation.js";

const formatConversation = (conversation) => {
    const customer = conversation.customerId;

    return {
        _id: conversation._id,

        status: conversation.status,
        aiEnabled: conversation.aiEnabled,
        humanTakeover: conversation.humanTakeover,

        lastMessage: conversation.lastMessage,
        lastMessageTime: conversation.lastMessageAt,
        unreadCount: conversation.unreadCount,

        customer: customer,

        customerName: customer?.profileName || customer?.name || "Unknown",
        customerPhone: customer?.phone,
        businessName: customer?.businessName,
        website: customer?.website,
        tags: customer?.tags || [],
        notes: customer?.notes,

        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
    };
};

export const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find()
            .populate("customerId")
            .sort({ lastMessageAt: -1, updatedAt: -1 });

        res.status(200).json({
            success: true,
            data: conversations.map(formatConversation),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch conversations",
            error: error.message,
        });
    }
};