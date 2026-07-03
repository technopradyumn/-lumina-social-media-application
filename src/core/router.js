/* ==========================================================================
   Lumina JS - View Router & Navigation System
   ========================================================================== */

import { state } from './state.js';
import { elements } from './config.js';

let onViewChangeCallback = null;

export function registerOnViewChange(callback) {
    onViewChangeCallback = callback;
}

export function switchView(viewName) {
    state.currentView = viewName;
    
    // Update active nav button
    elements.navItems.forEach(item => {
        if (item.getAttribute('data-view') === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update active view content with fade transitions
    elements.views.forEach(view => {
        if (view.id === `view-${viewName}`) {
            view.classList.add('active');
        } else {
            view.classList.remove('active');
        }
    });

    // Close conversations container class on mobile if switching views
    document.querySelector('.messages-container').classList.remove('chat-active');

    // Trigger grid updates or page updates
    if (onViewChangeCallback) {
        onViewChangeCallback(viewName);
    }
}

export function updateBadges() {
    // DM Badge
    const unreadChats = state.chats.filter(c => c.unread).length;
    if (unreadChats > 0) {
        elements.chatBadge.style.display = "flex";
        elements.chatBadge.textContent = unreadChats;
    } else {
        elements.chatBadge.style.display = "none";
    }

    // Notifications Badge
    const unreadNotifs = state.notifications.filter(n => n.unread).length;
    if (unreadNotifs > 0) {
        elements.notifBadge.style.display = "flex";
        elements.notifBadge.textContent = unreadNotifs;
    } else {
        elements.notifBadge.style.display = "none";
    }
}
