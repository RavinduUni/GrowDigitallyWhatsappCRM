import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const Settings = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form state
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    role: 'Workspace Administrator',
    phoneNumberId: '',
    accessToken: '',
    webhookUrl: 'https://api.crm.cloudapi.inc/v1/webhooks/whatsapp',
  });
  const [showToken, setShowToken] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    // TODO: Call API to save settings
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main className="flex-1 bg-background overflow-y-auto w-full">
      <div className="max-w-[960px] mx-auto p-lg md:p-xl w-full">
        {/* Page Header */}
        <header className="mb-xl flex items-center justify-between">
          <div>
            <h1 className="font-h1 text-h1 text-on-background">Workspace Settings</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
              Manage your WhatsApp CRM configuration and team access.
            </p>
          </div>
          {saved && (
            <div className="flex items-center gap-xs text-primary font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Saved
            </div>
          )}
        </header>

        <div className="flex flex-col gap-lg">
          {/* Section: Account Profile */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg md:p-xl shadow-sm">
            <h2 className="font-h2 text-h2 text-on-surface border-b border-surface-container-highest pb-sm mb-lg flex items-center gap-sm">
              <span className="material-symbols-outlined text-secondary">person</span>
              Account Profile
            </h2>
            <div className="flex flex-col md:flex-row gap-xl items-start">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-sm shrink-0">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-h1 text-h1 border-4 border-background shadow-sm uppercase">
                    {(user?.name || user?.email || 'A').charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-surface-container-lowest border border-outline-variant rounded-full p-1.5 shadow-sm hover:bg-surface-container transition-colors text-on-surface">
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">JPG, GIF or PNG. Max 1MB.</span>
              </div>

              {/* Form */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-md w-full">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-sm text-label-sm text-on-surface">Full Name</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className="bg-surface-container-lowest border border-outline-variant rounded-md px-md py-sm font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all w-full placeholder:text-outline"
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-sm text-label-sm text-on-surface">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    className="bg-surface-container-low border border-outline-variant rounded-md px-md py-sm font-body-md text-on-surface-variant cursor-not-allowed outline-none w-full"
                  />
                </div>
                <div className="flex flex-col gap-xs md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface">Role</label>
                  <input
                    type="text"
                    value={form.role}
                    disabled
                    className="bg-surface-container-low border border-outline-variant rounded-md px-md py-sm font-body-md text-on-surface-variant cursor-not-allowed outline-none w-full md:w-1/2"
                  />
                </div>
                <div className="md:col-span-2 mt-sm flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-on-primary font-label-sm text-label-sm px-lg py-sm rounded-full hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-xs cursor-pointer disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section: WhatsApp Cloud API Configuration */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg md:p-xl shadow-sm">
            <h2 className="font-h2 text-h2 text-on-surface border-b border-surface-container-highest pb-sm mb-lg flex items-center gap-sm">
              <span className="material-symbols-outlined text-secondary">api</span>
              WhatsApp Cloud API Configuration
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
              Connect your Meta App to enable sending and receiving messages via the WhatsApp Business Platform.
            </p>
            <div className="flex flex-col gap-md">
              {/* Phone Number ID */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-label-sm text-on-surface font-semibold">Phone Number ID</label>
                <input
                  type="text"
                  value={form.phoneNumberId}
                  onChange={(e) => handleChange('phoneNumberId', e.target.value)}
                  placeholder="e.g. 102938475610293"
                  className="bg-surface-container-lowest border border-outline-variant rounded-md px-md py-sm font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all w-full font-mono text-sm"
                />
                <span className="font-label-sm text-label-sm text-outline">
                  Found in your Meta App Dashboard &gt; WhatsApp &gt; Getting Started.
                </span>
              </div>

              {/* Access Token */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-label-sm text-on-surface font-semibold">System User Access Token</label>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={form.accessToken}
                    onChange={(e) => handleChange('accessToken', e.target.value)}
                    placeholder="EAAIuZBXZC..."
                    className="bg-surface-container-lowest border border-outline-variant rounded-md px-md py-sm font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all w-full font-mono text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken((p) => !p)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showToken ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <span className="font-label-sm text-label-sm text-error flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Needs to be a permanent token.
                </span>
              </div>

              {/* Webhook URL */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-label-sm text-on-surface font-semibold">Webhook URL</label>
                <div className="flex gap-sm">
                  <input
                    type="text"
                    value={form.webhookUrl}
                    disabled
                    className="bg-surface-container-low border border-outline-variant rounded-md px-md py-sm font-body-md text-on-surface-variant outline-none w-full font-mono text-sm cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(form.webhookUrl)}
                    className="border border-outline-variant text-on-surface font-label-sm text-label-sm px-md py-sm rounded-md hover:bg-surface-container transition-colors flex items-center gap-xs whitespace-nowrap bg-surface-container-lowest cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    Copy
                  </button>
                </div>
              </div>

              <div className="mt-md flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary text-on-primary font-label-sm text-label-sm px-lg py-sm rounded-full hover:bg-surface-tint transition-colors shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {saving ? 'Verifying...' : 'Verify & Save API Connection'}
                </button>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-xl py-lg text-center font-label-sm text-label-sm text-outline">
          © {new Date().getFullYear()} Cloud API CRM Enterprise. All systems operational.
        </footer>
      </div>
    </main>
  );
};

export default Settings;
