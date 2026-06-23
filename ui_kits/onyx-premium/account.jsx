import React, { useState } from 'react';
import { Card, Avatar, Button } from './ui';
import { t } from './i18n';

const AccountScreen = ({ user, onLogin, onLogout, onUpgrade }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="screen account-screen">
      <div className="account-header">
        <div className="user-info">
          <Avatar src={user?.avatar} size="large" />
          <div>
            <h2>{user?.name || 'Guest User'}</h2>
            <p>{user?.email || 'Not signed in'}</p>
            {!user ? (
              <Button onClick={onLogin}>Sign In</Button>
            ) : (
              <div className="plan-info">
                <span className="badge free">{t('free')}</span>
                <Button onClick={onUpgrade} variant="primary">Upgrade to Pro</Button>
              </div>
            )}
          </div>
        </div>

        <div className="usage-stats">
          <Card className="stat-card">
            <h3>Files Converted</h3>
            <p className="stat-value">247</p>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: '60%' }}></div>
            </div>
          </Card>
          <Card className="stat-card">
            <h3>AI Tools Used</h3>
            <p className="stat-value">12</p>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: '30%' }}></div>
            </div>
          </Card>
        </div>
      </div>

      <div className="account-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="account-content">
        {activeTab === 'overview' && (
          <div className="overview">
            <h3>Quick Stats</h3>
            <div className="stats-grid">
              <Card>
                <h4>Storage Saved</h4>
                <p className="stat-value-large">2.4 GB</p>
              </Card>
              <Card>
                <h4>Conversion Speed</h4>
                <p className="stat-value-large">3x Faster</p>
              </Card>
              <Card>
                <h4>AI Accuracy</h4>
                <p className="stat-value-large">95%</p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history">
            <h3>Recent Conversions</h3>
            <div className="history-list">
              {/* History items would go here */}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings">
            <h3>Preferences</h3>
            <Card>
              <h4>Theme</h4>
              <div className="theme-toggle">
                <button className="theme-btn">Dark</button>
                <button className="theme-btn">Light</button>
              </div>
            </Card>
            <Card>
              <h4>Language</h4>
              <select className="lang-select">
                <option>English</option>
                <option>Русский</option>
                <option>Español</option>
              </select>
            </Card>
          </div>
        )}
      </div>

      {user && (
        <div className="account-footer">
          <Button onClick={onLogout} variant="secondary">Sign Out</Button>
        </div>
      )}
    </div>
  );
};

export default AccountScreen;