/**
 * Calculator Logic
 * Price estimation calculations for project cost calculator
 *
 * Note: These are ESTIMATED ranges, not exact pricing
 * Final pricing depends on detailed requirements
 */

/**
 * Project type options
 */
export const projectTypes = [
  {
    value: 'website',
    label: 'Business Website',
    baseMin: 30000,
    baseMax: 50000,
  },
  {
    value: 'webapp',
    label: 'Web Application',
    baseMin: 80000,
    baseMax: 150000,
  },
  { value: 'mobile', label: 'Mobile App', baseMin: 100000, baseMax: 200000 },
] as const;

/**
 * Project scope options
 */
export const projectScopes = [
  { value: 'simple', label: 'Simple', multiplier: 1.0 },
  { value: 'standard', label: 'Standard', multiplier: 1.5 },
  { value: 'advanced', label: 'Advanced', multiplier: 2.2 },
] as const;

/**
 * Design complexity options
 */
export const designOptions = [
  { value: 'basic', label: 'Basic Design', multiplier: 1.0 },
  { value: 'custom', label: 'Custom Design', multiplier: 1.4 },
] as const;

/**
 * Timeline options
 */
export const timelineOptions = [
  { value: 'normal', label: 'Normal (6-8 weeks)', multiplier: 1.0 },
  { value: 'fast', label: 'Fast Track (3-4 weeks)', multiplier: 1.3 },
] as const;

/**
 * Maintenance options
 */
export const maintenanceOptions = [
  { value: 'no', label: 'No', monthlyAdd: 0 },
  { value: 'yes', label: 'Yes (+₹5k/month)', monthlyAdd: 5000 },
] as const;

/**
 * Page/feature count ranges
 */
export const pageCountOptions = [
  { value: '1-5', label: '1-5 pages', multiplier: 1.0 },
  { value: '6-10', label: '6-10 pages', multiplier: 1.2 },
  { value: '11-20', label: '11-20 pages', multiplier: 1.5 },
  { value: '20+', label: '20+ pages', multiplier: 1.8 },
] as const;

/**
 * Calculator input state
 */
export interface CalculatorInputs {
  projectType: string;
  projectScope: string;
  pageCount: string;
  designComplexity: string;
  timeline: string;
  maintenance: string;
}

/**
 * Default calculator inputs
 */
export const defaultInputs: CalculatorInputs = {
  projectType: 'website',
  projectScope: 'standard',
  pageCount: '6-10',
  designComplexity: 'basic',
  timeline: 'normal',
  maintenance: 'no',
};

/**
 * Calculate estimated price range
 */
export function calculateEstimate(inputs: CalculatorInputs): {
  minPrice: number;
  maxPrice: number;
  monthlyMaintenance: number;
} {
  // Get base prices from project type
  const projectType = projectTypes.find((p) => p.value === inputs.projectType);
  const baseMin = projectType?.baseMin ?? 30000;
  const baseMax = projectType?.baseMax ?? 50000;

  // Get multipliers
  const scopeMultiplier =
    projectScopes.find((s) => s.value === inputs.projectScope)?.multiplier ?? 1;
  const pageMultiplier =
    pageCountOptions.find((p) => p.value === inputs.pageCount)?.multiplier ?? 1;
  const designMultiplier =
    designOptions.find((d) => d.value === inputs.designComplexity)
      ?.multiplier ?? 1;
  const timelineMultiplier =
    timelineOptions.find((t) => t.value === inputs.timeline)?.multiplier ?? 1;

  // Get maintenance cost
  const monthlyMaintenance =
    maintenanceOptions.find((m) => m.value === inputs.maintenance)
      ?.monthlyAdd ?? 0;

  // Calculate final range
  const totalMultiplier =
    scopeMultiplier * pageMultiplier * designMultiplier * timelineMultiplier;

  const minPrice = Math.round((baseMin * totalMultiplier) / 1000) * 1000;
  const maxPrice = Math.round((baseMax * totalMultiplier) / 1000) * 1000;

  return {
    minPrice,
    maxPrice,
    monthlyMaintenance,
  };
}

/**
 * Format price in INR
 */
export function formatPrice(price: number): string {
  if (price >= 100000) {
    const lakhs = price / 100000;
    return `₹${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 1)}L`;
  }
  return `₹${(price / 1000).toFixed(0)}k`;
}
