/* ============================================
   ASSISTANT — EcoBot AI Brain (Rule Engine)
   ============================================ */

/**
 * @module assistant
 * Context-aware rule engine that provides personalized
 * eco-advice based on user profile, activity patterns,
 * and footprint breakdown. No external API required.
 */

import { BASELINES, getFootprintRating } from './calculator.js';
import { getTips, getRelevantTips, getRandomTip } from './tips.js';
import { CHALLENGES } from './challenges.js';

/* ---- Conversation State Machine ---- */

/**
 * Conversation states:
 * GREETING → ASSESSMENT → TIP → FOLLOW_UP → IDLE
 */
const STATES = {
  GREETING: 'greeting',
  ASSESSMENT: 'assessment',
  TIP: 'tip',
  FOLLOW_UP: 'follow_up',
  IDLE: 'idle'
};

/* ---- Response Templates ---- */

const GREETINGS = [
  "Hey there! 🌱 I'm EcoBot, your personal sustainability assistant. How can I help you today?",
  "Hi! 🌿 Ready to make a difference? I can give you tips, analyze your footprint, or help set goals.",
  "Hello! 🌍 I'm here to help you reduce your carbon footprint. What would you like to know?",
  "Hey! ♻️ Let's work together on making your lifestyle more sustainable. Ask me anything!"
];

const ENCOURAGEMENTS = [
  "Great job! Every small action counts. 🌟",
  "You're making a real difference! Keep it up! 💪",
  "Awesome progress! The planet thanks you. 🌎",
  "Every kg of CO₂ you save matters. You're on the right track! 🎯",
  "Small changes, big impact. You're doing amazing! ✨"
];

const FOLLOW_UPS = [
  "Want to hear more tips like this?",
  "Would you like to explore other categories?",
  "Can I help you set a reduction goal?",
  "Want me to analyze your recent activity patterns?",
  "Interested in joining a 30-day challenge?"
];

/* ---- Keyword Mappings ---- */

const INTENT_KEYWORDS = {
  greeting: ['hi', 'hello', 'hey', 'hola', 'good morning', 'good evening', 'sup', 'yo'],
  tip: ['tip', 'advice', 'suggest', 'recommend', 'help', 'how can i', 'what should', 'idea'],
  footprint: ['footprint', 'total', 'how much', 'my emissions', 'my co2', 'how am i', 'score', 'rating'],
  transport: ['car', 'drive', 'driving', 'bus', 'train', 'fly', 'flight', 'commute', 'travel', 'bike', 'cycling'],
  diet: ['food', 'eat', 'meat', 'vegan', 'vegetarian', 'diet', 'meal', 'cooking', 'beef', 'chicken'],
  energy: ['energy', 'electricity', 'power', 'heating', 'cooling', 'ac', 'solar', 'light', 'shower', 'laundry'],
  shopping: ['shopping', 'buy', 'purchase', 'clothes', 'fashion', 'online', 'package', 'delivery'],
  challenge: ['challenge', 'goal', 'target', 'reduce', 'commit', '30 day', 'thirty day'],
  compare: ['compare', 'average', 'vs', 'versus', 'compared to', 'global', 'country', 'national'],
  thanks: ['thanks', 'thank you', 'thx', 'cheers', 'awesome', 'great', 'cool', 'nice'],
  whatif: ['what if', 'if i', 'scenario', 'imagine', 'switch', 'change', 'replace'],
  progress: ['progress', 'streak', 'how am i doing', 'improvement', 'better', 'history']
};

/* ---- Core Assistant Class ---- */

export class Assistant {
  constructor() {
    this.state = STATES.GREETING;
    this.conversationHistory = [];
    this.shownTipIds = [];
    this.lastCategory = null;
  }

  /**
   * Process user input and generate a response.
   * @param {string} userMessage - User's message
   * @param {Object} context - Current user context
   * @param {Object} [context.profile] - User profile from quiz
   * @param {Object} [context.breakdown] - Category breakdown
   * @param {Array}  [context.recentActivities] - Recent activity log
   * @param {Object} [context.goals] - User goals
   * @param {number} [context.streak] - Current streak
   * @param {string} [context.apiKey] - Optional Gemini API key for AI responses
   * @returns {Promise<{text: string, quickReplies: string[], type: string}>} Response object
   */
  async respond(userMessage, context = {}) {
    const input = userMessage.toLowerCase().trim();
    const intent = this._detectIntent(input);
    
    // Store in history
    this.conversationHistory.push({ role: 'user', text: userMessage, time: Date.now() });

    let response;

    // Use Gemini API if configured
    if (context.apiKey) {
      try {
        response = await this._generateGeminiResponse(userMessage, context);
      } catch (err) {
        console.error("Gemini API error:", err);
        // Fallback to rule engine
        response = this._getRuleBasedResponse(intent, input, context);
      }
    } else {
      // Use rule-based engine
      response = this._getRuleBasedResponse(intent, input, context);
    }

    // Store response
    this.conversationHistory.push({ role: 'bot', text: response.text, time: Date.now() });
    
    return response;
  }

  async _generateGeminiResponse(userMessage, context) {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(context.apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format context for prompt
    const profileContext = context.profile ? `User Profile: Commutes via ${context.profile.commuteMode} (${context.profile.commuteDistance}km), Diet: ${context.profile.dietType}, Home: ${context.profile.homeSize} with ${context.profile.heatingType} heating.` : "New user, no profile yet.";
    const totalFootprint = context.breakdown?.total ? (context.breakdown.total / 1000).toFixed(1) + " tonnes" : "unknown";
    
    const prompt = `You are EcoBot, an enthusiastic and helpful AI sustainability assistant in the Dharatrack app.
Your goal is to help the user reduce their carbon footprint with practical, actionable advice.
Be concise, use emojis naturally, and format text with markdown (e.g. **bold**).

Context:
${profileContext}
Total Footprint: ${totalFootprint}
Recent Activities: ${context.recentActivities?.length || 0} logged.
Streak: ${context.streak} days.

User Message: "${userMessage}"

Provide a highly personalized response. If you suggest actions, keep them relevant to their profile.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return {
      text: text,
      quickReplies: ['More tips', 'Set a goal', 'Thanks!'],
      type: 'gemini'
    };
  }

  _getRuleBasedResponse(intent, input, context) {
    switch (intent) {
      case 'greeting':
        return this._handleGreeting(context);
      case 'tip':
        return this._handleTipRequest(input, context);
      case 'footprint':
        return this._handleFootprintQuery(context);
      case 'transport':
      case 'diet':
      case 'energy':
      case 'shopping':
        return this._handleCategoryQuery(intent, context);
      case 'challenge':
        return this._handleChallengeQuery(context);
      case 'compare':
        return this._handleCompareQuery(context);
      case 'whatif':
        return this._handleWhatIf(input, context);
      case 'progress':
        return this._handleProgressQuery(context);
      case 'thanks':
        return this._handleThanks();
      default:
        return this._handleUnknown(context);
    }
  }



  /**
   * Generate a proactive message based on recent activity.
   * Called when user logs an activity.
   * @param {Object} context
   * @param {Array} [context.recentActivities] - Recent activity log entries
   * @param {Object} [context.breakdown] - Category breakdown
   * @param {number} [context.streak] - Current logging streak
   * @returns {{text: string, quickReplies: string[], type: string}|null} Message object or null
   */
  getProactiveMessage(context) {
    const { recentActivities, breakdown, streak } = context;
    if (!recentActivities?.length) return null;

    const messages = [];

    // Check for high transport usage this week
    const weekTransport = recentActivities
      .filter(a => a.category === 'transport' && this._isThisWeek(a.date))
      .length;
    
    if (weekTransport >= 5) {
      messages.push({
        text: `🚗 I noticed you drove ${weekTransport} times this week. Have you considered carpooling or trying public transit for some of those trips? It could save up to 50% of your transport emissions!`,
        quickReplies: ['Give me transport tips', 'Tell me more', 'I\'ll try!'],
        type: 'proactive'
      });
    }

    // Check for beef consumption
    const weekBeef = recentActivities
      .filter(a => a.type === 'beef' && this._isThisWeek(a.date))
      .length;

    if (weekBeef >= 3) {
      messages.push({
        text: `🥩 You've had beef ${weekBeef} times this week. Beef is the highest-emission food — even swapping one meal for chicken saves ~5 kg CO₂! Want some tasty alternatives?`,
        quickReplies: ['Show me alternatives', 'Diet tips', 'Join Meatless Monday'],
        type: 'proactive'
      });
    }

    // Celebrate streaks
    if (streak && streak % 7 === 0 && streak > 0) {
      messages.push({
        text: `🔥 Amazing! You've been logging for ${streak} days straight! Consistency is key to understanding and reducing your footprint. ${this._randomPick(ENCOURAGEMENTS)}`,
        quickReplies: ['Show my progress', 'Give me a tip', 'Thanks!'],
        type: 'proactive'
      });
    }

    // High energy usage
    const weekEnergy = recentActivities
      .filter(a => a.category === 'energy' && this._isThisWeek(a.date));
    const weekEnergyTotal = weekEnergy.reduce((sum, a) => sum + (a.co2 || 0), 0);
    
    if (weekEnergyTotal > 20) {
      messages.push({
        text: `⚡ Your energy emissions are running high this week (${weekEnergyTotal.toFixed(1)} kg CO₂). Try the Unplug & Save challenge to cut phantom energy use!`,
        quickReplies: ['Energy tips', 'Join Unplug challenge', 'Tell me more'],
        type: 'proactive'
      });
    }

    return messages.length > 0 ? this._randomPick(messages) : null;
  }

  /**
   * Get the initial greeting message.
   * @param {Object} context
   * @param {Object} [context.profile] - User profile from quiz
   * @param {Object} [context.breakdown] - Category breakdown
   * @returns {{text: string, quickReplies: string[], type: string}} Greeting response
   */
  getGreeting(context) {
    if (context.profile) {
      const rating = getFootprintRating(context.breakdown?.total || 0);
      return {
        text: `Welcome back! 🌱 Your footprint is rated **${rating.label}**. ${this._randomPick(ENCOURAGEMENTS)} How can I help you today?`,
        quickReplies: ['Show my footprint', 'Give me a tip', 'Start a challenge', 'What can I improve?'],
        type: 'greeting'
      };
    }
    return {
      text: this._randomPick(GREETINGS),
      quickReplies: ['How does this work?', 'Give me a tip', 'Take the quiz'],
      type: 'greeting'
    };
  }

  /* ---- Intent Detection ---- */

  _detectIntent(input) {
    // Check each intent's keywords
    for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
      for (const keyword of keywords) {
        if (input.includes(keyword)) {
          return intent;
        }
      }
    }
    return 'unknown';
  }

  /* ---- Response Handlers ---- */

  _handleGreeting(context) {
    return this.getGreeting(context);
  }

  _handleTipRequest(input, context) {
    // Determine category from input
    let category = null;
    for (const cat of ['transport', 'diet', 'energy', 'shopping']) {
      if (input.includes(cat) || this._matchesCategoryKeywords(input, cat)) {
        category = cat;
        break;
      }
    }

    let tips;
    if (category) {
      tips = getTips({ category, excludeIds: this.shownTipIds, limit: 2 });
      this.lastCategory = category;
    } else if (context.breakdown) {
      tips = getRelevantTips(context.breakdown, this.shownTipIds);
      tips = tips.slice(0, 2);
    } else {
      tips = getTips({ excludeIds: this.shownTipIds, limit: 2 });
    }

    if (tips.length === 0) {
      this.shownTipIds = [];
      tips = getTips({ category, limit: 2 });
    }

    this.shownTipIds.push(...tips.map(t => t.id));

    const tipsText = tips.map(t => {
      const savings = t.savingsKg > 0 ? ` (saves ~${t.savingsKg} kg CO₂/year)` : '';
      return `💡 ${t.text}${savings}`;
    }).join('\n\n');

    const categoryLabel = category ? ` ${category}` : '';
    
    return {
      text: `Here are some${categoryLabel} tips for you:\n\n${tipsText}\n\n${this._randomPick(FOLLOW_UPS)}`,
      quickReplies: ['More tips', 'Different category', 'Set a goal', 'Thanks!'],
      type: 'tip'
    };
  }

  _handleFootprintQuery(context) {
    if (!context.breakdown) {
      return {
        text: "I don't have your footprint data yet. Take the lifestyle quiz first and I can give you a detailed breakdown! 📊",
        quickReplies: ['Take the quiz', 'How does it work?'],
        type: 'info'
      };
    }

    const { transport, diet, energy, shopping, total } = context.breakdown;
    const rating = getFootprintRating(total);
    const totalTonnes = (total / 1000).toFixed(1);
    
    // Find highest category
    const categories = { transport, diet, energy, shopping };
    const highest = Object.entries(categories).sort(([,a], [,b]) => b - a)[0];
    const highestPct = Math.round((highest[1] / total) * 100);

    return {
      text: `📊 **Your Carbon Footprint: ${totalTonnes} tonnes CO₂/year**\n\nRating: ${rating.label} ${this._getRatingEmoji(rating.rating)}\n\n` +
        `🚗 Transport: ${(transport/1000).toFixed(1)}t (${Math.round(transport/total*100)}%)\n` +
        `🍽️ Diet: ${(diet/1000).toFixed(1)}t (${Math.round(diet/total*100)}%)\n` +
        `⚡ Energy: ${(energy/1000).toFixed(1)}t (${Math.round(energy/total*100)}%)\n` +
        `🛍️ Shopping: ${(shopping/1000).toFixed(1)}t (${Math.round(shopping/total*100)}%)\n\n` +
        `Your biggest area is **${highest[0]}** at ${highestPct}%. I have great tips to help reduce that!`,
      quickReplies: [`${highest[0]} tips`, 'Compare to average', 'Set a goal', 'What if scenarios'],
      type: 'analysis'
    };
  }

  _handleCategoryQuery(category, context) {
    this.lastCategory = category;
    
    if (!context.breakdown) {
      const tips = getTips({ category, excludeIds: this.shownTipIds, limit: 2 });
      this.shownTipIds.push(...tips.map(t => t.id));
      
      const tipsText = tips.map(t => `💡 ${t.text}`).join('\n\n');
      return {
        text: `Here are some ${category} tips:\n\n${tipsText}\n\nTake the quiz for personalized advice!`,
        quickReplies: ['More tips', 'Take the quiz', 'Different category'],
        type: 'tip'
      };
    }

    const catValue = context.breakdown[category] || 0;
    const catTonnes = (catValue / 1000).toFixed(1);
    const percentage = Math.round((catValue / context.breakdown.total) * 100);
    
    const tips = getTips({ category, impact: 'high', excludeIds: this.shownTipIds, limit: 2 });
    this.shownTipIds.push(...tips.map(t => t.id));

    const icons = { transport: '🚗', diet: '🍽️', energy: '⚡', shopping: '🛍️' };
    const icon = icons[category];

    const tipsText = tips.map(t => `💡 ${t.text} (saves ~${t.savingsKg} kg/year)`).join('\n\n');

    return {
      text: `${icon} **Your ${category} footprint: ${catTonnes} tonnes/year** (${percentage}% of total)\n\n` +
        `Here are high-impact tips:\n\n${tipsText}`,
      quickReplies: ['More tips', 'Set a goal', 'Other categories', 'Start a challenge'],
      type: 'analysis'
    };
  }

  _handleChallengeQuery(context) {
    const challengeList = CHALLENGES.map(c => 
      `${c.icon} **${c.title}** — ${c.description} (${c.difficulty}, saves ~${c.estimatedSavings} kg CO₂)`
    ).join('\n\n');

    return {
      text: `Here are the available 30-day challenges:\n\n${challengeList}\n\nWhich one interests you? You can join from the Goals page!`,
      quickReplies: CHALLENGES.map(c => c.title),
      type: 'info'
    };
  }

  _handleCompareQuery(context) {
    if (!context.breakdown) {
      return {
        text: "Take the quiz first so I can compare your footprint to global averages! 📊",
        quickReplies: ['Take the quiz'],
        type: 'info'
      };
    }

    const total = context.breakdown.total;
    const totalTonnes = (total / 1000).toFixed(1);

    const comparisons = [
      { label: 'Global Average', value: BASELINES.global_avg, icon: '🌍' },
      { label: 'US Average', value: BASELINES.us_avg, icon: '🇺🇸' },
      { label: 'EU Average', value: BASELINES.eu_avg, icon: '🇪🇺' },
      { label: 'Paris Target (2030)', value: BASELINES.paris_target, icon: '🎯' }
    ];

    const compText = comparisons.map(c => {
      const cTonnes = (c.value / 1000).toFixed(1);
      const diff = total - c.value;
      const status = diff <= 0 ? '✅ Below' : '⚠️ Above';
      return `${c.icon} ${c.label}: ${cTonnes}t — ${status} by ${Math.abs(diff / 1000).toFixed(1)}t`;
    }).join('\n');

    return {
      text: `📊 **Your footprint (${totalTonnes}t) compared to:**\n\n${compText}\n\n` +
        (total <= BASELINES.global_avg 
          ? "You're doing better than the global average! Keep pushing for the Paris target. 🎯" 
          : "There's room for improvement. Let me help you find the biggest opportunities!"),
      quickReplies: ['Give me tips', 'Show breakdown', 'Set a goal'],
      type: 'comparison'
    };
  }

  _handleWhatIf(input, context) {
    const scenarios = [
      {
        keywords: ['bike', 'cycle', 'cycling'],
        text: "🚲 **What if you cycled to work?**\nSwitching a 10km car commute to cycling would save about **900 kg CO₂/year** — that's the same as planting 15 trees!",
        savings: 900
      },
      {
        keywords: ['vegan', 'plant'],
        text: "🥗 **What if you went vegan?**\nA plant-based diet saves about **1,500 kg CO₂/year** compared to a high-meat diet. Even going vegetarian saves ~1,200 kg!",
        savings: 1500
      },
      {
        keywords: ['solar', 'panel'],
        text: "☀️ **What if you installed solar panels?**\nSolar panels can offset 80-100% of your electricity emissions, saving around **1,200 kg CO₂/year** for an average home.",
        savings: 1200
      },
      {
        keywords: ['electric', 'ev'],
        text: "⚡ **What if you switched to an electric car?**\nAn EV produces 50-70% less lifetime emissions than a petrol car, saving about **1,500 kg CO₂/year** on average.",
        savings: 1500
      },
      {
        keywords: ['fly', 'flight', 'plane'],
        text: "✈️ **What if you took one fewer flight per year?**\nSkipping one round-trip flight saves about **700 kg CO₂**. Taking the train instead saves even more!",
        savings: 700
      }
    ];

    for (const scenario of scenarios) {
      if (scenario.keywords.some(k => input.includes(k))) {
        return {
          text: scenario.text,
          quickReplies: ['More scenarios', 'How to start', 'Set a goal'],
          type: 'whatif'
        };
      }
    }

    return {
      text: "🤔 I can model scenarios for you! Try asking things like:\n\n" +
        "• \"What if I cycled to work?\"\n" +
        "• \"What if I went vegan?\"\n" +
        "• \"What if I installed solar panels?\"\n" +
        "• \"What if I switched to an electric car?\"\n" +
        "• \"What if I flew less?\"",
      quickReplies: ['What if I cycled?', 'What if I went vegan?', 'What if solar?'],
      type: 'info'
    };
  }

  _handleProgressQuery(context) {
    if (!context.recentActivities?.length) {
      return {
        text: "You haven't logged any activities yet. Start logging your daily activities and I'll track your progress! 📈",
        quickReplies: ['How to log', 'Give me a tip'],
        type: 'info'
      };
    }

    const streak = context.streak || 0;
    const totalLogged = context.recentActivities.length;
    
    return {
      text: `📈 **Your Progress:**\n\n` +
        `🔥 Current streak: ${streak} day${streak !== 1 ? 's' : ''}\n` +
        `📝 Total activities logged: ${totalLogged}\n\n` +
        `${streak >= 7 ? 'Incredible consistency! ' : streak >= 3 ? 'Good momentum! ' : 'Keep logging daily! '}` +
        `${this._randomPick(ENCOURAGEMENTS)}`,
      quickReplies: ['Show footprint', 'Give me a tip', 'Start a challenge'],
      type: 'progress'
    };
  }

  _handleThanks() {
    const responses = [
      "You're welcome! 🌱 Remember, every small action adds up to big change!",
      "Happy to help! 🌍 Keep up the great work on your sustainability journey!",
      "Anytime! ♻️ Feel free to ask whenever you need more tips or advice!",
      "My pleasure! 🌿 Together we can make a difference. Keep going!"
    ];

    return {
      text: this._randomPick(responses),
      quickReplies: ['More tips', 'Show progress', 'Goodbye 👋'],
      type: 'thanks'
    };
  }

  _handleUnknown(context) {
    return {
      text: "I'm not sure I understand that, but I'm here to help with anything eco-related! 🌱 Here's what I can do:\n\n" +
        "• 📊 **Analyze your footprint** — just ask!\n" +
        "• 💡 **Give tips** — for any category\n" +
        "• 🎯 **Help set goals** — reduction targets\n" +
        "• 🏆 **Suggest challenges** — 30-day programs\n" +
        "• 🤔 **\"What if\" scenarios** — model changes\n" +
        "• 📈 **Track progress** — streaks & stats",
      quickReplies: ['Show footprint', 'Give me a tip', 'Start a challenge', 'What if scenarios'],
      type: 'help'
    };
  }

  /* ---- Utility Methods ---- */

  _matchesCategoryKeywords(input, category) {
    return INTENT_KEYWORDS[category]?.some(k => input.includes(k)) || false;
  }

  _randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  _getRatingEmoji(rating) {
    const emojis = {
      excellent: '🌟', great: '💚', good: '✅',
      average: '⚠️', high: '🔶', very_high: '🔴'
    };
    return emojis[rating] || '📊';
  }

  _isThisWeek(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo && d <= now;
  }
}

// Singleton instance
export const ecoBot = new Assistant();

/**
 * Module-level wrapper: process a user message using the singleton.
 * @param {string} message - User message
 * @param {Object} state - Full app state from store
 * @returns {Object} { text, quickReplies, type }
 */
export function processMessage(message, state) {
  const context = {
    profile: state.profile,
    breakdown: state.breakdown,
    recentActivities: state.activities?.slice(0, 50) || [],
    goals: state.goals,
    streak: state.streak?.current || 0
  };
  return ecoBot.respond(message, context);
}

/**
 * Module-level wrapper: get a proactive tip if warranted.
 * @param {Object} state - Full app state from store
 * @returns {string|null} Tip text or null
 */
export function getProactiveTip(state) {
  const context = {
    profile: state.profile,
    breakdown: state.breakdown,
    recentActivities: state.activities?.slice(0, 50) || [],
    goals: state.goals,
    streak: state.streak?.current || 0
  };
  const msg = ecoBot.getProactiveMessage(context);
  return msg ? msg.text : null;
}
