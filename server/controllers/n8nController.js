export const getWebhook = async (req, res) => {
    try {
        const webhookData = req.body;
        
        return res.json({ success: true, message: "Webhook received successfully", data: webhookData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}