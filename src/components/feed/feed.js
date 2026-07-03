/* ==========================================================================
   Lumina JS - Posts Feed, Suggestion List & Explore Tab Component
   ========================================================================== */

import { state } from '../../core/state.js';
import { elements } from '../../core/config.js';
import { formatCaption } from '../../core/utils.js';
import { switchView, updateBadges } from '../../core/router.js';
import { renderNotifications, renderInbox } from '../messages/messages.js';
import { renderProfileGrid } from '../profile/profile.js';

export function renderPosts(filterQuery = '') {
    elements.postsContainer.innerHTML = '';
    
    const filteredPosts = state.posts.filter(post => {
        if (!filterQuery) return true;
        return post.caption.toLowerCase().includes(filterQuery) || 
               post.author.name.toLowerCase().includes(filterQuery) ||
               (post.location && post.location.toLowerCase().includes(filterQuery));
    });

    if (filteredPosts.length === 0) {
        elements.postsContainer.innerHTML = `
            <div class="glass-panel" style="padding: 40px; text-align: center; border-radius: var(--radius-lg); color: var(--text-muted)">
                <p>No posts match your search query.</p>
            </div>
        `;
        return;
    }

    filteredPosts.forEach((post) => {
        const postCard = document.createElement('article');
        postCard.className = 'post-card glass-panel';
        postCard.innerHTML = `
            <div class="post-header">
                <div class="post-user-info" id="user-link-${post.id}">
                    <img src="${post.author.avatar}" alt="${post.author.name}" class="avatar-sm">
                    <div class="post-user-details">
                        <span class="post-user-name">
                            ${post.author.name}
                            ${post.author.verified ? `
                            <span class="verified-badge">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                                Pro
                            </span>` : ''}
                        </span>
                        <span class="post-user-handle">@${post.author.handle} ${post.location ? `• ${post.location}` : ''}</span>
                    </div>
                </div>
                <span class="post-meta">${post.time}</span>
            </div>
            
            <div class="post-media-container" id="media-${post.id}">
                <img src="${post.image}" alt="Post Visual" class="post-image">
                <div class="post-heart-pop" id="heart-pop-${post.id}">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
            </div>

            <div class="post-actions">
                <div class="actions-group">
                    <button class="action-btn ${post.liked ? 'liked' : ''}" id="btn-like-${post.id}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        <span class="like-count">${post.likes}</span>
                    </button>
                    <button class="action-btn" id="btn-comment-drawer-${post.id}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                        <span>${post.comments.length}</span>
                    </button>
                    <button class="action-btn" id="btn-share-${post.id}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                </div>
                <button class="action-btn ${post.bookmarked ? 'bookmarked' : ''}" id="btn-bookmark-${post.id}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                </button>
            </div>

            <div class="post-content">
                <div class="post-caption">${formatCaption(post.caption)}</div>
                <div class="post-stats-row">
                    <span>${post.likes} likes • ${post.comments.length} comments</span>
                </div>
            </div>

            <div class="post-comments-section" id="comments-${post.id}">
                <div class="comments-list">
                    ${post.comments.map(c => `
                        <div class="comment-item">
                            <span class="comment-author">${c.author}</span>
                            <span class="comment-text">${c.text}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="comment-input-box">
                    <input type="text" placeholder="Add a comment for ${post.author.name}..." id="comment-input-${post.id}">
                    <span class="btn-send-comment" id="comment-send-btn-${post.id}">Post</span>
                </div>
            </div>
        `;
        
        elements.postsContainer.appendChild(postCard);

        // Bind interactive event listeners manually to elements inside card
        postCard.querySelector(`#user-link-${post.id}`).addEventListener('click', () => navigateToCreator(post.author.handle));
        postCard.querySelector(`#btn-like-${post.id}`).addEventListener('click', () => toggleLike(post.id));
        postCard.querySelector(`#btn-comment-drawer-${post.id}`).addEventListener('click', () => toggleCommentsDrawer(post.id));
        postCard.querySelector(`#btn-share-${post.id}`).addEventListener('click', () => simulateShare(post.id));
        postCard.querySelector(`#btn-bookmark-${post.id}`).addEventListener('click', () => toggleBookmark(post.id));
        postCard.querySelector(`#comment-send-btn-${post.id}`).addEventListener('click', () => submitComment(post.id));

        const commentInput = postCard.querySelector(`#comment-input-${post.id}`);
        commentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitComment(post.id);
        });

        // Double-tap Setup
        const mediaContainer = postCard.querySelector('.post-media-container');
        let lastTap = 0;
        mediaContainer.addEventListener('click', () => {
            const now = Date.now();
            const timespan = now - lastTap;
            if (timespan < 300 && timespan > 0) {
                handleDoubleTapLike(post.id);
            }
            lastTap = now;
        });
    });
}

export function toggleLike(postId) {
    const post = state.posts.find(p => p.id === postId);
    if (!post) return;
    
    if (post.liked) {
        post.liked = false;
        post.likes--;
    } else {
        post.liked = true;
        post.likes++;
        
        if (post.author.handle !== state.currentUser.handle) {
            state.notifications.unshift({
                id: Date.now(),
                type: "like",
                actor: state.currentUser.name,
                avatar: state.currentUser.avatar,
                text: "liked your post in Lumina Feed",
                time: "Just now",
                unread: true
            });
            updateBadges();
            renderNotifications();
        }
    }
    renderPosts();
    renderProfileGrid();
}

export function handleDoubleTapLike(postId) {
    const post = state.posts.find(p => p.id === postId);
    if (!post) return;

    const heartPop = document.getElementById(`heart-pop-${postId}`);
    heartPop.classList.remove('animate');
    void heartPop.offsetWidth; // Trigger reflow
    heartPop.classList.add('animate');

    if (!post.liked) {
        post.liked = true;
        post.likes++;
        renderPosts();
        renderProfileGrid();

        if (post.author.handle !== state.currentUser.handle) {
            state.notifications.unshift({
                id: Date.now(),
                type: "like",
                actor: state.currentUser.name,
                avatar: state.currentUser.avatar,
                text: "liked your post in Lumina Feed",
                time: "Just now",
                unread: true
            });
            updateBadges();
            renderNotifications();
        }
    }
}

export function toggleCommentsDrawer(postId) {
    const drawer = document.getElementById(`comments-${postId}`);
    drawer.classList.toggle('open');
}

export function toggleBookmark(postId) {
    const post = state.posts.find(p => p.id === postId);
    if (!post) return;
    post.bookmarked = !post.bookmarked;
    renderPosts();
    renderProfileGrid();
}

export function simulateShare(postId) {
    elements.heartOverlay.classList.remove('show');
    const tempText = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(tempText).then(() => {
        alert("Mock link copied to clipboard: " + tempText);
    }).catch(() => {
        alert("Post shared successfully!");
    });
}

export function submitComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    if (!input || !input.value.trim()) return;

    const post = state.posts.find(p => p.id === postId);
    if (!post) return;

    post.comments.push({
        author: state.currentUser.name,
        text: input.value.trim()
    });

    if (post.author.handle !== state.currentUser.handle) {
        state.notifications.unshift({
            id: Date.now(),
            type: "comment",
            actor: state.currentUser.name,
            avatar: state.currentUser.avatar,
            text: `commented: '${input.value.trim()}'`,
            time: "Just now",
            unread: true
        });
        updateBadges();
        renderNotifications();
    }

    input.value = '';
    renderPosts();
    const drawer = document.getElementById(`comments-${postId}`);
    if (drawer) drawer.classList.add('open');
}

export function renderSuggestions() {
    elements.creatorsSuggestions.innerHTML = '';
    
    state.suggestions.forEach((item, index) => {
        const creatorRow = document.createElement('div');
        creatorRow.className = 'creator-suggestion';
        creatorRow.innerHTML = `
            <div class="creator-info" id="suggested-creator-${index}">
                <img src="${item.avatar}" alt="${item.name}" class="avatar-sm">
                <div>
                    <div class="creator-name">${item.name}</div>
                    <div class="creator-handle">@${item.handle}</div>
                </div>
            </div>
            <button class="btn-follow ${item.followed ? 'following' : ''}" id="btn-follow-${index}">
                ${item.followed ? 'Following' : 'Follow'}
            </button>
        `;
        elements.creatorsSuggestions.appendChild(creatorRow);

        creatorRow.querySelector(`#suggested-creator-${index}`).addEventListener('click', () => navigateToCreator(item.handle));
        creatorRow.querySelector(`#btn-follow-${index}`).addEventListener('click', () => toggleFollow(index));
    });
}

export function toggleFollow(index) {
    const item = state.suggestions[index];
    item.followed = !item.followed;
    renderSuggestions();

    if (item.followed) {
        const chatExists = state.chats.find(c => c.user.handle === item.handle);
        if (!chatExists) {
            state.chats.push({
                id: `chat_${item.handle}`,
                user: {
                    name: item.name,
                    handle: item.handle,
                    avatar: item.avatar,
                    status: "active"
                },
                unread: false,
                messages: [
                    { sender: "them", text: `Thanks for the follow, ${state.currentUser.name}! Glad to connect.`, time: "Just now" }
                ],
                botReplies: [
                    "How are your design systems going?",
                    "Vanilla JS is really versatile, isn't it?",
                    "Catch you later!"
                ]
            });
            renderInbox();
        }
    }
}

export function navigateToCreator(handle) {
    if (handle === state.currentUser.handle) {
        switchView('profile');
    } else {
        alert(`Navigating to Creator Profile: @${handle}. This features high-end graphics and layouts!`);
    }
}

export function renderExplore(filterQuery = '') {
    const grid = document.getElementById('explore-grid');
    grid.innerHTML = '';

    const explorePool = [
        { title: "Glassmorphic Cards", tags: "Creative Layouts", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80", cat: "creative" },
        { title: "Neo Coder Workspace", tags: "Future Tech", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80", cat: "tech" },
        { title: "Elastic Animations", tags: "Frontend Code", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80", cat: "code" },
        { title: "Dashboard Layout 2026", tags: "Creative Layouts", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80", cat: "creative" },
        { title: "Vibe Shader Art", tags: "Frontend Code", image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80", cat: "code" },
        { title: "Cybernetic Overlay HUD", tags: "Future Tech", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80", cat: "tech" }
    ];

    const filtered = explorePool.filter(item => {
        if (!filterQuery) return true;
        return item.title.toLowerCase().includes(filterQuery) || item.tags.toLowerCase().includes(filterQuery);
    });

    filtered.forEach(item => {
        const gridItem = document.createElement('div');
        gridItem.className = 'explore-item';
        gridItem.setAttribute('data-cat', item.cat);
        gridItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="explore-overlay">
                <h4>${item.title}</h4>
                <span>${item.tags}</span>
            </div>
        `;
        grid.appendChild(gridItem);
    });

    const tabs = document.querySelectorAll('.explore-tab');
    tabs.forEach(tab => {
        // Clear previous listeners by replacing node or standard rebinding
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const cat = tab.getAttribute('data-tab');

            const allItems = grid.querySelectorAll('.explore-item');
            allItems.forEach(item => {
                if (cat === 'all' || item.getAttribute('data-cat') === cat) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        };
    });
}
