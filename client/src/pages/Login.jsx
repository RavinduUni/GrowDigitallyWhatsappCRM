import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      // TODO: Call POST /api/auth/login
      // const { data } = await login(email, password);
      // loginUser(data.token, data.user);

      // Placeholder — remove when API is connected
      setError('API not connected yet. Wire POST /api/auth/login here.');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-dim min-h-screen flex items-center justify-center font-body-md text-body-md text-on-surface antialiased p-md">
      {/* Login Container */}
      <main className="bg-surface border border-outline-variant rounded-xl p-xl w-full max-w-[400px] flex flex-col items-center shadow-sm">
        {/* Header */}
        <header className="mb-lg flex flex-col items-center w-full">
          <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-md shadow-sm border border-outline-variant/30">
            <span
              className="material-symbols-outlined text-on-primary-container"
              style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}
            >
              forum
            </span>
          </div>
          <h1 className="font-h1 text-h1 text-on-surface mb-xs text-center">Conversation Monitor</h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-center">Enterprise CRM Authentication</p>
        </header>

        {/* Error */}
        {error && (
          <div className="w-full mb-md px-md py-sm bg-error-container text-on-error-container rounded-lg font-body-md text-body-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-md">
          {/* Email */}
          <div className="flex flex-col space-y-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="login-email">
              Work Email
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">
                mail
              </span>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@company.com"
                required
                className="w-full pl-10 pr-3 py-2 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-xs">
            <div className="flex justify-between items-end mb-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="login-password">
                Password
              </label>
              <a className="font-label-sm text-label-sm text-primary hover:text-primary-fixed-dim transition-colors" href="#">
                Forgot Password?
              </a>
            </div>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">
                lock
              </span>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3 py-2 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-md text-body-md transition-shadow"
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-sm">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-md bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary rounded-full font-h2 text-h2 transition-colors flex justify-center items-center gap-2 cursor-pointer disabled:opacity-60"
              id="login-submit-btn"
            >
              <span>{loading ? 'Logging in…' : 'Login'}</span>
              {!loading && (
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  arrow_forward
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <footer className="mt-lg pt-md border-t border-outline-variant w-full text-center flex flex-col space-y-sm">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Need an account?{' '}
            <a className="text-primary font-bold hover:underline" href="#">
              Request Access
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Login;
