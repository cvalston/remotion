// FILE: src/components/CrisisToConfidenceHero.tsx
//
// 🎯 45-second 9:16 Legal Marketing Video
// 🎨 CUSTOMIZE: Edit the CONFIG object below.
// ♿ ACCESSIBILITY: Respects prefers-reduced-motion automatically

import React, {useMemo, useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Sequence,
  // Audio, // Uncomment for production
  Img,
  interpolate,
  useCurrentFrame,
  spring,
  staticFile,
  useVideoConfig,
  continueRender,
  delayRender,
  // OffthreadVideo, // Uncomment for production with real video asset
} from 'remotion';
// Google Fonts replaced with system font for sandboxed/offline render.
// To restore: npm install @remotion/google-fonts, re-add the import above,
// and uncomment waitForInterFont in the useEffect below.
const interFont = 'Arial, Helvetica, sans-serif';
const waitForInterFont = async () => { /* no-op: using system font */ };

// --- ACCESSIBILITY: Reduced motion hook ---
const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reduced;
};

// --- CONFIGURATION ---
interface VideoConfig {
  fps: number;
  durationSeconds: number;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  fontFamily: string;
  ctaText: string;
  disclaimer: string;
  assets: {
    backgroundVideo: string;
    attorneyPhoto: string;
    badgeIcons: {
      twentyFourSeven: string;
      freeConsult: string;
      noFee: string;
    };
    audio: {
      backgroundMusic: string;
      voiceover?: string;
    };
  };
  audioMix: {
    musicVolume: number;
    voiceoverVolume: number;
    voiceoverStartFrame?: number;
  };
}

// 🔄 ASSET PATHS: Replace placeholders with real files before production render
const CONFIG: VideoConfig = {
  fps: 30,
  durationSeconds: 45,
  primaryColor: '#0a2540',
  accentColor: '#c9a75d',
  textColor: '#ffffff',
  fontFamily: interFont,
  ctaText: 'CALL NOW: 973-297-4440',
  disclaimer: 'Free consultation. No fee unless we win.',
  assets: {
    backgroundVideo: staticFile('videos/placeholder.mp4'),     // Replace: videos/newark-skyline-dawn.mp4
    attorneyPhoto: staticFile('images/placeholder.jpg'),        // Replace: images/randy-lewis-headshot.jpg
    badgeIcons: {
      twentyFourSeven: staticFile('icons/placeholder.png'),     // Replace: icons/icon-24-7.png
      freeConsult: staticFile('icons/placeholder.png'),         // Replace: icons/icon-free-consult.png
      noFee: staticFile('icons/placeholder.png'),               // Replace: icons/icon-no-fee.png
    },
    audio: {
      backgroundMusic: staticFile('audio/placeholder.mp3'),    // Replace: audio/calm-urgent-underscore.mp3
      // voiceover: staticFile('audio/voiceover.mp3'),
    },
  },
  audioMix: {
    musicVolume: 0.25,
    voiceoverVolume: 1.0,
    voiceoverStartFrame: 0,
  },
};

// --- SPRING CONFIG HELPER (plain function — not a hook) ---
const getSpringConfig = (damping = 20, stiffness = 100) => ({damping, stiffness});

// --- REUSABLE COMPONENTS ---

interface AnimatedTextProps {
  text: string;
  delay: number;
  fontSize?: number;
  align?: 'left' | 'center' | 'right';
  fontWeight?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = React.memo(({
  text,
  delay,
  fontSize = 48,
  align = 'center',
  fontWeight = 700,
}) => {
  const frame = useCurrentFrame();
  const reducedMotion = usePrefersReducedMotion();
  const springConfig = useMemo(() => getSpringConfig(), []);

  const opacity = useMemo(() => {
    if (reducedMotion) return frame >= delay ? 1 : 0;
    return spring({
      frame: frame - delay,
      fps: CONFIG.fps,
      config: springConfig,
    });
  }, [frame, delay, reducedMotion, springConfig]);

  const leftPos = useMemo(() => {
    if (align === 'center') return '50%';
    if (align === 'left') return '10%';
    return '90%';
  }, [align]);

  const transform = useMemo(() => {
    if (align === 'center') return 'translate(-50%, -50%)';
    return 'translateY(-50%)';
  }, [align]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: leftPos,
        transform,
        textAlign: align,
        color: CONFIG.textColor,
        fontFamily: CONFIG.fontFamily,
        fontSize,
        fontWeight,
        opacity: interpolate(opacity, [0, 1], [0, 1]),
        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
        width: align === 'center' ? '80%' : '45%',
        lineHeight: 1.2,
        WebkitTextStroke: '0.5px rgba(0,0,0,0.2)',
      }}
    >
      {text}
    </div>
  );
});
AnimatedText.displayName = 'AnimatedText';

interface PulseCTAProps {
  text: string;
  delay: number;
}

const PulseCTA: React.FC<PulseCTAProps> = React.memo(({text, delay}) => {
  const frame = useCurrentFrame();
  const reducedMotion = usePrefersReducedMotion();
  const springConfig = useMemo(() => getSpringConfig(15, 120), []);

  const scale = useMemo(() => {
    if (reducedMotion) return 1;
    return spring({
      frame: frame - delay,
      fps: CONFIG.fps,
      config: springConfig,
    });
  }, [frame, delay, reducedMotion, springConfig]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 120,
        left: '50%',
        transform: `translateX(-50%) scale(${interpolate(scale, [0, 1], [0.98, 1])})`,
        backgroundColor: CONFIG.accentColor,
        color: CONFIG.primaryColor,
        padding: '20px 40px',
        borderRadius: 50,
        fontFamily: CONFIG.fontFamily,
        fontSize: 32,
        fontWeight: 800,
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        border: `3px solid ${CONFIG.textColor}`,
        cursor: 'pointer',
        textAlign: 'center',
        width: '85%',
        maxWidth: 600,
      }}
      onClick={() => window.open('tel:9732974440', '_self')}
    >
      {text}
      <div style={{fontSize: 18, fontWeight: 400, marginTop: 8, opacity: 0.95}}>
        {CONFIG.disclaimer}
      </div>
    </div>
  );
});
PulseCTA.displayName = 'PulseCTA';

interface TrustBadgeProps {
  iconUrl: string;
  label: string;
  delay: number;
  position: {top: string; left?: string; right?: string; transform?: string};
}

const TrustBadge: React.FC<TrustBadgeProps> = React.memo(({
  iconUrl,
  label,
  delay,
  position,
}) => {
  const frame = useCurrentFrame();
  const reducedMotion = usePrefersReducedMotion();
  const springConfig = useMemo(() => getSpringConfig(25), []);

  const opacity = useMemo(() => {
    if (reducedMotion) return frame >= delay ? 1 : 0;
    return spring({
      frame: frame - delay,
      fps: CONFIG.fps,
      config: springConfig,
    });
  }, [frame, delay, reducedMotion, springConfig]);

  return (
    <div
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        right: position.right,
        transform: position.transform,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        opacity: interpolate(opacity, [0, 1], [0, 1]),
        backgroundColor: 'rgba(10, 37, 64, 0.9)',
        padding: '10px 20px',
        borderRadius: 30,
        border: `1px solid ${CONFIG.accentColor}`,
        backdropFilter: 'blur(4px)',
      }}
    >
      <Img
        src={iconUrl}
        style={{width: 32, height: 32}}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <span
        style={{
          color: CONFIG.textColor,
          fontFamily: CONFIG.fontFamily,
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        {label}
      </span>
    </div>
  );
});
TrustBadge.displayName = 'TrustBadge';

// --- MAIN COMPOSITION ---
export const CrisisToConfidenceHero: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const reducedMotion = usePrefersReducedMotion();

  const [handle] = useState(() => delayRender('Loading fonts'));

  useEffect(() => {
    waitForInterFont()
      .then(() => continueRender(handle))
      .catch((err) => {
        console.error('Font load failed:', err);
        continueRender(handle);
      });
  }, [handle]);

  const bgZoom = useMemo(() => {
    if (reducedMotion) return 1;
    return interpolate(frame, [0, durationInFrames], [1, 1.03]);
  }, [frame, durationInFrames, reducedMotion]);

  // musicVolume: re-enable when audio track is restored for production
  // const musicVolume = useMemo(() => {
  //   if (frame < 15) return interpolate(frame, [0, 15], [0, CONFIG.audioMix.musicVolume]);
  //   return CONFIG.audioMix.musicVolume;
  // }, [frame]);

  return (
    <AbsoluteFill style={{backgroundColor: CONFIG.primaryColor}}>
      {/* Background — placeholder uses gradient; swap OffthreadVideo back for production */}
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
        {/* PRODUCTION: uncomment OffthreadVideo and remove the solid-bg div below
        <OffthreadVideo
          src={CONFIG.assets.backgroundVideo}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${bgZoom})`,
            willChange: 'transform',
          }}
        />
        */}
        {/* PLACEHOLDER background (replace with OffthreadVideo for production) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #0d3060 0%, #081c3a 60%, #0a1428 100%)',
            transform: `scale(${bgZoom})`,
          }}
        />
        {/* Gradient overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(10,37,64,0.8) 0%, rgba(10,37,64,0.5) 50%, rgba(10,37,64,0.9) 100%)',
          }}
        />
      </div>

      {/* AUDIO TRACKS — disabled for placeholder render; re-enable for production */}
      {/* PRODUCTION: uncomment the Sequence below and set USE_PLACEHOLDER_AUDIO=false
      <Sequence from={0}>
        <Audio
          src={CONFIG.assets.audio.backgroundMusic}
          volume={musicVolume}
          loop
        />
        {CONFIG.assets.audio.voiceover && (
          <Audio
            src={CONFIG.assets.audio.voiceover}
            volume={CONFIG.audioMix.voiceoverVolume}
            startFrom={CONFIG.audioMix.voiceoverStartFrame ?? 0}
          />
        )}
      </Sequence>
      */}

      {/* SEQUENCE 1: PROBLEM ACKNOWLEDGMENT (0–10s) */}
      <Sequence from={0} durationInFrames={fps * 10}>
        <AnimatedText text="Facing criminal charges?" delay={15} fontSize={52} />
        <AnimatedText text="Injured and overwhelmed?" delay={45} fontSize={52} />
      </Sequence>

      {/* SEQUENCE 2: SOLUTION + CREDIBILITY (10–25s) */}
      <Sequence from={fps * 10} durationInFrames={fps * 15}>
        <AnimatedText
          text="Newark's Trusted Legal Advocate"
          delay={0}
          fontSize={44}
        />

        {/* Attorney photo */}
        <div
          style={{
            position: 'absolute',
            bottom: 280,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: interpolate(frame - fps * 10, [0, 30], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <Img
            src={CONFIG.assets.attorneyPhoto}
            style={{
              width: 180,
              height: 180,
              borderRadius: '50%',
              border: `4px solid ${CONFIG.accentColor}`,
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              objectFit: 'cover',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -40,
              left: '50%',
              transform: 'translateX(-50%)',
              color: CONFIG.textColor,
              fontFamily: CONFIG.fontFamily,
              fontSize: 24,
              fontWeight: 600,
              textAlign: 'center',
              width: 220,
            }}
          >
            Randy E. Lewis, Esq.
          </div>
        </div>
      </Sequence>

      {/* SEQUENCE 3: TRUST BADGES (20–35s) */}
      <Sequence from={fps * 20} durationInFrames={fps * 15}>
        <TrustBadge
          iconUrl={CONFIG.assets.badgeIcons.twentyFourSeven}
          label="24/7 Emergency Response"
          delay={0}
          position={{top: '25%', left: '10%'}}
        />
        <TrustBadge
          iconUrl={CONFIG.assets.badgeIcons.freeConsult}
          label="Free Case Review"
          delay={15}
          position={{top: '25%', right: '10%'}}
        />
        <TrustBadge
          iconUrl={CONFIG.assets.badgeIcons.noFee}
          label="No Fee Unless We Win"
          delay={30}
          position={{top: '40%', left: '50%', transform: 'translateX(-50%)'}}
        />
      </Sequence>

      {/* SEQUENCE 4: URGENCY + CTA (35–45s) */}
      <Sequence from={fps * 35} durationInFrames={fps * 10}>
        <AnimatedText
          text="Your Future Can't Wait."
          delay={0}
          fontSize={56}
          fontWeight={800}
        />
        <PulseCTA text={CONFIG.ctaText} delay={20} />

        {/* Multilingual note */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            color: CONFIG.textColor,
            fontFamily: CONFIG.fontFamily,
            fontSize: 20,
            opacity: 0.95,
            textAlign: 'center',
          }}
        >
          Habla Español • Falamos Português
        </div>
      </Sequence>

      {/* Safe zone guides — dev only */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 120,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.3)',
              fontSize: 12,
            }}
          >
            ↑ Safe zone top
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 120,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.3)',
              fontSize: 12,
            }}
          >
            ↓ Safe zone bottom (CTA)
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

export default CrisisToConfidenceHero;
