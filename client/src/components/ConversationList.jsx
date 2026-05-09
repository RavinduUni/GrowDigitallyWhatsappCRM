import { useState, useMemo } from 'react';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'open', label: 'Open' },
  { key: 'hot_lead', label: 'Hot Lead' },
  { key: 'handoff', label: 'Handoff' },
  { key: 'closed', label: 'Closed' },
];

const statusBadgeStyles = {
  new: 'bg-secondary-container text-on-secondary-container',
  open: 'bg-primary-container text-on-primary-container',
  hot_lead: 'bg-tertiary-container text-on-tertiary-container',
  handoff: 'bg-tertiary-fixed text-on-tertiary-fixed',
  closed: 'bg-surface-dim text-on-surface',
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) {
    return d.toLocaleDateString([], { weekday: 'short' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const ConversationList = ({
  conversations = [],
  selectedId,
  onSelect,
  loading,
}) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = useMemo(() => {
    let list = conversations;
    if (activeFilter !== 'all') {
      list = list.filter((c) => c.status === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          (c.customerName || '').toLowerCase().includes(q) ||
          (c.customerPhone || '').toLowerCase().includes(q) ||
          (c.lastMessage || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [conversations, activeFilter, search]);

  return (
    <aside className="w-[380px] shrink-0 border-r border-panel-border bg-surface flex flex-col h-full z-10 relative overflow-hidden">
      {/* Top App Bar */}
      <div className="px-md py-sm border-b border-panel-border bg-surface sticky top-0 z-40">
        <div className="flex justify-between items-center mb-sm">
          <h1 className="font-h1 text-h1 text-primary">Grow Digitally</h1>
          <div className="flex space-x-sm">
            <button className="text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors opacity-80 active:opacity-100 p-xs">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full bg-surface-container-lowest border border-panel-border rounded-lg pl-10 pr-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            id="conversation-search-input"
          />
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto hide-scrollbar space-x-sm pb-sm">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`whitespace-nowrap font-label-sm text-label-sm border border-green-300 rounded-2xl py-1 px-3 transition-colors cursor-pointer ${activeFilter === f.key
                  ? 'text-white bg-primary border-primary'
                  : 'text-on-surface-variant hover:text-primary'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Items */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          // Skeleton loaders
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start p-sm border-b border-panel-border animate-pulse">
              <div className="w-12 h-12 rounded-full bg-surface-container-high mr-sm mt-1 flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-surface-container-high rounded w-3/4" />
                <div className="h-3 bg-surface-container-high rounded w-1/2" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-sm">
            <span className="material-symbols-outlined text-on-surface-variant text-[40px] opacity-40">
              forum
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant">No conversations found</p>
          </div>
        ) : (
          filtered.map((conv) => {
            const isActive = selectedId === conv._id;
            return (
              <div
                key={conv._id}
                onClick={() => onSelect(conv)}
                className={`flex items-start p-sm border-b border-panel-border cursor-pointer transition-colors relative ${isActive
                    ? 'bg-surface-container-high shadow-surface'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low'
                  }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                )}

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-h2 text-h2 mr-sm mt-1 flex-shrink-0 uppercase">
                  {(conv.customerName || conv.customerPhone || '?').charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-xs">
                    <h3 className="font-body-lg text-body-lg text-on-surface truncate pr-2">
                      {conv.customerName || conv.customerPhone || 'Unknown'}
                    </h3>
                    <span className="font-label-sm text-label-sm text-on-surface-variant flex-shrink-0">
                      {formatTime(conv.lastMessageTime || conv.updatedAt)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="font-body-md text-body-md text-on-surface-variant truncate pr-2">
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="bg-primary text-on-primary font-label-sm text-label-sm rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-1">
                        {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Status badge */}
                  {conv.status && conv.status !== 'all' && (
                    <div className="mt-xs">
                      <span
                        className={`inline-block font-label-sm text-label-sm px-2 py-0.5 rounded-full text-[10px] ${statusBadgeStyles[conv.status] || 'bg-surface-container text-on-surface'
                          }`}
                      >
                        {conv.status === 'hot_lead' ? 'Hot Lead' : conv.status.charAt(0).toUpperCase() + conv.status.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default ConversationList;
