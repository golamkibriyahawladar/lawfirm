/**
 * Apex Legal Counsel - Virtual Legal Assistant Chat Widget
 */

document.addEventListener('DOMContentLoaded', () => {
    initLegalChatWidget();
});

function initLegalChatWidget() {
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatWindow = document.getElementById('chatWindow');
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const chatBody = document.getElementById('chatBody');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');

    if (!chatToggleBtn || !chatWindow) return;

    chatToggleBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
    });

    if (chatCloseBtn) {
        chatCloseBtn.addEventListener('click', () => {
            chatWindow.classList.remove('open');
        });
    }

    let firstOpen = true;
    chatToggleBtn.addEventListener('click', () => {
        if (firstOpen) {
            firstOpen = false;
            setTimeout(() => {
                appendBotMessage("Welcome to Apex Legal Counsel ⚖️. I'm your Virtual Legal Assistant. How can our legal team assist you today?", [
                    "Explore Practice Areas",
                    "Schedule Consultation",
                    "Fee Structure & Pricing",
                    "24/7 Emergency Hotline"
                ]);
            }, 300);
        }
    });

    function handleUserSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendUserMessage(text);
        chatInput.value = '';

        processBotResponse(text);
    }

    if (chatSendBtn) chatSendBtn.addEventListener('click', handleUserSend);

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUserSend();
        });
    }

    chatBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('chat-opt-btn')) {
            const optionText = e.target.textContent;
            appendUserMessage(optionText);
            processBotResponse(optionText);
        }
    });

    function appendUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-msg user';
        msgDiv.textContent = text;
        chatBody.appendChild(msgDiv);
        scrollToBottom();
    }

    function appendBotMessage(text, options = []) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-msg bot';
        
        let html = `<p>${text}</p>`;

        if (options && options.length > 0) {
            html += `<div class="chat-options">`;
            options.forEach(opt => {
                html += `<button class="chat-opt-btn">${opt}</button>`;
            });
            html += `</div>`;
        }

        msgDiv.innerHTML = html;
        chatBody.appendChild(msgDiv);
        scrollToBottom();
    }

    function processBotResponse(query) {
        const q = query.toLowerCase();

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-msg bot typing';
        typingDiv.innerHTML = '<em>Legal Assistant is typing...</em>';
        chatBody.appendChild(typingDiv);
        scrollToBottom();

        setTimeout(() => {
            typingDiv.remove();

            if (q.includes('practice') || q.includes('area') || q.includes('service')) {
                appendBotMessage(
                    "Our senior partners handle 6 core practice areas:\n1. Corporate Law & Mergers\n2. Criminal Defense & Litigation\n3. Family & Estate Planning\n4. Real Estate Transactions\n5. IP & Cyber Law\n6. Civil Litigation.",
                    ["Schedule Consultation", "Fee Structure & Pricing"]
                );
            } else if (q.includes('fee') || q.includes('price') || q.includes('cost') || q.includes('contingency')) {
                appendBotMessage(
                    "Personal Injury cases are handled on a 100% Contingency Fee basis (No win, no fee). Corporate and Defense litigation are structured via flat retainers or transparent hourly rates.",
                    ["Try Case Estimator", "Schedule Consultation"]
                );
            } else if (q.includes('try case estimator')) {
                window.location.hash = '#case-estimator';
                chatWindow.classList.remove('open');
            } else if (q.includes('emergency') || q.includes('hotline') || q.includes('urgent')) {
                appendBotMessage(
                    "For urgent criminal defense or court emergencies, please call our 24/7 Priority Legal Line immediately at +1 (800) 555-LEGAL.",
                    ["Schedule Consultation"]
                );
            } else if (q.includes('schedule') || q.includes('consultation') || q.includes('book') || q.includes('attorney')) {
                appendBotMessage(
                    "You can request a 100% confidential 30-minute case evaluation directly through our Case Evaluation Form!",
                    ["Go to Contact Form"]
                );
            } else if (q.includes('go to contact form')) {
                window.location.hash = '#contact';
                chatWindow.classList.remove('open');
            } else {
                appendBotMessage(
                    "Thank you for contacting Apex Legal Counsel. Our legal team is committed to defending your rights with aggressive, strategic representation.",
                    ["Explore Practice Areas", "Schedule Consultation"]
                );
            }
        }, 700);
    }

    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}
