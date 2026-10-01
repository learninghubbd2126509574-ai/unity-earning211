export interface WorkModuleInfo {
  id: string;
  title: string;
  shortDesc: string;
  route: string;
  badge?: string;
  iconName: string;
  color: string;
  rateInfo: string;
}

export const WORK_MODULES: WorkModuleInfo[] = [
  {
    id: 'typing',
    title: 'Typing Work',
    shortDesc: 'Accurate paragraph transcription, proofreading & text reformatting.',
    route: '/module/typing',
    badge: 'Popular',
    iconName: 'PenTool',
    color: 'bg-blue-100 text-blue-600',
    rateInfo: 'BDT 1 per approved session'
  },
  {
    id: 'form',
    title: 'Form Fillup Work',
    shortDesc: 'Multi-field data validation, verification & standardized entry.',
    route: '/module/form',
    badge: 'High Demand',
    iconName: 'FileText',
    color: 'bg-emerald-100 text-emerald-600',
    rateInfo: 'BDT 1 per 10 verified forms'
  },
  {
    id: 'data',
    title: 'Data Entry Work',
    shortDesc: 'Spreadsheet employee record compilation & verified link submission.',
    route: '/module/data',
    badge: 'Structured',
    iconName: 'Database',
    color: 'bg-indigo-100 text-indigo-600',
    rateInfo: 'BDT 1 per 10 verified links'
  },
  {
    id: 'video',
    title: 'Video Submit Work',
    shortDesc: 'Create commercial product promotional video ads and submit timeline editing proof.',
    route: '/module/video',
    badge: 'Creator',
    iconName: 'Video',
    color: 'bg-purple-100 text-purple-600',
    rateInfo: 'BDT 20 - 30 per approved video'
  },
  {
    id: 'photo',
    title: 'Photo Submit Work',
    shortDesc: 'Retouch product images using designated editing prompts with screen recording proof.',
    route: '/module/photo',
    badge: 'Design & Edit',
    iconName: 'Image',
    color: 'bg-rose-100 text-rose-600',
    rateInfo: 'BDT 15 - 25 per approved photo'
  },
  {
    id: 'micro',
    title: 'Micro Job Work',
    shortDesc: 'Quick digital tasks, engagement, channel follows & ratings.',
    route: '/microjob',
    badge: 'Instant Earn',
    iconName: 'Zap',
    color: 'bg-amber-100 text-amber-600',
    rateInfo: '10 points per task'
  },
  {
    id: 'shop',
    title: 'Product Selling & Affiliate',
    shortDesc: 'Promote verified catalog products and earn sales commissions.',
    route: '/shop',
    badge: 'Commission',
    iconName: 'ShoppingBag',
    color: 'bg-rose-100 text-rose-600',
    rateInfo: 'High commission on sales'
  },
  {
    id: 'ad_viewing',
    title: 'Sponsored Ad Viewing',
    shortDesc: 'View sponsored brand campaigns with interactive timer verification.',
    route: '/module/ad-viewing',
    badge: 'Trending',
    iconName: 'Eye',
    color: 'bg-teal-100 text-teal-600',
    rateInfo: 'BDT 0.50 per verified view'
  },
  {
    id: 'moderation',
    title: 'Content Moderation Work',
    shortDesc: 'Evaluate community submissions and flag policy-violating items.',
    route: '/module/moderation',
    badge: 'Active Task',
    iconName: 'CheckSquare',
    color: 'bg-cyan-100 text-cyan-600',
    rateInfo: 'BDT 1 per 5 reviewed items'
  },
  {
    id: 'social_marketing',
    title: 'Social Media Marketing',
    shortDesc: 'Distribute campaign materials across social channels & submit proof.',
    route: '/module/social-marketing',
    badge: 'Marketing',
    iconName: 'Share2',
    color: 'bg-pink-100 text-pink-600',
    rateInfo: 'BDT 2.50 per verified campaign'
  },
  {
    id: 'content_writing',
    title: 'Content Writing Work',
    shortDesc: 'Compose original topical articles and product reviews to brief.',
    route: '/module/content-writing',
    badge: 'Writing',
    iconName: 'Edit3',
    color: 'bg-violet-100 text-violet-600',
    rateInfo: 'BDT 3.00 per submitted article'
  },
  {
    id: 'dropshipping',
    title: 'Dropshipping Business',
    shortDesc: 'Manage wholesale store listings, process incoming orders & earn margin.',
    route: '/module/dropshipping',
    badge: 'E-Commerce',
    iconName: 'Package',
    color: 'bg-lime-100 text-lime-700',
    rateInfo: 'Up to 25% profit margin'
  },
  {
    id: 'gaming',
    title: 'Gaming Tournament',
    shortDesc: 'Compete in live trivia, speed challenges & leaderboard tournaments.',
    route: '/module/gaming-tournament',
    badge: 'Prizes',
    iconName: 'Gamepad2',
    color: 'bg-fuchsia-100 text-fuchsia-600',
    rateInfo: 'BDT 50 prize pool tournaments'
  },
  {
    id: 'website_visit',
    title: 'Website Visit & Earn',
    shortDesc: 'Browse verified partner portals with interactive engagement counters.',
    route: '/module/website-visit',
    badge: 'Fast Earn',
    iconName: 'Globe',
    color: 'bg-sky-100 text-sky-600',
    rateInfo: 'BDT 0.75 per verified visit'
  }
];

export const getModuleTitle = (moduleId?: string): string => {
  if (!moduleId) return 'No Work Module Assigned';
  const found = WORK_MODULES.find(m => m.id === moduleId);
  return found ? found.title : moduleId;
};
