/* ==========================================================================
   Lumina - Main JavaScript Entrypoint & Bootstrapper
   ========================================================================== */

import { state } from './core/state.js';
import { elements } from './core/config.js';
import { switchView, updateBadges, registerOnViewChange } from './core/router.js';
import { addAnalyticsLog } from './core/utils.js';

// Component imports
import { renderStories, closeStoryModal, sendStoryReply, toggleStoryPlayback } from './components/stories/stories.js';
import { renderPosts, renderSuggestions, renderExplore } from './components/feed/feed.js';
import { renderInbox, renderNotifications, initMiniChat } from './components/messages/messages.js';
import { initProfile, renderProfileGrid } from './components/profile/profile.js';
import { initSettings } from './components/settings/settings.js';

// --- DOMContentLoaded Bootstrapper ---
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTheme();
    initModals();
    initMiniChat();
    initCreatePost();
    initSettings();
    initProfile();

    // Register callback for SPA view transitions
    registerOnViewChange((viewName) => {
        if (viewName === 'profile') {
            renderProfileGrid();
        }
    });
    
    // Initial Render
    renderAll();
});

// Render everything
export function renderAll() {
    renderStories();
    renderPosts();
    renderSuggestions();
    renderExplore();
    renderInbox();
    renderNotifications();
    renderProfileGrid();
    updateBadges();
}

// Sidebar Navigation
function initNavigation() {
    elements.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetView = item.getAttribute('data-view');
            if (targetView) {
                e.preventDefault();
                switchView(targetView);
            }
        });
    });

    document.querySelector('.sidebar-logo').addEventListener('click', () => switchView('feed'));

    // Global Search filter
    elements.globalSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (state.currentView === 'feed') {
            renderPosts(query);
        } else if (state.currentView === 'explore') {
            renderExplore(query);
        }
    });
}

// Light / Dark Theme toggler
function initTheme() {
    const savedTheme = localStorage.getItem('lumina-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    }
    
    elements.themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('lumina-theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('lumina-theme', 'dark');
        }
    });
}

// Create Post Implementation
function initCreatePost() {
    elements.btnSubmitPost.addEventListener('click', publishPost);
}

function publishPost() {
    const caption = elements.postCaption.value.trim();
    const location = elements.postLocation.value.trim();
    if (!caption) {
        alert("Please enter a caption before sharing!");
        return;
    }

    const chosenAsset = document.querySelector('input[name="mock-asset"]:checked').value;

    const newPost = {
        id: `post_${Date.now()}`,
        author: {
            name: state.currentUser.name,
            handle: state.currentUser.handle,
            avatar: state.currentUser.avatar,
            verified: true
        },
        caption: caption,
        image: chosenAsset,
        location: location || "Global Space",
        likes: 0,
        comments: [],
        liked: false,
        bookmarked: false,
        time: "Just now"
    };

    state.posts.unshift(newPost);
    state.currentUser.postsCount++;
    elements.profileStatPostsCount.textContent = state.currentUser.postsCount;

    addAnalyticsLog(`Published a new post: <strong>"${caption.substring(0, 16)}..."</strong>`, 'purple');

    elements.postCaption.value = '';
    elements.postLocation.value = '';

    renderAll();
    closeCreateModal();
    switchView('feed');
}

// Modals wiring
function initModals() {
    document.querySelectorAll('.btn-create-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openCreateModal();
        });
    });

    document.querySelectorAll('.btn-close-create').forEach(btn => {
        btn.addEventListener('click', closeCreateModal);
    });

    document.querySelector('.create-modal-overlay').addEventListener('click', closeCreateModal);

    document.querySelectorAll('.btn-close-story').forEach(btn => {
        btn.addEventListener('click', closeStoryModal);
    });

    document.querySelector('.story-modal-overlay').addEventListener('click', closeStoryModal);

    elements.btnStoryReply.addEventListener('click', sendStoryReply);
    elements.storyReplyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendStoryReply();
    });

    elements.btnStoryPause.addEventListener('click', toggleStoryPlayback);
}

function openCreateModal() {
    elements.createModal.classList.add('open');
}

function closeCreateModal() {
    elements.createModal.classList.remove('open');
}
