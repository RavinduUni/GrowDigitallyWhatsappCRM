import Customer from "../models/Customer.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

const findOrCreateCustomerAndConversation = async ({ waId, profileName }) => {
    let customer = await Customer.findOne({ waId });

    if (!customer) {
        customer = await Customer.create({
            phone: waId,
            waId,
            profileName: profileName || waId,
            source: "whatsapp",
            lastActivityAt: new Date(),
        });
    } else {
        customer.profileName = profileName || customer.profileName;
        customer.lastActivityAt = new Date();
        await customer.save();
    }

    let conversation = await Conversation.findOne({
        customerId: customer._id,
        status: { $ne: "closed" },
    });

    if (!conversation) {
        conversation = await Conversation.create({
            customerId: customer._id,
            status: "open",
            aiEnabled: true,
            humanTakeover: false,
            unreadCount: 0,
        });
    }

    return { customer, conversation };
};

export const saveCustomerMessage = async (req, res) => {
    try {
        const { CustomerMessage, waId, profileName, whatsappMessageId } = req.body;

        if (!waId) {
            return res.status(400).json({
                success: false,
                message: "waId is required",
            });
        }

        if (!CustomerMessage) {
            return res.status(400).json({
                success: false,
                message: "CustomerMessage is required",
            });
        }

        const { customer, conversation } =
            await findOrCreateCustomerAndConversation({
                waId,
                profileName,
            });

        const customerMsg = await Message.create({
            conversationId: conversation._id,
            customerId: customer._id,
            whatsappMessageId,
            senderType: "customer",
            messageType: "text",
            text: CustomerMessage,
            direction: "inbound",
            status: "received",
            timestamp: new Date(),
        });

        conversation.lastMessage = CustomerMessage;
        conversation.lastMessageAt = new Date();
        conversation.unreadCount = (conversation.unreadCount || 0) + 1;
        conversation.customerServiceWindowExpiresAt = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        );

        await conversation.save();

        const shouldBotReply =
            conversation.aiEnabled === true && conversation.humanTakeover !== true;

        return res.status(201).json({
            success: true,
            message: "Customer message saved successfully",
            shouldBotReply,
            aiEnabled: conversation.aiEnabled,
            humanTakeover: conversation.humanTakeover,
            conversationId: conversation._id,
            data: {
                customer,
                conversation,
                message: customerMsg,
            },
        });
    } catch (error) {
        console.error("SAVE CUSTOMER MESSAGE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save customer message",
            error: error.message,
        });
    }
};

export const saveAgentReply = async (req, res) => {
    try {
        const { AgentReply, waId } = req.body;

        if (!waId) {
            return res.status(400).json({
                success: false,
                message: "waId is required",
            });
        }

        if (!AgentReply) {
            return res.status(400).json({
                success: false,
                message: "AgentReply is required",
            });
        }

        const customer = await Customer.findOne({ waId });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        const conversation = await Conversation.findOne({
            customerId: customer._id,
            status: { $ne: "closed" },
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        // Safety check: if human takeover is on, do not save bot reply
        if (conversation.humanTakeover || !conversation.aiEnabled) {
            return res.status(200).json({
                success: true,
                skipped: true,
                message: "Bot reply skipped because human takeover is active",
                data: {
                    conversation,
                },
            });
        }

        const agentMsg = await Message.create({
            conversationId: conversation._id,
            customerId: customer._id,
            senderType: "bot",
            messageType: "text",
            text: AgentReply,
            direction: "outbound",
            status: "sent",
            timestamp: new Date(),
        });

        conversation.lastMessage = AgentReply;
        conversation.lastMessageAt = new Date();

        // Do NOT increase unread count for bot reply
        await conversation.save();

        return res.status(201).json({
            success: true,
            message: "Agent reply saved successfully",
            data: {
                conversation,
                message: agentMsg,
            },
        });
    } catch (error) {
        console.error("SAVE AGENT REPLY ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save agent reply",
            error: error.message,
        });
    }
};