import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble.jsx";
import ReplyBox from "./ReplyBox.jsx";

const ChatWindow = ({
  conversation,
  messages = [],
  loading,
  onSend,
  onToggleAI,
  onTakeover,
  aiEnabled,
  showPanel,
  onTogglePanel,
  onClose,
}) => {
  const bottomRef = useRef(null);
  const prevMessageCountRef = useRef(0);

  const [toggling, setToggling] = useState(false);
  const [takingOver, setTakingOver] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const firstLoadRef = useRef(true);

  useEffect(() => {
    const currentCount = messages.length;
    const previousCount = prevMessageCountRef.current;

    // Opening/selecting a chat
    if (firstLoadRef.current) {
      bottomRef.current?.scrollIntoView({
        behavior: "instant",
        block: "end",
      });

      firstLoadRef.current = false;
    }

    // New incoming message
    else if (currentCount > previousCount) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }

    prevMessageCountRef.current = currentCount;
  }, [messages.length]);

  useEffect(() => {
    firstLoadRef.current = true;
    prevMessageCountRef.current = messages.length;
  }, [conversation?._id]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggleAI = async () => {
    if (!onToggleAI) return;

    setToggling(true);

    try {
      await onToggleAI();
    } finally {
      setToggling(false);
    }
  };

  const handleTakeover = async () => {
    if (!onTakeover) return;

    setTakingOver(true);

    try {
      await onTakeover();
    } finally {
      setTakingOver(false);
    }
  };

  if (!conversation) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center bg-[#F0F2F5] min-w-0">
        <div className="flex flex-col items-center gap-md text-center">
          <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant text-[40px]">
              forum
            </span>
          </div>

          <h2 className="font-h1 text-h1 text-on-surface">
            WhatsApp CRM Monitor
          </h2>

          <p className="font-body-md text-body-md text-on-surface-variant">
            Select a conversation from the list to start viewing messages and
            replying to customers.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col bg-[#F0F2F5] min-w-0 relative z-0">
      <header className="h-[72px] bg-surface border-b border-panel-border flex items-center justify-between px-md shrink-0 shadow-sm z-10">
        <button
          className="flex items-center gap-md cursor-pointer min-w-0 text-left"
          onClick={onTogglePanel}
          title="View customer details"
        >
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-h2 text-h2 uppercase shrink-0">
            {(conversation.customerName || conversation.customerPhone || "?").charAt(0)}
          </div>

          <div className="min-w-0">
            <h2 className="font-h2 text-h2 text-on-surface truncate">
              {conversation.customerName ||
                conversation.customerPhone ||
                "Unknown"}
            </h2>

            <p className="font-body-md text-body-md text-on-surface-variant truncate">
              {conversation.customerPhone || ""}
            </p>
          </div>
        </button>

        <div className="flex items-center space-x-sm shrink-0">
          <div className="flex items-center bg-surface-container border border-outline-variant rounded-full p-1">
            <button
              onClick={handleToggleAI}
              disabled={toggling}
              className={`rounded-full px-3 py-1 font-label-sm text-label-sm flex items-center transition-all cursor-pointer ${aiEnabled
                  ? "bg-surface text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
                }`}
              id="toggle-ai-btn"
            >
              <span className="material-symbols-outlined text-[16px] mr-1">
                smart_toy
              </span>
              {toggling ? "…" : "AI Active"}
            </button>

            <button
              onClick={handleToggleAI}
              disabled={toggling}
              className={`rounded-full px-3 py-1 font-label-sm text-label-sm flex items-center transition-all cursor-pointer ${!aiEnabled
                  ? "bg-surface text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
                }`}
            >
              <span className="material-symbols-outlined text-[16px] mr-1">
                person
              </span>
              Human
            </button>
          </div>

          <button
            onClick={handleTakeover}
            disabled={takingOver}
            className="bg-primary hover:bg-surface-tint text-on-primary px-4 py-2 rounded-full font-label-sm text-label-sm flex items-center transition-colors cursor-pointer"
            id="takeover-btn"
          >
            <span className="material-symbols-outlined text-[18px] mr-1">
              pan_tool_alt
            </span>
            {takingOver ? "Taking over…" : "Takeover"}
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
              id="more-btn"
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-surface-container-lowest border border-panel-border rounded-xl shadow-overlay z-50 py-1 overflow-hidden">
                <button
                  onClick={() => {
                    onClose?.();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left font-body-md text-body-md text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                  id="close-chat-btn"
                >
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                    close
                  </span>
                  Close chat
                </button>

                <hr className="border-panel-border mx-2" />

                <button
                  onClick={() => {
                    onTogglePanel?.();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left font-body-md text-body-md text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                    {showPanel ? "close_fullscreen" : "open_in_full"}
                  </span>
                  {showPanel ? "Close customer panel" : "Open customer panel"}
                </button>

                <hr className="border-panel-border mx-2" />

                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-left font-body-md text-body-md text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                    archive
                  </span>
                  Archive conversation
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-left font-body-md text-body-md text-error hover:bg-error-container transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">
                    delete
                  </span>
                  Delete conversation
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-md space-y-md chat-bg-pattern">
        {loading ? (
          <div className="space-y-md">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
              >
                <div
                  className="rounded-lg p-3 animate-pulse"
                  style={{
                    width: `${30 + Math.random() * 35}%`,
                    height: "52px",
                    background: i % 2 === 0 ? "#ffffff" : "#D9FDD3",
                  }}
                />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-4 py-2 rounded-lg shadow-sm">
              No messages yet. Start the conversation below.
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center my-md">
              <span className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-3 py-1 rounded-lg shadow-sm">
                Today
              </span>
            </div>

            {messages.map((msg, idx) => (
              <MessageBubble key={msg._id || idx} message={msg} />
            ))}
          </>
        )}

        <div ref={bottomRef} />
      </div>

      <ReplyBox onSend={onSend} disabled={!conversation} />
    </main>
  );
};

export default ChatWindow;