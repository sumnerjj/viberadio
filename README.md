# Vintage Radio Tuner

A vintage-style AM radio tuner web application with authentic static sound effects and smooth analog tuning.

## Features

- 🎵 **118 verified working radio stations** from around the world
- 📻 **Custom vintage dial interface** with authentic design
- 🔄 **Smooth analog tuning** with draggable dial
- 🎧 **Static sound effects** during channel changes and loading
- 📡 **Auto-play functionality** - stations start automatically when tuned
- 🌍 **International stations** from USA, Europe, and beyond
- 📱 **Responsive design** works on desktop and mobile

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation & Running

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd radio
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Frontend: http://localhost:3000 (or http://localhost:3001 if 3000 is busy)
   - The app will automatically open with a vintage radio interface

## How to Use

### Basic Controls
- **Click** anywhere on the dial to tune to that frequency
- **Click and drag** the dial to smoothly tune across frequencies
- **Play/Pause button** to control audio playback
- Stations automatically start playing when tuned

### Tuning Experience
- **Static sound effects** play during loading and channel changes
- **Station information** displays current station name, genre, and country
- **Frequency display** shows current AM frequency (530-1700 kHz)
- **Auto-tuning** finds the nearest station when you release the dial

## Development Commands

```bash
# Start both frontend and backend
npm run dev

# Start individual services
npm run dev:frontend  # Frontend only (port 3000)
npm run dev:backend   # Backend only (port 3001)

# Build for production
npm run build

# Run tests
npm run test

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Project Structure

```
radio/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── RadioTuner.tsx    # Main radio interface
│   │   ├── assets/
│   │   │   ├── dial.jpg          # Custom dial image
│   │   │   └── audio/
│   │   │       └── static.mp3    # Static sound effect
│   └── package.json
├── backend/            # Express backend
│   ├── src/
│   │   └── index.ts    # API server
│   └── package.json
└── package.json        # Root workspace config
```

## Technical Details

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Custom radio tuner component** with SVG needle overlay
- **HTML5 Audio API** for streaming radio stations
- **Responsive CSS** with vintage styling

### Backend
- **Express.js** API server
- **CORS enabled** for frontend communication
- **Request logging** middleware

### Audio System
- **118 verified radio stations** tested for reliability
- **Auto-play functionality** with error handling and fallback URLs
- **Static sound effects** for authentic radio experience
- **Loading states** with visual and audio feedback

## Radio Stations

The app includes 118 verified working radio stations:
- **Curated high-quality stations** (Radio Paradise, KEXP, SomaFM, etc.)
- **International variety** from Radio Browser API
- **67.8% success rate** from comprehensive testing
- **Multiple genres**: Jazz, Electronic, News, Classical, World Music
- **Global coverage**: USA, Europe, Asia, and more

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and personal use.