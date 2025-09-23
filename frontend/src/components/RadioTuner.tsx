import React, { useState, useRef, useEffect } from 'react';
import './RadioTuner.css';

interface RadioTunerProps {
  frequency?: number;
  onFrequencyChange?: (frequency: number) => void;
}

interface RadioStation {
  name: string;
  url: string;
  fallbackUrl?: string;
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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Predefined stations mapped to frequency ranges
  // Using VERIFIED WORKING streams from our comprehensive testing (23 confirmed working stations)
  const stationMap = {
    550: {
      name: "Radio Paradise Main",
      url: "https://stream.radioparadise.com/mp3-128",
      fallbackUrl: "https://stream.radioparadise.com/aac-128",
      genre: "Eclectic",
      country: "USA",
      language: "English"
    },
    580: {
      name: "Radio Paradise Mellow",
      url: "https://stream.radioparadise.com/mellow-128",
      fallbackUrl: "https://stream.radioparadise.com/mellow-aac",
      genre: "Mellow",
      country: "USA",
      language: "English"
    },
    610: {
      name: "Radio Paradise Rock",
      url: "https://stream.radioparadise.com/rock-128",
      fallbackUrl: "https://stream.radioparadise.com/rock-aac",
      genre: "Rock",
      country: "USA",
      language: "English"
    },
    640: {
      name: "Radio Paradise World",
      url: "https://stream.radioparadise.com/world-128",
      fallbackUrl: "https://stream.radioparadise.com/world-aac",
      genre: "World",
      country: "USA",
      language: "English"
    },
    670: {
      name: "WFMU Freeform",
      url: "https://stream0.wfmu.org/freeform-128k",
      fallbackUrl: "https://stream2.wfmu.org/freeform-128k",
      genre: "Freeform",
      country: "USA",
      language: "English"
    },
    700: {
      name: "WXPN",
      url: "https://wxpnhi.xpn.org/xpnhi",
      genre: "Adult Alternative",
      country: "USA",
      language: "English"
    },
    730: {
      name: "KEXP",
      url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3",
      genre: "Alternative",
      country: "USA",
      language: "English"
    },
    760: {
      name: "WNYC",
      url: "https://fm939.wnyc.org/wnycfm",
      genre: "Public Radio",
      country: "USA",
      language: "English"
    },
    790: {
      name: "Radio Swiss Jazz",
      url: "https://stream.srg-ssr.ch/m/rsj/mp3_128",
      genre: "Jazz",
      country: "Switzerland",
      language: "Multi"
    },
    820: {
      name: "WQXR Classical",
      url: "https://stream.wqxr.org/wqxr",
      genre: "Classical",
      country: "USA",
      language: "English"
    },
    850: {
      name: "Radio Swiss Classical",
      url: "https://stream.srg-ssr.ch/m/rsc_de/mp3_128",
      genre: "Classical",
      country: "Switzerland",
      language: "Multi"
    },
    880: {
      name: "NTS Radio 1",
      url: "https://stream-relay-geo.ntslive.net/stream",
      genre: "Electronic",
      country: "UK",
      language: "English"
    },
    910: {
      name: "NTS Radio 2",
      url: "https://stream-relay-geo.ntslive.net/stream2",
      genre: "Electronic",
      country: "UK",
      language: "English"
    },
    940: {
      name: "Radio FG",
      url: "https://radiofg.impek.com/fg",
      genre: "Electronic",
      country: "France",
      language: "French"
    },
    970: {
      name: "FluxFM",
      url: "https://streams.fluxfm.de/Flux/mp3-320/streams.fluxfm.de/",
      genre: "Electronic",
      country: "Germany",
      language: "German"
    },
    1000: {
      name: "Ibiza Global Radio",
      url: "https://server9.emitironline.com:18292/stream",
      genre: "Electronic",
      country: "Spain",
      language: "Spanish"
    },
    1030: {
      name: "Planet Rock",
      url: "https://stream-mz.planetradio.co.uk/planetrock.mp3",
      genre: "Rock",
      country: "UK",
      language: "English"
    },
    1060: {
      name: "Radio Caroline",
      url: "https://sc6.radiocaroline.net:8040/stream",
      genre: "Rock",
      country: "UK",
      language: "English"
    },
    1090: {
      name: "FIP France",
      url: "https://direct.fipradio.fr/live/fip-midfi.mp3",
      genre: "Eclectic",
      country: "France",
      language: "French"
    },
    1120: {
      name: "BBC Radio 6 Music",
      url: "https://stream.live.vc.bbcmedia.co.uk/bbc_6music",
      genre: "Alternative",
      country: "UK",
      language: "English"
    },
    1150: {
      name: "Radio France Inter",
      url: "https://direct.franceinter.fr/live/franceinter-midfi.mp3",
      genre: "Talk",
      country: "France",
      language: "French"
    },
    1180: {
      name: "The Current",
      url: "https://current.stream.publicradio.org/kcmp.mp3",
      genre: "Alternative",
      country: "USA",
      language: "English"
    },
    1210: {
      name: "KCSN",
      url: "https://kcsn.streamguys1.com/kcsn_mp3_hi",
      genre: "Alternative",
      country: "USA",
      language: "English"
    }
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
    console.log('📻 Frequency changed to:', currentFrequency);
    const station = findNearestStation(currentFrequency);
    console.log('🎯 Nearest station found:', station?.name);

    if (station && (!currentStation || station.name !== currentStation.name)) {
      console.log('🔄 Switching from', currentStation?.name, 'to', station.name);
      setCurrentStation(station);
      if (isPlaying) {
        console.log('🎵 Auto-playing new station since radio is currently playing');
        playStation(station);
      }
    }
  }, [currentFrequency, currentStation, isPlaying]);

  // Initialize station on component mount
  useEffect(() => {
    console.log('🚀 RadioTuner component mounted. Initial frequency:', currentFrequency);
    const station = findNearestStation(currentFrequency);
    if (station && !currentStation) {
      console.log('🎯 Setting initial station:', station.name);
      setCurrentStation(station);
    }
  }, []);

  const playStation = async (station: RadioStation, useFallback = false) => {
    const urlToTry = useFallback && station.fallbackUrl ? station.fallbackUrl : station.url;
    console.log(`🎵 Attempting to play station: ${station.name}`, useFallback ? '(using fallback URL)' : '');
    console.log('🔗 URL:', urlToTry);

    if (!audioRef.current) {
      console.error('❌ Audio ref is null');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    console.log('⏳ Setting loading state to true');

    try {
      const audio = audioRef.current;

      // Stop current playback
      console.log('⏹️ Pausing current audio');
      audio.pause();
      audio.currentTime = 0;

      console.log('🔗 Setting audio source to:', urlToTry);
      audio.src = urlToTry;

      console.log('🔄 Loading audio...');
      audio.load();

      // Wait for the audio to be ready to play
      console.log('⏳ Waiting for audio to be ready...');

      const playPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Audio load timeout'));
        }, 8000); // 8 second timeout

        const onCanPlay = () => {
          console.log('✅ Audio can play');
          clearTimeout(timeout);
          audio.removeEventListener('canplay', onCanPlay);
          audio.removeEventListener('error', onError);
          resolve(true);
        };

        const onError = (e: any) => {
          console.error('❌ Audio error during load:', e);
          clearTimeout(timeout);
          audio.removeEventListener('canplay', onCanPlay);
          audio.removeEventListener('error', onError);
          reject(e);
        };

        audio.addEventListener('canplay', onCanPlay);
        audio.addEventListener('error', onError);
      });

      await playPromise;

      console.log('▶️ Attempting to play audio...');
      await audio.play();

      console.log('🎉 Audio playing successfully!');
      setIsPlaying(true);

    } catch (error) {
      console.error('❌ Error playing radio stream:', error);
      console.error('Error details:', {
        name: error?.name,
        message: error?.message,
        code: error?.code
      });

      // Try fallback URL if main URL failed and fallback exists
      if (!useFallback && station.fallbackUrl) {
        console.log('🔄 Trying fallback URL...');
        await playStation(station, true);
        return;
      }

      // Provide user feedback for different error types
      let userMessage = 'Stream unavailable';
      if (error?.message?.includes('CORS')) {
        console.error('🚫 CORS error - stream blocked by browser security');
        userMessage = 'Stream blocked by security';
      } else if (error?.message?.includes('timeout')) {
        console.error('⏰ Stream took too long to load');
        userMessage = 'Connection timeout';
      } else if (error?.name === 'NotAllowedError') {
        console.error('🔒 Autoplay blocked by browser - user interaction required');
        userMessage = 'Click play to start';
      } else if (error?.name === 'NotSupportedError') {
        console.error('🎧 Audio format not supported by browser');
        userMessage = 'Format not supported';
      }

      setErrorMessage(userMessage);
      setIsPlaying(false);
    } finally {
      console.log('🏁 Setting loading state to false');
      setIsLoading(false);
    }
  };

  const togglePlayback = () => {
    console.log('🎛️ Toggle playback clicked. Current state:', { isPlaying, currentStation: currentStation?.name });

    if (!audioRef.current) {
      console.error('❌ Audio ref is null in togglePlayback');
      return;
    }

    if (!currentStation) {
      console.error('❌ No current station selected');
      return;
    }

    if (isPlaying) {
      console.log('⏸️ Pausing playback');
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      console.log('▶️ Starting playback for:', currentStation.name);
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
          {errorMessage && (
            <div className="error-message">
              ⚠ {errorMessage}
            </div>
          )}
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
        onLoadStart={() => {
          console.log('📥 Audio element: Load started');
          setIsLoading(true);
        }}
        onCanPlayThrough={() => {
          console.log('✅ Audio element: Can play through');
          setIsLoading(false);
        }}
        onError={(e) => {
          const error = e.currentTarget.error;
          console.error('❌ Audio element error:', {
            code: error?.code,
            message: error?.message,
            MEDIA_ERR_ABORTED: error?.code === 1,
            MEDIA_ERR_NETWORK: error?.code === 2,
            MEDIA_ERR_DECODE: error?.code === 3,
            MEDIA_ERR_SRC_NOT_SUPPORTED: error?.code === 4
          });
          setIsLoading(false);
          setIsPlaying(false);
        }}
        onPlay={() => {
          console.log('▶️ Audio element: Started playing');
          setIsPlaying(true);
          setIsLoading(false);
        }}
        onPause={() => {
          console.log('⏸️ Audio element: Paused');
          setIsPlaying(false);
        }}
        onStalled={() => {
          console.warn('⚠️ Audio element: Stalled');
        }}
        onSuspend={() => {
          console.log('⏸️ Audio element: Suspended');
        }}
        onWaiting={() => {
          console.log('⏳ Audio element: Waiting for data');
          setIsLoading(true);
        }}
        onCanPlay={() => {
          console.log('✅ Audio element: Can play');
          setIsLoading(false);
        }}
      />
    </div>
  );
};