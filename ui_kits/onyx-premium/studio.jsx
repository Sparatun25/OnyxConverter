import React, { useState } from 'react';
import { Card, ToolCard } from './ui';
import { t } from './i18n';

const AiStudioScreen = () => {
  const [selectedTool, setSelectedTool] = useState(null);

  const aiTools = [
    {
      id: 'transcriber',
      title: t('aiTools.transcriber'),
      description: 'Convert audio and video to text with high accuracy',
      icon: '🎤',
      pro: false,
      formats: ['MP3', 'WAV', 'M4A', 'MP4', 'MOV']
    },
    {
      id: 'subtitles',
      title: t('aiTools.subtitles'),
      description: 'Generate subtitles automatically from audio/video',
      icon: '📝',
      pro: true,
      formats: ['MP4', 'MOV', 'MKV', 'MP3', 'WAV']
    },
    {
      id: 'summarizer',
      title: t('aiTools.summarizer'),
      description: 'Get quick summaries of long videos and documents',
      icon: '📊',
      pro: false,
      formats: ['MP4', 'MOV', 'PDF', 'DOCX', 'TXT']
    },
    {
      id: 'translator',
      title: t('aiTools.translator'),
      description: 'Translate text in 100+ languages instantly',
      icon: '🌐',
      pro: false,
      formats: ['TXT', 'DOCX', 'PDF', 'SUB']
    },
    {
      id: 'toneShift',
      title: t('aiTools.toneShift'),
      description: 'Change the tone of your writing with AI',
      icon: '🎭',
      pro: true,
      formats: ['TXT', 'DOCX', 'MD']
    },
    {
      id: 'ocr',
      title: t('aiTools.ocr'),
      description: 'Extract text from images and scanned documents',
      icon: '🔍',
      pro: false,
      formats: ['JPG', 'PNG', 'PDF', 'HEIC']
    },
    {
      id: 'vector',
      title: t('aiTools.vector'),
      description: 'Convert images to scalable vectors with AI',
      icon: '🔲',
      pro: true,
      formats: ['JPG', 'PNG', 'PNG', 'BMP']
    },
    {
      id: 'compress',
      title: t('aiTools.compress'),
      description: 'Intelligently compress images with minimal quality loss',
      icon: '🗜️',
      pro: true,
      formats: ['JPG', 'PNG', 'WEBP']
    },
    {
      id: 'background',
      title: t('aiTools.background'),
      description: 'Remove backgrounds from photos with precision',
      icon: '✂️',
      pro: true,
      formats: ['JPG', 'PNG', 'PNG', 'WEBP']
    },
    {
      id: 'code',
      title: t('aiTools.code'),
      description: 'Convert code between programming languages',
      icon: '💻',
      pro: false,
      formats: ['JS', 'PY', 'TS', 'JAVA', 'CS']
    },
    {
      id: 'data',
      title: t('aiTools.data'),
      description: 'Extract structured data from unstructured content',
      icon: '📈',
      pro: true,
      formats: ['PDF', 'DOCX', 'TXT', 'HTML']
    }
  ];

  const renderTool = (tool) => (
    <ToolCard
      key={tool.id}
      icon={<span className="tool-icon-text">{tool.icon}</span>}
      title={tool.title}
      description={tool.description}
      pro={tool.pro}
      onClick={() => setSelectedTool(tool)}
    />
  );

  return (
    <div className="screen ai-studio-screen">
      <div className="studio-header">
        <h1>AI Studio</h1>
        <p>Powered by advanced AI models running locally in your browser</p>
      </div>

      {selectedTool ? (
        <div className="tool-detail">
          <Card className="detail-card">
            <div className="detail-header">
              <span className="tool-icon-text">{selectedTool.icon}</span>
              <div>
                <h2>{selectedTool.title}</h2>
                {selectedTool.pro && <span className="badge pro">Pro Feature</span>}
              </div>
              <button
                className="close-btn"
                onClick={() => setSelectedTool(null)}
              >
                ×
              </button>
            </div>

            <p>{selectedTool.description}</p>

            <div className="supported-formats">
              <h3>Supported Formats</h3>
              <div className="formats-list">
                {selectedTool.formats.map(format => (
                  <span key={format} className="format-tag">{format}</span>
                ))}
              </div>
            </div>

            <div className="tool-actions">
              <button className="primary-btn">Use Tool</button>
              {selectedTool.pro && (
                <button className="upgrade-btn">Upgrade to Pro</button>
              )}
            </div>
          </Card>
        </div>
      ) : (
        <div className="ai-tools-grid">
          <h2>All AI Tools</h2>
          <div className="tools-grid">
            {aiTools.map(renderTool)}
          </div>

          <Card className="ai-info">
            <h3>AI processing is local</h3>
            <p>All AI models run directly in your browser. Your data never leaves your device.</p>
            <div className="ai-stats">
              <div>
                <strong>95%</strong> accuracy
              </div>
              <div>
                <strong>0</strong> data uploads
              </div>
              <div>
                <strong>Local</strong> only
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AiStudioScreen;