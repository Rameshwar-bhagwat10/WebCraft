-- ============================================
-- WEBCRAFT REAL PROJECTS
-- Replacing demo projects with actual work
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Remove demo projects (optional - uncomment if you want to remove them)
-- DELETE FROM project_images WHERE project_id IN (SELECT id FROM projects);
-- DELETE FROM projects;

-- Step 2: Insert real projects

-- PROJECT 1: WebCraft Agency Platform
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
  meta_title,
  meta_description
) VALUES (
  'WebCraft Agency Platform',
  'webcraft-agency',
  'A production-grade web development agency platform with high performance, security, and SEO optimization.',
  'WebCraft is a comprehensive web development agency platform designed to showcase services, projects, pricing, and capture client leads efficiently.

**The Challenge**
Building a professional agency presence requires more than just a website—it needs enterprise-grade security, blazing-fast performance, and seamless lead capture while maintaining excellent SEO and accessibility standards.

**Our Solution**
Built a full-stack platform using cutting-edge technologies including Next.js 15 with App Router, React 19, and Supabase for the backend. Implemented comprehensive security measures including Row Level Security, rate limiting, and CAPTCHA protection.

**Key Features**
• High-performance server-rendered pages with optimized Core Web Vitals
• Secure backend with Supabase RLS and rate limiting
• Project showcase with optimized images and featured projects
• Contact forms with CAPTCHA, honeypot, and idempotency protection
• Complete SEO implementation (Metadata, OG images, JSON-LD, Sitemap)
• WCAG 2.2 AA accessibility compliance
• Production-grade error handling and monitoring

**Results**
Achieved a 9.8/10 production audit score with optimized Core Web Vitals architecture. The platform provides a secure, scalable foundation ready to handle real client traffic and leads.',
  'webapp',
  '["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Edge Functions"]',
  'published',
  true,
  100,
  1,
  'https://webcraftx.vercel.app',
  'WebCraft - Production-Grade Agency Platform',
  'A high-performance web development agency platform built with Next.js, React 19, and Supabase.'
);

-- PROJECT 2: Local Kirana Store Management System
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
  meta_title,
  meta_description
) VALUES (
  'Local Kirana Store Management',
  'kirana-store-management',
  'A web application for local kirana stores to manage products, orders, and customers digitally.',
  'A comprehensive web application built to help a local kirana store transition from traditional offline operations to a modern digital system.

**The Challenge**
Local kirana stores often struggle with manual record-keeping, order tracking, and inventory management. The store owner needed a simple yet powerful solution to digitize their business operations without a steep learning curve.

**Our Solution**
Developed a user-friendly web application with intuitive product management, order tracking, and customer management features. The system is designed for ease of use on mobile devices, allowing the store owner to manage operations on the go.

**Key Features**
• Product listing with categories and search functionality
• Customer order management and tracking
• Simple admin dashboard for daily operations
• Responsive design optimized for mobile users
• Secure backend APIs with proper authentication

**Results**
Successfully digitized the store''s operations, improving order tracking accuracy and reducing manual record-keeping errors. The store now has a digital presence and can serve customers more efficiently.',
  'webapp',
  '["Next.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"]',
  'published',
  true,
  90,
  2,
  NULL,
  'Kirana Store Management - Digital Business Solution',
  'A web application helping local kirana stores manage products, orders, and customers digitally.'
);

-- PROJECT 3: FreelanceHub Platform
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
  meta_title,
  meta_description
) VALUES (
  'FreelanceHub Platform',
  'freelancehub-platform',
  'An online freelancing platform where clients post jobs and freelancers can apply and manage work opportunities.',
  'FreelanceHub is a comprehensive job marketplace platform connecting clients with skilled freelancers for various project needs.

**The Challenge**
Creating a marketplace platform requires handling complex workflows—job posting, applications, user profiles, messaging, and secure authentication—while maintaining scalability for future growth.

**Our Solution**
Built a full-featured freelancing platform with separate flows for clients and freelancers. Implemented secure authentication, job management, and a scalable backend architecture designed to handle growing user bases.

**Key Features**
• Job posting and browsing with filters and search
• Comprehensive freelancer profiles with skills and portfolio
• Client–freelancer interaction and communication flow
• Secure authentication with role-based access
• Scalable backend structure for future expansion

**Results**
Demonstrates marketplace-level architecture with real-world workflows. The platform showcases expertise in building complex multi-user applications with scalable backend models.',
  'webapp',
  '["Next.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"]',
  'published',
  true,
  85,
  3,
  NULL,
  'FreelanceHub - Freelancing Job Marketplace',
  'A job marketplace platform connecting clients with freelancers for project opportunities.'
);

-- PROJECT 4: Developer Portfolio
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
  meta_title,
  meta_description
) VALUES (
  'Developer Portfolio',
  'developer-portfolio',
  'A modern, responsive portfolio website showcasing projects, skills, and experience with clean UI and smooth animations.',
  'A professionally designed portfolio website built to establish a strong personal brand and online presence for developers.

**The Challenge**
Standing out in the competitive web development market requires more than just skills—it needs a professional online presence that effectively showcases work, expertise, and personality.

**Our Solution**
Created a modern single-page portfolio with clean design, smooth animations, and optimized performance. The site effectively communicates skills, projects, and experience while maintaining excellent SEO and accessibility standards.

**Key Features**
• Clean single-page layout with smooth navigation
• Responsive sections for About, Projects, Skills, and Contact
• SEO-friendly structure with proper metadata
• Performance-optimized UI with fast load times
• Modern design with subtle animations

**Results**
Established a strong personal brand with a professional online presence. The portfolio serves as the foundation for agency branding and client acquisition.',
  'landing',
  '["Next.js", "TypeScript", "Tailwind CSS"]',
  'published',
  false,
  75,
  4,
  NULL,
  'Developer Portfolio - Professional Web Presence',
  'A modern portfolio website showcasing web development projects and skills.'
);

-- ============================================
-- VERIFY INSERTION
-- ============================================
-- Run this to verify projects were inserted:
-- SELECT id, title, slug, status, is_featured, priority, display_order FROM projects ORDER BY display_order;
