/* ============================================
   CHAT — AI Assistant UI Component
   ============================================ */

import { ecoBot } from '../engine/assistant.js';
import { getState, getActivities } from '../store.js';
import { Sanitize } from '../utils/sanitize.js';
import { delegate } from '../utils/dom.js';
import { announce } from '../utils/accessibility.js';
import { navigateTo } from '../router.js';

let isOpen = false;
let messages = [];

/**
 * Initialize the chat component (renders toggle button + panel shell).
 * Called once during app boot.
 */
export function initChat() {
  // Create chat toggle button
  const toggle = document.createElement('button');
  toggle.id = 'chat-toggle';
  toggle.className = 'chat-toggle';
  toggle.setAttribute('aria-label', 'Open EcoBot assistant');
  toggle.innerHTML = '🤖';
  document.body.appendChild(toggle);

  // Create chat panel (hidden initially)
  const panel = document.createElement('div');
  panel.id = 'chat-panel';
  panel.className = 'chat-panel hidden';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'EcoBot assistant');
  panel.innerHTML = `
    <div class="chat-header">
      <div class="chat-avatar" aria-hidden="true">🤖</div>
      <div class="chat-header-info">
        <div class="chat-name">EcoBot</div>
        <div class="chat-status">Online</div>
      </div>
      <button class="chat-close-btn" id="chat-close-btn" aria-label="Close chat">✕</button>
    </div>
    <div class="chat-messages" id="chat-messages" aria-live="polite" aria-relevant="additions"></div>
    <div class="quick-replies" id="quick-replies"></div>
    <div class="chat-input-area">
      <input type="text" class="chat-input" id="chat-input" placeholder="Ask EcoBot anything..." aria-label="Type a message" autocomplete="off">
      <button class="chat-send-btn" id="chat-send-btn" aria-label="Send message">
        ➤
      </button>
    </div>
  `;
  document.body.appendChild(panel);

  // Event listeners
  toggle.addEventListener('click', toggleChat);
  document.getElementById('chat-close-btn').addEventListener('click', toggleChat);
  document.getElementById('chat-send-btn').addEventListener('click', sendMessage);
  document.getElementById('chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Quick reply delegation
  delegate(document.getElementById('quick-replies'), 'click', '.quick-reply-btn', (e, btn) => {
    const text = btn.textContent.trim();
    handleQuickReply(text);
  });
}

function toggleChat() {
  isOpen = !isOpen;
  const panel = document.getElementById('chat-panel');
  const toggle = document.getElementById('chat-toggle');

  if (isOpen) {
    panel.classList.remove('hidden');
    toggle.innerHTML = '✕';
    toggle.setAttribute('aria-label', 'Close EcoBot assistant');

    // Show greeting if first open
    if (messages.length === 0) {
      const context = buildContext();
      const greeting = ecoBot.getGreeting(context);
      addBotMessage(greeting.text, greeting.quickReplies);
    }

    // Focus input
    setTimeout(() => {
      document.getElementById('chat-input')?.focus();
    }, 300);

    announce('EcoBot chat opened');
  } else {
    panel.classList.add('hidden');
    toggle.innerHTML = '🤖';
    toggle.setAttribute('aria-label', 'Open EcoBot assistant');
    announce('EcoBot chat closed');
  }
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input?.value?.trim();
  if (!text) return;

  // Add user message
  addUserMessage(text);
  input.value = '';

  // Show typing indicator
  showTyping();

  // Generate response (with slight delay for realism)
  setTimeout(async () => {
    const context = buildContext();
    try {
      const response = await ecoBot.respond(text, context);
      hideTyping();
      addBotMessage(response.text, response.quickReplies || []);
    } catch (e) {
      console.error(e);
      hideTyping();
      addBotMessage("Sorry, I experienced a technical issue. Could you try again?", []);
    }
  }, 600 + Math.random() * 400);
}

function handleQuickReply(text) {
  // Handle special quick replies
  if (text === 'Take the quiz') {
    navigateTo('/quiz');
    toggleChat();
    return;
  }
  if (text === 'Goodbye 👋') {
    addUserMessage(text);
    setTimeout(() => {
      addBotMessage('Goodbye! 🌱 Remember, every small action counts. See you soon!', []);
      setTimeout(() => toggleChat(), 1500);
    }, 500);
    return;
  }

  // Otherwise, treat as user message
  const input = document.getElementById('chat-input');
  if (input) input.value = text;
  sendMessage();
}

function addUserMessage(text) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  
  messages.push({ role: 'user', text, time: timeStr });

  const messagesEl = document.getElementById('chat-messages');
  if (!messagesEl) return;

  const msgEl = document.createElement('div');
  msgEl.className = 'chat-message user';
  msgEl.innerHTML = `
    <div class="message-bubble">${Sanitize.escapeHTML(text)}</div>
    <div class="message-time">${timeStr}</div>
  `;
  messagesEl.appendChild(msgEl);
  scrollToBottom();

  // Clear quick replies
  const qr = document.getElementById('quick-replies');
  if (qr) qr.innerHTML = '';
}

function addBotMessage(text, quickReplies = []) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  
  messages.push({ role: 'bot', text, time: timeStr });

  const messagesEl = document.getElementById('chat-messages');
  if (!messagesEl) return;

  // Format text: handle **bold** and line breaks
  const formattedText = formatBotText(text);

  const msgEl = document.createElement('div');
  msgEl.className = 'chat-message bot';
  msgEl.innerHTML = `
    <div class="message-bubble">${formattedText}</div>
    <div class="message-time">${timeStr}</div>
  `;
  messagesEl.appendChild(msgEl);

  // Quick replies
  if (quickReplies.length > 0) {
    const qrContainer = document.getElementById('quick-replies');
    if (qrContainer) {
      qrContainer.innerHTML = quickReplies.map(qr => 
        `<button class="quick-reply-btn" aria-label="${Sanitize.escapeHTML(qr)}">${Sanitize.escapeHTML(qr)}</button>`
      ).join('');
    }
  }

  scrollToBottom();
  announce(`EcoBot says: ${text.substring(0, 100)}`);
}

function formatBotText(text) {
  // Escape first, then apply formatting
  let safe = Sanitize.escapeHTML(text);
  // Bold: **text**
  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Line breaks
  safe = safe.replace(/\n/g, '<br>');
  // Bullet points: • or -
  safe = safe.replace(/^• /gm, '<span style="color: var(--color-accent);">•</span> ');
  return safe;
}

function showTyping() {
  const messagesEl = document.getElementById('chat-messages');
  if (!messagesEl) return;

  const typingEl = document.createElement('div');
  typingEl.id = 'typing-indicator';
  typingEl.className = 'chat-message bot';
  typingEl.innerHTML = `
    <div class="typing-indicator" aria-label="EcoBot is typing">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  `;
  messagesEl.appendChild(typingEl);
  scrollToBottom();
}

function hideTyping() {
  document.getElementById('typing-indicator')?.remove();
}

function scrollToBottom() {
  const messagesEl = document.getElementById('chat-messages');
  if (messagesEl) {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
}

function buildContext() {
  const state = getState();
  const recentActivities = getActivities({}).slice(0, 20);

  return {
    profile: state.onboarded ? state.profile : null,
    breakdown: state.breakdown,
    recentActivities,
    goals: state.goals,
    streak: state.streak?.current || 0,
    apiKey: state.preferences?.geminiApiKey || null
  };
}

/**
 * Show a proactive notification on the chat toggle.
 * @param {boolean} show
 */
export function showChatNotification(show) {
  const toggle = document.getElementById('chat-toggle');
  if (!toggle) return;

  let dot = toggle.querySelector('.notification-dot');
  if (show && !dot) {
    dot = document.createElement('span');
    dot.className = 'notification-dot';
    toggle.appendChild(dot);
  } else if (!show && dot) {
    dot.remove();
  }
}
