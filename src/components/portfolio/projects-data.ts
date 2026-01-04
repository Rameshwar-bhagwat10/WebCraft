/**
 * Portfolio Projects Data
 * Real projects by Rameshwar Bhagwat / WebCraft
 *
 * In production, this data comes from Supabase.
 * This file serves as fallback/static data.
 */

export interface ProjectData {
  /** URL-friendly identifier */
  slug: string;
  /** Project display name */
  title: string;
  /** One-line description (problem/solution focused) */
  shortDescription: string;
  /** Project category */
  type: 'Website' | 'Web App' | 'Mobile App' | 'Dashboard' | 'Landing Page';
  /** Thumbnail image path */
  thumbnail: string;
  /** Full project overview */
  overview: string;
  /** The problem being solved */
  problem: string;
  /** How we approached the solution */
  solution: string;
  /** Key features delivered */
  features: string[];
  /** Business outcome (realistic) */
  outcome: string;
  /** Tech stack used */
  techStack: string[];
  /** Featured image for detail page */
  featuredImage: string;
  /** Live URL if available */
  liveUrl?: string;
}

export const projectsData: ProjectData[] = [
  {
    slug: 'webcraft-agency',
    title: 'WebCraft Agency Platform',
    shortDescription:
      'A production-grade web development agency platform with high performance, security, and SEO optimization.',
    type: 'Web App',
    thumbnail: '/projects/webcraft-thumb.jpg',
    overview:
      'WebCraft is a comprehensive web development agency platform designed to showcase services, projects, pricing, and capture client leads efficiently.',
    problem:
      'Building a professional agency presence requires more than just a website—it needs enterprise-grade security, blazing-fast performance, and seamless lead capture while maintaining excellent SEO and accessibility standards.',
    solution:
      'Built a full-stack platform using cutting-edge technologies including Next.js 15 with App Router, React 19, and Supabase for the backend. Implemented comprehensive security measures including Row Level Security, rate limiting, and CAPTCHA protection.',
    features: [
      'High-performance server-rendered pages with optimized Core Web Vitals',
      'Secure backend with Supabase RLS and rate limiting',
      'Project showcase with optimized images and featured projects',
      'Contact forms with CAPTCHA, honeypot, and idempotency protection',
      'Complete SEO implementation (Metadata, OG images, JSON-LD, Sitemap)',
      'WCAG 2.2 AA accessibility compliance',
      'Production-grade error handling and monitoring',
    ],
    outcome:
      'Achieved a 9.8/10 production audit score with optimized Core Web Vitals architecture. The platform provides a secure, scalable foundation ready to handle real client traffic and leads.',
    techStack: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Edge Functions'],
    featuredImage: '/projects/webcraft-featured.jpg',
    liveUrl: 'https://webcraftx.vercel.app',
  },
  {
    slug: 'kirana-store-management',
    title: 'Local Kirana Store Management',
    shortDescription:
      'A web application for local kirana stores to manage products, orders, and customers digitally.',
    type: 'Web App',
    thumbnail: '/projects/kirana-thumb.jpg',
    overview:
      'A comprehensive web application built to help a local kirana store transition from traditional offline operations to a modern digital system.',
    problem:
      'Local kirana stores often struggle with manual record-keeping, order tracking, and inventory management. The store owner needed a simple yet powerful solution to digitize their business operations without a steep learning curve.',
    solution:
      'Developed a user-friendly web application with intuitive product management, order tracking, and customer management features. The system is designed for ease of use on mobile devices, allowing the store owner to manage operations on the go.',
    features: [
      'Product listing with categories and search functionality',
      'Customer order management and tracking',
      'Simple admin dashboard for daily operations',
      'Responsive design optimized for mobile users',
      'Secure backend APIs with proper authentication',
    ],
    outcome:
      'Successfully digitized the store\'s operations, improving order tracking accuracy and reducing manual record-keeping errors. The store now has a digital presence and can serve customers more efficiently.',
    techStack: ['Next.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    featuredImage: '/projects/kirana-featured.jpg',
  },
  {
    slug: 'freelancehub-platform',
    title: 'FreelanceHub Platform',
    shortDescription:
      'An online freelancing platform where clients post jobs and freelancers can apply and manage work opportunities.',
    type: 'Web App',
    thumbnail: '/projects/freelancehub-thumb.jpg',
    overview:
      'FreelanceHub is a comprehensive job marketplace platform connecting clients with skilled freelancers for various project needs.',
    problem:
      'Creating a marketplace platform requires handling complex workflows—job posting, applications, user profiles, messaging, and secure authentication—while maintaining scalability for future growth.',
    solution:
      'Built a full-featured freelancing platform with separate flows for clients and freelancers. Implemented secure authentication, job management, and a scalable backend architecture designed to handle growing user bases.',
    features: [
      'Job posting and browsing with filters and search',
      'Comprehensive freelancer profiles with skills and portfolio',
      'Client–freelancer interaction and communication flow',
      'Secure authentication with role-based access',
      'Scalable backend structure for future expansion',
    ],
    outcome:
      'Demonstrates marketplace-level architecture with real-world workflows. The platform showcases expertise in building complex multi-user applications with scalable backend models.',
    techStack: ['Next.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    featuredImage: '/projects/freelancehub-featured.jpg',
  },
  {
    slug: 'developer-portfolio',
    title: 'Developer Portfolio',
    shortDescription:
      'A modern, responsive portfolio website showcasing projects, skills, and experience with clean UI and smooth animations.',
    type: 'Landing Page',
    thumbnail: '/projects/portfolio-thumb.jpg',
    overview:
      'A professionally designed portfolio website built to establish a strong personal brand and online presence for developers.',
    problem:
      'Standing out in the competitive web development market requires more than just skills—it needs a professional online presence that effectively showcases work, expertise, and personality.',
    solution:
      'Created a modern single-page portfolio with clean design, smooth animations, and optimized performance. The site effectively communicates skills, projects, and experience while maintaining excellent SEO and accessibility standards.',
    features: [
      'Clean single-page layout with smooth navigation',
      'Responsive sections for About, Projects, Skills, and Contact',
      'SEO-friendly structure with proper metadata',
      'Performance-optimized UI with fast load times',
      'Modern design with subtle animations',
    ],
    outcome:
      'Established a strong personal brand with a professional online presence. The portfolio serves as the foundation for agency branding and client acquisition.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    featuredImage: '/projects/portfolio-featured.jpg',
  },
];

/**
 * Get a single project by slug
 */
export function getProjectBySlug(slug: string): ProjectData | undefined {
  return projectsData.find((project) => project.slug === slug);
}

/**
 * Get all project slugs for static generation
 */
export function getAllProjectSlugs(): string[] {
  return projectsData.map((project) => project.slug);
}
