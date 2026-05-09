import Customer from "../models/Customer.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const getWebhook = async (req, res) => {
    try {
        const { CustomerMessage, AgentReply, waId } = req.body;

        if (!waId) {
            return res.status(400).json({
                success: false,
                message: "waId is required",
            });
        }

        if (!CustomerMessage && !AgentReply) {
            return res.status(400).json({
                success: false,
                message: "CustomerMessage or AgentReply is required",
            });
        }

        // 1. Find or create customer
        let customer = await Customer.findOne({ waId });

        if (!customer) {
            customer = await Customer.create({
                phone: waId,
                waId,
                profileName: "WhatsApp User",
                source: "whatsapp",
                lastActivityAt: new Date(),
            });
        } else {
            customer.lastActivityAt = new Date();
            await customer.save();
        }

        // 2. Find or create active conversation
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

        const savedMessages = [];

        // 3. Save customer message
        if (CustomerMessage) {
            const customerMsg = await Message.create({
                conversationId: conversation._id,
                customerId: customer._id,
                senderType: "customer",
                messageType: "text",
                text: CustomerMessage,
                direction: "inbound",
                status: "received",
                timestamp: new Date(),
            });

            savedMessages.push(customerMsg);
        }

        // 4. Save AI agent reply
        if (AgentReply) {
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

            savedMessages.push(agentMsg);
        }

        // 5. Update conversation summary
        conversation.lastMessage = AgentReply || CustomerMessage;
        conversation.lastMessageAt = new Date();
        conversation.unreadCount = conversation.unreadCount + 1;
        conversation.customerServiceWindowExpiresAt = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        );

        await conversation.save();

        return res.status(201).json({
            success: true,
            message: "Chat saved successfully",
            data: {
                customer,
                conversation,
                messages: savedMessages,
            },
        });
    } catch (error) {
        console.error("N8N SAVE CHAT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save chat",
            error: error.message,
        });
    }
}