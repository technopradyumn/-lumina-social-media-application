/* ==========================================================================
   Lumina JS - Inbox Direct Messages (DMs) & Notifications Component
   ========================================================================== */

import { state } from '../../core/state.js';
import { elements } from '../../core/config.js';
import { updateBadges } from '../../core/router.js';

export function renderInbox() {
    elements.chatsList.innerHTML = '';
    
    state.chats.forEach(chat => {
        const lastMsg = chat.messages[chat.messages.length - 1];
        const row = document.createElement('div');
        row.className = `chat-row ${chat.id === state.activeChatId ? 'active' : ''} ${chat.unread ? 'unread' : ''}`;
        row.innerHTML = `
            <div class="chat-row-avatar">
                <img src="${chat.user.avatar}" alt="${chat.user.name}">
                <div class="user-status-indicator ${chat.user.status === 'active' ? 'active' : ''}" style="position:absolute; bottom:2px; right:2px; border: 2px solid var(--bg-base)"></div>
            </div>
            <div class="chat-row-info">
                <div class="chat-row-meta">
                    <span class="chat-row-name">${chat.user.name}</span>
                    <span class="chat-row-time">${lastMsg ? lastMsg.time : ''}</span>
                </div>
                <div class="chat-row-meta">
                    <span class="chat-row-snippet">${lastMsg ? lastMsg.text : 'Start a chat'}</span>
                    ${chat.unread ? `<div class="chat-row-unread-dot"></div>` : ''}
                </div>
            </div>
        `;
        row.addEventListener('click', () => selectChat(chat.id));
        elements.chatsList.appendChild(row);
    });
}

export function selectChat(chatId) {
    state.activeChatId = chatId;
    const chat = state.chats.find(c => c.id === chatId);
    if (!chat) return;

    chat.unread = false; 
    renderInbox();
    updateBadges();

    document.querySelector('.messages-container').classList.add('chat-active');

    // Build chat interface
    elements.chatMainArea.innerHTML = `
        <div class="chat-main-active">
            <div class="chat-active-header">
                <div class="chat-active-user">
                    <button class="btn-icon mobile-chat-back" id="btn-chat-back" style="display:none; margin-right: 8px; width:32px; height:32px">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <img src="${chat.user.avatar}" alt="${chat.user.name}" class="avatar-sm">
                    <div>
                        <div class="chat-active-user-name">${chat.user.name}</div>
                        <div class="chat-active-user-status">${chat.user.status === 'active' ? 'Online' : 'Offline'}</div>
                    </div>
                </div>
                <button class="btn-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </button>
            </div>
            
            <div class="chat-body" id="active-chat-body">
                <!-- Messages injected here -->
            </div>
            
            <div class="chat-footer">
                <div class="chat-input-wrapper">
                    <input type="text" id="chat-msg-input" placeholder="Message ${chat.user.name}...">
                </div>
                <button class="btn-icon" id="btn-chat-send" style="background: var(--accent-primary); color: white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
            </div>
        </div>
    `;

    renderChatMessages();

    // Bind listeners
    document.getElementById('btn-chat-send').addEventListener('click', sendDirectMessage);
    document.getElementById('btn-chat-back').addEventListener('click', closeActiveChatMobile);
    
    const chatInput = document.getElementById('chat-msg-input');
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendDirectMessage();
    });

    adjustMobileChatBackButton();
}

export function closeActiveChatMobile() {
    document.querySelector('.messages-container').classList.remove('chat-active');
    state.activeChatId = null;
    renderInbox();
}

function adjustMobileChatBackButton() {
    const backBtn = document.getElementById('btn-chat-back');
    if (backBtn && window.innerWidth <= 768) {
        backBtn.style.display = 'flex';
    }
}

export function renderChatMessages() {
    const chat = state.chats.find(c => c.id === state.activeChatId);
    const body = document.getElementById('active-chat-body');
    if (!chat || !body) return;

    body.innerHTML = '';
    chat.messages.forEach(msg => {
        const msgRow = document.createElement('div');
        msgRow.className = `chat-msg-row ${msg.sender === 'me' ? 'sent' : 'received'}`;
        msgRow.innerHTML = `
            <div>
                <div class="chat-msg-bubble">${msg.text}</div>
                <div class="chat-msg-time">${msg.time}</div>
            </div>
        `;
        body.appendChild(msgRow);
    });

    body.scrollTop = body.scrollHeight;
}

export function sendDirectMessage() {
    const input = document.getElementById('chat-msg-input');
    if (!input || !input.value.trim()) return;

    const chat = state.chats.find(c => c.id === state.activeChatId);
    if (!chat) return;

    const text = input.value.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    chat.messages.push({
        sender: "me",
        text: text,
        time: timeNow
    });

    input.value = '';
    renderChatMessages();
    renderInbox();

    // Trigger AI simulated bot response if enabled
    if (state.repliesEnabled) {
        setTimeout(() => {
            simulateBotResponse(chat);
        }, 1500);
    }
}

export function simulateBotResponse(chat) {
    if (chat.botReplies.length === 0) return;
    
    const replyText = chat.botReplies.shift();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    chat.messages.push({
        sender: "them",
        text: replyText,
        time: timeNow
    });

    renderChatMessages();
    renderInbox();
}

// Mini Sidebar Chat log
export function initMiniChat() {
    elements.miniChatSend.addEventListener('click', sendMiniChatMessage);
    elements.miniChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMiniChatMessage();
    });
}

export function sendMiniChatMessage() {
    const text = elements.miniChatInput.value.trim();
    if (!text) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.innerHTML = `<div class="msg-bubble">${text}</div>`;
    elements.miniChatLog.appendChild(userMsg);
    elements.miniChatInput.value = '';

    elements.miniChatLog.scrollTop = elements.miniChatLog.scrollHeight;

    setTimeout(() => {
        const replies = [
            "Lumina features state-of-the-art glassmorphism styling built with vanilla HTML & CSS.",
            "You can use the Theme Toggle button on the bottom left to check how clean Light Mode is!",
            "You can create a new post by clicking the '+ New Post' button in the top right. Try it!",
            "Try clicking on the stories at the top. They feature a full timer automation viewer."
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-msg bot';
        botMsg.innerHTML = `<div class="msg-bubble">${randomReply}</div>`;
        elements.miniChatLog.appendChild(botMsg);
        elements.miniChatLog.scrollTop = elements.miniChatLog.scrollHeight;
    }, 1200);
}

// Notifications Panel
export function renderNotifications() {
    elements.notifListContainer.innerHTML = '';
    
    if (state.notifications.length === 0) {
        elements.notifListContainer.innerHTML = `
            <div style="padding: 40px; text-align: center; color: var(--text-muted)">
                <p>No new notifications.</p>
            </div>
        `;
        return;
    }

    state.notifications.forEach(notif => {
        const notifCard = document.createElement('div');
        notifCard.className = `notif-card glass-panel ${notif.unread ? 'unread' : ''}`;
        
        let iconClass = 'follow';
        let iconSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>';
        
        if (notif.type === 'like') {
            iconClass = 'like';
            iconSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
        } else if (notif.type === 'comment') {
            iconClass = 'comment';
            iconSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
        }

        notifCard.innerHTML = `
            <div class="notif-icon-box ${iconClass}">
                ${iconSVG}
            </div>
            <div class="notif-info">
                <div class="notif-text">
                    <span class="notif-actor">${notif.actor}</span> ${notif.text}
                </div>
                <div class="notif-time">${notif.time}</div>
            </div>
            ${notif.unread ? '<div class="notif-indicator"></div>' : ''}
        `;
        
        notifCard.addEventListener('click', () => {
            notif.unread = false;
            renderNotifications();
            updateBadges();
        });

        elements.notifListContainer.appendChild(notifCard);
    });

    elements.btnClearNotifs.onclick = () => {
        state.notifications.forEach(n => n.unread = false);
        renderNotifications();
        updateBadges();
    };
}
