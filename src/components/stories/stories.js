/* ==========================================================================
   Lumina JS - Stories Tray & Immersive Player Component
   ========================================================================== */

import { state } from '../../core/state.js';
import { elements } from '../../core/config.js';

export function renderStories() {
    elements.storiesTray.innerHTML = '';
    
    state.stories.forEach((story, index) => {
        const storyEl = document.createElement('div');
        storyEl.className = `story-item ${story.read ? 'read' : ''}`;
        storyEl.innerHTML = `
            <div class="story-avatar-container">
                <img src="${story.author.avatar}" alt="${story.author.name}" class="story-avatar">
            </div>
            <span class="story-username">${story.author.name}</span>
        `;
        storyEl.addEventListener('click', () => openStoriesViewer(index));
        elements.storiesTray.appendChild(storyEl);
    });
}

export function openStoriesViewer(userIndex) {
    state.activeStoryUserIndex = userIndex;
    state.activeStoryIndex = 0;
    
    const userStory = state.stories[userIndex];
    userStory.read = true; // Mark as read
    renderStories(); // Update tray UI

    elements.storyModal.classList.add('open');
    showStoryMedia();
}

export function showStoryMedia() {
    const userStory = state.stories[state.activeStoryUserIndex];
    const storyItem = userStory.items[state.activeStoryIndex];

    // Author Details
    elements.storyAuthorImg.src = userStory.author.avatar;
    elements.storyAuthorName.textContent = userStory.author.name;
    elements.storyTime.textContent = storyItem.time;

    // Media HTML
    elements.storyMediaBox.innerHTML = `
        <img src="${storyItem.media}" alt="Story Media">
        <div class="story-tap-region left" id="story-prev-tap"></div>
        <div class="story-tap-region right" id="story-next-tap"></div>
    `;

    // Re-bind click event on dynamically generated tap regions
    document.getElementById('story-prev-tap').addEventListener('click', () => changeStoryStep(-1));
    document.getElementById('story-next-tap').addEventListener('click', () => changeStoryStep(1));

    // Reset and Render Progress Bars
    elements.storyProgressBars.innerHTML = '';
    userStory.items.forEach((item, idx) => {
        const progressBg = document.createElement('div');
        progressBg.className = 'story-progress-bg';
        const progressFill = document.createElement('div');
        progressFill.className = 'story-progress-fill';
        
        if (idx < state.activeStoryIndex) {
            progressFill.classList.add('completed');
        } else if (idx === state.activeStoryIndex) {
            progressFill.classList.add('active');
        }
        
        progressBg.appendChild(progressFill);
        elements.storyProgressBars.appendChild(progressBg);
    });

    // Auto-advance Timer (5 seconds)
    clearTimeout(state.storyTimer);
    state.storyTimer = setTimeout(() => {
        changeStoryStep(1);
    }, 5000);
}

export function changeStoryStep(direction) {
    const userStory = state.stories[state.activeStoryUserIndex];
    
    if (direction === 1) {
        // Next
        if (state.activeStoryIndex < userStory.items.length - 1) {
            state.activeStoryIndex++;
            showStoryMedia();
        } else {
            // Next User Story
            if (state.activeStoryUserIndex < state.stories.length - 1) {
                state.activeStoryUserIndex++;
                state.activeStoryIndex = 0;
                state.stories[state.activeStoryUserIndex].read = true;
                renderStories();
                showStoryMedia();
            } else {
                closeStoryModal();
            }
        }
    } else {
        // Previous
        if (state.activeStoryIndex > 0) {
            state.activeStoryIndex--;
            showStoryMedia();
        } else {
            // Previous User Story
            if (state.activeStoryUserIndex > 0) {
                state.activeStoryUserIndex--;
                state.activeStoryIndex = state.stories[state.activeStoryUserIndex].items.length - 1;
                showStoryMedia();
            }
        }
    }
}

export function closeStoryModal() {
    clearTimeout(state.storyTimer);
    elements.storyModal.classList.remove('open');
}

export function sendStoryReply() {
    const text = elements.storyReplyInput.value.trim();
    if (!text) return;

    const userStory = state.stories[state.activeStoryUserIndex];
    alert(`Reply sent to ${userStory.author.name}: "${text}"`);
    elements.storyReplyInput.value = '';
    closeStoryModal();
}

let storyPaused = false;
export function toggleStoryPlayback() {
    storyPaused = !storyPaused;
    const activeFill = elements.storyProgressBars.querySelector('.story-progress-fill.active');
    
    if (storyPaused) {
        clearTimeout(state.storyTimer);
        if (activeFill) {
            const width = window.getComputedStyle(activeFill).width;
            activeFill.style.width = width;
            activeFill.style.animation = 'none';
        }
        elements.btnStoryPause.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    } else {
        elements.btnStoryPause.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
        changeStoryStep(1);
    }
}
