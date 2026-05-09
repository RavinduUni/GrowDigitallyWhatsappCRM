export const getWebhook = async (req, res) => {
    try {
        const webhookData = req.body;
        console.log(webhookData);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}