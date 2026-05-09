import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    status: {
      type: String,
      enum: ["new", "open", "hot_lead", "handoff", "follow_up", "closed"],
      default: "new",
    },
    aiEnabled: { type: Boolean, default: true },
    humanTakeover: { type: Boolean, default: false },
    lastMessage: String,
    lastMessageAt: Date,
    unreadCount: { type: Number, default: 0 },
    serviceNeeded: {
      type: String,
      enum: ["website", "seo", "social_media", "custom_app", "unknown"],
      default: "unknown",
    },
    leadScore: { type: Number, default: 0 },
    customerServiceWindowExpiresAt: Date,
  },
  { timestamps: true }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;