/**
 * Blog Posts Data
 * Centralized blog content for listing and detail pages
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  tags: string[];
}

/**
 * Blog categories
 */
export const categories = [
  'All',
  'Development',
  'Design',
  'Business',
  'Tutorials',
];

/**
 * Category badge colors
 */
export const categoryColors: Record<string, string> = {
  Development: 'bg-primary-50 text-primary-700 border-primary-200',
  Design: 'bg-purple-50 text-purple-700 border-purple-200',
  Business: 'bg-success-50 text-success-700 border-success-200',
  Tutorials: 'bg-warning-50 text-warning-700 border-warning-200',
};

/**
 * Blog posts data
 */
export const posts: BlogPost[] = [
  {
    slug: 'nextjs-15-features',
    title: "What's New in Next.js 15: A Complete Guide",
    excerpt:
      'Explore the latest features and improvements in Next.js 15, including the new App Router enhancements and performance optimizations.',
    content: `
## Introduction

Next.js 15 brings a host of exciting new features and improvements that make building modern web applications even more powerful and efficient. In this comprehensive guide, we'll explore everything you need to know about the latest release.

## Key Features

### 1. Enhanced App Router

The App Router has received significant improvements in Next.js 15, making it even more intuitive and powerful:

- **Improved Caching**: More granular control over caching strategies
- **Better Error Handling**: Enhanced error boundaries and recovery mechanisms
- **Streaming Improvements**: Faster initial page loads with optimized streaming

### 2. Turbopack Stability

Turbopack, the Rust-based successor to Webpack, is now stable for development:

- Up to 10x faster cold starts
- 5x faster HMR (Hot Module Replacement)
- Reduced memory usage

### 3. Server Actions Enhancements

Server Actions have been refined with new capabilities:

\`\`\`typescript
'use server'

export async function submitForm(formData: FormData) {
  const name = formData.get('name')
  // Process form data securely on the server
  return { success: true }
}
\`\`\`

### 4. Partial Prerendering

A new rendering strategy that combines static and dynamic content:

- Static shell renders instantly
- Dynamic content streams in progressively
- Best of both SSG and SSR worlds

## Performance Improvements

Next.js 15 delivers measurable performance gains:

- **30% faster builds** on average
- **Reduced bundle sizes** through better tree-shaking
- **Improved Core Web Vitals** out of the box

## Migration Guide

Upgrading from Next.js 14 is straightforward:

1. Update your dependencies
2. Review breaking changes
3. Test your application thoroughly

## Conclusion

Next.js 15 represents a significant step forward for React-based web development. The improvements to the App Router, Turbopack stability, and new rendering strategies make it an excellent choice for your next project.
    `,
    category: 'Development',
    date: 'Dec 15, 2024',
    readTime: '8 min read',
    featured: true,
    author: {
      name: 'Alex Chen',
      role: 'Lead Developer',
    },
    tags: ['Next.js', 'React', 'Web Development', 'JavaScript'],
  },
  {
    slug: 'design-system-guide',
    title: 'Building a Scalable Design System from Scratch',
    excerpt:
      'Learn how to create a consistent and maintainable design system that grows with your product.',
    content: `
## Why Design Systems Matter

A well-crafted design system is the foundation of consistent, scalable product design. It bridges the gap between design and development, ensuring everyone speaks the same visual language.

## Core Components

### 1. Design Tokens

Design tokens are the atomic values of your design system:

- **Colors**: Primary, secondary, semantic colors
- **Typography**: Font families, sizes, weights
- **Spacing**: Consistent spacing scale
- **Shadows**: Elevation levels
- **Border Radius**: Consistent rounding

### 2. Component Library

Build reusable components that encapsulate design decisions:

\`\`\`tsx
// Button component with variants
const Button = ({ variant = 'primary', size = 'md', children }) => {
  return (
    <button className={cn(buttonVariants({ variant, size }))}>
      {children}
    </button>
  )
}
\`\`\`

### 3. Documentation

Good documentation is crucial:

- Component usage guidelines
- Do's and don'ts
- Interactive examples
- Accessibility requirements

## Implementation Strategy

### Phase 1: Audit

- Inventory existing components
- Identify inconsistencies
- Document current patterns

### Phase 2: Foundation

- Define design tokens
- Create base components
- Establish naming conventions

### Phase 3: Scale

- Build complex components
- Create composition patterns
- Document everything

## Tools We Recommend

- **Figma**: Design and prototyping
- **Storybook**: Component documentation
- **Tailwind CSS**: Utility-first styling
- **CVA**: Component variant management

## Conclusion

Building a design system is an investment that pays dividends in consistency, efficiency, and scalability. Start small, iterate often, and always keep your users in mind.
    `,
    category: 'Design',
    date: 'Dec 10, 2024',
    readTime: '12 min read',
    featured: true,
    author: {
      name: 'Sarah Miller',
      role: 'Design Lead',
    },
    tags: ['Design Systems', 'UI/UX', 'Components', 'Figma'],
  },
  {
    slug: 'web-performance-tips',
    title: '10 Web Performance Tips for 2025',
    excerpt:
      "Practical strategies to improve your website's Core Web Vitals and deliver faster user experiences.",
    content: `
## Why Performance Matters

Web performance directly impacts user experience, conversion rates, and SEO rankings. Here are 10 actionable tips to boost your site's performance.

## The Tips

### 1. Optimize Images

- Use modern formats (WebP, AVIF)
- Implement lazy loading
- Serve responsive images

### 2. Minimize JavaScript

- Code split aggressively
- Remove unused dependencies
- Use dynamic imports

### 3. Leverage Caching

- Set appropriate cache headers
- Use service workers
- Implement stale-while-revalidate

### 4. Optimize Fonts

- Use font-display: swap
- Subset fonts
- Preload critical fonts

### 5. Reduce Layout Shifts

- Set explicit dimensions
- Reserve space for dynamic content
- Avoid inserting content above existing content

### 6. Prioritize Critical CSS

- Inline critical styles
- Defer non-critical CSS
- Remove unused styles

### 7. Use a CDN

- Distribute content globally
- Reduce latency
- Enable edge caching

### 8. Enable Compression

- Use Brotli or Gzip
- Compress text-based assets
- Optimize API responses

### 9. Optimize Third-Party Scripts

- Audit all third-party code
- Load non-critical scripts async
- Consider self-hosting

### 10. Monitor Continuously

- Set up Real User Monitoring
- Track Core Web Vitals
- Alert on regressions

## Measuring Success

Use these tools to measure your improvements:

- Lighthouse
- WebPageTest
- Chrome DevTools
- Core Web Vitals report

## Conclusion

Performance optimization is an ongoing process. Start with the highest-impact changes and iterate continuously.
    `,
    category: 'Development',
    date: 'Dec 5, 2024',
    readTime: '6 min read',
    featured: false,
    author: {
      name: 'Alex Chen',
      role: 'Lead Developer',
    },
    tags: ['Performance', 'Core Web Vitals', 'Optimization', 'SEO'],
  },
  {
    slug: 'client-communication',
    title: 'Effective Client Communication for Developers',
    excerpt:
      'How to build strong client relationships through clear communication and expectation management.',
    content: `
## The Communication Challenge

As developers, we often focus on technical excellence while underestimating the importance of client communication. Great communication can make or break a project.

## Key Principles

### 1. Speak Their Language

- Avoid unnecessary jargon
- Use analogies they understand
- Focus on business outcomes

### 2. Set Clear Expectations

- Define scope explicitly
- Document assumptions
- Communicate timelines realistically

### 3. Provide Regular Updates

- Weekly status reports
- Milestone celebrations
- Early warning on issues

### 4. Listen Actively

- Ask clarifying questions
- Summarize understanding
- Validate requirements

## Handling Difficult Conversations

### Scope Creep

"I understand you'd like to add this feature. Let me outline how it affects our timeline and budget so we can make an informed decision together."

### Delays

"We've encountered an unexpected challenge. Here's what happened, what we're doing about it, and our revised timeline."

### Budget Concerns

"Let me break down where we are and explore options that fit your budget while still delivering value."

## Tools for Better Communication

- **Project Management**: Asana, Linear, Jira
- **Documentation**: Notion, Confluence
- **Communication**: Slack, Email
- **Video Calls**: Zoom, Google Meet

## Conclusion

Technical skills get you the job, but communication skills help you keep clients happy and coming back. Invest in both.
    `,
    category: 'Business',
    date: 'Nov 28, 2024',
    readTime: '5 min read',
    featured: false,
    author: {
      name: 'Michael Torres',
      role: 'Project Manager',
    },
    tags: [
      'Communication',
      'Client Relations',
      'Project Management',
      'Soft Skills',
    ],
  },
  {
    slug: 'tailwind-v4-migration',
    title: 'Migrating to Tailwind CSS v4: What You Need to Know',
    excerpt:
      'A step-by-step guide to upgrading your project to Tailwind CSS v4 with minimal disruption.',
    content: `
## What's New in Tailwind v4

Tailwind CSS v4 brings significant changes to how we write and configure our styles. Let's explore what's new and how to migrate.

## Major Changes

### 1. CSS-First Configuration

Configuration now lives in CSS:

\`\`\`css
@theme {
  --color-primary-500: oklch(0.6 0.2 250);
  --font-sans: 'Inter', sans-serif;
}
\`\`\`

### 2. OKLCH Colors

Better color manipulation with OKLCH:

- Perceptually uniform
- Wider gamut support
- Easier color math

### 3. New Gradient Syntax

\`\`\`html
<div class="bg-linear-to-r from-primary-500 to-secondary-500">
  Gradient content
</div>
\`\`\`

### 4. Container Queries

Built-in container query support:

\`\`\`html
<div class="@container">
  <div class="@md:flex @lg:grid">
    Responsive to container
  </div>
</div>
\`\`\`

## Migration Steps

### Step 1: Update Dependencies

\`\`\`bash
npm install tailwindcss@latest
\`\`\`

### Step 2: Convert Configuration

Move from tailwind.config.js to CSS-based config.

### Step 3: Update Class Names

Some utilities have been renamed:

- \`bg-gradient-to-r\` → \`bg-linear-to-r\`
- Color opacity syntax changes

### Step 4: Test Thoroughly

- Visual regression testing
- Check all breakpoints
- Verify dark mode

## Common Issues

### Issue 1: Missing Colors

Solution: Define colors in @theme block

### Issue 2: Plugin Compatibility

Solution: Check for v4-compatible versions

### Issue 3: Build Errors

Solution: Clear cache and rebuild

## Conclusion

Tailwind v4 is a significant upgrade that modernizes the framework. Take time to migrate properly and enjoy the new features.
    `,
    category: 'Tutorials',
    date: 'Nov 20, 2024',
    readTime: '10 min read',
    featured: false,
    author: {
      name: 'Sarah Miller',
      role: 'Design Lead',
    },
    tags: ['Tailwind CSS', 'CSS', 'Migration', 'Tutorial'],
  },
  {
    slug: 'accessibility-checklist',
    title: 'The Ultimate Web Accessibility Checklist',
    excerpt:
      'Ensure your website is accessible to everyone with this comprehensive WCAG compliance checklist.',
    content: `
## Why Accessibility Matters

Web accessibility ensures that people with disabilities can perceive, understand, navigate, and interact with websites. It's not just good practice—it's often a legal requirement.

## The Checklist

### Perceivable

#### Images
- [ ] All images have alt text
- [ ] Decorative images have empty alt=""
- [ ] Complex images have detailed descriptions

#### Color
- [ ] Color is not the only means of conveying information
- [ ] Text has sufficient contrast (4.5:1 minimum)
- [ ] UI components have 3:1 contrast ratio

#### Media
- [ ] Videos have captions
- [ ] Audio has transcripts
- [ ] No auto-playing media

### Operable

#### Keyboard
- [ ] All functionality available via keyboard
- [ ] No keyboard traps
- [ ] Focus order is logical
- [ ] Focus indicators are visible

#### Navigation
- [ ] Skip links are provided
- [ ] Page titles are descriptive
- [ ] Headings are hierarchical

#### Timing
- [ ] Users can extend time limits
- [ ] Pause, stop, hide moving content

### Understandable

#### Readability
- [ ] Language is declared
- [ ] Unusual words are defined
- [ ] Reading level is appropriate

#### Predictability
- [ ] Navigation is consistent
- [ ] Components behave consistently

#### Input Assistance
- [ ] Errors are clearly identified
- [ ] Labels are provided
- [ ] Error suggestions are helpful

### Robust

#### Compatibility
- [ ] Valid HTML
- [ ] ARIA used correctly
- [ ] Works with assistive technologies

## Testing Tools

- **axe DevTools**: Browser extension
- **WAVE**: Web accessibility evaluator
- **Lighthouse**: Built into Chrome
- **Screen readers**: NVDA, VoiceOver

## Conclusion

Accessibility is an ongoing commitment. Use this checklist as a starting point and continuously improve your site's accessibility.
    `,
    category: 'Development',
    date: 'Nov 15, 2024',
    readTime: '7 min read',
    featured: false,
    author: {
      name: 'Alex Chen',
      role: 'Lead Developer',
    },
    tags: ['Accessibility', 'WCAG', 'A11y', 'Inclusive Design'],
  },
];

/**
 * Get all posts
 */
export function getAllPosts(): BlogPost[] {
  return posts;
}

/**
 * Get featured posts
 */
export function getFeaturedPosts(): BlogPost[] {
  return posts.filter((p) => p.featured);
}

/**
 * Get regular (non-featured) posts
 */
export function getRegularPosts(): BlogPost[] {
  return posts.filter((p) => !p.featured);
}

/**
 * Get post by slug
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

/**
 * Get all post slugs for static generation
 */
export function getAllPostSlugs(): string[] {
  return posts.map((p) => p.slug);
}

/**
 * Get related posts (same category, excluding current)
 */
export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];

  return posts
    .filter(
      (p) => p.slug !== currentSlug && p.category === currentPost.category
    )
    .slice(0, limit);
}
