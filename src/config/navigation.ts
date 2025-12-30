/**
 * Navigation Configuration
 * Centralized navigation structure for the entire application
 * Easy to modify without touching component code
 */

export type NavItem = {
  label: string;
  href: string;
  /** External link opens in new tab */
  external?: boolean;
};

export type FooterLinkGroup = {
  title: string;
  links: NavItem[];
};

/**
 * Main navigation items
 * Used in header navbar
 */
export const mainNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
];

/**
 * Footer navigation groups
 */
export const footerNavGroups: FooterLinkGroup[] = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Work', href: '/work' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Web Development', href: '/services#web-development' },
      { label: 'UI/UX Design', href: '/services#design' },
      { label: 'E-commerce', href: '/services#ecommerce' },
      { label: 'Consulting', href: '/services#consulting' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Case Studies', href: '/work' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
];

/**
 * Legal links for footer
 */
export const legalLinks: NavItem[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
];

/**
 * CTA configuration
 */
export const ctaConfig = {
  label: 'Free Consultation',
  href: '/contact',
} as const;
