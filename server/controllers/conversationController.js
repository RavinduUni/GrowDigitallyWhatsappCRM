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

export const markConversationAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const conversation = await Conversation.findByIdAndUpdate(
            id,
            { unreadCount: 0 },
            { new: true }
        ).populate("customerId");

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        res.status(200).json({
            success: true,
            data: formatConversation(conversation),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to mark conversation as read",
            error: error.message,
        });
    }
};