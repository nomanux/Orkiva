export type Plan = {
  id: 'basic' | 'pro' | 'advanced'
  name: string
  price: number
  tagline: string
  features: string[]
  trial?: boolean
}

// Features are listed column by column, two per column, matching the design's grid.
export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 24,
    tagline: 'All the basics for starting a new business',
    features: ['Up to 2 staff members', 'Fraud analysis', 'Up to 4 locations', 'Professional reports'],
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 64,
    tagline: 'Everything you need for a growing business',
    features: ['Up to 5 staff members', 'Fraud analysis', 'Up to 5 locations', 'Professional reports'],
  },
  {
    id: 'advanced',
    name: 'Advanced Plan',
    price: 124,
    tagline: 'Advanced features for scaling your business',
    features: ['Up to 10 staff members', 'Fraud analysis', 'Up to 8 locations', 'Professional reports'],
    trial: true,
  },
]
