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
  "Shoriful Islam", "Nusrat Binfe Noor", "Imran Nazir", "Al-Amin Hossain", "Shahriar Nafiz",
  "Kamrul Hasan", "Selina Begum", "Rofiqul Islam", "Tasnim Akter", "Sajjad Hossain",
  "Torikul Islam", "Abdullah Al Mamun", "Nabil Mahmud", "Samira Haque", "Tahmina Khatun"
];

const DISTRICTS = [
  "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Sylhet", "Rangpur", "Barisal", "Mymensingh",
  "Comilla", "Cox's Bazar", "Gazipur", "Bogra", "Feni", "Pabna", "Dinajpur", "Jessore",
  "Tangail", "Narayanganj", "Noakhali", "Brahmanbaria", "Patuakhali", "Sirajganj", "Satkhira"
];

const MESSAGE_TEMPLATES = [
  "bhaiya typing er payment ki bKash e kora jabe?",
  "ami matro typing task 1 complete korlam, video record load korte baje laglo",
  "payout rquest deuar koto khon por taka ashe?",
  "Nagad e payout niyechi koto shomoy lagbe keu janno?",
  "vaiya amr data entry project review te ache",
  "ajke 500 taka withdraw nilam, bKash message peyechi 10 min a",
  "Form fillup e client 10 complete korar por batch reject dekhacche keno?",
  "ekhane typing speed er cheye accuracy important bhai",
  "vaiya video upload limit 500 MB korese, thanks!",
  "Screen record er sound soho thakte hobe?",
  "bhaiya ami legal contract paragraphta double check kore submit dilam",
  "bKash e withdraw deuar koto min por ashe keu bolben?",
  "Amr 2 ti project approve holo matro",
  "bhaiya apnader support system onk fast, valo laglo",
  "data entry excel e formula missing dekhale auto reject kore de",
  "ajke typing work e 230 taka bdt income holo, super happy",
  "apnara keyboard use koren naki phone a type koren?",
  "ami legal contract typing task 4 a achi",
  "vaiya apnader whatsapp group ache kono?",
  "Form fillup task unlocked sequential linear, nice security",
  "auto verification onk slow, but accurate",
  "bhaiya amr balance transfer complete hoyeche, dynamic status tracker awesome",
  "ajke total 1500 taka payechi, thanks unity",
  "ami dropshipping prject clear kore matro task submit dilam",
  "bhaiya 20% commission boost offer koto din cholbe?",
  "sobai real copy paste chara type koren naile auto verify te dhoira reject kore dibe",
  "legal contract details visual perfect design",
  "কাজের ভিডিও প্রুফ লিংক ড্রাইভ বা লুম ছাড়া অন্য কিছু দেওয়া যাবে?",
  "বিকাশে ১,৫০০ টাকা উইথড্র দিলাম, ১০ মিনিটের মধ্যে চলে এসেছে।",
  "ফর্ম ফিল-আপের ১০০ ক্লায়েন্টের ডাটা শেষ! ফাইনাল সাবমিট দিয়েছি।",
  "টাইপিং স্পিড ২৫ ডব্লিউপিএম হলে কি এপ্রুভ হবে ভাই?",
  "আজকে লিড জেনারেশনে ১৩০ টাকা করে বোনাস দিচ্ছে, সবাই কাজ শুরু করেন!",
  "৫৫% ডিসকাউন্টে আইডি এক্টিভ করার সুযোগটা অসাধারণ হয়েছে!",
  "সাপ্তাহিক গিফট ক্যাম্পেইনে আমার ৫টা কাজ সাবমিট করলাম, দেখা যাক শুক্রবারে উইনার হই কি না!",
  "সাদিয়া আপু তো গত শুক্রবারে ১,০০০ টাকা ফার্স্ট প্রাইজ পেয়েছিলেন, অভিনন্দন!",
  "ডাটা এন্ট্রি টাস্কের ২০% এক্সট্রা বোনাসটা ওয়ালেটে যোগ হয়ে গেছে ভাই!",
  "ফর্ম ফিলাপের কাজ শেষ করে ব্যালেন্স চেক করলাম, ইনস্ট্যান্ট ক্রেডিট হয়েছে।",
  "কারো ব্যালেন্স ট্রান্সফার দরকার হলে বলেন, আমার ৭ ডিজিট আইডিতে সেন্ড করতে পারবেন।",
  "ভাইয়া আজকে টাইপিংয়ের কাজ কয়টা পর্যন্ত করা যাবে?",
  "আমার ৩টা লিড কনভার্ট হইছে, ৩৯০ টাকা সাথে সাথে ব্যালেন্সে জমা হয়েছে!",
  "সাপোর্ট টিমের সার্ভিস খুব দ্রুত, হোয়াটসঅ্যাপে নক দিতেই সমাধান করে দিল।",
  "আলহামদুলিল্লাহ আজকে মোট ৭৫০ টাকা ইনকাম হলো।"
];

export const generate500RealisticChatPool = (): PresetMessage[] => {
  const pool: PresetMessage[] = [];
  
  // Create 500 varied messages
  for (let i = 0; i < 500; i++) {
    const name = FIRST_NAMES[i % FIRST_NAMES.length];
    const dist = DISTRICTS[i % DISTRICTS.length];
    const baseText = MESSAGE_TEMPLATES[i % MESSAGE_TEMPLATES.length];
    
    // Completely organic text without Resource suffixes!
    pool.push({
      userName: name,
      district: dist,
      text: baseText
    });
  }

  return pool;
};

export const generate320RealisticChatPool = generate500RealisticChatPool;

export const REALISTIC_STUDENT_CHAT_MESSAGES: PresetMessage[] = generate500RealisticChatPool();
