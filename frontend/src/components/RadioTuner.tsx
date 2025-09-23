import React, { useState, useRef, useEffect } from 'react';
import './RadioTuner.css';

interface RadioTunerProps {
  frequency?: number;
  onFrequencyChange?: (frequency: number) => void;
}

interface RadioStation {
  name: string;
  url: string;
  genre: string;
  country: string;
  language: string;
}

export const RadioTuner: React.FC<RadioTunerProps> = ({
  frequency = 800,
  onFrequencyChange
}) => {
  const [currentFrequency, setCurrentFrequency] = useState(frequency);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Predefined stations mapped to frequency ranges
  const stationMap = {
    550: { name: "BBC Radio 1", url: "http://stream.live.vc.bbcmedia.co.uk/bbc_radio_one", genre: "Pop", country: "UK", language: "English" },
    600: { name: "NPR News", url: "https://npr-ice.streamguys1.com/live.mp3", genre: "News", country: "USA", language: "English" },
    650: { name: "Jazz FM", url: "https://jazz-ard.ice.infomaniak.ch/jazz-ard-high.mp3", genre: "Jazz", country: "France", language: "French" },
    700: { name: "Classical WQXR", url: "https://stream.wqxr.org/wqxr", genre: "Classical", country: "USA", language: "English" },
    750: { name: "Radio France", url: "https://direct.franceinter.fr/live/franceinter-midfi.mp3", genre: "Talk", country: "France", language: "French" },
    800: { name: "Smooth Jazz", url: "https://ice5.somafm.com/groovesalad-128-mp3", genre: "Jazz", country: "USA", language: "English" },
    850: { name: "Chill Radio", url: "https://ice2.somafm.com/beatblender-128-mp3", genre: "Ambient", country: "USA", language: "English" },
    900: { name: "Rock Classic", url: "https://ice6.somafm.com/lush-128-mp3", genre: "Rock", country: "USA", language: "English" },
    950: { name: "Electronic Beats", url: "https://ice4.somafm.com/spacestation-128-mp3", genre: "Electronic", country: "USA", language: "English" },
    1000: { name: "Folk Music", url: "https://ice5.somafm.com/folkfwd-128-mp3", genre: "Folk", country: "USA", language: "English" },
    1050: { name: "Indie Radio", url: "https://ice6.somafm.com/indiepop-128-mp3", genre: "Indie", country: "USA", language: "English" },
    1100: { name: "Deep House", url: "https://ice4.somafm.com/deepspaceone-128-mp3", genre: "House", country: "USA", language: "English" },
    1150: { name: "Ambient Drone", url: "https://ice2.somafm.com/dronezone-128-mp3", genre: "Ambient", country: "USA", language: "English" },
    1200: { name: "Metal Radio", url: "https://ice6.somafm.com/metal-128-mp3", genre: "Metal", country: "USA", language: "English" },
    1250: { name: "Hip Hop", url: "https://ice4.somafm.com/hiphop-128-mp3", genre: "Hip Hop", country: "USA", language: "English" },
    1300: { name: "Country Music", url: "https://ice5.somafm.com/bagel-128-mp3", genre: "Country", country: "USA", language: "English" },
    1350: { name: "World Music", url: "https://ice2.somafm.com/secretagent-128-mp3", genre: "World", country: "Various", language: "Various" },
    1400: { name: "Reggae Vibes", url: "https://ice6.somafm.com/reggae-128-mp3", genre: "Reggae", country: "Jamaica", language: "English" },
    1450: { name: "Blues Station", url: "https://ice4.somafm.com/bootliquor-128-mp3", genre: "Blues", country: "USA", language: "English" },
    1500: { name: "Christmas FM", url: "https://ice5.somafm.com/christmas-128-mp3", genre: "Holiday", country: "USA", language: "English" },
    1550: { name: "Punk Rock", url: "https://ice2.somafm.com/suburbsofgoa-128-mp3", genre: "Punk", country: "USA", language: "English" },
    1600: { name: "Celtic Music", url: "https://ice6.somafm.com/thistle-128-mp3", genre: "Celtic", country: "Ireland", language: "English" }
  };

  // Find the nearest station for a given frequency
  const findNearestStation = (freq: number): RadioStation | null => {
    const frequencies = Object.keys(stationMap).map(Number).sort((a, b) => a - b);
    const closest = frequencies.reduce((prev, curr) =>
      Math.abs(curr - freq) < Math.abs(prev - freq) ? curr : prev
    );
    return stationMap[closest as keyof typeof stationMap] || null;
  };

  // Handle station change and audio playback
  useEffect(() => {
    const station = findNearestStation(currentFrequency);
    if (station && (!currentStation || station.name !== currentStation.name)) {
      setCurrentStation(station);
      if (isPlaying) {
        playStation(station);
      }
    }
  }, [currentFrequency, currentStation, isPlaying]);

  // Initialize station on component mount
  useEffect(() => {
    const station = findNearestStation(currentFrequency);
    if (station && !currentStation) {
      setCurrentStation(station);
    }
  }, []);

  const playStation = async (station: RadioStation) => {
    if (!audioRef.current) return;

    setIsLoading(true);

    try {
      // Stop current playback
      audioRef.current.pause();
      audioRef.current.src = station.url;

      // Load and play new stream
      await audioRef.current.load();
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing radio stream:', error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !currentStation) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      playStation(currentStation);
    }
  };

  // Convert frequency to angle (550-1600 range mapped to ~270 degrees)
  const frequencyToAngle = (freq: number) => {
    const minFreq = 550;
    const maxFreq = 1600;
    const startAngle = -135; // Start at 225 degrees (bottom left)
    const endAngle = 135;    // End at 135 degrees (bottom right)
    const range = maxFreq - minFreq;
    const angleRange = endAngle - startAngle;
    return startAngle + ((freq - minFreq) / range) * angleRange;
  };

  const handleDialClick = (event: React.MouseEvent<SVGElement>) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = event.clientX - rect.left - centerX;
    const y = event.clientY - rect.top - centerY;

    let angle = Math.atan2(y, x) * (180 / Math.PI);

    // Normalize angle to match our frequency range
    if (angle < -135) angle += 360;
    if (angle > 135 && angle < 225) {
      angle = angle < 180 ? 135 : -135;
    }

    // Convert angle back to frequency
    const minFreq = 550;
    const maxFreq = 1600;
    const startAngle = -135;
    const endAngle = 135;
    const angleRange = endAngle - startAngle;
    const normalizedAngle = angle - startAngle;
    const newFreq = minFreq + (normalizedAngle / angleRange) * (maxFreq - minFreq);

    const clampedFreq = Math.max(minFreq, Math.min(maxFreq, newFreq));
    setCurrentFrequency(clampedFreq);
    onFrequencyChange?.(clampedFreq);
  };

  // Generate frequency markings
  const generateFrequencyMarks = () => {
    const marks = [];
    const frequencies = [550, 600, 650, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600];

    for (const freq of frequencies) {
      const angle = frequencyToAngle(freq);
      const radian = (angle * Math.PI) / 180;
      const x1 = 150 + Math.cos(radian) * 130;
      const y1 = 150 + Math.sin(radian) * 130;
      const x2 = 150 + Math.cos(radian) * 120;
      const y2 = 150 + Math.sin(radian) * 120;
      const textX = 150 + Math.cos(radian) * 110;
      const textY = 150 + Math.sin(radian) * 110;

      marks.push(
        <g key={freq}>
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#d4af37"
            strokeWidth="1"
          />
          <text
            x={textX}
            y={textY}
            fill="url(#numberGradient)"
            fontSize="8"
            fontFamily="Times New Roman, serif"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="central"
            opacity="0.95"
            filter="url(#textGlow)"
          >
            {freq}
          </text>
        </g>
      );
    }
    return marks;
  };

  // Generate minor ticks
  const generateMinorTicks = () => {
    const ticks = [];
    for (let freq = 550; freq <= 1600; freq += 10) {
      if (freq % 50 !== 0) { // Skip major frequency marks
        const angle = frequencyToAngle(freq);
        const radian = (angle * Math.PI) / 180;
        const x1 = 150 + Math.cos(radian) * 130;
        const y1 = 150 + Math.sin(radian) * 130;
        const x2 = 150 + Math.cos(radian) * 125;
        const y2 = 150 + Math.sin(radian) * 125;

        ticks.push(
          <line
            key={freq}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#d4af37"
            strokeWidth="0.5"
            opacity="0.7"
          />
        );
      }
    }
    return ticks;
  };

  const tunerAngle = frequencyToAngle(currentFrequency);
  const tunerRadian = (tunerAngle * Math.PI) / 180;
  const tunerX = 150 + Math.cos(tunerRadian) * 80;
  const tunerY = 150 + Math.sin(tunerRadian) * 80;

  return (
    <div className="radio-tuner">
      <svg
        width="300"
        height="300"
        viewBox="0 0 300 300"
        onClick={handleDialClick}
        className="tuner-dial"
      >
        {/* Outer bezel with wear */}
        <circle
          cx="150"
          cy="150"
          r="145"
          fill="url(#bezelGradient)"
          stroke="url(#wornBrass)"
          strokeWidth="3"
        />

        {/* Background circle with patina */}
        <circle
          cx="150"
          cy="150"
          r="140"
          fill="url(#dialGradient)"
          stroke="url(#wornBrass)"
          strokeWidth="1.5"
        />

        {/* Aged paper texture overlay */}
        <circle
          cx="150"
          cy="150"
          r="138"
          fill="url(#paperTexture)"
          opacity="0.3"
        />

        {/* Inner frequency band circle */}
        <circle
          cx="150"
          cy="150"
          r="120"
          fill="none"
          stroke="url(#fadedBrass)"
          strokeWidth="0.8"
          opacity="0.9"
        />

        {/* Outer decorative circle with wear */}
        <circle
          cx="150"
          cy="150"
          r="135"
          fill="none"
          stroke="url(#fadedBrass)"
          strokeWidth="0.5"
          opacity="0.7"
        />

        {/* Additional concentric rings for authenticity */}
        <circle
          cx="150"
          cy="150"
          r="125"
          fill="none"
          stroke="#8b6914"
          strokeWidth="0.3"
          opacity="0.4"
        />
        <circle
          cx="150"
          cy="150"
          r="130"
          fill="none"
          stroke="#8b6914"
          strokeWidth="0.3"
          opacity="0.4"
        />

        {/* Minor ticks */}
        {generateMinorTicks()}

        {/* Major frequency markings */}
        {generateFrequencyMarks()}

        {/* Center logo area with vintage depth */}
        <circle
          cx="150"
          cy="150"
          r="52"
          fill="url(#centerBezel)"
          stroke="url(#centerRim)"
          strokeWidth="1.5"
        />
        <circle
          cx="150"
          cy="150"
          r="48"
          fill="url(#centerGradient)"
          stroke="url(#fadedBrass)"
          strokeWidth="1"
        />

        {/* Worn center texture */}
        <circle
          cx="150"
          cy="150"
          r="46"
          fill="url(#centerWear)"
          opacity="0.4"
        />

        {/* Silvertone text with vintage styling */}
        <text
          x="150"
          y="142"
          fill="url(#logoGradient)"
          fontSize="11"
          fontFamily="Times New Roman, serif"
          textAnchor="middle"
          fontWeight="bold"
          opacity="0.9"
          filter="url(#textGlow)"
        >
          Silvertone
        </text>

        {/* Small decorative line under text */}
        <line
          x1="135"
          y1="148"
          x2="165"
          y2="148"
          stroke="url(#fadedBrass)"
          strokeWidth="0.5"
          opacity="0.6"
        />

        {/* Vintage decorative stars with patina */}
        <g fill="url(#starGradient)" opacity="0.7">
          <polygon points="135,125 136.5,129 141,129 137.5,132 139,136 135,133.5 131,136 132.5,132 129,129 133.5,129" />
          <polygon points="165,125 166.5,129 171,129 167.5,132 169,136 165,133.5 161,136 162.5,132 159,129 163.5,129" />
          <polygon points="150,118 151.5,122 156,122 152.5,125 154,129 150,126.5 146,129 147.5,125 144,122 148.5,122" />
          <polygon points="127,135 128.5,139 133,139 129.5,142 131,146 127,143.5 123,146 124.5,142 121,139 125.5,139" />
          <polygon points="173,135 174.5,139 179,139 175.5,142 177,146 173,143.5 169,146 170.5,142 167,139 171.5,139" />
        </g>

        {/* Vintage band labels with enhanced styling */}
        <text
          x="150"
          y="195"
          fill="url(#bandLabelGradient)"
          fontSize="8"
          fontFamily="Arial, sans-serif"
          textAnchor="middle"
          fontWeight="bold"
          letterSpacing="2px"
          opacity="0.9"
          filter="url(#strongGlow)"
        >
          BROADCAST
        </text>

        <text
          x="150"
          y="210"
          fill="url(#bandLabelGradient)"
          fontSize="7"
          fontFamily="Arial, sans-serif"
          textAnchor="middle"
          fontWeight="bold"
          letterSpacing="2px"
          opacity="0.9"
          filter="url(#strongGlow)"
        >
          FOREIGN
        </text>

        {/* Additional authentic radio markings */}
        <text
          x="90"
          y="90"
          fill="url(#fadedBrass)"
          fontSize="5"
          fontFamily="Arial, sans-serif"
          textAnchor="middle"
          opacity="0.6"
          transform="rotate(-45 90 90)"
        >
          POLICE
        </text>

        <text
          x="210"
          y="210"
          fill="url(#fadedBrass)"
          fontSize="5"
          fontFamily="Arial, sans-serif"
          textAnchor="middle"
          opacity="0.6"
          transform="rotate(45 210 210)"
        >
          AVIATION
        </text>

        {/* Tuning indicator */}
        <line
          x1="150"
          y1="150"
          x2={tunerX}
          y2={tunerY}
          stroke="#ff6b35"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle
          cx="150"
          cy="150"
          r="3"
          fill="#d4af37"
        />

        {/* Vintage gradients and textures */}
        <defs>
          {/* Main dial background with aged patina */}
          <radialGradient id="dialGradient" cx="0.3" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="#3d2817" />
            <stop offset="30%" stopColor="#2a1810" />
            <stop offset="70%" stopColor="#1a0f08" />
            <stop offset="100%" stopColor="#0f0704" />
          </radialGradient>

          {/* Bezel with metallic wear */}
          <radialGradient id="bezelGradient" cx="0.2" cy="0.2" r="0.8">
            <stop offset="0%" stopColor="#6b5b37" />
            <stop offset="40%" stopColor="#4a3d23" />
            <stop offset="80%" stopColor="#2a1f13" />
            <stop offset="100%" stopColor="#1a1309" />
          </radialGradient>

          {/* Worn brass effects */}
          <linearGradient id="wornBrass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="30%" stopColor="#b8941f" />
            <stop offset="70%" stopColor="#8b6914" />
            <stop offset="100%" stopColor="#6b4f0a" />
          </linearGradient>

          <linearGradient id="fadedBrass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a8841a" />
            <stop offset="50%" stopColor="#8b6914" />
            <stop offset="100%" stopColor="#6b4f0a" />
          </linearGradient>

          {/* Center area gradients */}
          <radialGradient id="centerGradient" cx="0.4" cy="0.4" r="0.6">
            <stop offset="0%" stopColor="#4a2c18" />
            <stop offset="50%" stopColor="#3a1f10" />
            <stop offset="100%" stopColor="#2a1810" />
          </radialGradient>

          <radialGradient id="centerBezel" cx="0.3" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="#5a4a2a" />
            <stop offset="50%" stopColor="#3a2a1a" />
            <stop offset="100%" stopColor="#2a1a0a" />
          </radialGradient>

          <linearGradient id="centerRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b8941f" />
            <stop offset="50%" stopColor="#8b6914" />
            <stop offset="100%" stopColor="#5a420a" />
          </linearGradient>

          {/* Text gradients */}
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#b8941f" />
            <stop offset="100%" stopColor="#8b6914" />
          </linearGradient>

          <linearGradient id="numberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c4981f" />
            <stop offset="50%" stopColor="#a8841a" />
            <stop offset="100%" stopColor="#8b6914" />
          </linearGradient>

          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b8941f" />
            <stop offset="50%" stopColor="#9a7716" />
            <stop offset="100%" stopColor="#7a5a11" />
          </linearGradient>

          <linearGradient id="bandLabelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6ee881" />
            <stop offset="50%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>

          {/* Texture patterns for aged look */}
          <pattern id="paperTexture" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="#1a0f08" />
            <circle cx="3" cy="7" r="0.5" fill="#2a1810" opacity="0.3" />
            <circle cx="12" cy="3" r="0.3" fill="#0f0704" opacity="0.4" />
            <circle cx="17" cy="15" r="0.4" fill="#2a1810" opacity="0.2" />
            <circle cx="8" cy="18" r="0.2" fill="#0f0704" opacity="0.5" />
          </pattern>

          <pattern id="centerWear" patternUnits="userSpaceOnUse" width="15" height="15">
            <rect width="15" height="15" fill="#3a1f10" />
            <circle cx="5" cy="3" r="0.3" fill="#2a1810" opacity="0.4" />
            <circle cx="11" cy="9" r="0.2" fill="#1a0f08" opacity="0.6" />
            <circle cx="2" cy="12" r="0.4" fill="#2a1810" opacity="0.3" />
          </pattern>

          {/* Scratches and wear effects */}
          <filter id="roughPaper">
            <feTurbulence baseFrequency="0.04" numOctaves="5" result="noise" seed="1" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.5" />
          </filter>

          {/* Glow effects for text and elements */}
          <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="frequency-display">
        {Math.round(currentFrequency)} AM
      </div>

      {/* Station Information */}
      {currentStation && (
        <div className="station-info">
          <div className="station-name">{currentStation.name}</div>
          <div className="station-details">
            {currentStation.genre} • {currentStation.country}
          </div>
        </div>
      )}

      {/* Audio Controls */}
      <div className="audio-controls">
        <button
          className={`play-button ${isPlaying ? 'playing' : ''} ${isLoading ? 'loading' : ''}`}
          onClick={togglePlayback}
          disabled={!currentStation || isLoading}
        >
          {isLoading ? '○' : isPlaying ? '⏸' : '▶'}
        </button>
        <span className="volume-indicator">
          {isPlaying ? '♪♫♪' : isLoading ? '...' : '♪'}
        </span>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        preload="none"
        onLoadStart={() => setIsLoading(true)}
        onCanPlayThrough={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setIsPlaying(false);
        }}
      />
    </div>
  );
};