/**
 * Portfolio Projects Data
 * Centralized project information for consistency
 *
 * Note: These are demo projects presented honestly.
 * In production, this data could come from a CMS.
 */

export interface ProjectData {
  /** URL-friendly identifier */
  slug: string;
  /** Project display name */
  title: string;
  /** One-line description (problem/solution focused) */
  shortDescription: string;
  /** Project category */
  type: 'Website' | 'Web App' | 'Mobile App' | 'Dashboard';
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
  /** Tech stack used (optional, brief) */
  techStack?: string[];
  /** Featured image for detail page */
  featuredImage: string;
}

export const projectsData: ProjectData[] = [
  {
    slug: 'freshbite-restaurant',
    title: 'FreshBite Restaurant',
    shortDescription:
      'A modern restaurant website with online ordering that increased takeout orders by 40%.',
    type: 'Website',
    thumbnail: '/projects/freshbite-thumb.jpg',
    overview:
      'FreshBite needed a website that showcased their farm-to-table philosophy while making it easy for customers to browse the menu and place orders online.',
    problem:
      'Their existing website was outdated, slow on mobile, and had no online ordering capability. Customers were calling in orders, leading to errors and long wait times.',
    solution:
      'We built a fast, mobile-first website with an integrated ordering system. The design emphasizes their fresh ingredients with clean photography and intuitive navigation.',
    features: [
      'Mobile-optimized menu with filtering',
      'Online ordering with real-time availability',
      'Location finder with directions',
      'Reservation system integration',
      'SEO-optimized for local search',
    ],
    outcome:
      'Online orders increased by 40% in the first three months. Phone orders decreased significantly, freeing up staff time. The site loads in under 2 seconds on mobile.',
    techStack: ['Next.js', 'Tailwind CSS', 'Stripe'],
    featuredImage: '/projects/freshbite-featured.jpg',
  },
  {
    slug: 'taskflow-app',
    title: 'TaskFlow Project Manager',
    shortDescription:
      'A project management web app that helped a consulting firm reduce project delays by 25%.',
    type: 'Web App',
    thumbnail: '/projects/taskflow-thumb.jpg',
    overview:
      'A mid-size consulting firm needed a custom project management tool that matched their unique workflow, which off-the-shelf solutions could not accommodate.',
    problem:
      'The team was using spreadsheets and email to track projects, leading to missed deadlines, duplicated work, and poor visibility into project status.',
    solution:
      'We built a custom web application with real-time collaboration, automated status updates, and a dashboard that gives leadership instant visibility into all active projects.',
    features: [
      'Real-time project status tracking',
      'Automated deadline reminders',
      'Team workload visualization',
      'Client portal for status updates',
      'Integration with existing calendar system',
    ],
    outcome:
      'Project delays decreased by 25% within six months. Team members report spending less time on status meetings and more time on actual work.',
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    featuredImage: '/projects/taskflow-featured.jpg',
  },
  {
    slug: 'greenleaf-ecommerce',
    title: 'GreenLeaf Plant Shop',
    shortDescription:
      'An e-commerce platform for a plant nursery that doubled their online revenue.',
    type: 'Website',
    thumbnail: '/projects/greenleaf-thumb.jpg',
    overview:
      'GreenLeaf wanted to expand beyond their local market by selling plants online, but needed a platform that could handle the complexity of live plant inventory.',
    problem:
      'Plants have unique inventory challenges—seasonal availability, size variations, and care requirements. Generic e-commerce platforms could not handle these needs well.',
    solution:
      'We created a custom e-commerce solution with dynamic inventory management, plant care guides integrated into product pages, and a shipping calculator that accounts for plant fragility.',
    features: [
      'Dynamic inventory with size/variant support',
      'Integrated plant care guides',
      'Smart shipping calculator',
      'Seasonal availability indicators',
      'Customer plant collection tracker',
    ],
    outcome:
      'Online revenue doubled in the first year. Customer satisfaction improved due to better plant care information and accurate delivery expectations.',
    techStack: ['Next.js', 'Shopify API', 'Tailwind CSS'],
    featuredImage: '/projects/greenleaf-featured.jpg',
  },
  {
    slug: 'healthtrack-dashboard',
    title: 'HealthTrack Analytics',
    shortDescription:
      'A healthcare analytics dashboard that reduced report generation time from hours to minutes.',
    type: 'Dashboard',
    thumbnail: '/projects/healthtrack-thumb.jpg',
    overview:
      'A regional healthcare provider needed a way to visualize patient data and operational metrics without relying on manual spreadsheet reports.',
    problem:
      'Leadership spent hours each week compiling reports from multiple systems. Data was often outdated by the time decisions were made.',
    solution:
      'We built a real-time dashboard that pulls data from their existing systems and presents it in clear, actionable visualizations with role-based access control.',
    features: [
      'Real-time data synchronization',
      'Customizable dashboard views',
      'Automated report generation',
      'Role-based access control',
      'HIPAA-compliant data handling',
    ],
    outcome:
      'Report generation time dropped from 4+ hours to under 5 minutes. Leadership now has real-time visibility into key metrics for faster decision-making.',
    techStack: ['React', 'D3.js', 'Node.js', 'PostgreSQL'],
    featuredImage: '/projects/healthtrack-featured.jpg',
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
