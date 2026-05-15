import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { sendWhatsAppTextMessage } from "../services/whatsappService.js";

export const getMessagesByConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const messages = await Message.find({ conversationId }).sort({
            timestamp: 1,
            createdAt: 1,
        });

        res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages.",
            error: error.message,
        });
    }
};

export const sendManualMessage = async (req, res) => {
    try {
        const { conversationId, text } = req.body;

        if (!conversationId || !text?.trim()) {
            return res.status(400).json({
                success: false,
                message: "conversationId and text are required.",
            });
        }

        const conversation = await Conversation.findById(conversationId).populate(
            "customerId"
        );

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found.",
            });
        }

        const customer = conversation.customerId;

        if (!customer?.phone) {
            return res.status(400).json({
                success: false,
                message: "Customer phone number not found.",
            });
        }

        const whatsappResponse = await sendWhatsAppTextMessage(customer.phone, text);

        const whatsappMessageId = whatsappResponse?.messages?.[0]?.id;

        const adminMsg = await Message.create({
            conversationId: conversation._id,
            customerId: customer._id,
            whatsappMessageId,
            senderType: "admin",
            senderId: req.admin?._id,
            messageType: "text",
            text,
            direction: "outbound",
            status: "sent",
            timestamp: new Date(),
        });

        conversation.lastMessage = text;
        conversation.lastMessageAt = new Date();
        conversation.humanTakeover = true;
        conversation.aiEnabled = false;
        conversation.status = "handoff";

        await conversation.save();

        res.status(201).json({
            success: true,
            message: "Manual message sent.",
            data: {
                message: adminMsg,
                conversation,
            },
        });
    } catch (error) {
        console.error("SEND MANUAL MESSAGE ERROR:", error.response?.data || error);

        return res.status(error.response?.status || 500).json({
            success: false,
            message: "Failed to send manual message.",
            metaError: error.response?.data || null,
            error: error.response?.data?.error?.message || error.message,
        });
    }
};