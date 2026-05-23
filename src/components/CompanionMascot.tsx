import React, { useEffect, useState } from 'react';

interface CompanionMascotProps {
  hairStyle: 'bob' | 'spiky' | 'pony' | 'long' | 'asuka-twins' | 'rei-shaggy';
  hairColor: string;
  outfit: 'hoodie' | 'suit' | 'scifi' | 'casual' | 'plugsuit-red' | 'plugsuit-white' | 'school-uniform';
  outfitColor: string;
  accessory: 'none' | 'spen' | 'glasses' | 'headphones' | 'halo' | 'a10-clips';
  emotion: 'smiling' | 'speaking' | 'thinking' | 'wink';
  isSpeaking: boolean;
  className?: string;
  size?: number;
  eyeColor?: string;
}

export default function CompanionMascot({
  hairStyle,
  hairColor,
  outfit,
  outfitColor,
  accessory,
  emotion,
  isSpeaking,
  className = '',
  size = 120,
  eyeColor
}: CompanionMascotProps) {
  // Simple internal state for cute micro-behaviors
  const [blink, setBlink] = useState(false);
  const [talkingTick, setTalkingTick] = useState(false);

  // Passive blink loop
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Sync mouth opening while words are being spoken
  useEffect(() => {
    let interval: any = null;
    if (isSpeaking) {
      interval = setInterval(() => {
        setTalkingTick(prev => !prev);
      }, 150);
    } else {
      setTalkingTick(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSpeaking]);

  // Determine actual eye color
  const actualEyeColor = eyeColor || '#0284c7'; // default cyan-blue

  return (
    <div 
      className={`relative select-none flex items-center justify-center transition-all duration-300 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        width="100%" 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]"
      >
        <defs>
          <radialGradient id="faceGrad" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#fff1e6" />
            <stop offset="100%" stopColor="#fcd5bc" />
          </radialGradient>
          <linearGradient id="cyberLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>

        {/* 1. Halo Accessory (behind hair) */}
        {accessory === 'halo' && (
          <g className="animate-bounce" style={{ animationDuration: '3s' }}>
            <ellipse cx="50" cy="12" rx="18" ry="4" stroke="#f59e0b" strokeWidth="2.5" fill="none" opacity="0.9" />
            <ellipse cx="50" cy="12" rx="18" ry="4" stroke="#fef08a" strokeWidth="1" fill="none" opacity="1" className="blur-[1px]" />
          </g>
        )}

        {/* 2. Asuka Twins Hair Backing (if selected - needs to render behind shoulders) */}
        {hairStyle === 'asuka-twins' && (
          <g fill={hairColor}>
            {/* Elegant wavy twin pigtails floating behind shoulders on both sides */}
            <path d="M22,24 Q 0,15 6,55 Q 16,58 24,40 Z" />
            <path d="M78,24 Q 100,15 94,55 Q 84,58 76,40 Z" />
            {/* Rubberband ties */}
            <rect x="18" y="22" width="4" height="2" fill="#ef4444" rx="0.5" />
            <rect x="78" y="22" width="4" height="2" fill="#ef4444" rx="0.5" />
          </g>
        )}

        {/* 3. Base Character Neck & Shoulders (Outfit) */}
        {/* Simple shoulders base */}
        <path d="M30,85 C30,72 40,70 50,70 C60,70 70,72 70,85" fill="#fcd5bc" />

        {/* Dynamic Clothes Rendering */}
        {outfit === 'hoodie' && (
          <g>
            {/* Main cozy hoodie sweater body */}
            <path d="M24,85 C24,70 38,64 50,64 C62,64 76,70 76,85 Z" fill={outfitColor} />
            {/* Darker hood interior */}
            <path d="M35,64 C35,55 65,55 65,64" fill="#1e293b" opacity="0.3" stroke={outfitColor} strokeWidth="1" />
            {/* Drawstrings */}
            <line x1="45" y1="67" x2="45" y2="78" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="55" y1="67" x2="55" y2="75" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="45" cy="78" r="1.2" fill="#e2e8f0" />
            <circle cx="55" cy="75" r="1.2" fill="#e2e8f0" />
          </g>
        )}

        {outfit === 'suit' && (
          <g>
            {/* Sharp suit jacket shoulders */}
            <path d="M24,85 C24,72 38,65 50,65 C62,65 76,72 76,85 Z" fill="#1e293b" />
            {/* White inner button shirt */}
            <path d="M44,65 L56,65 L50,76 Z" fill="#ffffff" />
            {/* Sharp collar cutouts */}
            <path d="M38,65 L46,70 L42,65 Z" fill="#0f172a" />
            <path d="M62,65 L54,70 L58,65 Z" fill="#0f172a" />
            {/* Cute necktie */}
            <path d="M49,67 L51,67 L52,78 L50,81 L48,78 Z" fill={outfitColor} />
          </g>
        )}

        {outfit === 'scifi' && (
          <g>
            {/* High-tech mech cyber shoulder armor */}
            <path d="M22,85 C22,68 36,63 50,63 C64,63 78,68 78,85 Z" fill="#334155" />
            {/* Contrast plating details */}
            <path d="M28,85 L38,72 L44,85 Z" fill="#475569" />
            <path d="M72,85 L62,72 L56,85 Z" fill="#475569" />
            {/* Power reactor disk core */}
            <circle cx="50" cy="76" r="6" fill="#0f172a" stroke="url(#cyberLight)" strokeWidth="1.5" />
            <circle cx="50" cy="76" r="3" fill="#38bdf8" className={isSpeaking ? 'animate-pulse' : ''} />
            {/* Neon highlight lines */}
            <path d="M30,78 Q42,70 50,70" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.8" />
            <path d="M70,78 Q58,70 50,70" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.8" />
          </g>
        )}

        {outfit === 'casual' && (
          <g>
            {/* Standard round neck vintage tee shirt */}
            <path d="M24,85 C24,70 34,66 50,66 C66,66 76,70 76,85 Z" fill={outfitColor} />
            {/* Contrast ribbed neckband */}
            <path d="M40,66 C40,71 60,71 60,66" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.5" />
            {/* Visual logo insignia badge */}
            <polygon points="47,72 53,72 55,77 50,80 45,77" fill="#ffffff" opacity="0.3" />
          </g>
        )}

        {/* Anime Pilot Plugsuit 02 (Asuka Red) */}
        {outfit === 'plugsuit-red' && (
          <g>
            <path d="M22,85 C22,68 36,63 50,63 C64,63 78,68 78,85 Z" fill="#dc2626" />
            {/* Black central compression collar neckband */}
            <path d="M40,63 C40,71 60,71 60,63 Z" fill="#1e293b" />
            {/* Green neon alignment indicators on shoulders */}
            <circle cx="30" cy="74" r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="0.8" />
            <circle cx="70" cy="74" r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="0.8" />
            {/* Detailed orange chest plates */}
            <path d="M42,75 L48,70 L48,82 Z" fill="#f97316" stroke="#991b1b" strokeWidth="0.5" />
            <path d="M58,75 L52,70 L52,82 Z" fill="#f97316" stroke="#991b1b" strokeWidth="0.5" />
            {/* Core mechanical dial connector */}
            <circle cx="50" cy="78" r="2" fill="#e2e8f0" />
            <circle cx="50" cy="78" r="0.8" fill="#1e293b" />
          </g>
        )}

        {/* Anime Pilot Plugsuit 00 (Rei White) */}
        {outfit === 'plugsuit-white' && (
          <g>
            {/* Clean biomechanical white and charcoal gray plates */}
            <path d="M22,85 C22,68 36,63 50,63 C64,63 78,68 78,85 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
            {/* Black neck band lining */}
            <path d="M42,63 C42,72 58,72 58,63 Z" fill="#0f172a" />
            {/* Dark shoulder harnesses */}
            <path d="M24,78 Q36,68 44,70" stroke="#334155" strokeWidth="2.5" fill="none" />
            <path d="M76,78 Q64,68 56,70" stroke="#334155" strokeWidth="2.5" fill="none" />
            {/* Bold red connection indicator disk in center */}
            <circle cx="50" cy="74" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.8" />
            <circle cx="50" cy="74" r="2.2" fill="#dc2626" />
          </g>
        )}

        {/* School Uniform Tokyo-3 Sailor Jumper */}
        {outfit === 'school-uniform' && (
          <g>
            {/* Classic bright sky-blue suspender jumper skirt */}
            <path d="M22,85 C22,69 36,65 50,65 C64,65 78,69 78,85 Z" fill="#0284c7" />
            {/* White underblouse shirt */}
            <path d="M38,65 Q50,78 62,65 Z" fill="#ffffff" />
            {/* Dark crisp school straps */}
            <path d="M30,69 C34,69 40,79 40,85" stroke="#0369a1" strokeWidth="2" fill="none" />
            <path d="M70,69 C66,69 60,79 60,85" stroke="#0369a1" strokeWidth="2" fill="none" />
            {/* Red school girl neck tie ribbon ribbon knot */}
            <path d="M46,71 L54,71 L50,78 Z" fill="#ef4444" />
            <path d="M50,74 C47,78 44,84 44,84" stroke="#ef4444" strokeWidth="1.5" fill="none" />
            <path d="M50,74 C53,78 56,84 56,84" stroke="#ef4444" strokeWidth="1.5" fill="none" />
          </g>
        )}

        {/* 4. High ponytail hair backing (if Pony selected) */}
        {hairStyle === 'pony' && (
          <g>
            <path d="M55,20 C62,12 80,18 78,35 C76,50 68,52 64,48 C61,45 58,35 55,26 Z" fill={hairColor} />
            {/* Pontytail rubberband */}
            <circle cx="58" cy="24" r="2.5" fill="#eab308" />
          </g>
        )}

        {/* 5. Rounded Face Base */}
        <circle cx="50" cy="42" r="23" fill="url(#faceGrad)" />

        {/* Pink Rosy Cheeks Blush sticker */}
        <ellipse cx="34" cy="48" rx="3.5" ry="1.5" fill="#f87171" opacity="0.45" />
        <ellipse cx="66" cy="48" rx="3.5" ry="1.5" fill="#f87171" opacity="0.45" />

        {/* 6. Expressive Glowing Eyes with custom dye color (Ruby red for Rei, Aqua blue for Asuka) */}
        <g>
          {blink ? (
            /* Closed blinking eye lines */
            <>
              <path d="M30,42 Q35,40 40,42" stroke="#475569" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M60,42 Q65,40 70,42" stroke="#475569" strokeWidth="2" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              {/* Left Eye */}
              {emotion === 'wink' ? (
                /* Playful left wink */
                <path d="M30,43 Q35,38 40,43" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              ) : (
                <g>
                  {/* Eye Base White */}
                  <ellipse cx="35" cy="42" rx="4.5" ry="5.5" fill="#ffffff" />
                  {/* Glowing Iris (Customizable) */}
                  <ellipse cx="35" cy="42" rx="3" ry="4" fill={actualEyeColor} />
                  {/* Catchlight sparkles */}
                  <circle cx="34" cy="40" r="1" fill="#ffffff" />
                  <circle cx="36.5" cy="44" r="0.5" fill="#ffffff" />
                  {/* Eyebrow */}
                  <path d="M29,34 Q35,31 40,34" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                </g>
              )}

              {/* Right Eye */}
              <g>
                {/* Eye Base White */}
                <ellipse cx="65" cy="42" rx="4.5" ry="5.5" fill="#ffffff" />
                {/* Glowing Iris */}
                <ellipse cx="65" cy="42" rx="3" ry="4" fill={actualEyeColor} />
                {/* Catchlight sparkles */}
                <circle cx="64" cy="40" r="1" fill="#ffffff" />
                <circle cx="66.5" cy="44" r="0.5" fill="#ffffff" />
                {/* Eyebrow */}
                <path d="M60,34 Q65,31 71,34" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </g>
            </>
          )}
        </g>

        {/* 7. Dynamic Mouth & Tongue (Visual Lip-sync speaking) */}
        <g>
          {isSpeaking && talkingTick ? (
            /* Open talking animated slot mouth */
            <g>
              <path d="M46,51 Q50,58 54,51 Z" fill="#991b1b" stroke="#311010" strokeWidth="0.8" />
              {/* Little red tongue accent */}
              <path d="M48,54 Q50,56 52,54 Z" fill="#f87171" />
            </g>
          ) : emotion === 'thinking' ? (
            /* Focused concentration simple flat dot line mouth */
            <line x1="46" y1="52" x2="54" y2="52" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
          ) : emotion === 'wink' ? (
            /* Playful open small triangular mouth */
            <polygon points="46,50 54,50 50,55" fill="#f43f5e" />
          ) : (
            /* Standard happy smiling mouth curve */
            <path d="M45,51 Q50,56 55,51" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          )}
        </g>

        {/* Cute small nose */}
        <circle cx="50" cy="47" r="0.75" fill="#fcd5bc" stroke="#cb997e" strokeWidth="0.4" />

        {/* 8. Customizable Hair Layer Front */}
        <g>
          {hairStyle === 'bob' && (
            <g>
              {/* Core hair crown */}
              <path d="M24,35 C24,18 36,13 50,13 C64,13 76,18 76,35 C76,46 74,48 71,48 C68,48 67,31 50,31 C33,31 32,48 29,48 C26,48 24,46 24,35 Z" fill={hairColor} />
              {/* Cute framing hair side locks */}
              <path d="M24,35 C23,45 25,56 28,58 C29,59 30,57 29,52 Z" fill={hairColor} />
              {/* Right side hair framing locks */}
              <path d="M76,35 C77,45 75,56 72,58 C71,59 70,57 71,52 Z" fill={hairColor} />
            </g>
          )}

          {hairStyle === 'spiky' && (
            <g fill={hairColor}>
              {/* Spiky spires over the head */}
              <path d="M23,35 C26,20 36,15 50,15 C64,15 74,20 77,35 L75,32 L68,20 L61,25 L50,12 L39,25 L32,20 L25,32 Z" />
              {/* Flamboyant side bangs */}
              <polygon points="25,35 22,48 30,42" />
              <polygon points="75,35 78,48 70,42" />
              {/* Front center hair spikelet crossing forehead */}
              <polygon points="45,30 50,42 55,30" />
            </g>
          )}

          {hairStyle === 'pony' && (
            <g>
              {/* Clean tied crown of hair */}
              <path d="M25,36 C25,18 36,15 50,15 C64,15 75,18 75,36 C75,42 70,44 68,36 C64,28 58,30 50,30 C42,30 36,28 32,36 C30,44 25,42 25,36 Z" fill={hairColor} />
              {/* Small side bangs */}
              <path d="M25,36 C24,44 26,48 27,48 Z" fill={hairColor} />
              <path d="M75,36 C76,44 74,48 73,48 Z" fill={hairColor} />
            </g>
          )}

          {hairStyle === 'long' && (
            <g>
              {/* Full flowing hair behind shoulder line and framing sides */}
              <path d="M24,35 Q14,56 22,78 M76,35 Q86,56 78,78" stroke={hairColor} strokeWidth="5.5" strokeLinecap="round" fill="none" opacity="0.85" />
              {/* Main hair cap crown */}
              <path d="M23,34 C23,17 35,12 50,12 C65,12 77,17 77,34 C77,44 74,40 70,40 C62,40 60,26 50,26 C40,26 38,40 30,40 C26,40 23,44 23,34 Z" fill={hairColor} />
              {/* Long cascading hair flowing sides */}
              <path d="M23,34 C20,48 21,68 25,75 C26,76 27,74 26,62 Z" fill={hairColor} />
              <path d="M77,34 C80,48 79,68 75,75 C74,76 73,74 74,62 Z" fill={hairColor} />
            </g>
          )}

          {/* Special Anime Asuka Langley Hair Crown */}
          {hairStyle === 'asuka-twins' && (
            <g fill={hairColor}>
              {/* Fuller front sweeping bangs/lock with forehead framing */}
              <path d="M23,34 C23,17 35,12 50,12 C65,12 77,17 77,34 C77,44 74,40 70,40 C62,40 58,26 50,26 C42,26 38,40 30,40 C26,40 23,44 23,34 Z" />
              {/* Sleek side framing strands */}
              <path d="M23,34 C20,48 19,65 24,76 C25,77 26,75 25,62 Z" />
              <path d="M77,34 C80,48 81,65 76,76 C75,77 74,75 75,62 Z" />
              {/* Front spiky center parting lock */}
              <polygon points="44,26 50,38 56,26" />
              <polygon points="34,26 39,36 43,26" />
              <polygon points="66,26 61,36 57,26" />
            </g>
          )}

          {/* Special Anime Rei Ayanami Short Shaggy Bob */}
          {hairStyle === 'rei-shaggy' && (
            <g fill={hairColor}>
              {/* Feathered short bob crown */}
              <path d="M22,34 C22,15 34,10 50,10 C66,10 78,15 78,34 C78,44 75,44 71,44 C67,44 64,28 50,28 C36,28 33,44 29,44 C25,44 22,44 22,34 Z" />
              {/* Shaggy side cluster tips */}
              <path d="M22,34 C20,44 23,55 26,59 L28,51 Z" />
              <path d="M78,34 C80,44 77,55 74,59 L72,51 Z" />
              {/* Soft feathery bangs across forehead */}
              <polygon points="46,28 50,42 54,28" />
              <polygon points="37,28 42,39 46,28" />
              <polygon points="63,28 58,39 54,28" />
              {/* Spike cues at back of the neck */}
              <polygon points="26,48 22,54 28,52" />
              <polygon points="74,48 78,54 72,52" />
            </g>
          )}
        </g>

        {/* 9. Accessories Foreground */}
        {accessory === 'glasses' && (
          <g>
            {/* Left Glass lens */}
            <circle cx="35" cy="42" r="8.5" fill="none" stroke="#e11d48" strokeWidth="2" opacity="0.9" />
            <circle cx="35" cy="42" r="7.5" fill="#38bdf8" opacity="0.2" />
            {/* Right Glass lens */}
            <circle cx="65" cy="42" r="8.5" fill="none" stroke="#e11d48" strokeWidth="2" opacity="0.9" />
            <circle cx="65" cy="42" r="7.5" fill="#38bdf8" opacity="0.2" />
            {/* Bridge connector bar */}
            <line x1="43.5" y1="42" x2="56.5" y2="42" stroke="#e11d48" strokeWidth="2" />
            {/* Eye glasses handles going back */}
            <path d="M26.5,42 Q23,40 21,43" stroke="#e11d48" strokeWidth="1.5" fill="none" />
            <path d="M73.5,42 Q77,40 79,43" stroke="#e11d48" strokeWidth="1.5" fill="none" />
          </g>
        )}

        {accessory === 'headphones' && (
          <g>
            {/* Main over-ear headphones support headband */}
            <path d="M21,35 Q50,5 79,35" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M21,35 Q50,5 79,35" stroke="#feb019" strokeWidth="1" fill="none" strokeLinecap="round" />
            {/* Left cup ear piece pad */}
            <rect x="17" y="30" width="7" height="15" rx="3.5" fill="#0f172a" />
            <rect x="15" y="32" width="2" height="11" rx="1" fill="#feb019" />
            {/* Right cup ear piece pad */}
            <rect x="76" y="30" width="7" height="15" rx="3.5" fill="#0f172a" />
            <rect x="83" y="32" width="2" height="11" rx="1" fill="#feb019" />
          </g>
        )}

        {accessory === 'spen' && (
          <g className="animate-pulse" style={{ animationDuration: '4.5s' }}>
            {/* Character holding a beautiful futuristic S-Pen stylus like an aura rod */}
            <rect x="74" y="52" width="5" height="32" rx="1" transform="rotate(-25 76 68)" fill="#0f172a" stroke="#ffffff" strokeWidth="1" />
            <rect x="74.5" y="52" width="4" height="6" transform="rotate(-25 76 68)" fill="#0284c7" />
            {/* Metal shiny clip */}
            <rect x="74.5" y="58" width="0.8" height="4" transform="rotate(-25 76 68)" fill="#b45309" />
            {/* S-Pen tip glowing aura star */}
            <g transform="translate(86, 52)">
              <circle cx="0" cy="0" r="2.5" fill="#38bdf8" className="blur-[1px]" />
              <polygon points="0,-4 1,-1 4,0 1,1 0,4 -1,1 -4,0 -1,-1" fill="#ffffff" />
            </g>
          </g>
        )}

        {/* Neural A10 Nerve connection clips (Asuka/Rei iconic headgear clips) */}
        {accessory === 'a10-clips' && (
          <g>
            {/* Left black nerve clip with glow */}
            <g transform="translate(25, 22) rotate(-20)">
              <rect x="-1" y="-4" width="3.5" height="8" rx="1" fill="#1e293b" stroke="#000000" strokeWidth="0.5" />
              <line x1="0.75" y1="-3" x2="0.75" y2="3" stroke="#ef4444" strokeWidth="0.8" />
            </g>
            {/* Right black nerve clip with glow */}
            <g transform="translate(75, 22) rotate(20)">
              <rect x="-2.5" y="-4" width="3.5" height="8" rx="1" fill="#1e293b" stroke="#000000" strokeWidth="0.5" />
              <line x1="-0.75" y1="-3" x2="-0.75" y2="3" stroke="#ef4444" strokeWidth="0.8" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
