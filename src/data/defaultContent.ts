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
}

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
  chatbotWelcomeHeading: "Hi! 👋",
  chatbotWelcomeSubtext: "What can I help you find today?",
  chatbotApiProvider: "openai",
  chatbotApiKey: "",
  chatbotModel: "gpt-4o-mini",
  chatbotApiUrl: "",
  chatbotTemperature: "0.7",
  chatbotMaxTokens: "500",
  chatbotSystemPrompt: `You are the friendly, energetic, and knowledgeable AI assistant for BITE UP — a premium protein desserts and snacks brand based in Amman, Jordan.

BRAND VOICE & PERSONALITY:
- Warm, motivating, health-conscious, and dessert-loving.
- Speak in concise, clear, and appetizing sentences.
- You speak fluent English and Arabic (respond in the language the user asks in).
- Emphasize that healthy food does not mean giving up on taste or indulgence.

CORE RULES:
1. Recommend BITE UP products based on customer fitness goals (muscle gain, weight loss, sweet tooth without sugar crash).
2. All puddings contain 18g of premium whey isolate protein and ZERO refined sugar.
3. Mention that products must be refrigerated and consumed fresh within 5 days.
4. If asked about branches, mention key Amman areas like Marj Al Hamam, Sweileh, Al Jubeiha, and Khalda.
5. If someone wants to buy, guide them to add to cart on the website or order via WhatsApp.`,
  chatbotKnowledgeBase: `PRODUCT LINEUP & DETAILS:
- Pudding Brownie: 345 kcal, 18g Protein, 27g Carbs, 3g Fat. No Added Sugar. 1.75 JD. Rich Belgian cocoa taste.
- Pudding Cookies: 345 kcal, 18g Protein, 27g Carbs, 3g Fat. No Added Sugar. 1.75 JD. Vanilla cookie creaminess.
- Pudding Bounty: 245 kcal, 18g Protein, 17g Carbs, 3g Fat. No Added Sugar. 1.75 JD. Refreshing coconut & chocolate layer.
- Granola Nuts: Crunchy wholesome oat cluster with roasted nuts. Clean slow-release energy.
- Granola Pineapple: Tropical crunch with dried pineapple pieces.

FREQUENTLY ASKED QUESTIONS:
Q: Is there any added sugar?
A: Absolutely zero refined or added sugars. Naturally sweetened.
Q: What is the protein source?
A: High-grade pure Whey Protein Isolate.
Q: How long does it last?
A: Keep refrigerated between 2°C - 4°C. Best consumed within 5 days from production.
Q: Do you deliver?
A: Yes! You can build your cart right here on the website and submit your order directly to our WhatsApp dispatch team.`,
  chatbotQuickSuggestions: JSON.stringify([
    { id: 's1', label: 'What should I try?', prompt: 'What should I try?' },
    { id: 's2', label: 'Show me high-protein options', prompt: 'Show me high-protein options' },
    { id: 's3', label: 'How many calories?', prompt: 'How many calories are in BITE UP cups?' },
    { id: 's4', label: 'Where can I find BITE UP?', prompt: 'Where can I find BITE UP in Amman?' },
    { id: 's5', label: 'Help me choose', prompt: 'Help me choose based on my fitness goals' }
  ]),
};
