/**
 * Crisp SVG Vector Icon Suite for Vibez Browser.
 * High-fidelity, scalable SVG vectors matching modern browser aesthetics.
 */

const ICONS = {
  // Navigation & Shell
  back: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
  forward: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
  reload: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/></svg>`,
  stop: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  close: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  lock: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
  shield: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  shieldCheck: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>`,
  split: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="3" x2="12" y2="21"></line></svg>`,
  swap: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>`,
  search: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  ai: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`,
  library: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  automation: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  focus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  devtools: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  bookmark: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`,
  star: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  share: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>`,
  wallet: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`,
  gift: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>`,
  appsGrid: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="4" cy="4" r="2"></circle><circle cx="12" cy="4" r="2"></circle><circle cx="20" cy="4" r="2"></circle><circle cx="4" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="20" cy="12" r="2"></circle><circle cx="4" cy="20" r="2"></circle><circle cx="12" cy="20" r="2"></circle><circle cx="20" cy="20" r="2"></circle></svg>`,
  dotsVertical: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="19" r="2"></circle></svg>`,
  camera: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
  mic: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`,
  eye: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  settingsGear: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  chatBubble: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  usersGroup: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,

  // Window Controls
  windowMin: `<svg width="10" height="10" viewBox="0 0 10 10"><line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" stroke-width="1.2"/></svg>`,
  windowMax: `<svg width="10" height="10" viewBox="0 0 10 10"><rect x="0.6" y="0.6" width="8.8" height="8.8" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>`,
  windowClose: `<svg width="10" height="10" viewBox="0 0 10 10"><line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" stroke-width="1.2"/><line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1.2"/></svg>`,

  // 3D Sphere Emblem / Logo
  vibezOrb: `
    <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sphereGrad" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stop-color="#FF7575"/>
          <stop offset="45%" stop-color="#EB5757"/>
          <stop offset="85%" stop-color="#C53030"/>
          <stop offset="100%" stop-color="#8E1D1D"/>
        </radialGradient>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="60%" stop-color="#F1F5F9"/>
          <stop offset="100%" stop-color="#CBD5E1"/>
        </linearGradient>
        <filter id="orbShadow" x="-20%" y="-10%" width="140%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#EB5757" flood-opacity="0.35"/>
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.4"/>
        </filter>
      </defs>
      <!-- Base 3D Sphere -->
      <circle cx="50" cy="50" r="42" fill="url(#sphereGrad)" filter="url(#orbShadow)"/>
      <!-- Inner Gloss Curve Ring -->
      <path d="M22 56 C28 42, 68 40, 78 54 C74 64, 30 68, 22 56 Z" fill="url(#ringGrad)"/>
      <ellipse cx="49" cy="52" rx="14" ry="7" fill="#EB5757"/>
      <!-- Top Specular Highlight -->
      <ellipse cx="40" cy="24" rx="12" ry="5" fill="#FFFFFF" opacity="0.45" transform="rotate(-15 40 24)"/>
    </svg>
  `,

  // Brand Logos
  gmail: `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M2 6.5C2 4.57 3.57 3 5.5 3h13C20.43 3 22 4.57 22 6.5v11c0 1.93-1.57 3.5-3.5 3.5h-13C3.57 21 2 19.43 2 17.5v-11z" fill="#FFFFFF"/>
      <path d="M2 6.5L12 13l10-6.5V17.5c0 1.93-1.57 3.5-3.5 3.5H18V9.5L12 14.5 6 9.5V21H5.5C3.57 21 2 19.43 2 17.5V6.5z" fill="#EA4335"/>
      <path d="M2 6.5c0-.98.42-1.87 1.09-2.5L6 6.5v14.5H5.5C3.57 21 2 19.43 2 17.5V6.5z" fill="#C5221F"/>
      <path d="M22 6.5c0-.98-.42-1.87-1.09-2.5L18 6.5v14.5h.5c1.93 0 3.5-1.57 3.5-3.5V6.5z" fill="#4285F4"/>
      <path d="M18 6.5L12 11 6 6.5 3.09 4C3.72 3.39 4.57 3 5.5 3h13c.93 0 1.78.39 2.41 1L18 6.5z" fill="#FBBC04"/>
      <path d="M6 21V9.5L2 6.5V17.5C2 19.43 3.57 21 5.5 21H6z" fill="#34A853"/>
    </svg>
  `,
  instagram: `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="igGrad" cx="30%" cy="105%" r="115%">
          <stop offset="0%" stop-color="#FFD600"/>
          <stop offset="50%" stop-color="#FF0069"/>
          <stop offset="100%" stop-color="#7638FA"/>
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#igGrad)"/>
      <rect x="5.5" y="5.5" width="13" height="13" rx="4" stroke="#FFFFFF" stroke-width="1.8" fill="none"/>
      <circle cx="12" cy="12" r="3.2" stroke="#FFFFFF" stroke-width="1.8" fill="none"/>
      <circle cx="15.8" cy="8.2" r="0.9" fill="#FFFFFF"/>
    </svg>
  `,
  discord: `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="12" fill="#5865F2"/>
      <path d="M17.5 7.2A13.8 13.8 0 0 0 14.2 6.2a.2.2 0 0 0-.2.1 9.6 9.6 0 0 0-.4.9 12.8 12.8 0 0 0-3.2 0 9.8 9.8 0 0 0-.4-.9.2.2 0 0 0-.2-.1 13.8 13.8 0 0 0-3.3 1 .2.2 0 0 0-.1.1C4.4 10.2 3.8 13.1 4.1 16a.2.2 0 0 0 .1.2 13.9 13.9 0 0 0 4.2 2.1.2.2 0 0 0 .2-.1c.3-.5.7-1 1-1.5a.2.2 0 0 0-.1-.3 9.1 9.1 0 0 1-1.3-.6.2.2 0 0 1 0-.3c.1-.1.2-.1.3-.2a9.9 9.9 0 0 0 7.2 0c.1.1.2.1.3.2a.2.2 0 0 1 0 .3 9.2 9.2 0 0 1-1.3.6.2.2 0 0 0-.1.3c.3.5.7 1 1 1.5a.2.2 0 0 0 .2.1 13.9 13.9 0 0 0 4.2-2.1.2.2 0 0 0 .1-.2c.4-3.4-.6-6.3-2.4-8.8a.2.2 0 0 0-.1-.1zM9.5 14.1c-.8 0-1.4-.7-1.4-1.6 0-.9.6-1.6 1.4-1.6.8 0 1.4.7 1.4 1.6 0 .9-.6 1.6-1.4 1.6zm5 0c-.8 0-1.4-.7-1.4-1.6 0-.9.6-1.6 1.4-1.6.8 0 1.4.7 1.4 1.6 0 .9-.6 1.6-1.4 1.6z" fill="#FFFFFF"/>
    </svg>
  `,
  telegram: `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#29B6F6"/>
      <path d="M5.5 11.5l11-4.5c.5-.2 1 .1.8.7l-1.9 8.9c-.1.6-.5.7-1 .4l-2.7-2-1.3 1.3c-.2.2-.3.3-.6.3l.2-2.7 4.9-4.4c.2-.2 0-.3-.3-.1l-6.1 3.8-2.6-.8c-.6-.2-.6-.6.1-.9z" fill="#FFFFFF"/>
    </svg>
  `,
  facebook: `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#1877F2"/>
      <path d="M13.5 18v-5.5h1.8l.3-2.1h-2.1V9.1c0-.6.2-1 1-1h1.1V6.2c-.2 0-.9-.1-1.7-.1-1.7 0-2.8 1-2.8 2.9v1.4H9.3v2.1h1.8V18h2.4z" fill="#FFFFFF"/>
    </svg>
  `,
  linkedin: `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#0A66C2"/>
      <path d="M8.5 16.5v-6H6.5v6h2zm-1-6.9c.7 0 1.1-.5 1.1-1s-.4-1-1.1-1c-.7 0-1.1.5-1.1 1s.4 1 1.1 1zm9 6.9v-3.4c0-1.8-1-2.6-2.3-2.6-1 0-1.5.6-1.8 1v-.9H10.4c.1.6 0 6 0 6h2v-3.3c0-.2 0-.4.1-.5.2-.4.6-.8 1.2-.8.8 0 1.2.6 1.2 1.6v3h2.1z" fill="#FFFFFF"/>
    </svg>
  `,
  behance: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#0057FF"/>
      <path d="M6 8h3.3c1.5 0 2.2.7 2.2 1.6 0 .8-.5 1.2-1.1 1.4.8.2 1.4.8 1.4 1.7 0 1.2-.9 1.9-2.5 1.9H6V8zm1.8 2.6h1.3c.6 0 1-.2 1-.7 0-.5-.4-.7-1-.7H7.8v1.4zm0 2.6h1.5c.7 0 1.1-.3 1.1-.8 0-.5-.4-.8-1.1-.8H7.8v1.6zm7.2-2.3c.1-.8.7-1.4 1.7-1.4 1.1 0 1.7.7 1.7 1.4H15zm3.4.8c0-1.8-1.2-2.9-2.9-2.9s-3 1.2-3 2.9c0 1.8 1.2 2.9 3.1 2.9 1.3 0 2.3-.6 2.7-1.6h-1.5c-.2.4-.6.6-1.2.6-.9 0-1.4-.5-1.5-1.2h4.3v-.7zm-3.6-2.8h2.4v-.6h-2.4v.6z" fill="#FFFFFF"/>
    </svg>
  `,
  dribbble: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#EA4C89"/>
      <circle cx="12" cy="12" r="8" stroke="#FFFFFF" stroke-width="1.3" fill="none"/>
      <path d="M5.5 14.5c3.2-.4 6.7-.4 9.5.8" stroke="#FFFFFF" stroke-width="1.3"/>
      <path d="M8.5 5.5c2.4 2.8 4.2 6.1 5.2 9.8" stroke="#FFFFFF" stroke-width="1.3"/>
      <path d="M6 9.2c3.5 1.2 7.3 1.4 11.2.4" stroke="#FFFFFF" stroke-width="1.3"/>
    </svg>
  `,
  figma: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#1E1E1E"/>
      <path d="M9.5 8.5a2.5 2.5 0 0 1 2.5-2.5h2.5v5h-2.5a2.5 2.5 0 0 1-2.5-2.5z" fill="#F24E1E"/>
      <path d="M12 6h2.5a2.5 2.5 0 0 1 0 5H12V6z" fill="#FF7262"/>
      <path d="M9.5 12a2.5 2.5 0 0 1 2.5-2.5H12v5h-2.5A2.5 2.5 0 0 1 9.5 12z" fill="#A259FF"/>
      <path d="M12 12a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z" fill="#1ABCFE"/>
      <path d="M9.5 15.5a2.5 2.5 0 0 1 2.5-2.5v2.5a2.5 2.5 0 0 1-2.5 2.5 2.5 2.5 0 0 1 0-5z" fill="#0ACF83"/>
    </svg>
  `,
  pinterest: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#E60023"/>
      <path d="M12 5C8.1 5 5 8.1 5 12c0 2.9 1.8 5.5 4.3 6.5-.1-.6-.1-1.4.1-2 .2-.7 1.1-4.7 1.1-4.7s-.3-.6-.3-1.4c0-1.3.8-2.3 1.7-2.3.8 0 1.2.6 1.2 1.3 0 .8-.5 2-.8 3.1-.2 1 .5 1.7 1.4 1.7 1.7 0 2.9-2.2 2.9-4.8 0-2-1.3-3.5-3.8-3.5-2.8 0-4.5 2.1-4.5 4.4 0 .8.3 1.7.7 2.1.1.1.1.2 0 .4l-.3 1.1c-.1.2-.2.2-.4.1-1.3-.6-1.9-2.2-1.9-3.6 0-2.6 2.3-5.8 6.6-5.8 3.6 0 5.9 2.6 5.9 5.3 0 3.7-2 6.4-5 6.4-1 0-1.9-.5-2.2-1.1l-.6 2.3c-.2.8-.8 1.8-1.2 2.4.9.3 1.9.4 2.9.4 3.9 0 7-3.1 7-7s-3.1-7-7-7z" fill="#FFFFFF"/>
    </svg>
  `,
  snapchat: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#FFFC00"/>
      <path d="M12 6.5c-2.3 0-3.6 1.8-3.6 3.6 0 .8.3 1.5.5 1.8-.1.2-.4.4-.8.4-.3 0-.5-.1-.7-.2-.1 0-.2.1-.2.2 0 .4.4.9 1.1 1 .1.4-.1.8-.3 1.2-.2.4-.6.6-1.1.7-.2 0-.3.1-.3.3 0 .2.2.4.5.5.7.2 1.3.2 2 .1.4.6 1.1 1.2 2.9 1.2 1.8 0 2.5-.6 2.9-1.2.7.1 1.3.1 2-.1.3-.1.5-.3.5-.5 0-.2-.1-.3-.3-.3-.5-.1-.9-.3-1.1-.7-.2-.4-.4-.8-.3-1.2.7-.1 1.1-.6 1.1-1 0-.1-.1-.2-.2-.2-.2.1-.4.2-.7.2-.4 0-.7-.2-.8-.4.2-.3.5-1 .5-1.8 0-1.8-1.3-3.6-3.6-3.6z" fill="#000000" stroke="#000000" stroke-width="0.3"/>
      <path d="M12 6.8c-2.1 0-3.3 1.6-3.3 3.3 0 .7.3 1.4.5 1.6-.1.2-.4.4-.7.4-.2 0-.4-.1-.5-.2 0 0-.1 0-.1.1 0 .2.3.6.8.8.1.5-.1.9-.3 1.3-.2.3-.6.5-1 .6-.1 0-.1.1-.1.1 0 .1.1.2.3.2.6.2 1.2.1 1.8.1.4.6 1.1 1 2.6 1 1.5 0 2.2-.4 2.6-1 .6 0 1.2.1 1.8-.1.2 0 .3-.1.3-.2 0 0 0-.1-.1-.1-.4-.1-.8-.3-1-.6-.2-.4-.4-.8-.3-1.3.5-.2.8-.6.8-.8 0-.1-.1-.1-.1-.1-.1.1-.3.2-.5.2-.3 0-.6-.2-.7-.4.2-.2.5-.9.5-1.6 0-1.7-1.2-3.3-3.3-3.3z" fill="#FFFFFF"/>
    </svg>
  `,
  tiktok: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#000000"/>
      <path d="M15.5 8.2c-.8-.5-1.3-1.4-1.4-2.4h-2.1v9.2c0 1.3-1.1 2.4-2.4 2.4s-2.4-1.1-2.4-2.4 1.1-2.4 2.4-2.4c.3 0 .5.1.7.2V10.6c-.2 0-.5-.1-.7-.1-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5V9.9c1 .7 2.1 1.1 3.4 1.1V8.9c-.8 0-1.5-.3-2-0.7z" fill="#25F4EE"/>
      <path d="M15.8 8c-.8-.5-1.3-1.4-1.4-2.4h-1.8v9.2c0 1.3-1.1 2.4-2.4 2.4s-2.4-1.1-2.4-2.4 1.1-2.4 2.4-2.4c.3 0 .5.1.7.2V10.8c-.2 0-.5-.1-.7-.1-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5V9.9c1 .7 2.1 1.1 3.4 1.1V9.1c-.8 0-1.6-.4-2.3-1.1z" fill="#FE2C55"/>
      <path d="M15.5 8.2c-.8-.5-1.3-1.4-1.4-2.4h-2v9.2c0 1.3-1.1 2.4-2.4 2.4s-2.4-1.1-2.4-2.4 1.1-2.4 2.4-2.4c.3 0 .5.1.7.2V10.7c-.2 0-.5-.1-.7-.1-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5V9.9c1 .7 2.1 1.1 3.4 1.1V9c-.8 0-1.6-.3-2.1-.8z" fill="#FFFFFF"/>
    </svg>
  `
};

if (typeof module !== 'undefined') {
  module.exports = { ICONS };
}
