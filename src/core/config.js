/* ==========================================================================
   Lumina JS - DOM Elements Configuration Cache
   ========================================================================== */

export const elements = {
    themeToggleBtn: document.getElementById('theme-toggle'),
    navItems: document.querySelectorAll('.nav-item'),
    views: document.querySelectorAll('.app-view'),
    storiesTray: document.getElementById('stories-tray'),
    postsContainer: document.getElementById('posts-container'),
    creatorsSuggestions: document.getElementById('creators-suggestions'),
    globalSearch: document.getElementById('global-search'),
    
    // Modals
    createModal: document.getElementById('create-modal'),
    storyModal: document.getElementById('story-modal'),
    
    // Story Viewer Details
    storyProgressBars: document.getElementById('story-progress-bars'),
    storyAuthorImg: document.getElementById('story-author-img'),
    storyAuthorName: document.getElementById('story-author-name'),
    storyTime: document.getElementById('story-time'),
    storyMediaBox: document.getElementById('story-media-box'),
    storyReplyInput: document.getElementById('story-reply-input'),
    btnStoryReply: document.getElementById('btn-story-reply'),
    btnStoryPause: document.getElementById('btn-story-pause'),
    
    // Create Post Inputs
    uploaderArea: document.getElementById('uploader-area'),
    postCaption: document.getElementById('post-caption'),
    postLocation: document.getElementById('post-location'),
    btnSubmitPost: document.getElementById('btn-submit-post'),
    
    // Messages
    chatsList: document.getElementById('chats-list'),
    chatMainArea: document.getElementById('chat-main-area'),
    chatBadge: document.getElementById('chat-badge'),
    
    // Notifications
    notifListContainer: document.getElementById('notif-list-container'),
    notifBadge: document.getElementById('notif-badge'),
    btnClearNotifs: document.getElementById('btn-clear-notifs'),
    
    // Profile
    profileGrid: document.getElementById('profile-grid'),
    profileTabs: document.querySelectorAll('.profile-tab'),
    profileStatPostsCount: document.getElementById('profile-stat-posts'),
    
    // Mini Chat
    miniChatLog: document.getElementById('mini-chat-log'),
    miniChatInput: document.getElementById('mini-chat-input'),
    miniChatSend: document.getElementById('mini-chat-send'),
    
    // Interactivity feedback
    heartOverlay: document.getElementById('heart-feedback-overlay'),
    
    // Settings inputs & toggles
    settingName: document.getElementById('setting-name'),
    settingHandle: document.getElementById('setting-handle'),
    settingBio: document.getElementById('setting-bio'),
    btnSaveSettings: document.getElementById('btn-save-settings'),
    themeBubbles: document.querySelectorAll('.theme-bubble'),
    toggleAmbient: document.getElementById('toggle-ambient'),
    toggleReplies: document.getElementById('toggle-replies')
};
