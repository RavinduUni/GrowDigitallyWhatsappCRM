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

        customer,

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

export const updateConversationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "new",
            "open",
            "hot_lead",
            "handoff",
            "follow_up",
            "closed",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation status",
            });
        }

        const conversation = await Conversation.findByIdAndUpdate(
            id,
            { status },
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
            message: "Conversation status updated",
            data: formatConversation(conversation),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update conversation status",
            error: error.message,
        });
    }
};

export const takeoverConversation = async (req, res) => {
    try {
        const { id } = req.params;
        const { takeover } = req.body;

        const conversation = await Conversation.findById(id).populate("customerId");

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        const isTakeover = takeover === true;

        conversation.humanTakeover = isTakeover;
        conversation.aiEnabled = !isTakeover;
        conversation.status = isTakeover ? "handoff" : "open";

        await conversation.save();

        res.status(200).json({
            success: true,
            message: isTakeover
                ? "Human takeover enabled"
                : "AI resumed successfully",
            data: formatConversation(conversation),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update takeover",
            error: error.message,
        });
    }
};

export const toggleAI = async (req, res) => {
    try {
        const { id } = req.params;

        const conversation = await Conversation.findById(id).populate("customerId");

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        conversation.aiEnabled = !conversation.aiEnabled;
        conversation.humanTakeover = !conversation.aiEnabled;
        conversation.status = conversation.aiEnabled ? "open" : "handoff";

        await conversation.save();

        res.status(200).json({
            success: true,
            message: conversation.aiEnabled
                ? "AI enabled successfully"
                : "AI disabled successfully",
            data: formatConversation(conversation),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to toggle AI",
            error: error.message,
        });
    }
};