/* ==========================================================================
   APEX LEGAL COUNSEL - CHAT WIDGET (WITH WEBHOOK SUPPORT)
   ========================================================================== */

// 1. CONFIGURATION
const CHAT_CONFIG = {
    webhookUrl: "https://n8n.srv1237736.hstgr.cloud/webhook/59bac47e-c7f2-473f-9de5-b29d8b6283dc",
    botName: "Legal Assistant",
    initialMessage: "Hi, I can help you schedule a consultation and collect some basic information."
};

// 2. DOM ELEMENTS
document.addEventListener('DOMContentLoaded', () => {
    const chatLauncher = document.getElementById('chat-launcher');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatBadge = document.querySelector('.chat-badge');

    if (!chatLauncher || !chatWindow) return;

    // Show initial welcome message
    appendMessage(CHAT_CONFIG.initialMessage, 'bot');

    // Toggle Chat Window
    chatLauncher.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (chatBadge) chatBadge.style.display = 'none'; // Clear badge
    });

    if (chatClose) {
        chatClose.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
        });
    }

    // Send Message & Webhook Call
    if (chatForm) {
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
                if (CHAT_CONFIG.webhookUrl) {
                    const response = await fetch(CHAT_CONFIG.webhookUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            message: userText,
                            timestamp: new Date().toISOString(),
                            source: 'lawfirm_website'
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        removeTypingIndicator(typingId);

                        let replyText = data.reply || data.output || data.message || data.response || data.text;
                        if (!replyText && typeof data === 'string') replyText = data;

                        if (replyText) {
                            appendMessage(replyText, 'bot');
                            return;
                        }
                    }
                }
            } catch (error) {
                console.log('Webhook error, falling back to local handler:', error);
            }

            // D. Fallback Bot Response
            setTimeout(() => {
                removeTypingIndicator(typingId);
                const q = userText.toLowerCase();

                if (q.includes('practice') || q.includes('area') || q.includes('service')) {
                    appendMessage("Our firm specializes in Corporate Law, Criminal Defense, Family & Estate Planning, Real Estate, Intellectual Property, and Civil Litigation.", 'bot');
                } else if (q.includes('consultation') || q.includes('contact') || q.includes('appointment')) {
                    appendMessage("You can request a free consultation using our contact form on this page or call us 24/7 at +1 (800) 555-LEGAL.", 'bot');
                } else {
                    appendMessage("Thank you for your inquiry! One of our senior legal associates will assist you promptly.", 'bot');
                }
            }, 600);
        });
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('msg', sender === 'user' ? 'msg-user' : 'msg-bot');

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        msgDiv.innerHTML = `${escapeHtml(text)} <div class="msg-time">${timeStr}</div>`;

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
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
});
