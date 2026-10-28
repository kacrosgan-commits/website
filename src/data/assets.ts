/**
 * Local paths from ASSET_MANIFEST.json.
 * Do not point these at remote files or generated placeholders.
 */
export const assets = {
  hero: "/assets/hero/hero-orbit.webp",
  /** Decorative overlays only. Do not add unlicensed third-party photography here. */
  dashboard: {
    atmosphere: "/assets/dashboard/purple-atmosphere.svg",
    glow: "/assets/dashboard/purple-glow.svg",
  },
  aboutPhoto: "/assets/about/office-visual.webp",
  analyticsPhoto: "/assets/services/marketing-analytics.webp",
  team: [
    "/assets/team/founder-ceo/portrait.webp",
    "/assets/team/cofounder-cto/portrait.webp",
    "/assets/team/cfo/portrait.webp",
    "/assets/team/project-manager/portrait.webp",
    "/assets/team/senior-fullstack-developer/portrait.webp",
    "/assets/team/ai-engineer/portrait.webp",
    "/assets/team/mobile-app-developer/portrait.webp",
    "/assets/team/uiux-product-designer/portrait.webp",
    "/assets/team/qa-devops-engineer/portrait.webp",
  ],
  backgrounds: {
    aboutOrbit: "/assets/backgrounds/about-orbit.svg",
    servicesSpheres: "/assets/backgrounds/services-spheres.svg",
    portfolioPortal: "/assets/backgrounds/portfolio-portal.svg",
    processOrbit: "/assets/backgrounds/process-orbit.svg",
    blogPanels: "/assets/backgrounds/blog-panels.svg",
    contactGlobe: "/assets/backgrounds/contact-globe.svg",
    ctaWaves: "/assets/backgrounds/cta-waves.svg",
    footerRibbons: "/assets/backgrounds/footer-ribbons.svg",
  },
  portfolio: {
    "sample-launch-campaign": "/assets/portfolio/case-performance-ads.svg",
    "sample-search-program": "/assets/portfolio/case-seo.svg",
    "sample-social-system": "/assets/portfolio/case-social-media.svg",
    "sample-brand-platform": "/assets/portfolio/case-brand-strategy.svg",
    "sample-lead-journey": "/assets/portfolio/case-commerce.svg",
    "sample-lifecycle-notes": "/assets/portfolio/case-email-automation.svg",
  },
  blog: {
    "how-to-plan-a-custom-software-project": "/assets/blog/article-marketing-strategy.svg",
    "choosing-architecture-for-a-saas-product": "/assets/blog/article-seo.svg",
    "integrating-ai-into-existing-applications": "/assets/blog/article-paid-ads.svg",
  },
  serviceIcons: {
    "social-media-marketing": "/assets/icons/social-media.svg",
    "search-engine-optimization": "/assets/icons/seo.svg",
    "google-ads-ppc": "/assets/icons/paid-ads.svg",
    "meta-advertising": "/assets/icons/strategy.svg",
    "brand-strategy": "/assets/icons/branding.svg",
    "content-marketing": "/assets/icons/content.svg",
    "email-marketing": "/assets/icons/email.svg",
    "lead-generation": "/assets/icons/lead-generation.svg",
    "marketing-automation": "/assets/icons/automation.svg",
    "analytics-and-reporting": "/assets/icons/analytics.svg",
  },
} as const;

export type ServiceSlug = keyof typeof assets.serviceIcons;

export function serviceIcon(slug: string): string {
  return assets.serviceIcons[slug as ServiceSlug] ?? assets.serviceIcons["analytics-and-reporting"];
}

export function portfolioArt(id: string): string | undefined {
  return assets.portfolio[id as keyof typeof assets.portfolio];
}

export function blogArt(id: string): string | undefined {
  return assets.blog[id as keyof typeof assets.blog];
}

export function teamPhoto(index: number): string {
  return assets.team[index] ?? "";
}
