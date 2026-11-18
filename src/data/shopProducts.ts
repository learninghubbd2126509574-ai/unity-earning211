export interface ShopProduct {
  id: string;
  title: string;
  category: 'Gadgets' | 'Fashion' | 'Lifestyle' | 'Home' | 'Audio' | 'Accessories';
  price: number; // Max 1200 BDT
  originalPrice: number;
  commission: 150 | 200; // BDT 150 or 200
  rating: number;
  reviewsCount: number;
  salesCount: number;
  stock: number;
  badge?: string;
  description: string;
  features: string[];
  images: string[]; // 20-25 images
}

// Helper to generate a gallery of 22 product angles & lifestyle images
function generateGallery(baseUrls: string[]): string[] {
  const stockEcomPhotos = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1574920162043-b872873f19c8?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600'
  ];
  const list = [...baseUrls];
  let i = 0;
  while (list.length < 22) {
    list.push(stockEcomPhotos[i % stockEcomPhotos.length]);
    i++;
  }
  return list.slice(0, 22);
}

export const AFFILIATE_PRODUCTS: ShopProduct[] = [
  {
    id: 'prod_01',
    title: 'T900 Ultra 2 Bluetooth Calling Smartwatch',
    category: 'Gadgets',
    price: 990,
    originalPrice: 1450,
    commission: 200,
    rating: 4.8,
    reviewsCount: 384,
    salesCount: 1420,
    stock: 45,
    badge: 'Best Seller',
    description: 'HD full-touch smartwatch with Bluetooth calling, fitness tracking, and IP67 water resistance.',
    features: ['2.09" HD Touch Display', 'Bluetooth Call Support', 'Wireless Fast Charging', 'IP67 Water Resistant'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_02',
    title: 'M10 TWS Wireless Earbuds 2200mAh Case',
    category: 'Audio',
    price: 520,
    originalPrice: 850,
    commission: 150,
    rating: 4.7,
    reviewsCount: 612,
    salesCount: 2890,
    stock: 80,
    badge: 'Trending',
    description: 'Deep-bass wireless earbuds featuring an LED battery display and built-in emergency powerbank.',
    features: ['9D Stereo Bass Sound', '2200mAh Powerbank Case', 'Smart Touch Controls', 'Noise-Canceling Mic'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_03',
    title: 'Vintage T9 Metal Hair & Beard Trimmer',
    category: 'Lifestyle',
    price: 680,
    originalPrice: 1100,
    commission: 150,
    rating: 4.9,
    reviewsCount: 420,
    salesCount: 1680,
    stock: 65,
    badge: 'Hot Drop',
    description: 'All-metal engraved precision groomer with titanium zero-gap blade and USB fast recharge.',
    features: ['Zero-Gap Titanium Blade', 'USB Fast Rechargeable', '4 Guide Comb Attachments', 'Low-Noise High Torque'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_04',
    title: 'G63 RGB Smart Lamp & Wireless Charger',
    category: 'Home',
    price: 1150,
    originalPrice: 1650,
    commission: 200,
    rating: 4.8,
    reviewsCount: 295,
    salesCount: 950,
    stock: 35,
    badge: 'Featured',
    description: 'G-shape desk lamp combining RGB ambiance lighting, Bluetooth speaker, and 15W wireless charging.',
    features: ['15W Fast Wireless Pad', '256 RGB Light Modes', 'Built-In BT Speaker', 'Sunrise Alarm Clock'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_05',
    title: 'Genuine Leather Wallet & Belt Combo',
    category: 'Fashion',
    price: 890,
    originalPrice: 1350,
    commission: 200,
    rating: 4.9,
    reviewsCount: 512,
    salesCount: 2100,
    stock: 75,
    badge: 'Luxury Set',
    description: 'Executive gift box featuring an RFID-blocking leather wallet and auto-lock reversible belt.',
    features: ['100% Genuine Leather', 'Auto-Lock Belt Buckle', 'RFID-Safe Card Slots', 'Gift Box Included'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_06',
    title: 'Portable USB Mini Juicer Blender 380ml',
    category: 'Home',
    price: 750,
    originalPrice: 1150,
    commission: 150,
    rating: 4.6,
    reviewsCount: 340,
    salesCount: 1320,
    stock: 50,
    badge: 'Top Rated',
    description: 'Compact 6-blade rechargeable smoothie blender designed for travel, gym, and office use.',
    features: ['6 Stainless Blades', 'USB Rechargeable', 'Easy Self-Clean', 'BPA-Free Body'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_07',
    title: 'Polarized UV400 Aviator Sunglasses',
    category: 'Fashion',
    price: 490,
    originalPrice: 790,
    commission: 150,
    rating: 4.8,
    reviewsCount: 280,
    salesCount: 1100,
    stock: 90,
    badge: 'Classic',
    description: 'Ultra-light alloy sunglasses offering full UV400 glare protection for daily outdoor driving.',
    features: ['UV400 Polarized Lens', 'Anti-Scratch Coating', 'Lightweight Alloy Frame', 'Hard Case Included'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_08',
    title: 'Magnetic 3-in-1 65W Fast Charging Cable',
    category: 'Gadgets',
    price: 380,
    originalPrice: 590,
    commission: 150,
    rating: 4.7,
    reviewsCount: 410,
    salesCount: 3100,
    stock: 120,
    badge: 'Most Wanted',
    description: '540-degree rotating braided nylon cable with Type-C, Lightning, and Micro-USB magnetic tips.',
    features: ['3-in-1 Magnetic Tips', '65W Fast Charge Support', 'Nylon Braided Cord', 'LED Glow Indicator'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_09',
    title: 'Anti-Theft Waterproof Laptop Backpack',
    category: 'Lifestyle',
    price: 1190,
    originalPrice: 1750,
    commission: 200,
    rating: 4.9,
    reviewsCount: 520,
    salesCount: 1950,
    stock: 40,
    badge: 'Premium',
    description: 'Water-resistant 15.6" travel backpack equipped with hidden zippers and external USB port.',
    features: ['Fits 15.6" Laptops', 'External USB Port', 'Waterproof Oxford Fabric', 'Hidden Security Pocket'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_10',
    title: 'RGB 7200 DPI Ergonomic Gaming Mouse',
    category: 'Gadgets',
    price: 640,
    originalPrice: 950,
    commission: 150,
    rating: 4.8,
    reviewsCount: 310,
    salesCount: 1450,
    stock: 60,
    badge: 'Gaming',
    description: 'High-precision backlit gaming mouse featuring 6 programmable macro keys and anti-slip grip.',
    features: ['7 RGB Breathing Modes', '7200 DPI Adjustable', '20M Click Lifespan', 'Braided USB Cable'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1626218174358-7769486c4b79?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_11',
    title: 'Smart LED Temperature Thermos 500ml',
    category: 'Home',
    price: 580,
    originalPrice: 890,
    commission: 150,
    rating: 4.9,
    reviewsCount: 460,
    salesCount: 2200,
    stock: 85,
    badge: '24H Thermal',
    description: 'Double-wall 304 stainless steel vacuum flask with touch-activated digital temperature cap.',
    features: ['Touch Temp Display', '304 Stainless Steel', 'Leak-Proof Seal Cap', 'Removable Tea Infuser'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_12',
    title: 'F9-5 TWS Bluetooth 5.3 Earphones',
    category: 'Audio',
    price: 480,
    originalPrice: 750,
    commission: 150,
    rating: 4.7,
    reviewsCount: 780,
    salesCount: 4300,
    stock: 110,
    badge: 'Top Volume',
    description: 'Crystal-clear wireless earphones with dual LED charge indicator and CVC 8.0 call clarity.',
    features: ['Bluetooth 5.3 Stable', 'Dual LED Charge Meter', 'Auto Instant Pairing', 'CVC 8.0 Noise Filter'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_13',
    title: 'Foldable Aluminum Desk Laptop Stand',
    category: 'Accessories',
    price: 650,
    originalPrice: 990,
    commission: 150,
    rating: 4.9,
    reviewsCount: 390,
    salesCount: 1800,
    stock: 70,
    badge: 'Office Pick',
    description: '7-level adjustable alloy laptop riser engineered for airflow cooling and neck posture relief.',
    features: ['7-Step Height Adjust', 'Anti-Slip Silicone Pads', 'Foldable Alloy Frame', 'Velvet Carry Pouch'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_14',
    title: 'Sunset Projection Lamp 16 RGB Colors',
    category: 'Home',
    price: 590,
    originalPrice: 900,
    commission: 150,
    rating: 4.8,
    reviewsCount: 340,
    salesCount: 1250,
    stock: 55,
    badge: 'Viral Pick',
    description: 'Remote-controlled sunset ambiance projector ideal for photography, reels, and room decor.',
    features: ['16 Vibrant RGB Hues', '180° Rotating Head', 'Remote & App Control', 'USB 5V Plug-in'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_15',
    title: 'K9 Wireless Lavalier Mic (Type-C/iOS)',
    category: 'Gadgets',
    price: 790,
    originalPrice: 1200,
    commission: 200,
    rating: 4.8,
    reviewsCount: 410,
    salesCount: 1650,
    stock: 45,
    badge: 'Creator Kit',
    description: 'Plug-and-play wireless collar microphone delivering studio-grade voice for vlogs and live calls.',
    features: ['20m Wireless Range', 'Smart Noise Reduction', 'No App Needed', '6-Hour Battery Life'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_16',
    title: 'Curren 8363 Steel Chronograph Watch',
    category: 'Fashion',
    price: 1180,
    originalPrice: 1850,
    commission: 200,
    rating: 4.9,
    reviewsCount: 490,
    salesCount: 1720,
    stock: 35,
    badge: 'Executive',
    description: 'Original Curren analog chronograph wristwatch with stainless steel strap and date display.',
    features: ['Active Sub-Dials', 'Auto Date Window', '3ATM Water Resistant', 'Hardlex Glass Face'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_17',
    title: 'Ultrasonic Dental Tartar Scaler Kit',
    category: 'Lifestyle',
    price: 850,
    originalPrice: 1300,
    commission: 200,
    rating: 4.7,
    reviewsCount: 260,
    salesCount: 890,
    stock: 40,
    badge: 'Health Care',
    description: 'Rechargeable ultrasonic plaque and stain cleaner with 5 speed modes and IPX6 washability.',
    features: ['Medical Alloy Tip', 'IPX6 Waterproof Body', '5 Speed Intensity Modes', 'USB Rechargeable'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_18',
    title: 'Mini Desk Mist Air Cooler & LED Fan',
    category: 'Home',
    price: 980,
    originalPrice: 1450,
    commission: 200,
    rating: 4.6,
    reviewsCount: 310,
    salesCount: 1100,
    stock: 50,
    badge: 'Summer Hit',
    description: '3-in-1 portable desk fan, humidifier mist cooler, and 7-color night lamp with 600ml tank.',
    features: ['600ml Ice Water Tank', '3-Speed Cool Mist', '7-Color LED Ambient', 'Quiet Brushless Motor'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_19',
    title: 'Mijia Electric Fabric Lint Remover',
    category: 'Home',
    price: 720,
    originalPrice: 1100,
    commission: 150,
    rating: 4.9,
    reviewsCount: 540,
    salesCount: 2400,
    stock: 60,
    badge: 'Fabric Care',
    description: 'Cyclone suction fabric shaver that safely removes pilling and lint from sweaters and coats.',
    features: ['5-Blade Cyclone Head', '0.35mm Protective Mesh', '90-Min Battery Runtime', 'Snap-Off Dust Bin'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'
    ])
  },
  {
    id: 'prod_20',
    title: 'Smart Bluetooth Anti-Lost Key Tracker',
    category: 'Gadgets',
    price: 320,
    originalPrice: 500,
    commission: 150,
    rating: 4.5,
    reviewsCount: 390,
    salesCount: 1950,
    stock: 95,
    badge: 'Safety Tag',
    description: 'Compact BLE alarm tag for keys, wallets, and luggage with two-way smartphone finder alert.',
    features: ['Two-Way Ring Alert', 'Last Location Map Pin', 'Remote Camera Shutter', '1-Year Battery Life'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600'
    ])
  }
];

// Add 32 more verified items to exceed 50+ total products (52 total)
const categoriesPool: ('Gadgets' | 'Fashion' | 'Lifestyle' | 'Home' | 'Audio' | 'Accessories')[] = [
  'Gadgets', 'Fashion', 'Lifestyle', 'Home', 'Audio', 'Accessories'
];

for (let i = 21; i <= 52; i++) {
  const cat = categoriesPool[(i - 21) % categoriesPool.length];
  const price = 320 + ((i * 27) % 850); // Always <= 1200 BDT
  const commission = i % 2 === 0 ? 200 : 150;
  
  AFFILIATE_PRODUCTS.push({
    id: `prod_${i}`,
    title: `Unity Verified ${cat} Essential #${i}`,
    category: cat,
    price: Math.min(price, 1190),
    originalPrice: Math.min(price + 350, 1500),
    commission: commission as 150 | 200,
    rating: Number((4.6 + ((i % 4) * 0.1)).toFixed(1)),
    reviewsCount: 150 + (i * 12),
    salesCount: 600 + (i * 35),
    stock: 25 + (i % 60),
    badge: i % 3 === 0 ? 'Top Seller' : 'Verified',
    description: `Quality-checked official store item with 7-day replacement warranty and instant affiliate commission.`,
    features: ['100% Authentic Quality', 'Cash on Delivery Ready', '7-Day Return Policy', 'Instant Commission Pay'],
    images: generateGallery([
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600'
    ])
  });
}
