/* ==========================================================================
   Lumina JS - Common Utilities & Helpers
   ========================================================================== */

// Format hashtag links inside captions
export function formatCaption(text) {
    return text.replace(/#\w+/g, '<span class="hashtag">$&</span>');
}

// Appends activity log entries dynamically
export function addAnalyticsLog(desc, dotColor) {
    const logList = document.querySelector('.activity-log-list');
    if (!logList) return;

    const newLog = document.createElement('div');
    newLog.className = 'log-item';
    newLog.innerHTML = `
        <span class="log-dot ${dotColor}"></span>
        <span class="log-desc">${desc}</span>
        <span class="log-time">Just now</span>
    `;
    logList.insertBefore(newLog, logList.firstChild);
}

// Apply visual accent colors dynamically to document root
export function applyThemeColor(color) {
    const root = document.documentElement;
    let primary = '#8B5CF6';
    let primaryRgb = '139, 92, 246';
    let secondary = '#06B6D4';

    switch(color) {
        case 'purple':
            primary = '#8B5CF6';
            primaryRgb = '139, 92, 246';
            secondary = '#06B6D4';
            break;
        case 'cyan':
            primary = '#06B6D4';
            primaryRgb = '6, 182, 212';
            secondary = '#10B981';
            break;
        case 'pink':
            primary = '#EC4899';
            primaryRgb = '236, 72, 153';
            secondary = '#8B5CF6';
            break;
        case 'emerald':
            primary = '#10B981';
            primaryRgb = '16, 185, 129';
            secondary = '#06B6D4';
            break;
        case 'gold':
            primary = '#F59E0B';
            primaryRgb = '245, 158, 11';
            secondary = '#EC4899';
            break;
    }

    root.style.setProperty('--accent-primary', primary);
    root.style.setProperty('--accent-primary-rgb', primaryRgb);
    root.style.setProperty('--accent-secondary', secondary);

    addAnalyticsLog(`Accent Theme color updated to ${color.toUpperCase()}`, 'green');
}
