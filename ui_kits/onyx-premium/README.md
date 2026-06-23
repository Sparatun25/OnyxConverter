# Onyx Premium UI Component

A premium version of the Onyx Converter interface with advanced features including account system, AI tools, and enhanced user experience.

## Features

- **Dark/Light Theme Support**: System-aware theme switching with CSS custom properties
- **Account System**: User authentication, profile management, and usage tracking
- **AI Studio**: 11 AI-powered tools running locally in the browser
- **Responsive Design**: Mobile-friendly layout with modern design principles
- **Internationalization**: Support for multiple languages (en, ru, es)
- **Premium Design**: Inspired by Apple, Linear, and Vercel aesthetics

## File Structure

```
onyx-premium/
├── index.html          # Main HTML entry point
├── app.jsx             # Main React application component
├── cats.jsx            # SVG cat mascot components
├── i18n.jsx           # Internationalization utilities
├── ui.jsx             # Reusable UI components
├── screens.jsx        # Screen components (Convert, About, etc.)
├── account.jsx        # Account management screen
├── studio.jsx         # AI Studio interface
├── growth.jsx         # Subscription/upgrade screen
└── README.md          # This documentation
```

## Implementation Notes

### Styling
- Uses CSS custom properties for theming
- Spring-based animations for smooth transitions
- High-contrast focus states and accessibility
- Custom scrollbar styling

### React Components
- Modular component architecture
- State management for user, theme, and navigation
- LocalStorage integration for persistence

### AI Tools
- 11 different AI tools with distinct features
- Pro/Free tier system
- Local processing (no server uploads)

### Security & Privacy
- All processing happens client-side
- No file uploads to servers
- LocalStorage for user data
- Theme preference persistence

## Usage

To use this component in your project:

1. Include the HTML file as a reference or starting point
2. Copy the JSX files to your React project
3. Adjust asset paths (`../assets/`) as needed
4. Configure build tools for JSX transformation

## Dependencies

- React 18.3.1
- Babel Standalone (for JSX transformation)
- IBM Plex Mono font (Google Fonts)

## Browser Support

- Modern browsers with ES6+ support
- CSS Custom Properties (for theming)
- LocalStorage API

## Future Enhancements

- Additional languages (pt, de, fr)
- Real-time conversion progress
- Advanced AI models integration
- PWA support
- WebGL acceleration for AI processing