import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { BRAND } from '../data/constants';

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@zenved.com', password: 'admin', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { label: 'Instructor', email: 'instructor@zenved.com', password: 'instructor', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { label: 'Student', email: 'student@zenved.com', password: 'student', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { demoLogin, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const doLogin = async (loginEmail, loginPassword) => {
    try {
      setDemoLoading(true);
      await demoLogin(loginEmail, loginPassword);
      success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      error(err?.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleDemoLogin = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      error('Please enter email and password');
      return;
    }
    await doLogin(email, password);
  };

  const selectDemoAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    doLogin(account.email, account.password);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-brand-surface border border-white/[0.08] rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-danger rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">🎓</span>
            </div>
            <h1 className="font-syne font-extrabold text-2xl text-white mb-1">
              {BRAND.shortName}<span className="text-accent">{BRAND.highlight}</span>
            </h1>
            <p className="text-text-muted text-sm">{BRAND.tagline}</p>
          </div>

          <div className="text-center mb-8">
            <p className="text-text-primary font-medium mb-1 text-sm">
              One-click demo access
            </p>
            <p className="text-xs text-text-muted">
              Pick a role below to enter the dashboard
            </p>
          </div>

          {/* Quick Demo Accounts — one-click login */}
          <div className="mb-6">
            <div className="flex gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.label}
                  onClick={() => selectDemoAccount(account)}
                  disabled={demoLoading}
                  className={`flex-1 py-3 px-3 rounded-xl border text-sm font-semibold transition-colors hover:opacity-80 disabled:opacity-50 ${account.color}`}
                >
                  {demoLoading ? '...' : `Enter as ${account.label}`}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mb-6">
            <div className="border-t border-white/[0.07]"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-brand-surface px-3 text-text-muted text-xs">or sign in manually</span>
            </div>
          </div>

          <form onSubmit={handleDemoLogin} className="space-y-4 mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-brand-bg border border-white/[0.1] rounded-xl text-white placeholder-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-brand-bg border border-white/[0.1] rounded-xl text-white placeholder-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              disabled={demoLoading}
              className="w-full py-3 bg-accent hover:bg-accent/90 text-brand-bg font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm"
            >
              {demoLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="space-y-3 pt-6 border-t border-white/[0.07]">
            <h3 className="font-semibold text-accent text-sm mb-3">Why join {BRAND.name}?</h3>
            <div className="space-y-2">
              {[
                'Learn from industry experts',
                'Earn recognized certificates',
                'Learn at your own pace',
                'Lifetime access to courses',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-text-secondary">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-accent font-syne">10K+</p>
            <p className="text-xs text-text-muted">Students</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-accent font-syne">500+</p>
            <p className="text-xs text-text-muted">Courses</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-accent font-syne">4.8/5</p>
            <p className="text-xs text-text-muted">Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
