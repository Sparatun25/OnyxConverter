import React from 'react';
import { Card, DropZone } from './ui';
import Cats from './cats';

const ConvertScreen = ({ files, onDrop, onBrowse }) => (
  <div className="screen convert-screen">
    <div className="hero">
      <div className="hero-content">
        <h1>Convert anything, instantly</h1>
        <p>Photos, documents, audio, video, archives — all in your browser</p>
        <DropZone onDrop={onDrop} onBrowse={onBrowse}>
          <div className="drop-content">
            <Cats.CatLoading />
            <h2>Drag & drop your files here</h2>
            <p>or <button onClick={onBrowse}>browse</button> your device</p>
          </div>
        </DropZone>
      </div>
      <div className="hero-mascot">
        <Cats.CatMascot />
      </div>
    </div>

    <div className="features">
      <h2>Why choose Onyx?</h2>
      <div className="features-grid">
        <Card>
          <h3>Privacy first</h3>
          <p>Nothing ever leaves your browser</p>
        </Card>
        <Card>
          <h3>No file size limits</h3>
          <p>Convert anything, as big as you want</p>
        </Card>
        <Card>
          <h3>11 AI tools</h3>
          <p>Transcription, translation, OCR & more</p>
        </Card>
      </div>
    </div>
  </div>
);

const AiStudioScreen = () => (
  <div className="screen ai-studio-screen">
    <h1>AI Studio</h1>
    <p>Powered by cutting-edge AI models, running locally in your browser</p>

    <div className="ai-tools-grid">
      <ToolCard
        icon={<Cats.CatWaiting />}
        title="Smart Transcriber"
        description="Convert audio to text with 95% accuracy"
        pro={false}
      />
      <ToolCard
        icon={<Cats.CatWaiting />}
        title="Background Removal"
        description="Remove backgrounds with AI precision"
        pro={true}
      />
      <ToolCard
        icon={<Cats.CatWaiting />}
        title="Smart Translator"
        description="Translate text in 100+ languages"
        pro={false}
      />
      <ToolCard
        icon={<Cats.CatWaiting />}
        title="AI OCR"
        description="Extract text from images and PDFs"
        pro={false}
      />
    </div>
  </div>
);

const AboutScreen = () => (
  <div className="screen about-screen">
    <h1>About Onyx</h1>
    <div className="about-content">
      <div className="about-mission">
        <h2>Our mission</h2>
        <p>To make file processing fast, private, and accessible to everyone.</p>
      </div>

      <div className="about-features">
        <h2>Features</h2>
        <ul>
          <li>Zero file uploads — everything runs locally</li>
          <li>Support for 50+ file formats</li>
          <li>11 AI-powered tools</li>
          <li>Dark & light themes</li>
          <li>No ads, no tracking</li>
        </ul>
      </div>

      <div className="about-team">
        <h2>Made with ❤️</h2>
        <p>Onyx is crafted with love for the open-source community.</p>
      </div>
    </div>
  </div>
);

export { ConvertScreen, AiStudioScreen, AboutScreen };