export type ReviewCategory =
  | 'typing'
  | 'form'
  | 'data'
  | 'affiliate'
  | 'marketing'
  | 'payout'
  | 'general';

export type AvatarTone = 'blue' | 'white' | 'yellow' | 'black' | 'teal' | 'indigo';

export interface StudentReview {
  id: string;
  name: string;
  gender: 'male' | 'female';
  location: string;
  workRole: string;
  roleBadge?: string;
  avatarUrl?: string;
  avatarTone: AvatarTone;
  rating: number; // 7 to 10 (out of 10)
  text: string;
  category: ReviewCategory;
  date: string;
  likes: number;
  earnings?: string;
  projectSuccessId?: string;
  isVerified: boolean;
  status: 'approved' | 'pending';
  submittedByStudentId?: string;
}

const AVATAR_TONES: AvatarTone[] = ['blue', 'white', 'yellow', 'black', 'teal', 'indigo'];

const DISTRICTS = [
  'Dhaka', 'Chattogram', 'Rajshahi', 'Sylhet', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh',
  'Cumilla', 'Gazipur', 'Narayanganj', 'Bogura', 'Tangail', 'Faridpur', 'Jashore', 'Dinajpur',
  'Pabna', 'Kushtia', 'Habiganj', 'Jamalpur', 'Noakhali', 'Brahmanbaria', 'Patuakhali',
  'Bhola', 'Natore', 'Satkhira', 'Sirajganj', 'Jhenaidah', 'Netrokona', 'Chandpur',
  'Manikganj', 'Lakshmipur', 'Moulvibazar', 'Munshiganj', 'Kurigram', 'Narsingdi', 'Sherpur',
  'Nilphamari', 'Chapainawabganj', 'Pirojpur', 'Panchagarh', 'Jhalokathi', 'Gopalganj', 'Chuadanga'
];

const MALE_FIRST_EN = [
  'Tanvir', 'Rakibul', 'Ariful', 'Nazmul', 'Sabbir', 'Shakil', 'Rifat', 'Mehedi',
  'Touhid', 'Saidur', 'Mahir', 'Imran', 'Fahim', 'Naimul', 'Ashikur', 'Shariful',
  'Sajib', 'Hasan', 'Sohel', 'Shahin', 'Al-Amin', 'Mahmudul', 'Kamrul', 'Jahid',
  'Rashedul', 'Mizanur', 'Shafiq', 'Noman', 'Tanzim', 'Asif', 'Jewel', 'Bappi',
  'Faysal', 'Sanowar', 'Mahbub', 'Toufiq', 'Monirul', 'Aminur', 'Ashraful', 'Tariqul',
  'Riyad', 'Kabir', 'Enamul', 'Saddam', 'Mostafa', 'Wahid', 'Rezaul', 'Shawkat'
];

const MALE_LAST_EN = [
  'Ahmed', 'Hasan', 'Islam', 'Hossain', 'Rahman', 'Khan', 'Chowdhury', 'Uddin',
  'Mahmud', 'Karim', 'Haque', 'Sarkar', 'Miah', 'Ali', 'Sheikh', 'Patwary'
];

const FEMALE_FIRST_EN = [
  'Sumaiya', 'Farzana', 'Sadia', 'Nusrat', 'Jannatul', 'Khadija', 'Priyanka', 'Mahfuza',
  'Rubina', 'Anika', 'Tasnim', 'Jannat', 'Sharmin', 'Shampa', 'Poly', 'Bristi',
  'Munni', 'Laboni', 'Nadia', 'Ruma', 'Swapna', 'Rehana', 'Habiba', 'Ayesha',
  'Tania', 'Momtaz', 'Shahida', 'Sabina', 'Fatema', 'Nasrin', 'Mousumi', 'Roksana',
  'Israt', 'Afroza', 'Nazmun', 'Shirin', 'Bilkis', 'Selina', 'Shahnaz', 'Sumona',
  'Muntaha', 'Farhana', 'Jhumur', 'Rabeya', 'Tahmina', 'Razia', 'Shabnam', 'Nadira'
];

const FEMALE_LAST_EN = [
  'Akter', 'Jahan', 'Sultana', 'Khatun', 'Begum', 'Haque', 'Rahman', 'Islam',
  'Chowdhury', 'Parvin', 'Yasmin', 'Das', 'Roy', 'Tabassum', 'Ferdous', 'Siddika'
];

// Everyday casual photos (flowers, cats, scenery, coffee) — NO portrait faces
const CASUAL_AVATAR_URLS = [
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=150&auto=format&fit=crop&q=80'
];

interface ReviewTemplate {
  rating: 7 | 8 | 9 | 10;
  category: ReviewCategory;
  workRole: string;
  roleBadge: string;
  earnings?: string;
  text: string;
}

// Genuine, lived-in reviews written in realistic Banglish (dominant), Bengali, and natural English (max BDT 12,000)
const TEMPLATES_BY_RATING: Record<7 | 8 | 9 | 10, ReviewTemplate[]> = {
  10: [
    {
      rating: 10,
      category: 'form',
      workRole: 'Form Fillup · Active Worker',
      roleBadge: 'Form Fillup Worker',
      earnings: 'BDT 12,000',
      text: 'Ami university r 2nd year er student, bashay boshe free time e form fillup er kaj shuru korchilam. Prothome 60 jon client er list theke ekta ekta kore data milate ghum chole jeto, kintu ekhon obhyash hoye gese. Last 1.5 mashe total 12,000 tk er moto cashout korsi bKash e, mess er vara ar pocket khoroch ekhon nijei chalai.'
    },
    {
      rating: 10,
      category: 'payout',
      workRole: 'Data Entry · Active Worker',
      roleBadge: 'Data Entry Specialist',
      earnings: 'BDT 8,000',
      text: 'Kaj korar por shobcheye bhalo lagse balance transfer option ta. Gotokal amar friend er emergency tk lagto, ami or 7 digit ID code ta niye 3,000 tk transfer kore disi—kono charge charai 2 second er moddhe or account e jog hoye gese. Ekhon porjonto Data Entry kore mot 8,000 taka peyechi.'
    },
    {
      rating: 10,
      category: 'form',
      workRole: 'Form Fillup · Active Worker',
      roleBadge: 'Verified Member',
      earnings: 'BDT 10,500',
      text: 'প্রথমবার যখন ফর্ম ফিলাপের কাজ সাবমিট করি তখন প্রায় ২ ঘণ্টা পেন্ডিং দেখাচ্ছিল দেখে একটু ভয় পেয়েছিলাম। পরে আমার টিম লিডারকে নক দিলে উনি জানালেন অডিট চলছে। বিকেলে পুরো পেমেন্ট মেইন ব্যালেন্সে চলে আসে। এই পর্যন্ত কয়েক ধাপে ১০,৫০০ টাকা তুলেছি নগদে।'
    },
    {
      rating: 10,
      category: 'affiliate',
      workRole: 'Affiliate Shop · Active Seller',
      roleBadge: 'Affiliate Seller',
      earnings: 'BDT 5,000',
      text: 'Affiliate marketing e prothome link share kore kono order pacchilam na, bhabchilam hoyto kaj hobe na. Tarpor mentor bhaiyer kothamoto Facebook Marketplace ar 2-3 ta buy-sell group e product er bishoygulo banglay bujhiye post deway gotokal porjonto 5,000 tk er upore commission ashche.'
    },
    {
      rating: 10,
      category: 'data',
      workRole: 'Data Entry · Active Worker',
      roleBadge: 'Excel Analyst',
      earnings: 'BDT 9,200',
      text: 'I joined mostly to learn practical Excel work alongside my college studies. The microfinance and billing sheets actually forced me to practice VLOOKUP and reconciliation properly instead of clicking random buttons. Once my first two batches were approved, the rewards added up to BDT 9,200 total.'
    },
    {
      rating: 10,
      category: 'typing',
      workRole: 'Typing Work · Active Worker',
      roleBadge: 'Typing Worker',
      earnings: 'BDT 5,500',
      text: 'সত্যি বলতে টাইপিংয়ের কাজটা সবাই পারে না, শুরুতে আমার নিজেরও ৩০ মিনিটে ২৫০০+ অক্ষর শেষ করতে হাত ব্যথা হয়ে যেত। কপি-পেস্ট কাজ করে না দেখে প্রথম ২ সপ্তাহ শুধু স্পিড বাড়িয়েছি। এখন আলহামদুলিল্লাহ সময় শেষ হওয়ার আগেই সাবমিট করতে পারি, আর ৫,৫০০ টাকা আয় হয়েছে।'
    },
    {
      rating: 10,
      category: 'marketing',
      workRole: 'Digital Marketing · Active Worker',
      roleBadge: 'CPA & Social Worker',
      earnings: 'BDT 8,500',
      text: 'Bhai onno sob fake earning app theke eta ekdom alada. Ekhane kaaj na kore taka ashe na, abar sothikvabe sheet ba campaign complete korle payment atkay na. Digital marketing ar CPA tasks kore ekhon porjonto 8,500 taka bKash e nilam.'
    },
    {
      rating: 10,
      category: 'general',
      workRole: 'Content Moderation · Active Worker',
      roleBadge: 'Content Moderator',
      earnings: 'BDT 7,000',
      text: 'Moderator career option theke apply korar 4 din por account active hoyechilo. Kaj gulo khub formal ar dashboard er design o chokhe lagar moto, kono faltu ad ba jhamela nai. Ei mashe 7,000 tk payout pelam.'
    },
    {
      rating: 10,
      category: 'form',
      workRole: 'Form Fillup · Active Worker',
      roleBadge: 'Batch Worker',
      earnings: 'BDT 6,400',
      text: 'ঘরে বসে টিউশনের পাশাপাশি সন্ধ্যায় ২ ঘণ্টা সময় দিয়ে ফর্ম ফিলাপের কাজগুলো করি। একজন ক্লায়েন্টের ৪০টার মতো তথ্য দেখে দেখে বসাতে হয় বলে তাড়াহুড়ো করলে ভুল হয়, তাই সময় নিয়ে ধীরে ধীরে করি। এ পর্যন্ত ৬,৪০০ টাকা তুলেছি।'
    },
    {
      rating: 10,
      category: 'payout',
      workRole: 'Affiliate Shop · Active Seller',
      roleBadge: 'Shop Partner',
      earnings: 'BDT 5,000',
      text: 'Used the peer balance transfer twice this week to settle an amount with my cousin who also works on Unity Earning. No fees, instant credit once the 7-digit ID matches, and my affiliate earnings crossed BDT 5,000 this month.'
    },
    {
      rating: 10,
      category: 'data',
      workRole: 'Data Entry · Active Worker',
      roleBadge: 'Data Worker',
      earnings: 'BDT 11,400',
      text: 'Amader batch er 3-4 jon eksathe boshe Data Entry er project gulo solve kori. Bhul formula dile admin reject kore dey tai submit korar age duibar check kori. Eibhabe kaj kore gotokoyek shoptah e 11,400 tk income korechi.'
    },
    {
      rating: 10,
      category: 'form',
      workRole: 'Form Fillup · Active Worker',
      roleBadge: 'Form Worker',
      earnings: 'BDT 4,800',
      text: 'আগে অনলাইনে ২ জায়গায় প্রতারণার শিকার হয়েছিলাম, তাই এখানে জয়েন করেও প্রথমে বিশ্বাস হচ্ছিল না। প্রথম পেমেন্ট ৩,০০০ টাকা বিকাশে পাওয়ার পর ভরসা পেয়েছি। এখন ৪,৮০০ টাকা আয় হয়ে গেছে আলহামদুলিল্লাহ।'
    }
  ],
  9: [
    {
      rating: 9,
      category: 'form',
      workRole: 'Form Fillup · Active Worker',
      roleBadge: 'Form Fillup Worker',
      earnings: 'BDT 5,000',
      text: 'Form fillup er kaj kore 5,000 taka income korte perechi kintu kajta besh somoy sapekkho. 60 jon client er list theke ekjoner sob detail milaye 40 ta ghor fill korte onek monojog lage, ekta digit vul holei punoray check korte hoy. Tobe tk thikmoto dey etai ashol kotha.'
    },
    {
      rating: 9,
      category: 'data',
      workRole: 'Data Entry · Active Worker',
      roleBadge: 'Data Entry Worker',
      earnings: 'BDT 3,800',
      text: 'Shurute Data Entry sheet gulo dekhe matha ghuray gechilo, formula bujhtam na. Pore Telegram helpline e mentor sir ke screenshot pathanor por uni voice message e bujhiye diyechen. Tarpor theke 3,800 tk earn korechi, just submission verify hote majhe majhe 2-3 ghonta wait korte hoy.'
    },
    {
      rating: 9,
      category: 'typing',
      workRole: 'Typing Work · Active Worker',
      roleBadge: 'Typing Member',
      earnings: 'BDT 3,000',
      text: 'টাইপিং প্রজেক্টে ৩০ মিনিটের টাইমার অন হওয়ার পর একটু নার্ভাস হয়ে যাই, কারণ মাঝপথে ভুল করেও পেজ রিফ্রেশ দিলে ২ ঘণ্টা অপেক্ষা করতে হয়। তবে মন দিয়ে ২টা প্রজেক্ট ঠিকঠাক জমা দিতে পেরেছি আর ৩,০০০ টাকা পেয়েছি।'
    },
    {
      rating: 9,
      category: 'affiliate',
      workRole: 'Affiliate Shop · Active Seller',
      roleBadge: 'Affiliate Partner',
      earnings: 'BDT 4,200',
      text: 'Shop er notun UI ta besh neat lagse, product code ar direct link alada kore dewa ache bole buyer ke pathate subidha hoy. Ekhon porjonto 4,200 tk commission peyechi, delivery confirm howar por balance e add hoy.'
    },
    {
      rating: 9,
      category: 'payout',
      workRole: 'Microjob · Active Worker',
      roleBadge: 'Verified Contributor',
      earnings: 'BDT 3,200',
      text: 'Earned BDT 3,200 combining small microjobs and form reviews over the past month. Cashout to Nagad went through cleanly the next morning, and support actually replies when you message them with your ID.'
    },
    {
      rating: 9,
      category: 'marketing',
      workRole: 'Social Marketing · Active Worker',
      roleBadge: 'Marketing Member',
      earnings: 'BDT 5,400',
      text: 'ডিজিটাল মার্কেটিং ও সোশ্যাল প্রোমোশন টাস্কগুলোতে লিড আনতে একটু পরিশ্রম হয়, শুধু লিংক শেয়ার করলে কেউ ক্লিক করে না। নিয়ম মেনে পোস্ট করায় ৫,৪০০ টাকার মতো আয় হয়েছে।'
    },
    {
      rating: 9,
      category: 'form',
      workRole: 'Form Fillup · Active Worker',
      roleBadge: 'Active Worker',
      earnings: 'BDT 4,500',
      text: 'Amar kache site ta khub e reliable lagse. Kaj ektu tough holeo fake kichu nai—4,500 tk bKash e nilam gotokal. Just review time ta aro ektu fast korle 10/10 ditam.'
    },
    {
      rating: 9,
      category: 'data',
      workRole: 'Data Entry · Active Worker',
      roleBadge: 'Excel Trainee',
      earnings: 'BDT 3,500',
      text: 'Phone diye Data Entry korte ektu choto lagto, tai brother er laptop niye kaj kori ekhon. Sheet validation error na thakle 3,500 tk er moto easy pawa gese ei mashe.'
    }
  ],
  8: [
    {
      rating: 8,
      category: 'typing',
      workRole: 'Typing Work · Active Worker',
      roleBadge: 'Typing Worker',
      earnings: 'BDT 2,400',
      text: 'Sotti bolte typing er kaj ta onno module er cheye onek kothin. 30 minute e 2500+ character error chara type kora ar screen record korar pressure ta notun der jonno ektu beshi hoye jay. Ami 3rd try te pass kore 2,400 tk peyechi, etake aro ektu sohoj korle valo hoto.'
    },
    {
      rating: 8,
      category: 'data',
      workRole: 'Data Entry · Active Worker',
      roleBadge: 'Data Trainee',
      earnings: 'BDT 3,000',
      text: 'আপনাদের প্রজেক্টের কাজগুলো আসলেই অনেক কঠিন এবং খুঁটিনাটি ভুল ধরার সিস্টেম খুব কড়া। প্রথম শিটটায় একটা ফর্মুলা ভুল থাকায় রিজেক্ট হয়েছিল, আমাকে আরও প্র্যাকটিস করতে হবে। তবে দ্বিতীয় প্রজেক্ট ঠিকমতো জমা দিয়ে ৩,০০০ টাকা পেয়েছি।'
    },
    {
      rating: 8,
      category: 'form',
      workRole: 'Form Fillup · Active Worker',
      roleBadge: 'Form Fillup Worker',
      earnings: 'BDT 3,600',
      text: 'Form fillup kore BDT 3,600 peyechi tobe data entry r quantity onek barano hoyeche. 60 ta client theke khoja ar 40 ta column fillup korte ek bosay 1.5 ghonta lege jay. Payout 100% real kintu workload ektu heavy.'
    },
    {
      rating: 8,
      category: 'typing',
      workRole: 'Typing Work · Active Worker',
      roleBadge: 'Active Worker',
      earnings: 'BDT 1,800',
      text: 'The payment system and balance transfer both work properly—withdrew BDT 1,800 without trouble. My only gripe is that the typing passage length feels overwhelming on a phone keyboard; laptop users definitely have an advantage here.'
    },
    {
      rating: 8,
      category: 'affiliate',
      workRole: 'Affiliate Shop · Active Seller',
      roleBadge: 'Affiliate Seller',
      earnings: 'BDT 2,800',
      text: 'অ্যাফিলিয়েট শপের প্রোডাক্টগুলো ভালো এবং কমিশনও ঠিকমতো দেয়। তবে এখন অনেকেই একসাথে শেয়ার করায় সেল আনতে ভালোই সময় ও মার্কেটিং স্কিল লাগে। এ পর্যন্ত ২,৮০০ টাকা পেয়েছি।'
    },
    {
      rating: 8,
      category: 'general',
      workRole: 'Microjob · Active Worker',
      roleBadge: 'Microjob Worker',
      earnings: 'BDT 2,200',
      text: 'Kaj submit korar por verification e kokhono 3-4 ghonta pore approval ashe, tobe group e admin ke bolle dekhe dey. Ekhon porjonto 2,200 taka withdraw korechi, bishashjoggo site.'
    }
  ],
  7: [
    {
      rating: 7,
      category: 'typing',
      workRole: 'Typing Work · Active Worker',
      roleBadge: 'Typing Learner',
      text: 'Bhai typing er kaj ta khub e kothin lagse amar kache. 30 minute timer shuru howar por 2500+ okkhor type korte giye 2 bar time out hoye gelo, ar tarpor 2 ghonta lock thake. Eta ektu sohoj korle amader moto new worker der jonno subidha hoto.'
    },
    {
      rating: 7,
      category: 'data',
      workRole: 'Data Entry · Active Worker',
      roleBadge: 'Data Entry Member',
      text: 'আপনাদের প্রজেক্টের কাজগুলো অনেক কঠিন, কোনো শর্টকাট বা অনুমান করে জমা দিলে সরাসরি বাতিল করে দেয়। আমার এক্সেলের বেসিক দুর্বল থাকায় দুবার রিজেক্ট খেয়েছি, আমাকে আরও প্র্যাকটিস করে তারপর সাবমিট করতে হবে।'
    },
    {
      rating: 7,
      category: 'typing',
      workRole: 'Typing Work · Active Worker',
      roleBadge: 'Active Worker',
      earnings: 'BDT 1,200',
      text: 'একটা প্রজেক্ট শেষ করে ১,২০০ টাকা পেয়েছি ঠিকই, কিন্তু সত্যি বলতে টাইপিং আর ফর্ম ফিলাপ দুটোতেই অনেক ধৈর্য লাগে। তাড়াহুড়ো করে টাইপ করলে বানান ভুল ধরে দেয়, স্পিড বাড়ানো ছাড়া উপায় নেই।'
    },
    {
      rating: 7,
      category: 'form',
      workRole: 'Form Fillup · Active Worker',
      roleBadge: 'Batch Worker',
      earnings: 'BDT 1,500',
      text: 'Platform genuine, bKash e 1,500 taka cashout o peyechi ar balance transfer o kaj kore. Kintu kajer quantity eto beshi je choto screen wala phone diye form fillup korte chokh byatha hoye jay. Laptop chara kora ektu kothin.'
    },
    {
      rating: 7,
      category: 'general',
      workRole: 'Data Entry · Active Worker',
      roleBadge: 'Trainee',
      text: 'Honestly the tasks here are much tougher than typical microjob sites. Between the strict audit rules and the long validation sheets, I need more practice before I can finish assignments smoothly and earn faster.'
    },
    {
      rating: 7,
      category: 'typing',
      workRole: 'Typing Work · Active Worker',
      roleBadge: 'Typing Trainee',
      text: 'Typing er text onek boro ar time kom, ami ekhono 1st batch complete korte pari nai. Tobe live chat e dekhlam jara 1-2 mas practice korche tara thik e parche, dekhi chesta chalay jacchi.'
    }
  ]
};

const RELATIVE_DATES_EN = [
  'Today · 14 mins ago',
  'Today · 42 mins ago',
  'Today · 1 hour ago',
  'Today · 3 hours ago',
  'Today · 5 hours ago',
  'Yesterday',
  '2 days ago',
  '3 days ago',
  '4 days ago',
  '5 days ago',
  '6 days ago',
  '1 week ago',
  '2 weeks ago'
];

// Pattern for the 100 displayed reviews:
// - First 3 are 10/10
// - Followed by 9, 10, 9, 8...
// - Overall 10, 9, 8 dominate (~84 items) with clear representation of 7/10 (~16 items)
const RATING_SEQUENCE_100: (7 | 8 | 9 | 10)[] = (() => {
  const seq: (7 | 8 | 9 | 10)[] = [
    10, 10, 10,
    9, 9,
    10, 10,
    9,
    8, 8
  ];
  const cycle: (7 | 8 | 9 | 10)[] = [
    10, 9, 10, 8, 9, 7, 10, 9, 8, 10, 9, 8, 7, 10, 9, 8, 10, 7, 9, 8, 10, 9, 7, 8, 9
  ];
  let idx = 0;
  while (seq.length < 100) {
    seq.push(cycle[idx % cycle.length]);
    idx++;
  }
  return seq.slice(0, 100);
})();

function seededInt(seed: number): number {
  let x = (seed ^ 0x9e3779b9) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b) >>> 0;
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35) >>> 0;
  return (x ^ (x >>> 16)) >>> 0;
}

const POOL_SIZE = 1360;

function buildPoolByRating(): Record<7 | 8 | 9 | 10, StudentReview[]> {
  const buckets: Record<7 | 8 | 9 | 10, StudentReview[]> = {
    10: [],
    9: [],
    8: [],
    7: []
  };

  const ratingsOrder: (7 | 8 | 9 | 10)[] = [10, 9, 10, 9, 8, 10, 9, 8, 7];

  for (let i = 0; i < POOL_SIZE; i++) {
    const h1 = seededInt(i * 19 + 101);
    const h2 = seededInt(i * 37 + 307);
    const h3 = seededInt(i * 59 + 709);

    const rating = ratingsOrder[i % ratingsOrder.length];
    const tmpls = TEMPLATES_BY_RATING[rating];
    const tmpl = tmpls[(i + (h2 % 11)) % tmpls.length];

    const isFemale = h1 % 10 < 4;
    const fullName = isFemale
      ? `${FEMALE_FIRST_EN[h1 % FEMALE_FIRST_EN.length]} ${FEMALE_LAST_EN[h2 % FEMALE_LAST_EN.length]}`
      : `${MALE_FIRST_EN[h1 % MALE_FIRST_EN.length]} ${MALE_LAST_EN[h2 % MALE_LAST_EN.length]}`;

    const location = DISTRICTS[h3 % DISTRICTS.length];
    const avatarTone = AVATAR_TONES[(i + h1) % AVATAR_TONES.length];

    // ~68% NO profile photo (colored monogram circle), ~32% casual flower/cat/nature image
    const avatarUrl =
      h2 % 10 < 3 ? CASUAL_AVATAR_URLS[h3 % CASUAL_AVATAR_URLS.length] : undefined;

    const projectCode = String(1000000 + (seededInt(i * 97 + 13) % 8999999));

    buckets[rating].push({
      id: `rev-pool-${1000 + i}`,
      name: fullName,
      gender: isFemale ? 'female' : 'male',
      location,
      workRole: tmpl.workRole,
      roleBadge: tmpl.roleBadge,
      avatarUrl,
      avatarTone,
      rating: tmpl.rating,
      text: tmpl.text,
      category: tmpl.category,
      date: RELATIVE_DATES_EN[i % RELATIVE_DATES_EN.length],
      likes: 8 + (h3 % 64),
      earnings: tmpl.earnings,
      projectSuccessId: projectCode,
      isVerified: true,
      status: 'approved'
    });
  }

  return buckets;
}

const POOL_BUCKETS = buildPoolByRating();

export function getDailyRotatedReviews(now: Date = new Date()): {
  reviews: StudentReview[];
  dailyCount: number;
  daySeed: number;
} {
  const daySeed = Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86400000
  );

  const cursors: Record<7 | 8 | 9 | 10, number> = {
    10: (daySeed * 11) % POOL_BUCKETS[10].length,
    9: (daySeed * 9) % POOL_BUCKETS[9].length,
    8: (daySeed * 7) % POOL_BUCKETS[8].length,
    7: (daySeed * 3) % POOL_BUCKETS[7].length
  };

  const display100: StudentReview[] = RATING_SEQUENCE_100.map((targetRating, idx) => {
    const bucket = POOL_BUCKETS[targetRating];
    const item = bucket[cursors[targetRating] % bucket.length];
    cursors[targetRating] += 1;

    return {
      ...item,
      date: idx < 8 ? RELATIVE_DATES_EN[idx % 5] : item.date
    };
  });

  return {
    reviews: display100,
    dailyCount: 100,
    daySeed
  };
}

export const ALL_DEFAULT_REVIEWS: StudentReview[] = getDailyRotatedReviews().reviews;
