const statusOptions = [
  { value: 'new', label: 'New Lead' },
  { value: 'open', label: 'Open' },
  { value: 'hot_lead', label: 'Hot Lead' },
  { value: 'handoff', label: 'Handoff' },
  { value: 'closed', label: 'Closed' },
];

const CustomerPanel = ({ conversation, onClose, onStatusChange }) => {
  if (!conversation) return null;

  const customer = conversation.customer || conversation;

  return (
    <aside className="w-1/4 shrink-0 bg-surface border-l border-panel-border h-full overflow-y-auto z-10 shadow-[-4px_0_15px_rgba(0,0,0,0.03)]">
      {/* Header — Profile */}
      <div className="p-lg border-b border-panel-border text-center flex flex-col items-center bg-linear-to-b from-surface-bright to-surface">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-h1 text-h1 mb-md shadow-md border-2 border-surface uppercase">
          {(customer.customerName || customer.name || customer.customerPhone || '?').charAt(0)}
        </div>
        <h2 className="font-h1 text-h1 text-on-surface mb-xs">
          {customer.customerName || customer.name || 'Unknown'}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant flex items-center justify-center">
          {customer.businessName && (
            <>
              <span className="material-symbols-outlined text-[16px] mr-1">business</span>
              {customer.businessName}
            </>
          )}
        </p>
      </div>

      <div className="p-md space-y-xl">
        {/* Status & Assignee */}
        <div className="space-y-md">
          {/* Conversation Status */}
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider">
              Conversation Status
            </label>
            <div className="relative">
              <select
                value={conversation.status || 'open'}
                onChange={(e) => onStatusChange?.(e.target.value)}
                className="w-full bg-surface-container-lowest border border-panel-border rounded-lg pl-3 pr-10 py-2 font-body-md text-body-md text-on-surface appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant material-symbols-outlined text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Assigned Admin */}
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider">
              Assigned Admin
            </label>
            <div className="flex items-center p-2 border border-panel-border rounded-lg bg-surface-container-lowest cursor-pointer hover:border-primary transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm mr-2 uppercase">
                {(conversation.assignedAdmin?.name || conversation.assignedAdmin || 'U').charAt(0)}
              </div>
              <span className="font-body-md text-body-md text-on-surface flex-1">
                {conversation.assignedAdmin?.name || conversation.assignedAdmin || 'Unassigned'}
              </span>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">arrow_drop_down</span>
            </div>
          </div>
        </div>

        <hr className="border-panel-border" />

        {/* Contact Info */}
        <div>
          <h3 className="font-h2 text-h2 text-on-surface mb-md">Contact Info</h3>
          <div className="grid grid-cols-1 gap-2">
            {/* Phone */}
            <div className="bg-surface-container-lowest border border-panel-border p-3 rounded-lg flex items-center">
              <span className="material-symbols-outlined text-on-surface-variant mr-3">phone_iphone</span>
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">WhatsApp / Mobile</p>
                <p className="font-body-md text-body-md text-on-surface">
                  {customer.customerPhone || customer.phone || 'N/A'}
                </p>
              </div>
            </div>

            {/* Email */}
            {customer.email && (
              <div className="bg-surface-container-lowest border border-panel-border p-3 rounded-lg flex items-center">
                <span className="material-symbols-outlined text-on-surface-variant mr-3">email</span>
                <div className="truncate">
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Email</p>
                  <p className="font-body-md text-body-md text-on-surface truncate">{customer.email}</p>
                </div>
              </div>
            )}

            {/* Website */}
            {customer.website && (
              <div className="bg-surface-container-lowest border border-panel-border p-3 rounded-lg flex items-center">
                <span className="material-symbols-outlined text-on-surface-variant mr-3">language</span>
                <div className="truncate">
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Website</p>
                  <a
                    className="font-body-md text-body-md text-primary hover:underline truncate block"
                    href={customer.website.startsWith('http') ? customer.website : `https://${customer.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {customer.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {customer.tags && customer.tags.length > 0 && (
          <div>
            <h3 className="font-h2 text-h2 text-on-surface mb-md">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {customer.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm px-3 py-1 rounded-full flex items-center shadow-sm"
                >
                  {tag}
                  <button className="ml-1 hover:text-on-tertiary">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              ))}
              <span className="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-3 py-1 rounded-full flex items-center shadow-sm border border-outline-variant cursor-pointer hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-[16px] mr-1">add</span>
                Add Tag
              </span>
            </div>
          </div>
        )}

        {/* Notes */}
        {customer.notes && (
          <div>
            <h3 className="font-h2 text-h2 text-on-surface mb-md">Notes</h3>
            <div className="bg-surface-container-lowest border border-panel-border p-3 rounded-lg shadow-sm">
              <p className="font-body-md text-body-md text-on-surface italic">
                "{customer.notes}"
              </p>
            </div>
          </div>
        )}

        {/* Add Internal Note button */}
        <button className="w-full bg-surface-container-low text-primary border border-primary/20 hover:bg-surface-container transition-colors py-2 rounded-lg font-label-sm text-label-sm flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px] mr-2">edit_note</span>
          Add Internal Note
        </button>
      </div>
    </aside>
  );
};

export default CustomerPanel;
