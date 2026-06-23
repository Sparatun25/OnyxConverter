import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { t } from './i18n';

// Import screens
import ConvertScreen from './screens';
import AiStudioScreen from './studio';
import AccountScreen from './account';
import GrowthScreen from './growth';

// Main App Component
const App = () => {
  const [currentScreen, setCurrentScreen] = useState('convert');
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');

  // Load user from localStorage or simulate login
  useEffect(() => {
    const savedUser = localStorage.getItem('onyx-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('onyx-theme', theme);
  }, [theme]);

  const handleLogin = () => {
    // Simulate login
    const mockUser = {
      id: '1',
      name: 'Demo User',
      email: 'demo@onyx.app',
      avatar: null,
      plan: 'free'
    };
    setUser(mockUser);
    localStorage.setItem('onyx-user', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('onyx-user');
  };

  const handleUpgrade = () => {
    setCurrentScreen('growth');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const screens = {
    convert: ConvertScreen,
    aiStudio: AiStudioScreen,
    account: AccountScreen,
    growth: GrowthScreen,
    about: null // Placeholder for AboutScreen
  };

  const CurrentScreen = screens[currentScreen];

  return (
    <div className="app">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-container">
          <svg className="logo" width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
            <circle cx="16" cy="16" r="14"/>
            <circle cx="16" cy="16" r="6" fill="white"/>
          </svg>
          <span>Onyx</span>
        </div>

        <nav className="main-nav">
          <button
            className={`nav-item ${currentScreen === 'convert' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('convert')}
          >
            <span className="nav-icon">📁</span>
            <span>Convert</span>
          </button>

          <button
            className={`nav-item ${currentScreen === 'aiStudio' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('aiStudio')}
          >
            <span className="nav-icon">🤖</span>
            <span>AI Studio</span>
          </button>

          <button
            className={`nav-item ${currentScreen === 'about' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('about')}
          >
            <span className="nav-icon">ℹ️</span>
            <span>About</span>
          </button>
        </nav>

        <div className="user-section">
          {user ? (
            <>
              <div className="user-info">
                <div className="user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span>{user.name[0]}</span>
                  )}
                </div>
                <div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-plan">{user.plan}</div>
                </div>
              </div>
              <button className="upgrade-trigger" onClick={handleUpgrade}>
                Upgrade
              </button>
            </>
          ) : (
            <button className="login-btn" onClick={handleLogin}>
              Sign In
            </button>
          )}
        </div>

        <div className="theme-toggle">
          <button
            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={toggleTheme}
          >
            🌙
          </button>
          <button
            className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
            onClick={toggleTheme}
          >
            ☀️
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {CurrentScreen && (
          <CurrentScreen
            user={user}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onUpgrade={handleUpgrade}
          />
        )}
      </main>
    </div>
  );
};

// Initialize the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Add some basic styles
const style = document.createElement('style');
style.textContent = `
  .app {
    display: flex;
    height: 100vh;
    font-family: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace;
  }

  .sidebar {
    width: 280px;
    background: var(--bg-2);
    border-right: 1px solid var(--line);
    display: flex;
    flex-direction: column;
    padding: 20px;
    gap: 20px;
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .main-nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: var(--r);
    text-decoration: none;
    color: var(--secondary);
    transition: all 0.2s ease;
  }

  .nav-item:hover {
    background: var(--btn-hover);
  }

  .nav-item.active {
    background: var(--blue);
    color: white;
  }

  .nav-icon {
    font-size: 20px;
    width: 24px;
  }

  .user-section {
    border-top: 1px solid var(--line);
    padding-top: 20px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--btn);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: var(--blue);
  }

  .user-name {
    font-weight: 500;
  }

  .user-plan {
    font-size: 12px;
    color: var(--muted);
  }

  .upgrade-trigger, .login-btn {
    width: 100%;
    padding: 10px 16px;
    background: var(--btn);
    border: none;
    border-radius: var(--r);
    color: var(--btn-text);
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .upgrade-trigger:hover, .login-btn:hover {
    background: var(--btn-hover);
  }

  .theme-toggle {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .theme-btn {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: var(--r);
    background: var(--btn);
    cursor: pointer;
    font-size: 20px;
    transition: all 0.2s ease;
  }

  .theme-btn:hover {
    background: var(--btn-hover);
  }

  .theme-btn.active {
    background: var(--blue);
    color: white;
  }

  .main-content {
    flex: 1;
    overflow-y: auto;
    padding: 40px;
  }

  .screen {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Additional screen-specific styles would be added here */
`;
document.head.appendChild(style);

// Export for standalone testing
export default App;