# Vanar xBPP — EXACT Design Spec (Matching Ferron/VanarChain sites)

## Reference Visual Identity (from actual Ferron + VanarChain v4 sites)

### Background
- **Main background:** Warm off-white `#EDEDEA` (NOT white, NOT dark — warm beige-gray)
- **Subtle noise/grain texture overlay** on entire page: add via CSS pseudo-element or SVG filter
- **One dark section** near the bottom: `#1A1A1A` (for architecture/how-it-works type section)
- **No dark nav**, no dark cards on main bg — this is a LIGHT design

### Typography — Critical
- **Display/headline font:** "Bebas Neue" (from Google Fonts — closest free match to Druk Wide/Monument Extended used in Ferron/Vanar)
  - ALL CAPS always
  - Very large: hero ~100px, section titles ~72px
  - Line height: 0.95
  - Letter spacing: -1px to 0 (tight)
  - Italic transform on hero: `font-style: italic` or `transform: skewX(-6deg)`
- **Body font:** "Inter" (already familiar to the project)
- **Label font:** Inter, 12px, 600 weight, ALL CAPS, letter-spacing 2.5px

### Colors
```
Page bg:           #EDEDEA  (warm off-white)
Dark section bg:   #1A1A1A  
Card bg:           #FFFFFF
Card border:       #E2E2DE  (light warm gray)

Teal accent:       #3ECFA5  (this is THE Vanar/Ferron teal — slightly different from #03D9AF)
Teal dark:         #2AAF8E

Headline text:     #1E2D2D  (very dark teal-charcoal, NOT pure black)
Body text:         #6B6B67  (medium gray)
Label text:        #3ECFA5  (teal)
Muted text:        #9E9E98

Border:            #E2E2DE
```

### Key Visual Patterns (copy exactly from reference sites)

**Section Label pattern:**
```jsx
<div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
  <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#3ECFA5'}} />
  <span style={{fontFamily:'Inter',fontSize:'12px',fontWeight:600,letterSpacing:'2.5px',textTransform:'uppercase',color:'#3ECFA5'}}>
    LABEL TEXT HERE
  </span>
</div>
```

**Card pattern (Ferron style — white card, light border):**
```jsx
<div style={{
  background:'#FFFFFF',
  border:'1px solid #E2E2DE',
  borderRadius:'14px',
  padding:'32px',
}}>
```

**Card pattern (VanarChain style — corner bracket accents):**
```jsx
// Card with NO border, just corner bracket decorations
<div style={{position:'relative', padding:'32px'}}>
  {/* top-right corner bracket */}
  <div style={{position:'absolute',top:'12px',right:'12px',width:'20px',height:'20px',
    borderTop:'2px solid #3ECFA5',borderRight:'2px solid #3ECFA5'}} />
  {/* bottom-left corner bracket */}
  <div style={{position:'absolute',bottom:'12px',left:'12px',width:'20px',height:'20px',
    borderBottom:'2px solid #3ECFA5',borderLeft:'2px solid #3ECFA5'}} />
</div>
```

**Hero headline pattern (mixed teal/dark words):**
```jsx
<h1 style={{fontFamily:'"Bebas Neue",display',fontSize:'100px',lineHeight:0.95,
  fontStyle:'italic',color:'#1E2D2D',letterSpacing:'-1px',textTransform:'uppercase'}}>
  <span>Agents can spend money.</span>
  <br/>
  <span>They just can't prove </span>
  <span style={{color:'#3ECFA5'}}>they should.</span>
</h1>
```

**Teal gradient button:**
```jsx
<button style={{
  background:'linear-gradient(135deg, #3ECFA5, #2AAF8E)',
  color:'white',
  fontFamily:'Inter',
  fontSize:'13px',
  fontWeight:700,
  letterSpacing:'1.5px',
  textTransform:'uppercase',
  padding:'16px 36px',
  borderRadius:'12px',
  border:'none',
  cursor:'pointer',
}}>
```

**Ghost/outline button:**
```jsx
<button style={{
  background:'transparent',
  color:'#1E2D2D',
  fontFamily:'Inter',
  fontSize:'13px',
  fontWeight:700,
  letterSpacing:'1.5px',
  textTransform:'uppercase',
  padding:'16px 36px',
  borderRadius:'12px',
  border:'1px solid #B8B8B4',
  cursor:'pointer',
}}>
```

**Dark section (architecture/how it works):**
```jsx
<section style={{background:'#1A1A1A', padding:'100px 80px'}}>
  {/* pill badge */}
  <div style={{display:'inline-flex',alignItems:'center',border:'1px solid rgba(255,255,255,0.25)',
    borderRadius:'100px',padding:'8px 20px',marginBottom:'40px'}}>
    <span style={{color:'white',fontSize:'12px',fontWeight:600,letterSpacing:'2px',
      textTransform:'uppercase'}}>HOW IT ALL CONNECTS</span>
  </div>
  {/* headline in white with teal accent */}
  <h2 style={{fontFamily:'"Bebas Neue"',fontSize:'72px',lineHeight:0.95,fontStyle:'italic',
    color:'white'}}>
    TRUST IS THE <span style={{color:'#3ECFA5'}}>PRODUCT.</span>
  </h2>
</section>
```

**Tag badge (inline protocol tags):**
```jsx
<span style={{
  display:'inline-flex',alignItems:'center',gap:'6px',
  background:'rgba(62,207,165,0.08)',
  border:'1px solid rgba(62,207,165,0.3)',
  borderRadius:'100px',
  padding:'4px 12px',
  fontSize:'11px',fontWeight:700,letterSpacing:'1px',
  textTransform:'uppercase',color:'#3ECFA5'
}}>
  X402 · XBPP · VANARCHAIN
</span>
```

## What to build — File by file

### 1. src/index.css
Complete rewrite of CSS variables:
```css
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap");

:root {
  --background: 40 15% 91%;        /* #EDEDEA warm off-white */
  --foreground: 180 22% 15%;       /* #1E2D2D dark teal-charcoal */
  --card: 0 0% 100%;               /* #FFFFFF */
  --card-foreground: 180 22% 15%;
  --primary: 161 56% 53%;          /* #3ECFA5 Vanar teal */
  --primary-foreground: 0 0% 100%;
  --secondary: 40 8% 94%;
  --secondary-foreground: 180 22% 15%;
  --muted: 40 8% 88%;
  --muted-foreground: 0 0% 62%;    /* #9E9E98 */
  --accent: 161 56% 53%;
  --accent-foreground: 0 0% 100%;
  --border: 40 12% 87%;            /* #E2E2DE */
  --input: 40 8% 94%;
  --ring: 161 56% 53%;
  --radius: 0.875rem;
  
  --decision-allow: 142 69% 58%;
  --decision-block: 0 91% 71%;
  --decision-escalate: 43 96% 56%;
  
  --font-display: 'Bebas Neue', 'Arial Black', sans-serif;
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

/* Grain texture */
body::before {
  content: '';
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 256px 256px;
}

/* Keep dark class for dark sections */
.dark-section {
  background: #1A1A1A;
}

/* Section label dot pattern */
.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #3ECFA5;
}
.section-label::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3ECFA5;
  flex-shrink: 0;
}

/* Display headline utility */
.display-heading {
  font-family: var(--font-display);
  font-style: italic;
  line-height: 0.95;
  text-transform: uppercase;
  letter-spacing: -1px;
}

/* Vanar teal text */
.teal-text { color: #3ECFA5; }

/* Corner bracket card */
.corner-card {
  position: relative;
}
.corner-card::before {
  content: '';
  position: absolute;
  top: 14px; right: 14px;
  width: 22px; height: 22px;
  border-top: 2px solid #3ECFA5;
  border-right: 2px solid #3ECFA5;
}
.corner-card::after {
  content: '';
  position: absolute;
  bottom: 14px; left: 14px;
  width: 22px; height: 22px;
  border-bottom: 2px solid #3ECFA5;
  border-left: 2px solid #3ECFA5;
}
```

### 2. src/components/landing/HeroSection.tsx — FULL REBUILD

Rebuild to match Ferron site hero exactly:
- Background: #EDEDEA (no dark bg, no grid overlay)
- Ambient teal glow blob top-right (radial gradient, 400px, very blurred, rgba(62,207,165,0.12))
- Nav: same bg as page, Vanar V logo + "VANAR xBPP" brand, center nav links, right teal gradient CTA "GITHUB →"
- Hero content LEFT-ALIGNED (not centered)
- Section label: dot + "VANAR × XBPP OPEN STANDARD · BASE NATIVE"
- Big Bebas Neue italic headline: dark teal-charcoal for main text, teal #3ECFA5 for "they should."
- Body text: Inter, 17px, gray #6B6B67
- Feature dot row: small teal dots + text labels (like Ferron's "ZeroClaw fork · Base native" row)
- Two buttons: teal gradient "Try the Playground" + ghost "Read the Spec"

### 3. src/components/landing/ProblemSection.tsx — UPDATE
- Section label pattern (dot + uppercase teal label)
- Bebas Neue headline
- White cards with light border for problem items

### 4. src/components/landing/WhatIsSection.tsx — UPDATE
- Bebas Neue headline with teal accent word
- Clean card layout

### 5. src/components/landing/HowItWorksSection.tsx — DARK SECTION
- background: #1A1A1A
- Pill badge for section label
- White + teal Bebas Neue headline
- Dark card variants

### 6. src/components/landing/Footer.tsx — UPDATE  
- Background #EDEDEA matching page
- Vanar V logo + VANAR xBPP text
- Clean, minimal footer

### 7. ALL other landing components
Apply the same treatment: section-label dot pattern, Bebas Neue headlines, white cards, teal accents.

## After all changes:
1. `npm run build` — fix any errors
2. `git add -A && git commit -m "feat: full Vanar/Ferron design system — light theme, Bebas Neue, teal #3ECFA5"`
3. `git push origin main`
4. `openclaw system event --text "Vanar xBPP full rebuild complete — matches Ferron/Vanar design language" --mode now`
