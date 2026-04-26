import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from 'remotion';
import {z} from 'zod';

// ─── SCHEMA ────────────────────────────────────────────────────────────────

export const randyLewisSchema = z.object({
  problemStatement: z.string(),
  mistakenAssumption: z.string(),
  stats: z.array(z.object({value: z.string(), label: z.string()})),
  testimonials: z.array(
    z.object({
      quote: z.string(),
      author: z.string(),
      outcome: z.string(),
    })
  ),
  offerHighlight: z.string(),
  phoneNumber: z.string(),
  bilingual: z.boolean(),
  primaryColor: z.string(),
  accentColor: z.string(),
});

export type RandyLewisProps = z.infer<typeof randyLewisSchema>;

export const defaultProps: RandyLewisProps = {
  problemStatement: "You're facing charges —\nhere's the mistake\nmost people make.",
  mistakenAssumption:
    'Most people hire the first "affordable" attorney they find. Junior lawyers settle fast. You pay with your freedom.',
  stats: [
    {value: '500+', label: 'Cases Won'},
    {value: '95%', label: 'Success Rate'},
    {value: '24/7', label: 'Available'},
  ],
  testimonials: [
    {
      quote: 'Randy got my charges completely dismissed. I thought my life was over.',
      author: 'M.R. — Newark',
      outcome: 'Charges Dismissed',
    },
    {
      quote: 'He saved me $20,000 in fines and kept me out of jail.',
      author: 'J.T. — Essex County',
      outcome: '$20K Saved',
    },
    {
      quote: 'Available at 2am when I was arrested. Charges dropped by morning.',
      author: 'D.L. — Newark',
      outcome: 'DUI Dismissed',
    },
  ],
  offerHighlight: 'Free consultation. No fee unless we win.',
  phoneNumber: '973-297-4440',
  bilingual: true,
  primaryColor: '#0a2540',
  accentColor: '#c9a75d',
};

// ─── CONSTANTS ─────────────────────────────────────────────────────────────

const WHITE = '#ffffff';
const RED = '#e74c3c';
const FONT = 'Arial, Helvetica, sans-serif';

// ─── ANIMATION HELPERS ─────────────────────────────────────────────────────

const spr = (frame: number, fps: number, delay = 0, damping = 20, stiffness = 100) =>
  spring({frame: frame - delay, fps, config: {damping, stiffness}});

const fade = (frame: number, start: number, dur = 18) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// ─── ANIMATED BACKGROUND ───────────────────────────────────────────────────

const AnimatedBg: React.FC<{
  frame: number;
  primary: string;
  accent: string;
  variant?: 'dark' | 'darker' | 'problem';
}> = ({frame, primary, accent, variant = 'dark'}) => {
  const bg =
    variant === 'problem'
      ? 'linear-gradient(160deg, #100a0a 0%, #1a0505 100%)'
      : variant === 'darker'
      ? 'linear-gradient(160deg, #0a1520 0%, #050d14 100%)'
      : `linear-gradient(160deg, ${primary} 0%, #061828 100%)`;

  // Slow drift: subtle parallax on background lines
  const drift = interpolate(frame, [0, 300], [0, -12], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      {/* Grid lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(201,167,93,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,167,93,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          transform: `translateY(${drift}px)`,
        }}
      />
      {/* Radial vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      {/* Accent glow orb */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
          top: -100,
          left: '50%',
          transform: 'translateX(-50%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Legal motif: faint scales-of-justice symbols tiled across bg */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          gap: 0,
          opacity: 0.04,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {Array.from({length: 80}).map((_, i) => (
          <div
            key={i}
            style={{
              width: 120,
              height: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 52,
              color: accent,
              flexShrink: 0,
            }}
          >
            {i % 3 === 0 ? '⚖' : i % 3 === 1 ? '§' : '⚖'}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── SEQUENCE 1: PATTERN INTERRUPT ─────────────────────────────────────────

const PatternInterrupt: React.FC<{
  text: string;
  frame: number;
  fps: number;
  accent: string;
  primary: string;
}> = ({text, frame, fps, accent, primary}) => {
  const lines = text.split('\n');

  // Warning badge entrance (pops in first like MistakeSlide)
  const badgeScale = spr(frame, fps, 0, 12, 150);
  const badgeOpacity = fade(frame, 0, 12);

  // Accent bar draws down
  const barH = interpolate(frame, [10, 38], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-start', padding: '0 72px'}}>
      <AnimatedBg frame={frame} primary={primary} accent={accent} />

      <div style={{position: 'relative', zIndex: 1, width: '100%'}}>
        {/* Animated warning badge */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: 32,
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
            transformOrigin: 'left center',
          }}
        >
          <div
            style={{
              backgroundColor: `${accent}1a`,
              border: `2px solid ${accent}`,
              borderRadius: 50,
              padding: '10px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{fontSize: 24}}>⚖️</span>
            <span
              style={{
                color: accent,
                fontFamily: FONT,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: 'uppercase',
              }}
            >
              LEGAL ALERT
            </span>
          </div>
        </div>

        {/* Left-aligned layout: vertical accent bar + text */}
        <div style={{display: 'flex', gap: 28, alignItems: 'stretch'}}>
          {/* Animated vertical accent bar */}
          <div
            style={{
              width: 5,
              backgroundColor: accent,
              borderRadius: 3,
              height: `${barH}%`,
              minHeight: 8,
              alignSelf: 'flex-start',
              marginTop: 6,
              flexShrink: 0,
              // grow with content
              ...(barH >= 100 ? {alignSelf: 'stretch', height: 'auto'} : {}),
            }}
          />

          {/* Headline lines staggered — left aligned */}
          <div>
            {lines.map((line, i) => {
              const delay = 12 + i * 14;
              const x = interpolate(spr(frame, fps, delay), [0, 1], [-30, 0]);
              const opacity = fade(frame, delay, 16);
              return (
                <div
                  key={i}
                  style={{
                    color: i === lines.length - 1 ? accent : WHITE,
                    fontFamily: FONT,
                    fontSize: 58,
                    fontWeight: 900,
                    lineHeight: 1.1,
                    textAlign: 'left',
                    opacity,
                    transform: `translateX(${x}px)`,
                    textShadow: '0 3px 16px rgba(0,0,0,0.5)',
                    marginBottom: 4,
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SEQUENCE 2: THE MISTAKE ────────────────────────────────────────────────

const MistakeSlide: React.FC<{
  text: string;
  frame: number;
  fps: number;
  accent: string;
  primary: string;
}> = ({text, frame, fps, accent, primary}) => {
  const iconScale = spr(frame, fps, 5, 12, 150);
  const iconOpacity = fade(frame, 5, 12);
  const cardY = interpolate(spr(frame, fps, 18), [0, 1], [40, 0]);
  const cardOpacity = fade(frame, 18);
  const borderH = interpolate(frame, [18, 50], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 72px'}}>
      <AnimatedBg frame={frame} primary={primary} accent={accent} variant="problem" />

      <div style={{position: 'relative', zIndex: 1, width: '100%'}}>
        {/* Warning badge */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 36,
            opacity: iconOpacity,
            transform: `scale(${iconScale})`,
          }}
        >
          <div
            style={{
              backgroundColor: `${RED}22`,
              border: `2px solid ${RED}`,
              borderRadius: 50,
              padding: '12px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{fontSize: 28}}>⚠️</span>
            <span
              style={{
                color: RED,
                fontFamily: FONT,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: 'uppercase',
              }}
            >
              THE MISTAKE
            </span>
          </div>
        </div>

        {/* Quote card */}
        <div
          style={{
            position: 'relative',
            opacity: cardOpacity,
            transform: `translateY(${cardY}px)`,
          }}
        >
          {/* Animated left border */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 5,
              height: `${borderH}%`,
              backgroundColor: RED,
              borderRadius: 3,
            }}
          />
          <div style={{paddingLeft: 36}}>
            <div
              style={{
                color: WHITE,
                fontFamily: FONT,
                fontSize: 44,
                fontWeight: 700,
                lineHeight: 1.3,
                textShadow: '0 2px 12px rgba(0,0,0,0.4)',
              }}
            >
              {text}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SEQUENCE 3: GUIDE / RANDY ──────────────────────────────────────────────

const StatBadge: React.FC<{
  value: string;
  label: string;
  delay: number;
  frame: number;
  fps: number;
  accent: string;
}> = ({value, label, delay, frame, fps, accent}) => {
  const scale = spr(frame, fps, delay, 18, 80);
  const opacity = fade(frame, delay, 14);

  // Counter animation for numeric values
  const numericMatch = value.match(/^(\d+)(\+|%)?$/);
  const displayValue = useMemo(() => {
    if (!numericMatch) return value;
    const target = parseInt(numericMatch[1], 10);
    const suffix = numericMatch[2] || '';
    const counted = Math.floor(
      interpolate(frame, [delay, delay + 40], [0, target], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    );
    return `${counted}${suffix}`;
  }, [frame, delay, numericMatch, value]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        backgroundColor: 'rgba(10,37,64,0.85)',
        border: `1.5px solid ${accent}`,
        borderRadius: 20,
        padding: '18px 28px',
        textAlign: 'center',
        backdropFilter: 'blur(8px)',
        minWidth: 180,
      }}
    >
      <div
        style={{
          color: accent,
          fontFamily: FONT,
          fontSize: 42,
          fontWeight: 900,
          lineHeight: 1,
        }}
      >
        {displayValue}
      </div>
      <div
        style={{
          color: 'rgba(255,255,255,0.8)',
          fontFamily: FONT,
          fontSize: 18,
          fontWeight: 600,
          marginTop: 6,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
    </div>
  );
};

const GuideSlide: React.FC<{
  stats: {value: string; label: string}[];
  frame: number;
  fps: number;
  bilingual: boolean;
  accent: string;
  primary: string;
}> = ({stats, frame, fps, bilingual, accent, primary}) => {
  const photoScale = spr(frame, fps, 5, 18, 80);
  const photoOpacity = fade(frame, 5, 20);
  const nameOpacity = fade(frame, 28);
  const nameY = interpolate(spr(frame, fps, 28), [0, 1], [20, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 72px',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      <AnimatedBg frame={frame} primary={primary} accent={accent} variant="darker" />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Super-label */}
        <div
          style={{
            color: accent,
            fontFamily: FONT,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: 'uppercase',
            opacity: fade(frame, 0, 15),
            marginBottom: 28,
          }}
        >
          YOUR GUIDE
        </div>

        {/* Photo with layered rings */}
        <div
          style={{
            position: 'relative',
            opacity: photoOpacity,
            transform: `scale(${photoScale})`,
            marginBottom: 28,
          }}
        >
          {/* Outer glow ring */}
          <div
            style={{
              position: 'absolute',
              inset: -8,
              borderRadius: '50%',
              border: `2px solid ${accent}44`,
            }}
          />
          {/* Main gold ring */}
          <div
            style={{
              position: 'absolute',
              inset: -4,
              borderRadius: '50%',
              border: `3px solid ${accent}`,
            }}
          />
          <Img
            src={staticFile('images/randy-lewis-headshot.jpg')}
            style={{
              width: 220,
              height: 220,
              borderRadius: '50%',
              objectFit: 'cover',
              display: 'block',
              boxShadow: `0 12px 48px rgba(0,0,0,0.6), 0 0 0 4px ${accent}`,
            }}
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = 'none';
            }}
          />
        </div>

        {/* Name + title */}
        <div
          style={{
            opacity: nameOpacity,
            transform: `translateY(${nameY}px)`,
            textAlign: 'center',
            marginBottom: 36,
          }}
        >
          <div
            style={{
              color: WHITE,
              fontFamily: FONT,
              fontSize: 52,
              fontWeight: 900,
              lineHeight: 1.05,
              textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}
          >
            Randy E. Lewis, Esq.
          </div>
          <div
            style={{
              color: 'rgba(255,255,255,0.65)',
              fontFamily: FONT,
              fontSize: 24,
              fontWeight: 500,
              marginTop: 8,
            }}
          >
            Criminal Defense · Personal Injury · Newark, NJ
          </div>
          {bilingual && (
            <div
              style={{
                color: accent,
                fontFamily: FONT,
                fontSize: 20,
                fontWeight: 600,
                marginTop: 10,
                opacity: 0.9,
              }}
            >
              Habla Español · Falamos Português
            </div>
          )}
        </div>

        {/* Stat badges */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {stats.map((s, i) => (
            <StatBadge
              key={i}
              value={s.value}
              label={s.label}
              delay={42 + i * 12}
              frame={frame}
              fps={fps}
              accent={accent}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SEQUENCE 4: TESTIMONIAL CARD ──────────────────────────────────────────

const TestimonialCard: React.FC<{
  quote: string;
  author: string;
  outcome: string;
  frame: number;
  fps: number;
  accent: string;
  primary: string;
}> = ({quote, author, outcome, frame, fps, accent, primary}) => {
  const cardScale = spr(frame, fps, 5, 18, 80);
  const cardOpacity = fade(frame, 5, 20);
  const starsOpacity = fade(frame, 28, 20);
  const outcomeBadgeScale = spr(frame, fps, 35, 15, 120);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 60px'}}>
      <AnimatedBg frame={frame} primary={primary} accent={accent} variant="darker" />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
        }}
      >
        {/* Card */}
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: `1.5px solid ${accent}55`,
            borderRadius: 24,
            padding: '48px 52px',
            backdropFilter: 'blur(12px)',
            boxShadow: `0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)`,
          }}
        >
          {/* Quote mark */}
          <div
            style={{
              color: accent,
              fontFamily: 'Georgia, serif',
              fontSize: 100,
              lineHeight: 0.6,
              opacity: 0.35,
              marginBottom: 20,
            }}
          >
            "
          </div>

          {/* Quote text */}
          <div
            style={{
              color: WHITE,
              fontFamily: FONT,
              fontSize: 42,
              fontWeight: 600,
              lineHeight: 1.35,
              fontStyle: 'italic',
              marginBottom: 36,
              textShadow: '0 1px 8px rgba(0,0,0,0.3)',
            }}
          >
            {quote}
          </div>

          {/* Stars */}
          <div
            style={{
              display: 'flex',
              gap: 6,
              marginBottom: 20,
              opacity: starsOpacity,
            }}
          >
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{color: accent, fontSize: 32}}>
                ★
              </span>
            ))}
          </div>

          {/* Author + outcome badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontFamily: FONT,
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              — {author}
            </div>

            <div
              style={{
                transform: `scale(${outcomeBadgeScale})`,
                backgroundColor: `${accent}22`,
                border: `1.5px solid ${accent}`,
                borderRadius: 30,
                padding: '8px 22px',
                color: accent,
                fontFamily: FONT,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              ✓ {outcome}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SEQUENCE 5: CTA ────────────────────────────────────────────────────────

const CTASlide: React.FC<{
  offerHighlight: string;
  phoneNumber: string;
  bilingual: boolean;
  frame: number;
  fps: number;
  accent: string;
  primary: string;
}> = ({offerHighlight, phoneNumber, bilingual, frame, fps, accent, primary}) => {
  const headlineOpacity = fade(frame, 5);
  const headlineY = interpolate(spr(frame, fps, 5), [0, 1], [24, 0]);
  const btnScale = spr(frame, fps, 20, 12, 150);
  const pulse = Math.sin(frame / 14) * 0.018 + 1;
  const glowOpacity = interpolate(Math.sin(frame / 14), [-1, 1], [0.3, 0.7]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 72px',
        flexDirection: 'column',
        gap: 40,
      }}
    >
      <AnimatedBg frame={frame} primary={primary} accent={accent} />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 36,
          width: '100%',
        }}
      >
        {/* Headline */}
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: WHITE,
              fontFamily: FONT,
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1.05,
              textShadow: '0 3px 20px rgba(0,0,0,0.5)',
            }}
          >
            Your Future
          </div>
          <div
            style={{
              color: accent,
              fontFamily: FONT,
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1.05,
              textShadow: `0 0 40px ${accent}66`,
            }}
          >
            Can't Wait.
          </div>
          <div
            style={{
              color: 'rgba(255,255,255,0.65)',
              fontFamily: FONT,
              fontSize: 26,
              fontWeight: 400,
              marginTop: 16,
            }}
          >
            {offerHighlight}
          </div>
        </div>

        {/* CTA Button */}
        <div style={{position: 'relative', width: '90%', maxWidth: 580}}>
          {/* Glow behind button */}
          <div
            style={{
              position: 'absolute',
              inset: -16,
              borderRadius: 70,
              background: `radial-gradient(ellipse, ${accent}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }}
          />
          <div
            style={{
              position: 'relative',
              transform: `scale(${btnScale * pulse})`,
              backgroundColor: accent,
              borderRadius: 60,
              padding: '32px 48px',
              textAlign: 'center',
              boxShadow: `0 8px 40px ${accent}55, 0 2px 0 rgba(255,255,255,0.2) inset`,
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                color: primary,
                fontFamily: FONT,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: 'uppercase',
                marginBottom: 8,
                opacity: 0.8,
              }}
            >
              Call Randy Directly — 24/7
            </div>
            <div
              style={{
                color: primary,
                fontFamily: FONT,
                fontSize: 52,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: 1,
              }}
            >
              {phoneNumber}
            </div>
            {bilingual && (
              <div
                style={{
                  color: primary,
                  fontFamily: FONT,
                  fontSize: 18,
                  fontWeight: 500,
                  marginTop: 10,
                  opacity: 0.65,
                }}
              >
                Habla Español · Falamos Português
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            color: 'rgba(255,255,255,0.35)',
            fontFamily: FONT,
            fontSize: 18,
            textAlign: 'center',
            opacity: fade(frame, 40),
          }}
        >
          thelewislawyer.com · Newark, NJ
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── MAIN COMPOSITION ───────────────────────────────────────────────────────

export const RandyLewisHero: React.FC<RandyLewisProps> = (props) => {
  const {
    problemStatement,
    mistakenAssumption,
    stats,
    testimonials,
    offerHighlight,
    phoneNumber,
    bilingual,
    primaryColor,
    accentColor,
  } = props;

  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // StoryBrand pacing from expertise.md:
  // pattern interrupt (3s) → problem (4s) → guide (5s) → testimonials (10s) → CTA (3s)
  const S1 = fps * 5;                                       // 0–5s   pattern interrupt
  const S2 = fps * 6;                                       // 5–11s  the mistake
  const S3 = fps * 8;                                       // 11–19s guide
  const TESTI_DUR = fps * 5;                                // 5s per testimonial
  const shown = useMemo(() => testimonials.slice(0, 3), [testimonials]);
  const S4_TOTAL = TESTI_DUR * shown.length;               // 19–34s testimonials
  const S5 = fps * 8;                                       // 34–42s CTA

  const t2 = S1;
  const t3 = t2 + S2;
  const t4 = t3 + S3;
  const t5 = t4 + S4_TOTAL;
  const totalFrames = t5 + S5;

  // Local frame within each sequence
  const f1 = frame;
  const f2 = frame - t2;
  const f3 = frame - t3;
  const f5 = frame - t5;

  return (
    <AbsoluteFill style={{backgroundColor: primaryColor}}>
      {/* S1: Pattern interrupt */}
      <Sequence from={0} durationInFrames={S1}>
        <PatternInterrupt
          text={problemStatement}
          frame={f1}
          fps={fps}
          accent={accentColor}
          primary={primaryColor}
        />
      </Sequence>

      {/* S2: The mistake */}
      <Sequence from={t2} durationInFrames={S2}>
        <MistakeSlide
          text={mistakenAssumption}
          frame={f2}
          fps={fps}
          accent={accentColor}
          primary={primaryColor}
        />
      </Sequence>

      {/* S3: Guide */}
      <Sequence from={t3} durationInFrames={S3}>
        <GuideSlide
          stats={stats}
          frame={f3}
          fps={fps}
          bilingual={bilingual}
          accent={accentColor}
          primary={primaryColor}
        />
      </Sequence>

      {/* S4: Testimonials */}
      {shown.map((t, i) => {
        const start = t4 + i * TESTI_DUR;
        const localFrame = frame - start;
        return (
          <Sequence key={i} from={start} durationInFrames={TESTI_DUR}>
            <TestimonialCard
              quote={t.quote}
              author={t.author}
              outcome={t.outcome}
              frame={localFrame}
              fps={fps}
              accent={accentColor}
              primary={primaryColor}
            />
          </Sequence>
        );
      })}

      {/* S5: CTA */}
      <Sequence from={t5} durationInFrames={S5}>
        <CTASlide
          offerHighlight={offerHighlight}
          phoneNumber={phoneNumber}
          bilingual={bilingual}
          frame={f5}
          fps={fps}
          accent={accentColor}
          primary={primaryColor}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export default RandyLewisHero;
