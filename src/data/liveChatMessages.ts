export interface PresetMessage {
  userName: string;
  district: string;
  text: string;
}

const FIRST_NAMES = [
  "Tanvir Hasan", "Sadia Sultana", "Ariful Islam", "Nusrat Jahan Mim", "Rakibul Islam",
  "Mehedi Hasan Shuvo", "Farhana Akter", "Sabbir Ahmed", "Shamima Nasrin", "Sourav Barua",
  "Afrin Jahan", "Mahmudul Hasan", "Rifat Chowdhury", "Jannatul Ferdous", "Imran Nazir",
  "Puja Rani Das", "Al-Amin Hossain", "Tania Islam", "Shahriar Nafiz", "Sumaiya Khanom",
  "Naimur Rahman", "Fahim Faisal", "Rokeya Sultana", "Shoriful Haque", "Nabil Mahmud",
  "Afsana Mirza", "Kazi Enamul Haque", "Saidur Rahman", "Samira Haque", "Mostafizur Rahman",
  "Shahnaz Parvin", "Moniruzzaman", "Tahmina Khatun", "Atikur Rahman", "Zerin Tasnim",
  "Kamrul Hasan", "Selina Begum", "Rofiqul Islam", "Tasnim Akter", "Sajjad Hossain",
  "Tariqul Islam", "Abdullah Al Mamun", "Maliha Chowdhury", "Zakir Hossain", "Fariha Islam"
];

const DISTRICTS = [
  "Dhaka", "Chattogram", "Rajshahi", "Khulna", "Sylhet", "Rangpur", "Barishal", "Mymensingh",
  "Cumilla", "Cox's Bazar", "Gazipur", "Bogura", "Feni", "Pabna", "Dinajpur", "Jashore",
  "Tangail", "Narayanganj", "Noakhali", "Brahmanbaria", "Patuakhali", "Sirajganj", "Satkhira"
];

// Realistic conversational Q&A pairs + problem solving + reviews + moderator & lead gen discussions
const CONVERSATION_THREADS: { messages: { text: string; nameOffset?: number }[] }[] = [
  {
    messages: [
      { text: "ভাই Data Entry প্রজেক্টের Google Sheet লিংক দিলাম কিন্তু সাবমিট করার পর প্রবলেম দেখাচ্ছে কেন?", nameOffset: 0 },
      { text: "ভাই Google Sheet এর Share অপশনে গিয়ে 'Anyone with the link - Viewer/Editor' অন করেছেন? Restricted থাকলে অডিট সিস্টেম ফাইল দেখতে পায় না।", nameOffset: 5 },
      { text: "ওহ হ্যাঁ ভাই, Restricted ছিল! এখন Anyone with the link করে আবার দিলাম, সাবমিট নিয়ে নিছে। ধন্যবাদ!", nameOffset: 0 }
    ]
  },
  {
    messages: [
      { text: "আমি Content Moderator এর জন্য এপ্লাই করেছি ৩ দিন হলো, অ্যাপ্রুভ হতে আসলে কতদিন লাগতে পারে কেউ জানেন?", nameOffset: 1 },
      { text: "সাদিয়া আপু আমারটা হতে ৫ দিন লেগেছিল। প্রোফাইল ও আগের কাজের এক্টিভিটি চেক করে টিম থেকে মেসেজ দেয়। একটু ধৈর্য ধরে অপেক্ষা করেন।", nameOffset: 6 },
      { text: "বুঝতে পারছি ভাই, দেখি আর কয়দিন লাগে। ততদিন আগের কাজগুলো চালিয়ে যাই।", nameOffset: 1 }
    ]
  },
  {
    messages: [
      { text: "Ajke Lead Generation er kaj kemon cholche sobar? Lead ki valo ashtese?", nameOffset: 2 },
      { text: "Alhamdulillah vai, ajke dupur theke 4 ta lead convert hoise! Bhalo response paitesi FB post ar group theke.", nameOffset: 7 },
      { text: "Vai amar kache inquiry ashe kintu convert kom hocche, ki vabe kotha bolle valo hoy?", nameOffset: 8 },
      { text: "Vai shudhu link send korben na, age banglay kajta ki ar kivabe shuru korbe 2 line bujhiye bolen, tahole conversion onek bare.", nameOffset: 7 }
    ]
  },
  {
    messages: [
      { text: "Typing কাজ করতে গিয়ে টাইপ বক্স অন হচ্ছে না কেন ভাই? লেখা যাচ্ছে না!", nameOffset: 3 },
      { text: "আরে ভাই উপরের/নিচের সবুজ 'Start Task' বাটনে আগে ক্লিক করতে হবে! ওইটাতে ক্লিক করলে ৩০ মিনিটের টাইমার চালু হবে আর বক্স অন হবে।", nameOffset: 9 },
      { text: "ওকে ভাই ক্লিক করছি, এখন টাইপ করা যাচ্ছে। আর পেজ রিফ্রেশ দিলে নাকি ২ ঘণ্টা লক হয়ে যায়?", nameOffset: 3 },
      { text: "হ্যাঁ ভাই, Start করার পর পেজ রিফ্রেশ দিলে বা ৩০ মিনিটে শেষ না করলে ২ ঘণ্টার কুলডাউন লক পড়ে যায়। সাবধানে একবারে শেষ করবেন।", nameOffset: 9 }
    ]
  },
  {
    messages: [
      { text: "Alhamdulillah aajke bKash e 1,450 taka withdraw nilam, 22 minute er moddhe cash peye gesi!", nameOffset: 4 },
      { text: "MashaAllah vai, apni kon kon module niye kaj kortechen?", nameOffset: 10 },
      { text: "Ami Lead Generation ar Product Sell kori beshi, sathe free time e Data Entry kori.", nameOffset: 4 }
    ]
  },
  {
    messages: [
      { text: "Form Fill-up e amar 40 ta field submit hocche na keno? বার বার error dekhay!", nameOffset: 11 },
      { text: "Check koren ekta field o jeno blank na thake ar paste/autofill korben na, ekdom manual type korle Save nibe.", nameOffset: 12 },
      { text: "Oh accha, ami ektu fast type korte giye 2 ta field miss korsilam, ekhon thik hoise bhai!", nameOffset: 11 }
    ]
  },
  {
    messages: [
      { text: "কাজের ক্ষেত্রে একটা জিনিস ভালো লাগলো—স্ক্রিন রেকর্ডিং আর রিয়েল ডাটা এন্ট্রির কারণে যারা আসলেই কাজ জানে তারাই টিকতে পারে, ফেইক লোক কম।", nameOffset: 13 },
      { text: "ঠিক বলছেন ভাই, তবে টাইপিং জব একটু বেশি কঠিন হয়ে গেছে ২৫০০+ ক্যারেক্টার দেওয়ায় 😅 কিন্তু প্র্যাকটিস করলে হাত অনেক ফাস্ট হয়।", nameOffset: 14 }
    ]
  },
  {
    messages: [
      { text: "Moderator apply korar por kono interview ba test hoy naki?", nameOffset: 15 },
      { text: "Normal e basic profile review ar communication check kore vai. 4 theke 7 working days er moddhe status update hoye jay.", nameOffset: 16 }
    ]
  },
  {
    messages: [
      { text: "Affiliate Marketing er Unity Earning Shop theke amar 2 ta product sell hoise ajke Alhamdulillah!", nameOffset: 17 },
      { text: "Kivabe sell korlen apu? Ami to link share korlam kintu order asheni ekhono.", nameOffset: 18 },
      { text: "Product er ID ar direct shop link ta valo vabe caption likhe WhatsApp status ar local buying group e share koren, response paben InshaAllah.", nameOffset: 17 }
    ]
  },
  {
    messages: [
      { text: "Amar Data Entry project #2 submit disi 1 ghonta age, ekhono Under Review dekhacche, approve hobe to?", nameOffset: 19 },
      { text: "Hae vai tension niyen na, 2 ghonta review window thake. Formula r BDT 50 deduction thik thakle review sesh holei update paben.", nameOffset: 20 }
    ]
  },
  {
    messages: [
      { text: "Lead gen e ai week e amar 9 ta lead convert hoise Alhamdulillah! Sobai try koren, regular 2-3 hour dile valo outcome ashe.", nameOffset: 21 },
      { text: "MashaAllah bhai, apnar convert rate to onek bhalo! Ami ajke theke abar notun kore lead follow-up shuru kortesi.", nameOffset: 22 }
    ]
  },
  {
    messages: [
      { text: "Typing job e bhul korle ki approve hoy na? Amar passage e ekta wrong year chilo, oita ki change korte hobe?", nameOffset: 23 },
      { text: "Ha bhai! Upore yellow box e 'টাস্ক পরিবর্তন ও ভুল সংশোধনের রুলস' দেওয়া আছে, ওইগুলা ঠিক করে টাইপ করতে হবে, naile audit e reject dekhabe.", nameOffset: 24 },
      { text: "Thanks vai! Bhalo hoise age jiggesh kore nisi, nahole abar 2 hour cooldown khete hoto.", nameOffset: 23 }
    ]
  },
  {
    messages: [
      { text: "কাউকে ব্যালেন্স ট্রান্সফার করতে চাইলে থ্রি-লাইন মেনু থেকে ব্যালেন্স ট্রান্সফারে গিয়ে আইডি দিলেই সাথে সাথে চলে যায়। খুব হেল্পফুল ফিচার।", nameOffset: 25 },
      { text: "হ্যাঁ ভাই আমি গতকাল ফ্রেন্ডের একাউন্টে ৩০০ টাকা সেন্ড করলাম, কোনো ঝামেলা ছাড়াই হয়ে গেছে।", nameOffset: 26 }
    ]
  },
  {
    messages: [
      { text: "Bhai Nagad e withdraw request disi 15 min holo, ashte kotokkhon lage sadharonoto?", nameOffset: 27 },
      { text: "Sadharonoto 15-40 minute er moddhe chole ashe vai, peak hour e ektu beshi somoy nite pare but payment clear hoye jay.", nameOffset: 28 },
      { text: "Alhamdulillah ai matro Nagad SMS ashlo 950 taka received! Thank you vai.", nameOffset: 27 }
    ]
  },
  {
    messages: [
      { text: "Content Moderator job er application amar 6 din holo pending, support e ki knock dibo?", nameOffset: 29 },
      { text: "7 din par hole WhatsApp live support e আপনার Student ID দিয়ে জিজ্ঞেস করতে পারেন আপু, ওরা বলে দিবে কোন পর্যায়ে আছে।", nameOffset: 30 }
    ]
  },
  {
    messages: [
      { text: "Ajke বাংলা টাইপিং টাস্ক ৪ ও ৭ করতে গিয়ে হাত ব্যথা হয়ে গেছে ভাই, ৩০০০ ক্যারেক্টারের বেশি ছিল মনে হয়!", nameOffset: 31 },
      { text: "Bhai বিজয় বা অভ্র কিবোর্ড দিয়ে ল্যাপটপে টাইপ করলে অনেক সহজ হয়, মোবাইলে এত বড় বাংলা প্যাসেজ ৩০ মিনিটে শেষ করা বেশ কঠিন।", nameOffset: 32 }
    ]
  },
  {
    messages: [
      { text: "Alhamdulillah ei mashe lead generation ar product affiliate milaye 6,800 taka earn korsi. Shuru te mone hoisilo parbo na, ekhon bhaloi cholche.", nameOffset: 33 },
      { text: "Congrats vai! Consistency thakle obossoi valo kichu kora jay.", nameOffset: 34 }
    ]
  },
  {
    messages: [
      { text: "Video proof upload korte giye Amar Google Drive link ta error bolche keno?", nameOffset: 35 },
      { text: "Link er access 'Restricted' thakle error dekhay vai. Drive e Manage Access e giye 'Anyone with the link' select kore copy link din.", nameOffset: 36 },
      { text: "Oh thik ase vai, access change kore abar disi, ekhon niye nise!", nameOffset: 35 }
    ]
  }
];

export const generate500RealisticChatPool = (): PresetMessage[] => {
  const pool: PresetMessage[] = [];
  let threadIdx = 0;

  // Build ordered conversational sequences so problems & answers always appear logically back-to-back
  while (pool.length < 520) {
    const thread = CONVERSATION_THREADS[threadIdx % CONVERSATION_THREADS.length];
    const baseSeed = threadIdx * 7;

    thread.messages.forEach((m, msgStep) => {
      const idx = baseSeed + (m.nameOffset ?? msgStep * 3);
      pool.push({
        userName: FIRST_NAMES[idx % FIRST_NAMES.length],
        district: DISTRICTS[(idx * 3) % DISTRICTS.length],
        text: m.text
      });
    });

    threadIdx++;
  }

  return pool.slice(0, 520);
};

export const generate320RealisticChatPool = generate500RealisticChatPool;

export const REALISTIC_STUDENT_CHAT_MESSAGES: PresetMessage[] = generate500RealisticChatPool();
