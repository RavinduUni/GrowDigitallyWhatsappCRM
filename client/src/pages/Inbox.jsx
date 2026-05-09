import { useState, useEffect, useCallback, useRef } from "react";
import ConversationList from "../components/ConversationList.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import CustomerPanel from "../components/CustomerPanel.jsx";
import { getSocket } from "../services/socket.js";
import api from "../services/api.js";

const Inbox = () => {
  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(true);

  const [selected, setSelected] = useState(null);
  const selectedRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const [aiEnabled, setAiEnabled] = useState(true);
  const [showPanel, setShowPanel] = useState(false);

  const togglePanel = () => setShowPanel((prev) => !prev);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  const fetchMessages = useCallback(async (conversationId, showLoading = false) => {
    if (!conversationId) return;

    try {
      if (showLoading) setLoadingMsgs(true);

      const response = await api.get(`/api/messages/${conversationId}`);
      setMessages(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      if (showLoading) setLoadingMsgs(false);
    }
  }, []);

  const selectConversation = useCallback(
    async (conv, showLoading = true) => {
      if (!conv) return;

      setSelected(conv);
      selectedRef.current = conv;
      setAiEnabled(conv.aiEnabled ?? true);
      setShowPanel(false);

      await fetchMessages(conv._id, showLoading);

      setConversations((prev) =>
        prev.map((c) => (c._id === conv._id ? { ...c, unreadCount: 0 } : c))
      );
    },
    [fetchMessages]
  );

  const fetchConversations = useCallback(
    async (showLoading = false) => {
      try {
        if (showLoading) setLoadingConvs(true);

        const response = await api.get("/api/conversations");
        const convs = response.data.data || [];

        setConversations(convs);

        if (!selectedRef.current && convs.length > 0) {
          const firstConv = convs[0];
          setSelected(firstConv);
          selectedRef.current = firstConv;
          setAiEnabled(firstConv.aiEnabled ?? true);
          await fetchMessages(firstConv._id, true);
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        if (showLoading) setLoadingConvs(false);
      }
    },
    [fetchMessages]
  );

  const handleSelect = useCallback(
    async (conv) => {
      await selectConversation(conv, true);
    },
    [selectConversation]
  );

  const handleSend = useCallback(
    async (text) => {
      if (!selected || !text?.trim()) return;

      const optimisticMsg = {
        _id: Date.now().toString(),
        text,
        senderType: "admin",
        direction: "outbound",
        timestamp: new Date().toISOString(),
        status: "sent",
      };

      setMessages((prev) => [...prev, optimisticMsg]);

      setConversations((prev) =>
        prev.map((c) =>
          c._id === selected._id
            ? {
              ...c,
              lastMessage: text,
              lastMessageTime: new Date().toISOString(),
            }
            : c
        )
      );

      try {
        // Next step: connect manual reply API.
        // await api.post("/api/messages/send", {
        //   conversationId: selected._id,
        //   text,
        // });
      } catch (error) {
        console.error("Send failed:", error);
      }
    },
    [selected]
  );

  const handleToggleAI = useCallback(async () => {
    if (!selected) return;

    try {
      const response = await api.patch(
        `/api/conversations/${selected._id}/toggle-ai`
      );

      const updated = response.data.data || {};
      const nextAiState = updated.aiEnabled ?? !aiEnabled;

      setAiEnabled(nextAiState);

      setSelected((prev) =>
        prev ? { ...prev, ...updated, aiEnabled: nextAiState } : prev
      );

      setConversations((prev) =>
        prev.map((c) =>
          c._id === selected._id
            ? { ...c, ...updated, aiEnabled: nextAiState }
            : c
        )
      );
    } catch (error) {
      console.error("Failed to toggle AI:", error);
    }
  }, [selected, aiEnabled]);

  const handleTakeover = useCallback(async () => {
    if (!selected) return;

    try {
      const takeover = !selected.humanTakeover;

      const response = await api.patch(
        `/api/conversations/${selected._id}/takeover`,
        { takeover }
      );

      const updated = response.data.data || {
        humanTakeover: takeover,
        aiEnabled: !takeover,
        status: takeover ? "handoff" : selected.status,
      };

      setAiEnabled(updated.aiEnabled ?? false);

      setSelected((prev) => (prev ? { ...prev, ...updated } : prev));

      setConversations((prev) =>
        prev.map((c) =>
          c._id === selected._id ? { ...c, ...updated } : c
        )
      );
    } catch (error) {
      console.error("Failed to takeover conversation:", error);
    }
  }, [selected]);

  const handleStatusChange = useCallback(
    async (newStatus) => {
      if (!selected) return;

      try {
        const response = await api.patch(
          `/api/conversations/${selected._id}/status`,
          { status: newStatus }
        );

        const updated = response.data.data || { status: newStatus };

        setSelected((prev) =>
          prev ? { ...prev, ...updated, status: newStatus } : prev
        );

        setConversations((prev) =>
          prev.map((c) =>
            c._id === selected._id
              ? { ...c, ...updated, status: newStatus }
              : c
          )
        );
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    },
    [selected]
  );

  useEffect(() => {
    fetchConversations(true);
  }, [fetchConversations]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations(false);

      if (selectedRef.current?._id) {
        fetchMessages(selectedRef.current._id, false);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchConversations, fetchMessages]);

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

      setConversations((prev) =>
        prev.map((c) =>
          c._id === convId
            ? {
              ...c,
              lastMessage: msg.text || msg.body || msg.content || "",
              lastMessageTime:
                msg.timestamp || msg.createdAt || new Date().toISOString(),
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
        setAiEnabled(conv.aiEnabled ?? true);
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

    socket.on("new_message", onNewMessage);
    socket.on("conversation_updated", onConversationUpdated);
    socket.on("message_sent", onMessageSent);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("conversation_updated", onConversationUpdated);
      socket.off("message_sent", onMessageSent);
    };
  }, []);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <ConversationList
        conversations={conversations}
        selectedId={selected?._id}
        onSelect={handleSelect}
        loading={loadingConvs}
      />

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

      {showPanel && selected && (
        <CustomerPanel
          conversation={selected}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default Inbox;