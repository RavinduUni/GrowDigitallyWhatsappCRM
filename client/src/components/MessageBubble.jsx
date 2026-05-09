const MessageBubble = ({ message }) => {
  const isCustomer = message.direction === 'inbound' || message.sender === 'customer';
  const isBot = message.sender === 'bot' || message.sender === 'ai';

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Customer message — left aligned, white bubble
  if (isCustomer) {
    return (
      <div className="flex justify-start">
        <div className="bg-chat-received rounded-lg rounded-tl-sm p-3 pb-2 max-w-[40%] shadow-sm">
          <p className="font-chat-text text-chat-text text-on-surface wrap-break-word whitespace-pre-wrap">
            {message.body || message.content || message.text || ''}
          </p>
          <div className="flex justify-end mt-1">
            <span className="text-[11px] text-on-surface-variant font-label-sm leading-none">
              {formatTime(message.timestamp || message.createdAt)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Bot/Admin message — right aligned, green bubble
  return (
    <div className="flex justify-end">
      <div className="bg-chat-sent rounded-lg rounded-tr-sm p-3 pb-2 max-w-[40%] shadow-sm border border-primary/10">
        {/* Sender label */}
        <div className="flex items-center mb-1 text-primary font-label-sm text-[11px]">
          <span className="material-symbols-outlined text-[14px] mr-1">
            {isBot ? 'smart_toy' : 'person'}
          </span>
          {isBot ? 'AI Assistant' : 'Admin'}
        </div>

        <p className="font-chat-text text-chat-text text-on-surface wrap-break-word whitespace-pre-wrap">
          {message.body || message.content || message.text || ''}
        </p>

        {/* Time + delivery status */}
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[11px] font-label-sm text-on-surface-variant leading-none">
            {formatTime(message.timestamp || message.createdAt)}
          </span>
          {message.status && (
            <span
              className={`material-symbols-outlined text-[14px] ${
                message.status === 'read' ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              {message.status === 'sent' ? 'done' : 'done_all'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

