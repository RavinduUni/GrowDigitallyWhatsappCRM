import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const Settings = () => {
  const { user } = useAuth();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    role: user?.role || "admin",
  });

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const [otpForm, setOtpForm] = useState({
    email: "",
    otp: "",
  });

  const [admins, setAdmins] = useState([]);
  const [adminError, setAdminError] = useState("");
  const [adminSuccess, setAdminSuccess] = useState("");
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const isSuperAdmin = user?.role === "super_admin";

  const loadAdmins = async () => {
    if (!isSuperAdmin) return;

    try {
      setLoadingAdmins(true);
      const res = await api.get("/api/auth/members");
      setAdmins(res.data.data || []);
    } catch (err) {
      setAdminError(
        err.response?.data?.message || "Failed to load admin members."
      );
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, [isSuperAdmin]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleInviteChange = (field, value) => {
    setInviteForm((prev) => ({ ...prev, [field]: value }));
    setAdminError("");
    setAdminSuccess("");
  };

  const handleOtpChange = (field, value) => {
    setOtpForm((prev) => ({ ...prev, [field]: value }));
    setAdminError("");
    setAdminSuccess("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Optional: connect profile update API later
    await new Promise((r) => setTimeout(r, 800));

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    setAdminError("");
    setAdminSuccess("");

    if (!isSuperAdmin) {
      setAdminError("Only the Super Admin can add admins.");
      return;
    }

    if (
      !inviteForm.name.trim() ||
      !inviteForm.email.trim() ||
      !inviteForm.password.trim()
    ) {
      setAdminError("Name, email and password are required.");
      return;
    }

    try {
      setSendingInvite(true);

      await api.post("/api/auth/members/invite", inviteForm);

      setAdminSuccess("OTP sent to the admin email.");
      setOtpForm((prev) => ({
        ...prev,
        email: inviteForm.email,
      }));

      setInviteForm({
        name: "",
        email: "",
        password: "",
        role: "admin",
      });

      await loadAdmins();
    } catch (err) {
      setAdminError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to send OTP invite."
      );
    } finally {
      setSendingInvite(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setAdminError("");
    setAdminSuccess("");

    if (!isSuperAdmin) {
      setAdminError("Only the Super Admin can verify admins.");
      return;
    }

    if (!otpForm.email.trim() || !otpForm.otp.trim()) {
      setAdminError("Email and OTP are required.");
      return;
    }

    try {
      setVerifyingOtp(true);

      await api.post("/api/auth/members/verify-otp", otpForm);

      setAdminSuccess("Admin verified successfully. Login access is now active.");

      setOtpForm({
        email: "",
        otp: "",
      });

      await loadAdmins();
    } catch (err) {
      setAdminError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "OTP verification failed."
      );
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <main className="flex-1 bg-background overflow-y-auto w-full">
      <div className="max-w-[960px] mx-auto p-lg md:p-xl w-full">
        <header className="mb-xl flex items-center justify-between">
          <div>
            <h1 className="font-h1 text-h1 text-on-background">
              Workspace Settings
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
              Manage your WhatsApp CRM configuration and team access.
            </p>
          </div>

          {saved && (
            <div className="flex items-center gap-xs text-primary font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[18px]">
                check_circle
              </span>
              Saved
            </div>
          )}
        </header>

        <div className="flex flex-col gap-lg">
          {/* Account Profile */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg md:p-xl shadow-sm">
            <h2 className="font-h2 text-h2 text-on-surface border-b border-surface-container-highest pb-sm mb-lg flex items-center gap-sm">
              <span className="material-symbols-outlined text-secondary">
                person
              </span>
              Account Profile
            </h2>

            <div className="flex flex-col md:flex-row gap-xl items-start">
              <div className="flex flex-col items-center gap-sm shrink-0">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-h1 text-h1 border-4 border-background shadow-sm uppercase">
                    {(user?.name || user?.email || "A").charAt(0)}
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Logged in as {user?.role}
                </span>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-md w-full">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-sm text-label-sm text-on-surface">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="bg-surface-container-lowest border border-outline-variant rounded-md px-md py-sm font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all w-full placeholder:text-outline"
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="font-label-sm text-label-sm text-on-surface">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    className="bg-surface-container-low border border-outline-variant rounded-md px-md py-sm font-body-md text-on-surface-variant cursor-not-allowed outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-xs md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface">
                    Role
                  </label>
                  <input
                    type="text"
                    value={form.role}
                    disabled
                    className="bg-surface-container-low border border-outline-variant rounded-md px-md py-sm font-body-md text-on-surface-variant cursor-not-allowed outline-none w-full md:w-1/2 capitalize"
                  />
                </div>

                <div className="md:col-span-2 mt-sm flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-on-primary font-label-sm text-label-sm px-lg py-sm rounded-full hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-xs cursor-pointer disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Admin Access */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg md:p-xl shadow-sm">
            <h2 className="font-h2 text-h2 text-on-surface border-b border-surface-container-highest pb-sm mb-lg flex items-center gap-sm">
              <span className="material-symbols-outlined text-secondary">
                admin_panel_settings
              </span>
              Admin Access
            </h2>

            {!isSuperAdmin ? (
              <div className="bg-error-container text-on-error-container rounded-lg p-md flex items-start gap-sm">
                <span className="material-symbols-outlined">lock</span>
                <div>
                  <p className="font-body-md text-body-md font-semibold">
                    Access Restricted
                  </p>
                  <p className="font-body-md text-body-md">
                    Only the Super Admin can add admins or agents.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
                  Add admins or agents by email. The system will send an OTP to
                  confirm access before the account becomes active.
                </p>

                {adminSuccess && (
                  <div className="mb-md bg-primary-container text-on-primary-container rounded-lg p-sm flex items-center gap-sm">
                    <span className="material-symbols-outlined text-[18px]">
                      check_circle
                    </span>
                    {adminSuccess}
                  </div>
                )}

                {adminError && (
                  <div className="mb-md bg-error-container text-on-error-container rounded-lg p-sm flex items-center gap-sm">
                    <span className="material-symbols-outlined text-[18px]">
                      error
                    </span>
                    {adminError}
                  </div>
                )}

                {/* Invite Admin */}
                <form
                  onSubmit={handleSendInvite}
                  className="grid grid-cols-1 md:grid-cols-2 gap-md mb-xl"
                >
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-sm text-label-sm text-on-surface font-semibold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={inviteForm.name}
                      onChange={(e) =>
                        handleInviteChange("name", e.target.value)
                      }
                      placeholder="Admin name"
                      className="bg-surface-container-lowest border border-outline-variant rounded-md px-md py-sm font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all w-full placeholder:text-outline"
                    />
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="font-label-sm text-label-sm text-on-surface font-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) =>
                        handleInviteChange("email", e.target.value)
                      }
                      placeholder="admin@growdigitally.lk"
                      className="bg-surface-container-lowest border border-outline-variant rounded-md px-md py-sm font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all w-full placeholder:text-outline"
                    />
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="font-label-sm text-label-sm text-on-surface font-semibold">
                      Password
                    </label>
                    <input
                      type="password"
                      value={inviteForm.password}
                      onChange={(e) =>
                        handleInviteChange("password", e.target.value)
                      }
                      placeholder="Set login password"
                      className="bg-surface-container-lowest border border-outline-variant rounded-md px-md py-sm font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all w-full placeholder:text-outline"
                    />
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="font-label-sm text-label-sm text-on-surface font-semibold">
                      Role
                    </label>
                    <select
                      value={inviteForm.role}
                      onChange={(e) =>
                        handleInviteChange("role", e.target.value)
                      }
                      className="bg-surface-container-lowest border border-outline-variant rounded-md px-md py-sm font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all w-full"
                    >
                      <option value="admin">Admin</option>
                      <option value="agent">Agent</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={sendingInvite}
                      className="bg-primary text-on-primary font-label-sm text-label-sm px-lg py-sm rounded-full hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-xs cursor-pointer disabled:opacity-60"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        outgoing_mail
                      </span>
                      {sendingInvite ? "Sending OTP..." : "Send OTP Invite"}
                    </button>
                  </div>
                </form>

                {/* Verify OTP */}
                <form
                  onSubmit={handleVerifyOtp}
                  className="border border-outline-variant rounded-lg p-md mb-xl"
                >
                  <h3 className="font-h2 text-h2 text-on-surface mb-md flex items-center gap-sm">
                    <span className="material-symbols-outlined text-secondary">
                      password
                    </span>
                    Verify OTP
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="flex flex-col gap-xs">
                      <label className="font-label-sm text-label-sm text-on-surface font-semibold">
                        Admin Email
                      </label>
                      <input
                        type="email"
                        value={otpForm.email}
                        onChange={(e) =>
                          handleOtpChange("email", e.target.value)
                        }
                        placeholder="admin@growdigitally.lk"
                        className="bg-surface-container-lowest border border-outline-variant rounded-md px-md py-sm font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all w-full placeholder:text-outline"
                      />
                    </div>

                    <div className="flex flex-col gap-xs">
                      <label className="font-label-sm text-label-sm text-on-surface font-semibold">
                        OTP
                      </label>
                      <input
                        type="text"
                        value={otpForm.otp}
                        onChange={(e) =>
                          handleOtpChange("otp", e.target.value)
                        }
                        placeholder="6-digit OTP"
                        maxLength={6}
                        className="bg-surface-container-lowest border border-outline-variant rounded-md px-md py-sm font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all w-full placeholder:text-outline tracking-widest"
                      />
                    </div>
                  </div>

                  <div className="mt-md flex justify-end">
                    <button
                      type="submit"
                      disabled={verifyingOtp}
                      className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-label-sm text-label-sm px-lg py-sm rounded-full transition-colors shadow-sm flex items-center gap-xs cursor-pointer disabled:opacity-60"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        task_alt
                      </span>
                      {verifyingOtp ? "Verifying..." : "Verify & Activate"}
                    </button>
                  </div>
                </form>

                {/* Admin List */}
                <div className="flex flex-col gap-xs">
                  <div className="flex items-center justify-between mb-xs">
                    <label className="font-label-sm text-label-sm text-on-surface font-semibold">
                      Current Members ({admins.length})
                    </label>

                    <button
                      type="button"
                      onClick={loadAdmins}
                      className="text-primary hover:bg-surface-container-low px-sm py-xs rounded-full flex items-center gap-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        refresh
                      </span>
                      Refresh
                    </button>
                  </div>

                  <div className="border border-outline-variant rounded-lg overflow-hidden">
                    {loadingAdmins ? (
                      <div className="p-md text-on-surface-variant">
                        Loading admins...
                      </div>
                    ) : admins.length === 0 ? (
                      <div className="p-md text-on-surface-variant">
                        No admins found.
                      </div>
                    ) : (
                      admins.map((admin, idx) => (
                        <div
                          key={admin._id || admin.email}
                          className={`flex items-center justify-between px-md py-sm ${idx !== admins.length - 1
                              ? "border-b border-outline-variant"
                              : ""
                            } hover:bg-surface-container/40 transition-colors`}
                        >
                          <div className="flex items-center gap-sm">
                            <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm text-label-sm uppercase shrink-0">
                              {(admin.name || admin.email || "A").charAt(0)}
                            </div>

                            <div className="flex flex-col">
                              <span className="font-body-md text-body-md text-on-surface">
                                {admin.name}
                              </span>
                              <span className="font-label-sm text-label-sm text-on-surface-variant">
                                {admin.email}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-sm">
                            <span className="font-label-sm text-label-sm px-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container capitalize">
                              {admin.role}
                            </span>

                            <span
                              className={`font-label-sm text-label-sm px-sm py-0.5 rounded-full ${admin.isActive
                                  ? "bg-primary/10 text-primary"
                                  : "bg-error-container text-on-error-container"
                                }`}
                            >
                              {admin.isActive ? "Active" : "Pending OTP"}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <span className="font-label-sm text-label-sm text-outline mt-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      info
                    </span>
                    Members can login only after OTP verification.
                  </span>
                </div>
              </>
            )}
          </section>
        </div>

        <footer className="mt-xl py-lg text-center font-label-sm text-label-sm text-outline">
          © {new Date().getFullYear()} Cloud API CRM Enterprise. All systems
          operational.
        </footer>
      </div>
    </main>
  );
};

export default Settings;