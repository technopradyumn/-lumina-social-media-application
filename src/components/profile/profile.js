/* ==========================================================================
   Lumina JS - Profile View tabs & Grid items Component
   ========================================================================== */

import { state } from '../../core/state.js';
import { elements } from '../../core/config.js';
import { switchView } from '../../core/router.js';

export function initProfile() {
    elements.profileTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            elements.profileTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderProfileGrid();
        });
    });
}

export function renderProfileGrid() {
    const activeTab = document.querySelector('.profile-tab.active');
    if (!activeTab || !elements.profileGrid) return;
    
    const tabName = activeTab.getAttribute('data-profile-tab');
    elements.profileGrid.innerHTML = '';

    let contentList = [];
    if (tabName === 'posts') {
        contentList = state.posts.filter(p => p.author.handle === state.currentUser.handle);
    } else if (tabName === 'saved') {
        contentList = state.posts.filter(p => p.bookmarked);
    }

    if (contentList.length === 0) {
        elements.profileGrid.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted)">
                <p>No posts available in this collection.</p>
            </div>
        `;
        return;
    }

    contentList.forEach(post => {
        const item = document.createElement('div');
        item.className = 'profile-grid-item';
        item.innerHTML = `
            <img src="${post.image}" alt="Profile visual">
            <div class="profile-grid-overlay">
                <div class="grid-overlay-stat">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <span>${post.likes}</span>
                </div>
                <div class="grid-overlay-stat">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
                    <span>${post.comments.length}</span>
                </div>
            </div>
        `;
        item.addEventListener('click', () => {
            switchView('feed');
            setTimeout(() => {
                const targetPost = document.getElementById(`media-${post.id}`);
                if (targetPost) targetPost.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 200);
        });
        elements.profileGrid.appendChild(item);
    });
}
