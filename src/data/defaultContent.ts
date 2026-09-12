export interface SiteContent {
  // --- HOME PAGE ---
  // Hero
  homeHeroHeadline: string;
  homeHeroSubtext: string;
  homeHeroImg: string;
  // Featured Menu
  homeFeaturedEyebrow: string;
  homeFeaturedHeadline: string;
  homeFeaturedSubline: string;
  homeFeaturedBottomHint: string;
  // Find Us
  homeFindEyebrow: string;
  homeFindHeadline: string;
  homeFindSubline: string;
  // Why Bite Up
  homeWhyEyebrow: string;
  homeWhyHeadline: string;
  homeWhySubtitle: string;
  homeWhyPillar1Title: string;
  homeWhyPillar1Desc: string;
  homeWhyPillar2Title: string;
  homeWhyPillar2Desc: string;
  homeWhyPillar3Title: string;
  homeWhyPillar3Desc: string;
  homeWhyPillar4Title: string;
  homeWhyPillar4Desc: string;
  // Nutrition
  homeNutritionEyebrow: string;
  homeNutritionHeadline: string;
  // Story
  homeStoryEyebrow: string;
  homeStoryHeadline: string;
  homeStoryBody: string;
  homeStoryImg: string;
  // Instagram
  homeIgEyebrow: string;
  homeIgHeadline: string;
  homeIgSubtitle: string;
  homeIgLinkUrl: string;
  homeIgPostUrl: string;
  // CTA
  homeCtaHeadline: string;
  homeCtaSubtext: string;

  // --- ABOUT PAGE ---
  // Hero
  aboutHeroEyebrow: string;
  aboutHeroHeadline: string;
  aboutHeroSubtext: string;
  aboutHeroImg: string;
  // Mission
  aboutMissionEyebrow: string;
  aboutMissionTitle: string;
  aboutMissionLeadP: string;
  aboutMissionSecondP: string;
  aboutMissionImageCaption: string;
  aboutMissionImg: string;
  // Philosophy
  aboutPhilPillar1Title: string;
  aboutPhilPillar1Desc: string;
  aboutPhilPillar2Title: string;
  aboutPhilPillar2Desc: string;
  aboutPhilPillar3Title: string;
  aboutPhilPillar3Desc: string;
  aboutPhilPillar4Title: string;
  aboutPhilPillar4Desc: string;
  // Retail
  aboutRetailEyebrow: string;
  aboutRetailHeadline: string;
  aboutRetailSubtitle: string;

  // --- CHATBOT & AI TRAINING ---
  chatbotEnabled?: string;
  chatbotAssistantName?: string;
  chatbotWelcomeHeading?: string;
  chatbotWelcomeSubtext?: string;
  chatbotApiProvider?: string;
  chatbotApiKey?: string;
  chatbotModel?: string;
  chatbotApiUrl?: string;
  chatbotTemperature?: string;
  chatbotMaxTokens?: string;
  chatbotSystemPrompt?: string;
  chatbotKnowledgeBase?: string;
  chatbotQuickSuggestions?: string;
  menuCategories?: string;
  retailAreas?: string;
  adminUsername?: string;
  adminPassword?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
}

export const defaultMenuCategories: MenuCategory[] = [
  { id: 'pudding', name: 'PROTEIN PUDDINGS' },
  { id: 'granola', name: 'CRUNCHY GRANOLAS' }
];

export const defaultRetailAreas: string[] = [
  'Marj Al Hamam',
  'Al Jubeiha',
  'Dahiyat Al Rashid',
  'Sweileh',
  'Abu Nsair',
  'Tabarbour',
  'Wadi Saqra',
  'Shmeisani',
  'Khalda'
];

export const defaultContent: SiteContent = {
  // --- HOME PAGE ---
  homeHeroHeadline: "CRAVE BETTER.\nBITE UP.",
  homeHeroSubtext: "Protein-packed treats made for when you want something delicious while staying mindful of what you eat.",
  homeHeroImg: "/images/product-nuts.jpg",
  
  homeFeaturedEyebrow: "FEATURED MENU",
  homeFeaturedHeadline: "YOUR NEXT FAVORITE",
  homeFeaturedSubline: "A few of the bites you'll want to try.",
  homeFeaturedBottomHint: "Puddings, granola & more.",

  homeFindEyebrow: "WHERE TO FIND US",
  homeFindHeadline: "FIND BITE UP NEAR YOU",
  homeFindSubline: "Available at selected supermarkets and coffee spots across Amman.",

  homeWhyEyebrow: "WHY BITE UP",
  homeWhyHeadline: "TASTE GOOD.\nFEEL GOOD.",
  homeWhySubtitle: "No compromises, no weird aftertaste. Just honest protein treats designed for your everyday momentum.",
  homeWhyPillar1Title: "HIGH PROTEIN",
  homeWhyPillar1Desc: "Up to 18g clean protein.",
  homeWhyPillar2Title: "NO ADDED SUGAR",
  homeWhyPillar2Desc: "Naturally sweet, no spikes.",
  homeWhyPillar3Title: "SMARTER CHOICES",
  homeWhyPillar3Desc: "Crafted fresh in Amman.",
  homeWhyPillar4Title: "GREAT TASTE",
  homeWhyPillar4Desc: "Rich dessert satisfaction.",

  homeNutritionEyebrow: "MACRONUTRIENTS",
  homeNutritionHeadline: "WHAT'S IN YOUR BITE?",

  homeStoryEyebrow: "OUR STORY",
  homeStoryHeadline: "WE BELIEVE HEALTHY\nSHOULD TASTE GOOD.",
  homeStoryBody: "We started BITE UP because we refused to choose between staying on track with fitness and enjoying authentic desserts. Handcrafted fresh daily in Amman, Jordan, every cup delivers rich indulgence with the clean macronutrients your body respects.",
  homeStoryImg: "/images/brand-banner.png",
  
  homeIgEyebrow: "FOLLOW @BIT.EUP ↗",
  homeIgHeadline: "THE BITE UP COMMUNITY",
  homeIgSubtitle: "Daily drops, fresh cups, and good energy across Amman.",
  homeIgLinkUrl: "https://www.instagram.com/bit.eup/",
  homeIgPostUrl: "https://www.instagram.com/reel/DcO2fJfuMMy/",

  homeCtaHeadline: "READY TO BITE UP?",
  homeCtaSubtext: "Your next craving is waiting.",


  // --- ABOUT PAGE ---
  aboutHeroEyebrow: "THE BITE UP STORY",
  aboutHeroHeadline: "WE BELIEVE HEALTHY\nSHOULD TASTE GOOD.",
  aboutHeroSubtext: "Handcrafted in Amman, Jordan. Protein-packed treats made for when you want something delicious while staying mindful of what you eat.",
  aboutHeroImg: "/images/brand-banner.png",
  
  aboutMissionEyebrow: "OUR MISSION",
  aboutMissionTitle: "WHY BITE UP?",
  aboutMissionLeadP: "We believe that healthy food shouldn't feel like a compromise or a strict punishment. It should be creamy, rich, satisfying, and something you genuinely celebrate every day.",
  aboutMissionSecondP: "Every cup is crafted with clean macronutrients, up to 18 grams of quality protein, and no added sugars. Whether you're heading to the gym, in back-to-back meetings, or enjoying a late-night craving, BITE UP is fuel that loves you back.",
  aboutMissionImageCaption: "REAL INGREDIENTS. ZERO EXCUSES.",
  aboutMissionImg: "/images/product-chocolate.jpg",

  aboutPhilPillar1Title: "HIGH PROTEIN",
  aboutPhilPillar1Desc: "Formulated with up to 18g of clean protein per serving to support satiety and recovery.",
  aboutPhilPillar2Title: "NO ADDED SUGAR",
  aboutPhilPillar2Desc: "Naturally balanced taste with zero refined sugars, preventing afternoon energy crashes.",
  aboutPhilPillar3Title: "AMMAN CRAFTED",
  aboutPhilPillar3Desc: "Locally made fresh daily in Jordan using premium, verified ingredients.",
  aboutPhilPillar4Title: "UNCOMPROMISED TASTE",
  aboutPhilPillar4Desc: "Silky puddings, crunchy granolas, and pure chocolate notes you crave without guilt.",

  aboutRetailEyebrow: "RETAIL LOCATIONS",
  aboutRetailHeadline: "FIND BITE UP IN AMMAN",
  aboutRetailSubtitle: "Available at your favorite neighborhood supermarkets and specialty coffee spots across Amman.",

  // --- CHATBOT & AI TRAINING ---
  chatbotEnabled: "true",
  chatbotAssistantName: "BITE UP Assistant",
  chatbotWelcomeHeading: "Welcome to BITE UP 👋",
  chatbotWelcomeSubtext: "High-protein, guilt-free treats crafted fresh in Amman with zero added sugar. How can I help you crave better today?",
  chatbotApiProvider: "openrouter",
  chatbotApiKey: "",
  chatbotModel: "google/gemini-2.0-flash-001",
  chatbotApiUrl: "https://openrouter.ai/api/v1/chat/completions",
  chatbotTemperature: "0.7",
  chatbotMaxTokens: "800",
  chatbotSystemPrompt: `أنت المساعد الذكي الرسمي لعلامة BITE UP (بايت أب) المتخصصة في الحلويات والسناكات الصحية الغنية بالبروتين وبدون سكر مضاف في عمّان، الأردن. شعارنا: "CRAVE BETTER. BITE UP."

قواعد أساسية وصارمة جداً:
1. منع استخدام الإيموجي أو السمايلات منعاً باتاً:
   يمنع منعاً قاطعاً استخدام أي شكل من أشكال الإيموجي (Emojis) أو السمايلات أو الوجوه التعبيرية أو الرموز في ردودك نهائياً. يجب أن تكون الردود نصية بحتة، راقية، ذكية، واحترافية.

2. الرد عند السؤال عن المنيو أو قائمة الأصناف:
   إذا سأل العميل عن المنيو، أو قائمة الطعام، أو الأصناف المتوفرة، أو "شو عندكم"، يجب عليك ذكر جميع الأصناف الـ 13 كاملة بدون استثناء مقسمة إلى الفئتين التاليتين مع الأسعار والماكروز المختصرة:
   - فئة بودينغ البروتين (السعر: 1.75 دينار للعلبة | 18 غرام بروتين صافي | بدون سكر مضاف):
     1. بودينغ براوني (Pudding Brownie): 345 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون.
     2. بودينغ كوكيز (Pudding Cookies): 345 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون.
     3. بودينغ باونتي (Pudding Bounty): 245 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون.
     4. بودينغ لوتس (Pudding Lotus): 245 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون.
     5. بودينغ أوريو (Pudding Oreo): 345 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون.
     6. بودينغ فيريرو (Pudding Ferrero): 245 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون.
     7. بودينغ سنيكرز (Pudding Snickers): 245 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون.
     8. بودينغ تيراميسو (Pudding Tiramisu): 245 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون.
     9. بودينغ بستاشيو (Pudding Pistachio): 245 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون.
     10. بودينغ كيندر (Pudding Kinder): 345 سعرة حرارية | 18 غرام بروتين | 27 غرام كارب | 3 غرام دهون.
   - فئة كاسات الجرانولا المقرمشة (السعر: 2.00 دينار للعلبة | 16 غرام بروتين | سناك صحي ومقرمش):
     1. جرانولا مكسرات (Granola Nuts): 205 سعرة حرارية | 16 غرام بروتين | 27 غرام كارب | 7 غرام دهون صحية | بدون سكر مضاف.
     2. جرانولا أناناس (Granola Pineapple): 205 سعرة حرارية | 16 غرام بروتين | 27 غرام كارب | 7 غرام دهون صحية | بدون سكر مضاف.
     3. جرانولا فراولة (Granola Strawberry): 205 سعرة حرارية | 16 غرام بروتين | 27 غرام كارب | 7 غرام دهون صحية | سكر طبيعي من الفواكه فقط.

3. الرد عند السؤال عن أي صنف معين أو كم غرام فيه:
   إذا سأل العميل عن صنف معين أو استفسر عن عدد الغرامات أو الماكروز أو المكونات، يجب تزويده بكافة التفاصيل بالأرقام والغرامات الكاملة:
   - اسم الصنف باللغتين العربية والإنجليزية.
   - السعر الدقيق بالدينار الأردني (JD).
   - السعرات الحرارية الكلية (kcal).
   - كمية البروتين الصافي بالغرام (g) مع ذكر أنه واي بروتين معزول نقي (Whey Protein Isolate).
   - كمية الكاربوهيدرات بالغرام (g).
   - كمية الدهون بالغرام (g).
   - حالة السكر (بدون سكر مضاف، أو سكر طبيعي من الفواكه).
   - وصف النكهة والقوام.
   - طريقة الحفظ: مبرد بالثلاجة بين 2 إلى 4 درجات مئوية، والاستهلاك خلال 5 أيام من الإنتاج.

4. الذكاء في المساعدة وتوجيه العميل وإتمام الطلب (تقليل ضغط الواتساب):
   - هدفك الأساسي أن تجيب العميل على كل أسئلته بدقة واحترافية حتى لا يضطر للسؤال الطويل على الواتساب، وتساعده في اتخاذ قراره فوراً.
   - إذا سأل عن الدايت أو التنشيف: رشح له الأصناف بـ 245 سعرة (باونتي، لوتس، فيريرو، سنيكرز، تيراميسو، بستاشيو) مع 18g بروتين.
   - إذا سأل عن الشوكولاتة الغنية: رشح له البراوني أو الكوكيز أو الكيندر.
   - إذا سأل عن طريقة الطلب: وضّح له أنه يستطيع اختيار الأصناف وإضافتها إلى السلة هنا في الموقع، ثم الضغط على إتمام الطلب لتتحول السلة تلقائياً إلى رسالة جاهزة عبر الواتساب مع العناوين والأسعار لتأكيد سريع.
   - إذا سأل عن التوصيل: التوصيل متاح لجميع مناطق عمّان.
   - إذا سأل عن المحل أو السوبرماركت: متوفرين في أكثر من 15 سوبرماركت شريك في عمّان (مرج الحمام، داحية الرشيد، الجبيهة، صويلح، وخلدا).
   - النبرة والأسلوب: تحدث دائماً بلغة العميل؛ إذا سأل أو اختار بالإنجليزية فأجب بإنجليزية ممتازة وراقية واحترافية بدون إيموجي، وإذا سأل بالعربي فتحدث بلهجة عربية أردنية بيضاء راقية ومحترمة وذكية. كن مبتكراً ومقنعاً وانهِ ردك دائماً بسؤال لطيف يقرب العميل من الطلب (مثل: "بتحب تضيفه للسلة وتجربه؟" أو "Would you like to add it to your order?").`,
  chatbotKnowledgeBase: `=== مرجع القائمة الكاملة المعتمدة لـ BITE UP ===

1. بودينغ البروتين (PROTEIN PUDDINGS)
السعر الموحد: 1.75 دينار للعلبة | 18 غرام بروتين صافي | بدون سكر مضاف

• Pudding Brownie (بودينغ براوني):
  - السعر: 1.75 JD
  - السعرات الحرارية: 345 kcal
  - البروتين: 18 غرام صافي (Whey Protein Isolate)
  - الكاربوهيدرات: 27 غرام
  - الدهون: 3 غرام
  - السكر: بدون سكر مضاف نهائياً
  - المذاق: كاكاو بلجيكي فاخر غني وبراوني طري لعشاق الشوكولاتة

• Pudding Cookies (بودينغ كوكيز):
  - السعر: 1.75 JD
  - السعرات الحرارية: 345 kcal
  - البروتين: 18 غرام صافي (Whey Protein Isolate)
  - الكاربوهيدرات: 27 غرام
  - الدهون: 3 غرام
  - السكر: بدون سكر مضاف نهائياً
  - المذاق: كوكيز فانيليا أمريكي كريمي ومتوازن

• Pudding Bounty (بودينغ باونتي):
  - السعر: 1.75 JD
  - السعرات الحرارية: 245 kcal
  - البروتين: 18 غرام صافي (Whey Protein Isolate)
  - الكاربوهيدرات: 27 غرام
  - الدهون: 3 غرام
  - السكر: بدون سكر مضاف نهائياً
  - المذاق: جوز هند طبيعي منعش مع طبقة شوكولاتة خفيفة

• Pudding Lotus (بودينغ لوتس):
  - السعر: 1.75 JD
  - السعرات الحرارية: 245 kcal
  - البروتين: 18 غرام صافي (Whey Protein Isolate)
  - الكاربوهيدرات: 27 غرام
  - الدهون: 3 غرام
  - السكر: بدون سكر مضاف نهائياً
  - المذاق: بسكويت لوتس مكرمل مع لمسة قرفة خفيفة

• Pudding Oreo (بودينغ أوريو):
  - السعر: 1.75 JD
  - السعرات الحرارية: 345 kcal
  - البروتين: 18 غرام صافي (Whey Protein Isolate)
  - الكاربوهيدرات: 27 غرام
  - الدهون: 3 غرام
  - السكر: بدون سكر مضاف نهائياً
  - المذاق: بسكويت أوريو داكن مع كريمة بروتينية

• Pudding Ferrero (بودينغ فيريرو):
  - السعر: 1.75 JD
  - السعرات الحرارية: 245 kcal
  - البروتين: 18 غرام صافي (Whey Protein Isolate)
  - الكاربوهيدرات: 27 غرام
  - الدهون: 3 غرام
  - السكر: بدون سكر مضاف نهائياً
  - المذاق: بندق محمص مع شوكولاتة على طريقة فيريرو روشيه

• Pudding Snickers (بودينغ سنيكرز):
  - السعر: 1.75 JD
  - السعرات الحرارية: 245 kcal
  - البروتين: 18 غرام صافي (Whey Protein Isolate)
  - الكاربوهيدرات: 27 غرام
  - الدهون: 3 غرام
  - السكر: بدون سكر مضاف نهائياً
  - المذاق: كراميل صحي مع فول سوداني محمص وشوكولاتة

• Pudding Tiramisu (بودينغ تيراميسو):
  - السعر: 1.75 JD
  - السعرات الحرارية: 245 kcal
  - البروتين: 18 غرام صافي (Whey Protein Isolate)
  - الكاربوهيدرات: 27 غرام
  - الدهون: 3 غرام
  - السكر: بدون سكر مضاف نهائياً
  - المذاق: قهوة إسبريسو إيطالية وكريمة ماسكاربوني خفيفة

• Pudding Pistachio (بودينغ بستاشيو):
  - السعر: 1.75 JD
  - السعرات الحرارية: 245 kcal
  - البروتين: 18 غرام صافي (Whey Protein Isolate)
  - الكاربوهيدرات: 27 غرام
  - الدهون: 3 غرام
  - السكر: بدون سكر مضاف نهائياً
  - المذاق: فستق حلبي طبيعي كريمي فاخر

• Pudding Kinder (بودينغ كيندر):
  - السعر: 1.75 JD
  - السعرات الحرارية: 345 kcal
  - البروتين: 18 غرام صافي (Whey Protein Isolate)
  - الكاربوهيدرات: 27 غرام
  - الدهون: 3 غرام
  - السكر: بدون سكر مضاف نهائياً
  - المذاق: شوكولاتة كيندر بالحليب مع طبقة كريمة بيضاء

2. كاسات الجرانولا المقرمشة (CRUNCHY GRANOLA)
السعر الموحد: 2.00 دينار للعلبة | 16 غرام بروتين | سناك صحي ومقرمش

• Granola Nuts (جرانولا مكسرات):
  - السعر: 2.00 JD
  - السعرات الحرارية: 205 kcal
  - البروتين: 16 غرام صافي
  - الكاربوهيدرات: 27 غرام
  - الدهون: 7 غرام دهون صحية
  - السكر: بدون سكر مضاف نهائياً
  - المكونات: شوفان محمص مع تشكيلة مكسرات طبيعية غنية بالطاقة والألياف

• Granola Pineapple (جرانولا أناناس):
  - السعر: 2.00 JD
  - السعرات الحرارية: 205 kcal
  - البروتين: 16 غرام صافي
  - الكاربوهيدرات: 27 غرام
  - الدهون: 7 غرام دهون صحية
  - السكر: بدون سكر مضاف نهائياً
  - المكونات: شوفان محمص مع قطع أناناس طبيعي مجفف لمذاق استوائي منعش

• Granola Strawberry (جرانولا فراولة):
  - السعر: 2.00 JD
  - السعرات الحرارية: 205 kcal
  - البروتين: 16 غرام صافي
  - الكاربوهيدرات: 27 غرام
  - الدهون: 7 غرام دهون صحية
  - السكر: سكر طبيعي من الفواكه فقط (بدون سكر مكرر)
  - المكونات: شوفان محمص مع قطع فراولة طبيعية مجففة

معلومات المتجر والتوصيل والحفظ:
- الحفظ: يجب حفظ جميع العلب في الثلاجة في درجة حرارة بين 2 و4 درجات مئوية.
- مدة الصلاحية: تستهلك طازجة خلال 5 أيام من تاريخ الإنتاج.
- التوصيل: متوفر لجميع مناطق عمّان عبر إتمام الطلب من السلة إلى الواتساب.
- نقاط البيع في عمّان: متوفر لدى السوبرماركت والمتاجر الشريكة في مرج الحمام، داحية الرشيد، الجبيهة، صويلح، وخلدا.`,
  chatbotQuickSuggestions: JSON.stringify([
    { id: 's1', label: 'View Full Menu & Prices', prompt: 'Show me the full BITE UP menu with all flavors and prices' },
    { id: 's2', label: 'Lowest Calorie Options', prompt: 'Which BITE UP cups have the lowest calories?' },
    { id: 's3', label: 'Pudding Brownie Macros', prompt: 'What are the full macros and ingredients of Pudding Brownie?' },
    { id: 's4', label: 'Crunchy Granola Cups', prompt: 'Tell me about the granola flavors and how much protein they have' },
    { id: 's5', label: 'Delivery & Storage Guide', prompt: 'How should I store BITE UP cups and how does delivery work in Amman?' }
  ]),
  menuCategories: JSON.stringify(defaultMenuCategories),
  retailAreas: JSON.stringify(defaultRetailAreas),
  adminUsername: 'admin',
  adminPassword: 'biteup2026',
};
