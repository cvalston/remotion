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

// --- SCHEMA ---
export const randyLewisSchema = z.object({
  problemStatement: z.string(),
  mistakenAssumption: z.string(),
  testimonials: z.array(
    z.object({
      quote: z.string(),
      author: z.string(),
    })
  ),
  offerHighlight: z.string(),
  phoneNumber: z.string(),
  bilingual: z.boolean(),
});

export type RandyLewisProps = z.infer<typeof randyLewisSchema>;

export const defaultProps: RandyLewisProps = {
  problemStatement: "You're facing charges — here's the mistake most people make.",
  mistakenAssumption:
    'Most people hire the first "affordable" attorney they find. Junior lawyers settle fast. You pay the price — with your freedom.',
  testimonials: [
    {
      quote: 'Randy got my charges completely dismissed. I thought my life was over.',
      author: 'M.R., Newark — Criminal Defense',
    },
    {
      quote: 'He saved me $20,000 in fines and kept me out of jail. Unbelievable.',
      author: 'J.T., Essex County — Traffic Violation',
    },
    {
      quote: 'Available at 2am when I was arrested. Charges dropped by morning.',
      author: 'D.L., Newark — DUI Defense',
    },
  ],
  offerHighlight: 'Free consultation. No fee unless we win.',
  phoneNumber: '973-297-4440',
  bilingual: true,
};

// --- COLORS ---
const NAVY = '#0a2540';
const GOLD = '#c9a75d';
const WHITE = '#ffffff';
const FONT = 'Arial, Helvetica, sans-serif';

// --- HELPERS ---
const fadeIn = (frame: number, start: number, duration = 20) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const slideUp = (frame: number, fps: number, delay: number) =>
  spring({frame: frame - delay, fps, config: {damping: 20, stiffness: 100}});

// --- SUB-COMPONENTS ---

const PatternInterrupt: React.FC<{text: string; frame: number; fps: number}> = ({
  text,
  frame,
  fps,
}) => {
  const y = interpolate(slideUp(frame, fps, 10), [0, 1], [40, 0]);
  const opacity = fadeIn(frame, 10);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${NAVY} 0%, #061828 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 60px',
      }}
    >
      <div
        style={{
          color: GOLD,
          fontFamily: FONT,
          fontSize: 28,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 3,
          opacity: fadeIn(frame, 0),
          marginBottom: 24,
        }}
      >
        STOP — READ THIS FIRST
      </div>
      <div
        style={{
          color: WHITE,
          fontFamily: FONT,
          fontSize: 52,
          fontWeight: 800,
          textAlign: 'center',
          lineHeight: 1.15,
          opacity,
          transform: `translateY(${y}px)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const MistakeSlide: React.FC<{text: string; frame: number; fps: number}> = ({
  text,
  frame,
  fps,
}) => {
  const opacity = fadeIn(frame, 5);
  const scaleVal = interpolate(slideUp(frame, fps, 5), [0, 1], [0.96, 1]);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0d0d0d',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 60px',
      }}
    >
      <div
        style={{
          borderLeft: `6px solid #e74c3c`,
          paddingLeft: 32,
          opacity,
          transform: `scale(${scaleVal})`,
        }}
      >
        <div
          style={{
            color: '#e74c3c',
            fontFamily: FONT,
            fontSize: 22,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginBottom: 16,
          }}
        >
          THE MISTAKE
        </div>
        <div
          style={{
            color: WHITE,
            fontFamily: FONT,
            fontSize: 44,
            fontWeight: 700,
            lineHeight: 1.25,
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const GuideSlide: React.FC<{frame: number; fps: number; bilingual: boolean}> = ({
  frame,
  fps,
  bilingual,
}) => {
  const photoOpacity = fadeIn(frame, 10, 30);
  const textOpacity = fadeIn(frame, 30);
  const badgeScale = interpolate(slideUp(frame, fps, 40), [0, 1], [0.8, 1]);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${NAVY} 0%, #061828 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 60px',
        flexDirection: 'column',
        gap: 32,
      }}
    >
      <div style={{opacity: photoOpacity}}>
        <Img
          src={staticFile('images/randy-lewis-headshot.jpg')}
          style={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: `5px solid ${GOLD}`,
            objectFit: 'cover',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <div style={{opacity: textOpacity, textAlign: 'center'}}>
        <div
          style={{
            color: GOLD,
            fontFamily: FONT,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 2,
            marginBottom: 8,
          }}
        >
          YOUR GUIDE
        </div>
        <div
          style={{color: WHITE, fontFamily: FONT, fontSize: 52, fontWeight: 800}}
        >
          Randy E. Lewis, Esq.
        </div>
        <div
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontFamily: FONT,
            fontSize: 28,
            marginTop: 8,
          }}
        >
          Criminal Defense · Newark, NJ
        </div>
        {bilingual && (
          <div
            style={{
              color: GOLD,
              fontFamily: FONT,
              fontSize: 22,
              marginTop: 12,
              opacity: 0.9,
            }}
          >
            Habla Español · Falamos Português
          </div>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          gap: 24,
          transform: `scale(${badgeScale})`,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {['24/7 Emergency Response', 'Free Case Review', 'No Fee Unless We Win'].map(
          (label) => (
            <div
              key={label}
              style={{
                backgroundColor: 'rgba(201,167,93,0.15)',
                border: `1px solid ${GOLD}`,
                borderRadius: 30,
                padding: '10px 24px',
                color: WHITE,
                fontFamily: FONT,
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          )
        )}
      </div>
    </AbsoluteFill>
  );
};

const TestimonialSlide: React.FC<{
  quote: string;
  author: string;
  frame: number;
  fps: number;
}> = ({quote, author, frame, fps}) => {
  const opacity = fadeIn(frame, 5, 25);
  const y = interpolate(slideUp(frame, fps, 5), [0, 1], [30, 0]);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0f1923 0%, #162030 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 64px',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          color: GOLD,
          fontFamily: FONT,
          fontSize: 120,
          lineHeight: 0.5,
          opacity: 0.4,
          alignSelf: 'flex-start',
        }}
      >
        "
      </div>
      <div
        style={{
          opacity,
          transform: `translateY(${y}px)`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: WHITE,
            fontFamily: FONT,
            fontSize: 44,
            fontWeight: 600,
            lineHeight: 1.3,
            fontStyle: 'italic',
            marginBottom: 32,
          }}
        >
          {quote}
        </div>
        <div
          style={{
            color: GOLD,
            fontFamily: FONT,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          — {author}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginTop: 24,
          }}
        >
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{color: GOLD, fontSize: 28}}>
              ★
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CTASlide: React.FC<{
  offerHighlight: string;
  phoneNumber: string;
  bilingual: boolean;
  frame: number;
  fps: number;
}> = ({offerHighlight, phoneNumber, bilingual, frame, fps}) => {
  const pulse = Math.sin(frame / 15) * 0.02 + 1;
  const opacity = fadeIn(frame, 5);
  const btnScale = interpolate(slideUp(frame, fps, 20), [0, 1], [0.9, 1]);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${NAVY} 0%, #061828 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 60px',
        flexDirection: 'column',
        gap: 40,
      }}
    >
      <div style={{opacity, textAlign: 'center'}}>
        <div
          style={{
            color: WHITE,
            fontFamily: FONT,
            fontSize: 58,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          Your Future
          <br />
          <span style={{color: GOLD}}>Can't Wait.</span>
        </div>
        <div
          style={{
            color: 'rgba(255,255,255,0.75)',
            fontFamily: FONT,
            fontSize: 26,
          }}
        >
          {offerHighlight}
        </div>
      </div>

      <div
        style={{
          transform: `scale(${btnScale * pulse})`,
          backgroundColor: GOLD,
          borderRadius: 60,
          padding: '28px 48px',
          textAlign: 'center',
          boxShadow: `0 0 40px rgba(201,167,93,0.4)`,
          cursor: 'pointer',
          width: '85%',
          maxWidth: 560,
        }}
      >
        <div
          style={{
            color: NAVY,
            fontFamily: FONT,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          Call Randy Directly — 24/7
        </div>
        <div
          style={{color: NAVY, fontFamily: FONT, fontSize: 44, fontWeight: 900}}
        >
          {phoneNumber}
        </div>
        {bilingual && (
          <div
            style={{
              color: NAVY,
              fontFamily: FONT,
              fontSize: 18,
              marginTop: 8,
              opacity: 0.75,
            }}
          >
            Habla Español · Falamos Português
          </div>
        )}
      </div>

      <div
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontFamily: FONT,
          fontSize: 18,
          textAlign: 'center',
          opacity,
        }}
      >
        thelewislawyer.com · Newark, NJ
      </div>
    </AbsoluteFill>
  );
};

// --- MAIN COMPOSITION ---
export const RandyLewisHero: React.FC<RandyLewisProps> = ({
  problemStatement,
  mistakenAssumption,
  testimonials,
  offerHighlight,
  phoneNumber,
  bilingual,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const INTRO_DUR = fps * 6;       // 0–6s
  const MISTAKE_DUR = fps * 6;     // 6–12s
  const GUIDE_DUR = fps * 8;       // 12–20s
  const TESTI_DUR = fps * 5;       // 5s each
  const CTA_DUR = fps * 8;         // last 8s

  const testimonialsToShow = useMemo(() => testimonials.slice(0, 3), [testimonials]);
  const totalTestiDur = TESTI_DUR * testimonialsToShow.length;
  const ctaStart = INTRO_DUR + MISTAKE_DUR + GUIDE_DUR + totalTestiDur;

  return (
    <AbsoluteFill style={{backgroundColor: NAVY}}>
      {/* SEQUENCE 1: Pattern interrupt */}
      <Sequence from={0} durationInFrames={INTRO_DUR}>
        <PatternInterrupt text={problemStatement} frame={frame} fps={fps} />
      </Sequence>

      {/* SEQUENCE 2: The mistake */}
      <Sequence from={INTRO_DUR} durationInFrames={MISTAKE_DUR}>
        <MistakeSlide
          text={mistakenAssumption}
          frame={frame - INTRO_DUR}
          fps={fps}
        />
      </Sequence>

      {/* SEQUENCE 3: Guide introduction */}
      <Sequence from={INTRO_DUR + MISTAKE_DUR} durationInFrames={GUIDE_DUR}>
        <GuideSlide
          frame={frame - INTRO_DUR - MISTAKE_DUR}
          fps={fps}
          bilingual={bilingual}
        />
      </Sequence>

      {/* SEQUENCE 4: Testimonials */}
      {testimonialsToShow.map((t, i) => {
        const start = INTRO_DUR + MISTAKE_DUR + GUIDE_DUR + i * TESTI_DUR;
        return (
          <Sequence key={i} from={start} durationInFrames={TESTI_DUR}>
            <TestimonialSlide
              quote={t.quote}
              author={t.author}
              frame={frame - start}
              fps={fps}
            />
          </Sequence>
        );
      })}

      {/* SEQUENCE 5: CTA */}
      <Sequence from={ctaStart} durationInFrames={CTA_DUR}>
        <CTASlide
          offerHighlight={offerHighlight}
          phoneNumber={phoneNumber}
          bilingual={bilingual}
          frame={frame - ctaStart}
          fps={fps}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export default RandyLewisHero;
