import { useState } from 'react';

const ReplyBox = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const msg = text.trim();
    if (!msg || sending) return;
    setSending(true);
    try {
      await onSend(msg);
      setText('');
    } catch {
      // Error handled upstream
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="bg-surface border-t border-panel-border p-3 flex items-end space-x-2 z-10 shrink-0">
      {/* Add button */}
      <button
        className="p-2 text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors rounded-full hover:bg-surface-container-low mb-1 shrink-0"
        disabled={disabled}
      >
        <span className="material-symbols-outlined">add</span>
      </button>

      {/* Attach button */}
      <button
        className="p-2 text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors rounded-full hover:bg-surface-container-low mb-1 shrink-0"
        disabled={disabled}
      >
        <span className="material-symbols-outlined">attach_file</span>
      </button>

      {/* Text input */}
      <div className="flex-1 bg-surface-container-lowest border border-panel-border rounded-xl px-4 py-2 min-h-[44px] max-h-[120px] overflow-y-auto focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all flex items-center">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Select a conversation…' : 'Type a message...'}
          disabled={disabled}
          rows={1}
          className="w-full bg-transparent border-none focus:ring-0 resize-none font-chat-text text-chat-text text-on-surface p-0 m-0 outline-none"
          style={{ minHeight: '24px' }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
          }}
          id="reply-textarea"
        />
      </div>

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!text.trim() || disabled || sending}
        className={`p-3 rounded-full shadow-md flex items-center justify-center transition-colors mb-0.5 shrink-0 cursor-pointer ${
          text.trim() && !disabled
            ? 'bg-primary hover:bg-surface-tint text-on-primary'
            : 'bg-surface-container text-on-surface-variant'
        }`}
        id="send-message-btn"
      >
        <span className="material-symbols-outlined">
          {sending ? 'hourglass_empty' : 'send'}
        </span>
      </button>
    </footer>
  );
};

export default ReplyBox;
