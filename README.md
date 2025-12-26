# MakeUsLive Agency Website

Premium agency website built with Next.js 14, GSAP animations, and Lenis smooth scroll.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3.4
- **Animations**: GSAP 3.12 + ScrollTrigger
- **Smooth Scroll**: @studio-freight/lenis
- **3D**: @react-three/fiber + drei
- **Forms**: React Hook Form + Zod
- **Language**: TypeScript 5.x

## Features

- 🎨 Glassmorphism design system
- 🔄 Buttery smooth 60fps scroll with Lenis
- ✨ GSAP scroll-triggered animations
- 📱 Fully responsive design
- ♿ Accessibility-focused (WCAG compliant)
- ⚡ Performance optimized (Lighthouse 95+)
- 🎭 Reduced motion support

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx            # Home page composition
├── globals.css         # Global styles + Tailwind
components/
├── providers/          # Context providers (GSAP, Lenis)
├── layout/             # Navbar, Footer
├── sections/           # Page sections (Hero, Services, etc.)
├── ui/                 # Reusable UI components
├── canvas/             # Three.js components
lib/
├── utils.ts            # Utility functions (cn, etc.)
├── constants.ts        # Design tokens + copy
├── validations.ts      # Zod schemas
hooks/                  # Custom React hooks
types/                  # TypeScript interfaces
```

## Animation Guidelines

All animations use GSAP with cleanup:

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    // animations here
  }, containerRef)
  
  return () => ctx.revert()
}, [])
```

## Deployment

Optimized for Vercel deployment:

```bash
vercel --prod
```

## License

Private - MakeUsLive Agency

