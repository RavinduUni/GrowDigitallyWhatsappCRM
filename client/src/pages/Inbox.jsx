import { useState, useEffect, useCallback, useRef } from 'react';
import ConversationList from '../components/ConversationList.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import CustomerPanel from '../components/CustomerPanel.jsx';
import { getSocket } from '../services/socket.js';
import { dummyConversations, dummyMessages } from '../dummyData.js';

const Inbox = () => {
  // Conversations
  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(true);

  // Selected conversation
  const [selected, setSelected] = useState(null);
  const selectedRef = useRef(null);

  // Messages
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  // AI state
  const [aiEnabled, setAiEnabled] = useState(true);

  // Customer panel visibility — closed by default
  const [showPanel, setShowPanel] = useState(false);
  const togglePanel = () => setShowPanel((p) => !p);

  // Keep ref in sync
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // ─── Fetch conversations ───
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // TODO: Call GET /api/conversations
        // const { data } = await getConversations();
        // setConversations(data.conversations || data || []);
        setConversations(dummyConversations);
      } catch {
        // handle error
      } finally {
        setLoadingConvs(false);
      }
    };
    fetchConversations();
  }, []);

  // ─── Fetch messages for selected conversation ───
  const fetchMessages = useCallback(async (conversationId) => {
    setLoadingMsgs(true);
    try {
      // TODO: Call GET /api/messages/:conversationId
      // const { data } = await getMessages(conversationId);
      // setMessages(data.messages || data || []);
      setMessages(dummyMessages[conversationId] || []);
    } catch {
      // handle error
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  // ─── Select conversation ───
  const handleSelect = useCallback(
    (conv) => {
      setSelected(conv);
      setAiEnabled(conv.aiEnabled ?? true);
      fetchMessages(conv._id);
      setShowPanel(false); // reset panel on new conversation

      // Mark as read locally
      setConversations((prev) =>
        prev.map((c) => (c._id === conv._id ? { ...c, unreadCount: 0 } : c))
      );
    },
    [fetchMessages]
  );

  // ─── Send message ───
  const handleSend = useCallback(
    async (text) => {
      if (!selected) return;
      try {
        // TODO: Call POST /api/messages/send
        // const { data } = await sendMessage(selected._id, text);
        // const newMsg = data.message || data;
        const newMsg = {
          _id: Date.now().toString(),
          body: text,
          sender: 'admin',
          direction: 'outbound',
          timestamp: new Date().toISOString(),
          status: 'sent',
        };
        setMessages((prev) => [...prev, newMsg]);

        // Update conversation list
        setConversations((prev) =>
          prev.map((c) =>
            c._id === selected._id
              ? { ...c, lastMessage: text, lastMessageTime: new Date().toISOString() }
              : c
          )
        );
      } catch {
        throw new Error('Send failed');
      }
    },
    [selected]
  );

  // ─── Toggle AI ───
  const handleToggleAI = useCallback(async () => {
    if (!selected) return;
    try {
      // TODO: Call PATCH /api/conversations/:id/toggle-ai
      // const { data } = await toggleAI(selected._id);
      setAiEnabled((prev) => !prev);
    } catch {
      // handle error
    }
  }, [selected]);

  // ─── Takeover ───
  const handleTakeover = useCallback(async () => {
    if (!selected) return;
    try {
      // TODO: Call PATCH /api/conversations/:id/takeover
      // await takeoverConversation(selected._id);
      setAiEnabled(false);
      setSelected((prev) => (prev ? { ...prev, aiEnabled: false, status: 'handoff' } : prev));
      setConversations((prev) =>
        prev.map((c) =>
          c._id === selected._id ? { ...c, status: 'handoff', aiEnabled: false } : c
        )
      );
    } catch {
      // handle error
    }
  }, [selected]);

  // ─── Status change ───
  const handleStatusChange = useCallback(async (newStatus) => {
    if (!selected) return;
    try {
      // TODO: Call PATCH /api/conversations/:id/status
      // await updateConversationStatus(selected._id, newStatus);
      setSelected((prev) => (prev ? { ...prev, status: newStatus } : prev));
      setConversations((prev) =>
        prev.map((c) =>
          c._id === selected._id ? { ...c, status: newStatus } : c
        )
      );
    } catch {
      // handle error
    }
  }, [selected]);

  // ─── Socket listeners ───
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onNewMessage = (data) => {
      const msg = data.message || data;
      const convId = msg.conversationId || data.conversationId;

      if (selectedRef.current?._id === convId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      } else {
        setConversations((prev) =>
          prev.map((c) =>
            c._id === convId
              ? { ...c, unreadCount: (c.unreadCount || 0) + 1 }
              : c
          )
        );
      }

      // Update last message
      setConversations((prev) =>
        prev.map((c) =>
          c._id === convId
            ? {
                ...c,
                lastMessage: msg.body || msg.content || msg.text || '',
                lastMessageTime: msg.timestamp || msg.createdAt || new Date().toISOString(),
              }
            : c
        )
      );
    };

    const onConversationUpdated = (data) => {
      const conv = data.conversation || data;
      setConversations((prev) =>
        prev.map((c) => (c._id === conv._id ? { ...c, ...conv } : c))
      );
      if (selectedRef.current?._id === conv._id) {
        setSelected((prev) => (prev ? { ...prev, ...conv } : prev));
      }
    };

    const onMessageSent = (data) => {
      const msg = data.message || data;
      const convId = msg.conversationId || data.conversationId;
      if (selectedRef.current?._id === convId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on('new_message', onNewMessage);
    socket.on('conversation_updated', onConversationUpdated);
    socket.on('message_sent', onMessageSent);

    return () => {
      socket.off('new_message', onNewMessage);
      socket.off('conversation_updated', onConversationUpdated);
      socket.off('message_sent', onMessageSent);
    };
  }, []);

  return (
    <>
      {/* Conversation List */}
      <ConversationList
        conversations={conversations}
        selectedId={selected?._id}
        onSelect={handleSelect}
        loading={loadingConvs}
      />

      {/* Chat Window */}
      <ChatWindow
        conversation={selected}
        messages={messages}
        loading={loadingMsgs}
        onSend={handleSend}
        onToggleAI={handleToggleAI}
        onTakeover={handleTakeover}
        aiEnabled={aiEnabled}
        showPanel={showPanel}
        onTogglePanel={togglePanel}
      />

      {/* Customer Panel — only visible when showPanel is true */}
      {showPanel && selected && (
        <CustomerPanel
          conversation={selected}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
};

export default Inbox;
