/* ==========================================================================
   Lumina JS - Settings Editor Component
   ========================================================================== */

import { state } from '../../core/state.js';
import { elements } from '../../core/config.js';
import { addAnalyticsLog, applyThemeColor } from '../../core/utils.js';

export function initSettings() {
    if (!elements.btnSaveSettings) return;

    // 1. Save Profile Details
    elements.btnSaveSettings.addEventListener('click', () => {
        const nameVal = elements.settingName.value.trim();
        const handleVal = elements.settingHandle.value.trim();
        const bioVal = elements.settingBio.value.trim();

        if (!nameVal || !handleVal) {
            alert("Name and username handle cannot be blank!");
            return;
        }

        // Update Global State
        state.currentUser.name = nameVal;
        state.currentUser.handle = handleVal;
        state.currentUser.bio = bioVal;

        // Propagate changes instantly to user pill in sidebar
        const sidebarName = document.querySelector('.user-pill-name');
        const sidebarTag = document.querySelector('.user-pill-tag');
        if (sidebarName) sidebarName.textContent = nameVal;
        if (sidebarTag) sidebarTag.textContent = '@' + handleVal;

        // Propagate changes instantly to profile card header
        const profileName = document.querySelector('.profile-name-section h1');
        const profileHandle = document.querySelector('.profile-handle');
        const profileBio = document.querySelector('.profile-bio');
        if (profileName) profileName.innerHTML = `${nameVal} <span class="verified-badge"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>Pro Creator</span>`;
        if (profileHandle) profileHandle.textContent = '@' + handleVal;
        if (profileBio) profileBio.textContent = bioVal;

        addAnalyticsLog(`Profile credentials updated to <strong>@${handleVal}</strong>`, 'cyan');
        alert("Portal customizations saved successfully!");
    });

    // 2. Accent Color Theme Presets Selection
    elements.themeBubbles.forEach(bubble => {
        bubble.addEventListener('click', () => {
            elements.themeBubbles.forEach(b => b.classList.remove('active'));
            bubble.classList.add('active');
            
            const color = bubble.getAttribute('data-theme-color');
            applyThemeColor(color);
        });
    });

    // 3. Ambient Glow Toggle switch
    elements.toggleAmbient.addEventListener('change', (e) => {
        const glows = document.querySelectorAll('.ambient-glow');
        glows.forEach(glow => {
            if (e.target.checked) {
                glow.style.display = 'block';
            } else {
                glow.style.display = 'none';
            }
        });

        addAnalyticsLog('Ambient Glow backdrops ' + (e.target.checked ? 'enabled' : 'disabled'), 'purple');
    });

    // 4. Real-Time Smart Replies toggle switch
    elements.toggleReplies.addEventListener('change', (e) => {
        state.repliesEnabled = e.target.checked;
        addAnalyticsLog('AI Smart replies ' + (e.target.checked ? 'enabled' : 'disabled'), 'pink');
    });
}
