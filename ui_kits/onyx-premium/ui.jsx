import React from 'react';
import Cats from './cats';

const Button = ({ children, variant = 'primary', size = 'medium', ...props }) => (
  <button
    className={`btn btn-${variant} btn-${size}`}
    {...props}
    style={{
      '--btn': 'var(--btn)',
      '--btn-hover': 'var(--btn-hover)',
      '--btn-text': 'var(--btn-text)',
      '--r': 'var(--r)',
      '--shadow': 'var(--shadow)'
    }}
  >
    {children}
  </button>
);

const ButtonIcon = ({ icon, children, ...props }) => (
  <button className="btn-icon" {...props}>
    {icon}
    <span>{children}</span>
  </button>
);

const Card = ({ children, className = '', ...props }) => (
  <div className={`card ${className}`} {...props}>
    {children}
  </div>
);

const DropZone = ({ children, isDragOver = false, ...props }) => (
  <div
    className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
    {...props}
    style={{
      '--drop-bg': isDragOver ? 'var(--drop-bg)' : 'transparent',
      '--drop-line': isDragOver ? 'var(--drop-line)' : 'var(--line)'
    }}
  >
    {children}
  </div>
);

const ToolCard = ({ icon, title, description, pro = false, ...props }) => (
  <Card className="tool-card" {...props}>
    <div className="tool-icon">{icon}</div>
    <h3>{title} {pro && <span className="badge pro">Pro</span>}</h3>
    <p>{description}</p>
  </Card>
);

const Avatar = ({ src, alt = "Avatar", size = 'medium' }) => (
  <div className={`avatar avatar-${size}`}>
    {src ? <img src={src} alt={alt} /> : <div className="avatar-placeholder">{alt[0]}</div>}
  </div>
);

const Logo = () => (
  <div className="logo">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
      <circle cx="16" cy="16" r="14"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  </div>
);

const NavItem = ({ icon, children, active = false, ...props }) => (
  <a className={`nav-item ${active ? 'active' : ''}`} {...props}>
    {icon}
    <span>{children}</span>
  </a>
);

export { Button, ButtonIcon, Card, DropZone, ToolCard, Avatar, Logo, NavItem };