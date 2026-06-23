import React, { useState } from 'react';
import { Card, Button } from './ui';
import { t } from './i18n';

const GrowthScreen = () => {
  const [activePlan, setActivePlan] = useState('free');

  const plans = [
    {
      id: 'free',
      name: t('free'),
      price: '$0',
      period: '/month',
      features: [
        'Up to 5 conversions per day',
        'Basic AI tools',
        '1GB file size limit',
        'Community support'
      ],
      cta: 'Current Plan',
      featured: false
    },
    {
      id: 'pro',
      name: t('pro'),
      price: '$9.99',
      period: '/month',
      features: [
        t('unlimited'),
        'All AI tools unlocked',
        'No file size limits',
        'Priority processing',
        'Advanced file formats',
        'Priority support'
      ],
      cta: 'Upgrade Now',
      featured: true
    }
  ];

  const features = [
    {
      icon: '🚀',
      title: t('unlimited'),
      description: 'Convert as many files as you want, any size'
    },
    {
      icon: '🤖',
      title: 'All AI Tools',
      description: 'Unlock premium AI features and models'
    },
    {
      icon: '⚡',
      title: 'Priority Queue',
      description: 'Jump the line for faster processing'
    },
    {
      icon: '🔒',
      title: 'Enhanced Privacy',
      description: 'Military-grade encryption for your files'
    }
  ];

  return (
    <div className="screen growth-screen">
      <div className="hero">
        <h1>Unlock Full Power</h1>
        <p>Upgrade to Pro and access unlimited conversions and all AI tools</p>

        <div className="stats">
          <div className="stat">
            <div className="stat-number">95%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat">
            <div className="stat-number">100+</div>
            <div className="stat-label">Languages</div>
          </div>
          <div className="stat">
            <div className="stat-number">0</div>
            <div className="stat-label">Data Uploads</div>
          </div>
        </div>
      </div>

      <div className="plans-section">
        <h2>Choose Your Plan</h2>
        <div className="plans-grid">
          {plans.map(plan => (
            <Card key={plan.id} className={`plan-card ${plan.featured ? 'featured' : ''}`}>
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="price">
                  <span className="amount">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
              </div>

              <ul className="features-list">
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`plan-cta ${activePlan === plan.id ? 'active' : ''}`}
                variant={plan.featured ? 'primary' : 'secondary'}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        {activePlan === 'free' && (
          <Card className="upgrade-prompt">
            <h3>Ready to go Pro?</h3>
            <p>Unlock unlimited conversions and all AI tools with a Pro subscription.</p>
            <Button onClick={() => setActivePlan('pro')}>View Pro Plans</Button>
          </Card>
        )}
      </div>

      <div className="features-section">
        <h2>Pro Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Card key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          <Card className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards, PayPal, and Apple Pay.</p>
          </Card>
          <Card className="faq-item">
            <h3>Can I cancel anytime?</h3>
            <p>Yes, you can cancel your subscription at any time with no penalties.</p>
          </Card>
          <Card className="faq-item">
            <h3>Do you offer refunds?</h3>
            <p>We offer a 30-day money-back guarantee for all new subscriptions.</p>
          </Card>
        </div>
      </div>

      <div className="cta-section">
        <Card className="cta-card">
          <h2>Start Your Free Trial</h2>
          <p>No credit card required. Cancel anytime.</p>
          <Button size="large" variant="primary">Start Free Trial</Button>
        </Card>
      </div>
    </div>
  );
};

export default GrowthScreen;