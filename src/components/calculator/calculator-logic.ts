/**
 * Calculator Logic
 * Price estimation calculations for project cost calculator
 *
 * Note: These are ESTIMATED ranges, not exact pricing
 * Final pricing depends on detailed requirements
 * 
 * Pricing in INR (Indian Rupees)
 */

/**
 * Project type options - aligned with pricing page
 * Basic: ₹1,000 | Standard: ₹3,000 | Premium: ₹6,000
 */
export const projectTypes = [
  {
    value: 'landing',
    label: 'Landing Page',
    baseMin: 800,
    baseMax: 1500,
  },
  {
    value: 'portfolio',
    label: 'Portfolio / Personal Site',
    baseMin: 1000,
    baseMax: 2000,
  },
  {
    value: 'business',
    label: 'Business Website',
    baseMin: 1500,
    baseMax: 3500,
  },
  {
    value: 'blog',
    label: 'Blog / Content Site',
    baseMin: 1200,
    baseMax: 2500,
  },
  {
    value: 'ecommerce',
    label: 'E-Commerce Store',
    baseMin: 3000,
    baseMax: 8000,
  },
  {
    value: 'webapp',
    label: 'Web Application',
    baseMin: 5000,
    baseMax: 15000,
  },
  {
    value: 'saas',
    label: 'SaaS Platform',
    baseMin: 8000,
    baseMax: 20000,
  },
  {
    value: 'mobile',
    label: 'Mobile App',
    baseMin: 6000,
    baseMax: 18000,
  },
  {
    value: 'dashboard',
    label: 'Admin Dashboard',
    baseMin: 4000,
    baseMax: 10000,
  },
] as const;

/**
 * Project scope options - more granular
 */
export const projectScopes = [
  { value: 'minimal', label: 'Minimal (MVP)', multiplier: 0.7 },
  { value: 'simple', label: 'Simple', multiplier: 1.0 },
  { value: 'standard', label: 'Standard', multiplier: 1.4 },
  { value: 'advanced', label: 'Advanced', multiplier: 1.8 },
  { value: 'enterprise', label: 'Enterprise', multiplier: 2.5 },
] as const;

/**
 * Design complexity options - expanded
 */
export const designOptions = [
  { value: 'template', label: 'Template Based', multiplier: 0.8 },
  { value: 'basic', label: 'Basic Custom', multiplier: 1.0 },
  { value: 'standard', label: 'Standard Custom', multiplier: 1.3 },
  { value: 'premium', label: 'Premium Design', multiplier: 1.6 },
  { value: 'luxury', label: 'Luxury / High-End', multiplier: 2.0 },
] as const;

/**
 * Timeline options - more choices
 */
export const timelineOptions = [
  { value: 'relaxed', label: 'Relaxed (10-12 weeks)', multiplier: 0.9 },
  { value: 'normal', label: 'Normal (6-8 weeks)', multiplier: 1.0 },
  { value: 'fast', label: 'Fast (4-5 weeks)', multiplier: 1.2 },
  { value: 'urgent', label: 'Urgent (2-3 weeks)', multiplier: 1.5 },
  { value: 'rush', label: 'Rush (1-2 weeks)', multiplier: 2.0 },
] as const;

/**
 * Page/feature count ranges - expanded
 */
export const pageCountOptions = [
  { value: '1-3', label: '1-3 pages', multiplier: 0.8 },
  { value: '4-6', label: '4-6 pages', multiplier: 1.0 },
  { value: '7-10', label: '7-10 pages', multiplier: 1.2 },
  { value: '11-15', label: '11-15 pages', multiplier: 1.4 },
  { value: '16-25', label: '16-25 pages', multiplier: 1.7 },
  { value: '25+', label: '25+ pages', multiplier: 2.0 },
] as const;

/**
 * Features/Integrations options - NEW
 */
export const featureOptions = [
  { value: 'none', label: 'Basic (No extras)', multiplier: 1.0 },
  { value: 'few', label: 'Few Features (2-3)', multiplier: 1.15 },
  { value: 'moderate', label: 'Moderate (4-6)', multiplier: 1.3 },
  { value: 'many', label: 'Many Features (7-10)', multiplier: 1.5 },
  { value: 'extensive', label: 'Extensive (10+)', multiplier: 1.8 },
] as const;

/**
 * Content/CMS options - NEW
 */
export const contentOptions = [
  { value: 'static', label: 'Static Content', multiplier: 1.0 },
  { value: 'basic-cms', label: 'Basic CMS', multiplier: 1.15 },
  { value: 'advanced-cms', label: 'Advanced CMS', multiplier: 1.3 },
  { value: 'headless', label: 'Headless CMS', multiplier: 1.4 },
  { value: 'custom', label: 'Custom CMS', multiplier: 1.6 },
] as const;

/**
 * Maintenance options - aligned with pricing scale
 */
export const maintenanceOptions = [
  { value: 'none', label: 'No Maintenance', monthlyAdd: 0 },
  { value: 'basic', label: 'Basic (₹200/month)', monthlyAdd: 200 },
  { value: 'standard', label: 'Standard (₹500/month)', monthlyAdd: 500 },
  { value: 'premium', label: 'Premium (₹1,000/month)', monthlyAdd: 1000 },
  { value: 'enterprise', label: 'Enterprise (₹2,000/month)', monthlyAdd: 2000 },
] as const;

/**
 * Hosting & Domain options - NEW
 */
export const hostingOptions = [
  { value: 'no', label: 'No (I have my own)', oneTimeAdd: 0 },
  { value: 'yes', label: 'Yes (+₹1,000/year)', oneTimeAdd: 1000 },
] as const;

/**
 * Calculator input state - expanded
 */
export interface CalculatorInputs {
  projectType: string;
  projectScope: string;
  pageCount: string;
  designComplexity: string;
  features: string;
  content: string;
  timeline: string;
  hosting: string;
  maintenance: string;
}

/**
 * Default calculator inputs
 */
export const defaultInputs: CalculatorInputs = {
  projectType: 'business',
  projectScope: 'standard',
  pageCount: '7-10',
  designComplexity: 'standard',
  features: 'few',
  content: 'basic-cms',
  timeline: 'normal',
  hosting: 'no',
  maintenance: 'none',
};

/**
 * Calculate estimated price range
 */
export function calculateEstimate(inputs: CalculatorInputs): {
  minPrice: number;
  maxPrice: number;
  hostingCost: number;
  monthlyMaintenance: number;
} {
  // Get base prices from project type
  const projectType = projectTypes.find((p) => p.value === inputs.projectType);
  const baseMin = projectType?.baseMin ?? 1500;
  const baseMax = projectType?.baseMax ?? 3500;

  // Get multipliers
  const scopeMultiplier =
    projectScopes.find((s) => s.value === inputs.projectScope)?.multiplier ?? 1;
  const pageMultiplier =
    pageCountOptions.find((p) => p.value === inputs.pageCount)?.multiplier ?? 1;
  const designMultiplier =
    designOptions.find((d) => d.value === inputs.designComplexity)?.multiplier ?? 1;
  const featureMultiplier =
    featureOptions.find((f) => f.value === inputs.features)?.multiplier ?? 1;
  const contentMultiplier =
    contentOptions.find((c) => c.value === inputs.content)?.multiplier ?? 1;
  const timelineMultiplier =
    timelineOptions.find((t) => t.value === inputs.timeline)?.multiplier ?? 1;

  // Get hosting cost (one-time yearly)
  const hostingCost =
    hostingOptions.find((h) => h.value === inputs.hosting)?.oneTimeAdd ?? 0;

  // Get maintenance cost
  const monthlyMaintenance =
    maintenanceOptions.find((m) => m.value === inputs.maintenance)?.monthlyAdd ?? 0;

  // Calculate final range with all multipliers
  const totalMultiplier =
    scopeMultiplier *
    pageMultiplier *
    designMultiplier *
    featureMultiplier *
    contentMultiplier *
    timelineMultiplier;

  // Round to nearest 100 for cleaner prices
  const minPrice = Math.round((baseMin * totalMultiplier) / 100) * 100;
  const maxPrice = Math.round((baseMax * totalMultiplier) / 100) * 100;

  return {
    minPrice,
    maxPrice,
    hostingCost,
    monthlyMaintenance,
  };
}

/**
 * Format price in INR with Indian numbering
 */
export function formatPrice(price: number): string {
  if (price >= 100000) {
    const lakhs = price / 100000;
    return `₹${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 1)}L`;
  }
  if (price >= 1000) {
    const thousands = price / 1000;
    return `₹${thousands.toFixed(thousands % 1 === 0 ? 0 : 1)}k`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
}
