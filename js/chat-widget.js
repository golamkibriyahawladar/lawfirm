/* ==========================================================================
   REUSABLE CHAT WIDGET JS
   ========================================================================== */

// 1. CONFIGURATION (Paste your Webhook URL here!)
const CHAT_CONFIG = {
    // ⬇️ Paste your Webhook URL inside the quotes below ⬇️
    webhookUrl: "https://n8n.srv1237736.hstgr.cloud/webhook/59bac47e-c7f2-473f-9de5-b29d8b6283dc",
    botName: "Legal Assistant",
    initialMessage: "Welcome to Apex Legal Counsel. How can our legal team assist you today?"
};

// 2. DOM ELEMENTS
const chatLauncher = document.getElementById('chat-launcher');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatBadge = document.querySelector('.chat-badge');

// 3. INITIALIZE WIDGET
document.addEventListener('DOMContentLoaded', () => {
    // Show initial welcome message
    appendMessage(CHAT_CONFIG.initialMessage, 'bot');
});

// Toggle Chat Window
chatLauncher.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
    if (chatBadge) chatBadge.style.display = 'none'; // Clear badge
});

chatClose.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
});

// 4. SEND MESSAGE & WEBHOOK CALL
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userText = chatInput.value.trim();
    if (!userText) return;

    // A. Show User Message in UI
    appendMessage(userText, 'user');
    chatInput.value = '';

    // B. Show Typing Indicator
    const typingId = showTypingIndicator();

    // C. Send Message to Webhook
    try {
        if (!CHAT_CONFIG.webhookUrl) {
            // Demo Fallback Response if Webhook URL is not set yet
            setTimeout(() => {
                removeTypingIndicator(typingId);
                appendMessage("Thank you for your message! Please configure your Webhook URL in `js/chat-widget.js` to receive live automated/AI responses.", 'bot');
            }, 1000);
            return;
        }

        // HTTP POST Request to Webhook
        const response = await fetch(CHAT_CONFIG.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userText,
                timestamp: new Date().toISOString()
            })
        });

        const data = await response.json();
        removeTypingIndicator(typingId);

        // D. Extract Response Message from Webhook Payload
        // Checks common response keys: reply, output, message, text, or raw string
        let replyText = data.reply || data.output || data.message || data.response || data.text;

        if (!replyText && typeof data === 'string') {
            replyText = data;
        } else if (!replyText) {
            replyText = JSON.stringify(data);
        }

        // E. Show Webhook Response in Chat
        appendMessage(replyText, 'bot');

    } catch (error) {
        console.error('Webhook Error:', error);
        removeTypingIndicator(typingId);
        appendMessage("Sorry, I am having trouble connecting to the server. Please try again later.", 'bot');
    }
});

// 5. HELPER FUNCTIONS
function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msg', sender === 'user' ? 'msg-user' : 'msg-bot');

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    msgDiv.innerHTML = `${escapeHtml(text)} <div class="msg-time">${timeStr}</div>`;

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto scroll to bottom
}

function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = id;
    typingDiv.classList.add('msg', 'msg-bot', 'typing-indicator');
    typingDiv.innerText = `${CHAT_CONFIG.botName} is typing...`;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
