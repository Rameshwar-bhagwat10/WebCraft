-- ============================================
-- WEBCRAFT DEMO PROJECTS
-- Sample data for the Work/Projects section
-- ============================================
-- Run this in Supabase SQL Editor AFTER 005 and 006 migrations
-- ============================================

-- Insert demo projects
INSERT INTO projects (
  title,
  slug,
  short_description,
  full_description,
  category,
  tech_stack,
  status,
  is_featured,
  priority,
  display_order,
  live_url,
  github_url,
  meta_title,
  meta_description
) VALUES 
-- Project 1: FreshBite Restaurant
(
  'FreshBite Restaurant',
  'freshbite-restaurant',
  'A modern restaurant website with online ordering that increased takeout orders by 40%.',
  'FreshBite needed a website that showcased their farm-to-table philosophy while making it easy for customers to browse the menu and place orders online.

**The Challenge**
Their existing website was outdated, slow on mobile, and had no online ordering capability. Customers were calling in orders, leading to errors and long wait times.

**Our Solution**
We built a fast, mobile-first website with an integrated ordering system. The design emphasizes their fresh ingredients with clean photography and intuitive navigation.

**Key Features**
• Mobile-optimized menu with filtering
• Online ordering with real-time availability
• Location finder with directions
• Reservation system integration
• SEO-optimized for local search

**Results**
Online orders increased by 40% in the first three months. Phone orders decreased significantly, freeing up staff time. The site loads in under 2 seconds on mobile.',
  'website',
  '["Next.js", "Tailwind CSS", "Stripe", "Supabase"]',
  'published',
  true,
  90,
  1,
  'https://freshbite-demo.vercel.app',
  NULL,
  'FreshBite Restaurant - Modern Restaurant Website',
  'A case study on building a high-performance restaurant website with online ordering capabilities.'
),

-- Project 2: TaskFlow Project Manager
(
  'TaskFlow Project Manager',
  'taskflow-app',
  'A project management web app that helped a consulting firm reduce project delays by 25%.',
  'A mid-size consulting firm needed a custom project management tool that matched their unique workflow, which off-the-shelf solutions could not accommodate.

**The Challenge**
The team was using spreadsheets and email to track projects, leading to missed deadlines, duplicated work, and poor visibility into project status.

**Our Solution**
We built a custom web application with real-time collaboration, automated status updates, and a dashboard that gives leadership instant visibility into all active projects.

**Key Features**
• Real-time project status tracking
• Automated deadline reminders
• Team workload visualization
• Client portal for status updates
• Integration with existing calendar system

**Results**
Project delays decreased by 25% within six months. Team members report spending less time on status meetings and more time on actual work.',
  'webapp',
  '["React", "Node.js", "PostgreSQL", "Socket.io", "Redis"]',
  'published',
  true,
  85,
  2,
  NULL,
  'https://github.com/webcraft/taskflow-demo',
  'TaskFlow - Custom Project Management Solution',
  'How we built a custom project management app that reduced delays by 25%.'
),

-- Project 3: GreenLeaf Plant Shop
(
  'GreenLeaf Plant Shop',
  'greenleaf-ecommerce',
  'An e-commerce platform for a plant nursery that doubled their online revenue.',
  'GreenLeaf wanted to expand beyond their local market by selling plants online, but needed a platform that could handle the complexity of live plant inventory.

**The Challenge**
Plants have unique inventory challenges—seasonal availability, size variations, and care requirements. Generic e-commerce platforms could not handle these needs well.

**Our Solution**
We created a custom e-commerce solution with dynamic inventory management, plant care guides integrated into product pages, and a shipping calculator that accounts for plant fragility.

**Key Features**
• Dynamic inventory with size/variant support
• Integrated plant care guides
• Smart shipping calculator
• Seasonal availability indicators
• Customer plant collection tracker

**Results**
Online revenue doubled in the first year. Customer satisfaction improved due to better plant care information and accurate delivery expectations.',
  'ecommerce',
  '["Next.js", "Shopify API", "Tailwind CSS", "Algolia"]',
  'published',
  true,
  80,
  3,
  'https://greenleaf-demo.vercel.app',
  NULL,
  'GreenLeaf - E-commerce for Plant Nursery',
  'Building a specialized e-commerce platform that doubled online revenue for a plant nursery.'
),

-- Project 4: HealthTrack Analytics Dashboard
(
  'HealthTrack Analytics',
  'healthtrack-dashboard',
  'A healthcare analytics dashboard that reduced report generation time from hours to minutes.',
  'A regional healthcare provider needed a way to visualize patient data and operational metrics without relying on manual spreadsheet reports.

**The Challenge**
Leadership spent hours each week compiling reports from multiple systems. Data was often outdated by the time decisions were made.

**Our Solution**
We built a real-time dashboard that pulls data from their existing systems and presents it in clear, actionable visualizations with role-based access control.

**Key Features**
• Real-time data synchronization
• Customizable dashboard views
• Automated report generation
• Role-based access control
• HIPAA-compliant data handling

**Results**
Report generation time dropped from 4+ hours to under 5 minutes. Leadership now has real-time visibility into key metrics for faster decision-making.',
  'dashboard',
  '["React", "D3.js", "Node.js", "PostgreSQL", "AWS"]',
  'published',
  false,
  70,
  4,
  NULL,
  NULL,
  'HealthTrack - Healthcare Analytics Dashboard',
  'A HIPAA-compliant analytics dashboard that transformed healthcare reporting.'
),

-- Project 5: TechStart Landing Page
(
  'TechStart Landing Page',
  'techstart-landing',
  'A high-converting landing page for a SaaS startup that achieved 12% conversion rate.',
  'TechStart, an early-stage SaaS company, needed a landing page that would effectively communicate their value proposition and convert visitors into trial signups.

**The Challenge**
Their existing page had a 2% conversion rate and failed to clearly explain what the product does. Visitors were bouncing within seconds.

**Our Solution**
We designed a clean, focused landing page with clear messaging, social proof, and a streamlined signup flow. A/B testing helped optimize every element.

**Key Features**
• Clear value proposition above the fold
• Interactive product demo
• Customer testimonials with video
• Optimized signup flow
• A/B tested CTAs and copy

**Results**
Conversion rate increased from 2% to 12%. The page now generates 6x more trial signups with the same traffic.',
  'landing',
  '["Next.js", "Framer Motion", "Tailwind CSS", "Vercel Analytics"]',
  'published',
  false,
  65,
  5,
  'https://techstart-demo.vercel.app',
  NULL,
  'TechStart - High-Converting SaaS Landing Page',
  'How we built a landing page that achieved 12% conversion rate for a SaaS startup.'
),

-- Project 6: FitLife Mobile App
(
  'FitLife Fitness App',
  'fitlife-mobile',
  'A cross-platform fitness app with workout tracking and social features.',
  'FitLife wanted to create a mobile app that would help users track their fitness journey while building a community of like-minded individuals.

**The Challenge**
Existing fitness apps were either too complex or lacked social features. Users wanted something simple yet engaging that would keep them motivated.

**Our Solution**
We built a cross-platform mobile app using React Native, featuring intuitive workout tracking, progress visualization, and social challenges to keep users engaged.

**Key Features**
• Custom workout builder
• Progress tracking with charts
• Social challenges and leaderboards
• Integration with wearables
• Offline mode support

**Results**
The app achieved 50,000 downloads in the first month with a 4.8-star rating. Daily active users consistently engage with social features.',
  'mobile',
  '["React Native", "Firebase", "Node.js", "HealthKit", "Google Fit"]',
  'published',
  false,
  60,
  6,
  NULL,
  NULL,
  'FitLife - Cross-Platform Fitness App',
  'Building a fitness app with 50,000 downloads and 4.8-star rating.'
);

-- ============================================
-- VERIFY INSERTION
-- ============================================
-- Run this to verify projects were inserted:
-- SELECT id, title, slug, status, is_featured, priority FROM projects ORDER BY display_order;

