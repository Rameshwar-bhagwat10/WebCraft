/**
 * Services Data
 * Centralized service information for consistency across components
 */

export interface ServiceData {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  whoItsFor: string[];
  whatYouGet: string[];
  outcome: string;
}

export const servicesData: ServiceData[] = [
  {
    id: 'business-websites',
    title: 'Business Websites',
    shortDescription:
      'Professional websites that represent your brand and convert visitors into customers.',
    description:
      'Your website is often the first impression potential customers have of your business. We build fast, professional websites that clearly communicate your value and guide visitors toward taking action.',
    whoItsFor: [
      'Small to medium businesses needing an online presence',
      'Companies with outdated websites that need a refresh',
      'Startups looking to establish credibility',
    ],
    whatYouGet: [
      'Custom design tailored to your brand',
      'Mobile-responsive layout that works on all devices',
      'SEO-optimized structure for better search visibility',
      'Fast loading speeds for better user experience',
      'Easy-to-update content management',
    ],
    outcome:
      'A professional online presence that builds trust with visitors and turns them into customers.',
  },
  {
    id: 'web-applications',
    title: 'Web Applications',
    shortDescription:
      'Custom web apps that streamline your operations and solve real business problems.',
    description:
      'When off-the-shelf software does not fit your needs, a custom web application can transform how your business operates. We build tools that automate tasks, improve efficiency, and give you a competitive edge.',
    whoItsFor: [
      'Businesses with unique workflow requirements',
      'Teams drowning in spreadsheets and manual processes',
      'Companies ready to digitize their operations',
    ],
    whatYouGet: [
      'Custom-built solution designed for your specific needs',
      'Intuitive interface your team will actually use',
      'Secure data handling and user authentication',
      'Integration with your existing tools and systems',
      'Scalable architecture that grows with your business',
    ],
    outcome:
      'A powerful tool that saves time, reduces errors, and helps your team work more efficiently.',
  },
  {
    id: 'mobile-apps',
    title: 'Mobile Apps',
    shortDescription:
      'Native and cross-platform apps that keep your customers engaged on any device.',
    description:
      'Meet your customers where they are—on their phones. We build mobile applications that provide seamless experiences, whether your users are on iOS, Android, or both.',
    whoItsFor: [
      'Businesses wanting to reach customers on mobile',
      'Companies with services that benefit from on-the-go access',
      'Startups with mobile-first product ideas',
    ],
    whatYouGet: [
      'Cross-platform development for iOS and Android',
      'Native-feeling performance and interactions',
      'Offline functionality where it makes sense',
      'Push notifications to keep users engaged',
      'App store submission and launch support',
    ],
    outcome:
      'A mobile presence that keeps your customers connected and engaged with your business.',
  },
  {
    id: 'ui-dashboards',
    title: 'UI & Dashboards',
    shortDescription:
      'Intuitive interfaces and data dashboards that make complex information actionable.',
    description:
      'Data is only valuable if you can understand it. We design and build dashboards that turn complex information into clear insights, helping you make better decisions faster.',
    whoItsFor: [
      'Teams struggling to make sense of their data',
      'Businesses needing internal tools and admin panels',
      'Companies wanting to provide data insights to customers',
    ],
    whatYouGet: [
      'Clean, intuitive interface design',
      'Real-time data visualization',
      'Customizable views and filters',
      'Role-based access control',
      'Export and reporting capabilities',
    ],
    outcome:
      'Clear visibility into your business data, enabling faster and more informed decisions.',
  },
  {
    id: 'maintenance-support',
    title: 'Maintenance & Support',
    shortDescription:
      'Ongoing care to keep your digital products secure, fast, and up-to-date.',
    description:
      'Launching is just the beginning. We provide ongoing maintenance and support to ensure your website or application stays secure, performs well, and continues to meet your needs as your business evolves.',
    whoItsFor: [
      'Businesses with existing websites needing regular updates',
      'Companies without in-house technical resources',
      'Anyone who wants peace of mind about their digital presence',
    ],
    whatYouGet: [
      'Regular security updates and patches',
      'Performance monitoring and optimization',
      'Content updates and minor feature additions',
      'Technical support when issues arise',
      'Regular backups and disaster recovery',
    ],
    outcome:
      'A reliable digital presence that stays secure and performs well without demanding your attention.',
  },
];
