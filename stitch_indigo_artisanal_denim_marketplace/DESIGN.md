---
name: Indigo & Stitch
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#45464e'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#75777e'
  outline-variant: '#c5c6cf'
  surface-tint: '#505e80'
  primary: '#041533'
  on-primary: '#ffffff'
  primary-container: '#1b2a49'
  on-primary-container: '#8392b6'
  inverse-primary: '#b7c6ed'
  secondary: '#974724'
  on-secondary: '#ffffff'
  secondary-container: '#ff996f'
  on-secondary-container: '#772f0d'
  tertiary: '#251009'
  on-tertiary: '#ffffff'
  tertiary-container: '#3d241c'
  on-tertiary-container: '#ae897e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b7c6ed'
  on-primary-fixed: '#0a1b39'
  on-primary-fixed-variant: '#384667'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb598'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#78310f'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#e7bdb1'
  on-tertiary-fixed: '#2c160e'
  on-tertiary-fixed-variant: '#5d4037'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  display-lg:
    fontFamily: Domine
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Domine
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Domine
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Domine
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
  stitch-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  stitch-gap: 4px
---

## Brand & Style
The design system is built upon the concept of "Digital Craftsmanship." It avoids the ephemeral nature of standard SaaS interfaces in favor of a tactile, durable aesthetic that mirrors the longevity of high-quality denim. The target audience includes enthusiasts of slow fashion, heritage workwear, and artisanal goods who value transparency and human touch over industrial efficiency.

The visual style is a blend of **Tactile Minimalism** and **Brutalism-Lite**. It utilizes heavy horizontal and vertical lines, intentional whitespace, and subtle "imperfections" such as dashed borders and textured backgrounds to evoke the feeling of a physical workshop. The emotional response should be one of reliability, warmth, and unhurried quality.

## Colors
The palette is rooted in the materials of the trade. The **Deep Indigo** provides a stable, authoritative base for structural elements and primary navigation. **Warm Rust** acts as the "stitch" color, used sparingly for calls to action, active states, and highlights. 

**Leather Brown** is reserved for metadata, tags, and small badges—mimicking the branding patches on a pair of jeans. Backgrounds utilize the **Raw Cotton** off-white to reduce eye strain and provide a "canvas" feel that is warmer and more organic than a sterile #FFFFFF.

## Typography
The typography strategy contrasts the sturdy, traditional feel of **Domine** (a robust slab-serif) with the pragmatic clarity of **Work Sans**. For technical details and "industrial" labels (like SKU numbers, price breakdowns, and status updates), **JetBrains Mono** is introduced to simulate the stamped or printed text found on production manifests and care labels. Use high contrast for headings and muted charcoal for body text to maintain an approachable, editorial rhythm.

## Layout & Spacing
The design system employs a **Fixed Grid** on desktop (1280px max-width) and a **Fluid Grid** on mobile. The spacing rhythm is strictly 8px-based to ensure visual alignment across technical tables and configurators. 

Margins are generous to prevent the "cluttered shop" feel; instead, it should feel like a well-organized studio. Horizontal dividers should utilize a 1px dashed stroke (2px dash, 2px gap) to mimic a running stitch, creating a distinct vertical rhythm between sections.

## Elevation & Depth
Depth is achieved through **Tonal Layering** rather than shadows. Surfaces do not "float"; they are stacked. 
- **Level 0 (Base):** Raw Cotton (#F9F7F2).
- **Level 1 (Cards/Panels):** Cream (#FFFBF2) with a 1px solid border in Indigo (at 10% opacity) or a dashed "stitch" border.
- **Interactions:** When an element is hovered, it does not lift with a shadow; instead, it gains a subtle interior "inset" border or a color shift to Rust.
- **Textures:** Large background areas should feature a low-opacity (.03) denim weave SVG pattern to add tactile grit without interfering with legibility.

## Shapes
The shape language is primarily rectangular and "clipped." While a slight 4px radius (Soft) is used for overall friendliness, interactive elements like "Leather Tags" should feature a 0px radius on three sides and a clipped/angled corner on one side to mimic a physical hangtag. Copper rivet icons are the only perfectly circular elements, used for radio buttons and focal points.

## Components

### Navigation Bar
The header is a fixed-top element with a solid Indigo bottom border. It features a "Current Workshop" location detector in the top-left (Label-MD) and high-contrast navigation links. The "Cart" icon is replaced with a "Loom" or "Bundle" icon in Copper.

### Fabric Swatch Cards
Product cards feature a 1:1 aspect ratio image with a 1px "stitch" border. Below the image, a small "Leather Tag" badge (Tertiary color) displays the fabric weight (e.g., "14oz"). Title text is Headline-MD in Indigo.

### Denim Configurator
A vertical multi-step component. Each step (Fit, Wash, Hardware) is housed in a Cream panel. Active selections are marked with a "Copper Rivet" (a 12px circle with a metallic gradient and a center dot). 

### Price Breakdown Table
A transparent list with no outer borders. Rows are separated by dashed horizontal lines. Label-MD is used for descriptions (e.g., "Organic Indigo Dye") and Body-MD for prices, aligned to a right-hand column for a "manifest" look.

### Production Status Stepper
A horizontal line using the dashed stitch style. Completed steps are Deep Indigo with a "V" stitch icon; the current step is a pulsing Copper Rivet; upcoming steps are muted Grey.

### Artisan Profile Snippets
A horizontal card containing a circular "Portrait" of the maker. The background of the snippet uses the Cream tone, with a "Handmade in [Location]" label in the Stitch-Label style. All text is centered to feel like a premium garment interior label.