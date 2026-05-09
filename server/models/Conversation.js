const conversationSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    status: {
        type: String,
        enum: ["new", "open", "hot_lead", "handoff", "follow_up", "closed"],
        default: "new",
    },
    aiEnabled: { type: Boolean, default: true },
    humanTakeover: { type: Boolean, default: false },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ],
    serviceNeeded: {
        type: String,
        enum: ["website", "seo", "social_media", "custom_app", "unknown"],
        default: "unknown",
    },

}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;