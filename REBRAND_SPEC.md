# Vanar xBPP — Full Visual Rebrand Spec

## The Goal
This site currently looks like a generic Lovable/SaaS template with teal colors swapped in.
We need it to look like a premium Web3/blockchain protocol site — matching VanarChain's visual identity.

## Reference Aesthetic
Think: Base.org, Optimism.io, or a dark premium crypto protocol site.
- Deep near-black backgrounds with subtle grid/dot texture overlays
- Glowing teal (#03D9AF) borders, text gradients, and accent effects
- Glass morphism cards (backdrop-blur, semi-transparent with border)
- Monospace uppercase labels with letter-spacing (the "protocol" look)
- Gradient text on headlines
- Noise/grain texture on backgrounds
- Animated pulsing glows, scanline effects
- Clean sharp typography — Figtree for body, monospace for labels

## Design Tokens (apply to src/index.css)

### Core Palette
```
--background: 222 20% 4%;        /* #080b12 */
--foreground: 210 20% 93%;       /* #e8edf5 */

--card: 222 18% 7%;              /* #0e1219 */
--card-foreground: 210 20% 93%;

--popover: 222 18% 7%;
--popover-foreground: 210 20% 93%;

--primary: 168 97% 43%;          /* #03D9AF teal */
--primary-foreground: 222 20% 4%;

--secondary: 222 15% 12%;        /* #171e2b */
--secondary-foreground: 210 20% 93%;

--muted: 222 15% 10%;
--muted-foreground: 215 15% 50%;

--accent: 168 97% 43%;
--accent-foreground: 222 20% 4%;

--border: 222 15% 14%;           /* subtle dark border */
--input: 222 15% 10%;
--ring: 168 97% 43%;

--radius: 0.75rem;
```

### Decision Colors (keep these — they're used in the app logic)
```
--decision-allow: 142 69% 58%;
--decision-block: 0 91% 71%;
--decision-escalate: 43 96% 56%;
```

## Global CSS Additions (add to src/index.css)

Add these utility classes at the bottom of the file:

```css
/* Vanar Grid Background */
.vanar-grid {
  background-image: 
    linear-gradient(rgba(3, 217, 175, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(3, 217, 175, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Vanar Dot Grid */
.vanar-dots {
  background-image: radial-gradient(rgba(3, 217, 175, 0.15) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* Teal Glow */
.glow-teal {
  box-shadow: 0 0 40px rgba(3, 217, 175, 0.15), 0 0 80px rgba(3, 217, 175, 0.05);
}

.glow-teal-text {
  text-shadow: 0 0 30px rgba(3, 217, 175, 0.4);
}

/* Glass Card */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(3, 217, 175, 0.12);
}

/* Gradient Text */
.gradient-text {
  background: linear-gradient(135deg, #03D9AF 0%, #6BE197 50%, #03D9AF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Protocol Label (monospace badge) */
.proto-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: hsl(168 97% 43%);
  padding: 4px 10px;
  border: 1px solid rgba(3, 217, 175, 0.3);
  border-radius: 4px;
  background: rgba(3, 217, 175, 0.06);
}

/* Scanning line animation */
@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

/* Pulse glow */
@keyframes pulseGlow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

/* Flow animation */
@keyframes flow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

## Component-by-Component Rebuild

### 1. src/components/landing/HeroSection.tsx — FULL REBUILD

The hero must look premium and protocol-grade. Key changes:
- Background: vanar-grid overlay on dark bg + radial teal glow from center
- Nav: glass pill navbar with teal accents (keep current structure but style properly)
- Badge: replace the current pill with a styled `proto-label` look
- Headline: same text but "they should." in gradient-text class
- Subhead: same text
- Architecture flow: make the nodes glass-card style with teal borders/glow
- npm install code block: styled like a real terminal (dark bg, teal dollar sign prefix)
- CTAs: primary button gets teal glow effect; outline button gets teal border
- Add subtle scanline or noise overlay div (absolute, pointer-events-none, opacity 0.03)

Hero background structure:
```jsx
<section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
  {/* Grid */}
  <div className="absolute inset-0 vanar-grid opacity-60" />
  {/* Radial teal glow center */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full" 
    style={{background: 'radial-gradient(ellipse, rgba(3,217,175,0.08) 0%, transparent 70%)'}} />
  {/* Content */}
  <main>...</main>
</section>
```

Nav logo — replace the current dot+text with:
```jsx
<div className="flex items-center gap-2">
  <div className="w-6 h-6 rounded-sm flex items-center justify-center"
    style={{background: 'linear-gradient(135deg, #03D9AF, #6BE197)', boxShadow: '0 0 12px rgba(3,217,175,0.5)'}}>
    <span className="text-xs font-bold text-black">V</span>
  </div>
  <span className="text-sm font-mono font-semibold tracking-[0.15em] uppercase">VANAR xBPP</span>
</div>
```

### 2. src/components/landing/Footer.tsx — UPDATE

Replace the current footer with:
- Same structure but use glass-card style background
- Add a top border with teal gradient: `border-top: 1px solid rgba(3,217,175,0.2)`
- Logo should use the same V icon as the nav
- Tagline: "Built on VanarChain" with teal color
- Bottom text: keep "Where agent behavior becomes obvious" + vanarchain.com link

### 3. src/components/layout/Header.tsx — CHECK AND UPDATE
Read this file. If it has a separate nav, update logo and style to match HeroSection nav style.

### 4. src/index.css — WE ALREADY STARTED
Verify all the above tokens are applied, add the utility classes above.

### 5. tailwind.config.ts — ADD ANIMATIONS
Add the custom animations (scan, pulseGlow, flow) to the tailwind config's extend.keyframes and extend.animation sections.

## What NOT to change
- Keep ALL page content exactly as-is (text, copy, feature lists, specs, scenarios, playground logic)
- Keep all routing and page structure
- Keep shadcn/ui components for forms, dropdowns etc (just the styling updates)
- Keep the decision colors (allow/block/escalate)

## After the rebuild
1. Run `npm run build` — must pass
2. If build passes:
   ```
   git add -A && git commit -m "feat: full Vanar visual rebrand — premium protocol design"
   git push origin main
   ```
3. Run: `openclaw system event --text "Vanar xBPP rebrand complete — full protocol design applied" --mode now`
