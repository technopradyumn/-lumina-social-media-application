/* ==========================================================================
   Lumina JS - Centralized Application State
   ========================================================================== */

export const state = {
    currentUser: {
        name: "Aurora Thorne",
        handle: "aurorathorne",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
        postsCount: 4,
        followersCount: "12.8k",
        followingCount: "384",
        bio: "🎨 Interactive UI/UX Engineer • Crafting glassmorphic visual environments using CSS/HTML/JS • ☕ Coffee enthusiast & open-source developer."
    },
    currentView: "feed",
    repliesEnabled: true,
    activeChatId: null,
    activeStoryIndex: 0,
    activeStoryUserIndex: 0,
    storyTimer: null,
    posts: [
        {
            id: "post_1",
            author: {
                name: "CyberVibe",
                handle: "cybervibe",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
                verified: true
            },
            caption: "Just finished coding the layout for Lumina using CSS Grid and variables! Frosty glass is here to stay. Let me know what you think of the glowing background. 🚀✨ #GlassmorphicUI #VanillaJSChallenge #CSSArt",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
            location: "Neo Tokyo",
            likes: 128,
            comments: [
                { author: "NeonArt", text: "This looks absolutely breathtaking! The glassmorphism blur is perfect." },
                { author: "CodeArchitect", text: "Insane performance. Smooth animations even on my mobile!" }
            ],
            liked: false,
            bookmarked: false,
            time: "2 hours ago"
        },
        {
            id: "post_2",
            author: {
                name: "NeonArt",
                handle: "neon_art",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
                verified: true
            },
            caption: "Immersive abstract visual exploration. Floating glass spheres, iridescent glowing ribbons, and custom HSL variables. The future is vibrant. 💎🎨 #AbstractArt #CSSArt #ModernDesign",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
            location: "Virtual Gallery",
            likes: 94,
            comments: [
                { author: "CyberVibe", text: "The color transitions are super clean! Did you generate this dynamically?" },
                { author: "PixelNinja", text: "Loving the ambient glow behind the card. Great aesthetic!" }
            ],
            liked: false,
            bookmarked: false,
            time: "5 hours ago"
        }
    ],
    stories: [
        {
            userId: "story_user_1",
            author: {
                name: "CyberVibe",
                handle: "cybervibe",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
            },
            items: [
                { media: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", time: "1h ago" },
                { media: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80", time: "40m ago" }
            ],
            read: false
        },
        {
            userId: "story_user_2",
            author: {
                name: "NeonArt",
                handle: "neon_art",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
            },
            items: [
                { media: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80", time: "3h ago" }
            ],
            read: false
        },
        {
            userId: "story_user_3",
            author: {
                name: "CodeArchitect",
                handle: "codearchitect",
                avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80"
            },
            items: [
                { media: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", time: "5h ago" }
            ],
            read: true
        }
    ],
    chats: [
        {
            id: "chat_cybervibe",
            user: {
                name: "CyberVibe",
                handle: "cybervibe",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
                status: "active"
            },
            unread: true,
            messages: [
                { sender: "them", text: "Hey Aurora! Did you see the new CSS backdrop-filter specification?", time: "03:45 PM" },
                { sender: "me", text: "Yes! The performance has improved so much. Lumina uses it everywhere.", time: "03:47 PM" },
                { sender: "them", text: "Dude, that layout animation looks so crisp! How did you do it?", time: "03:48 PM" }
            ],
            botReplies: [
                "I used CSS transitions with cubic-bezier to get that elastic pop effect! Try checking out style.css.",
                "Awesome! If you need any help integrating glassmorphism, just let me know. Lumina is open source!",
                "Check out the Explore tab too, some cool layouts there!"
            ]
        },
        {
            id: "chat_neon_art",
            user: {
                name: "NeonArt",
                handle: "neon_art",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
                status: "offline"
            },
            unread: false,
            messages: [
                { sender: "me", text: "Hey! Do you mind if I showcase your abstract render as a featured post?", time: "Yesterday" },
                { sender: "them", text: "Thanks for sharing the asset link. It worked perfectly. Yes, please do! I'd love that.", time: "Yesterday" }
            ],
            botReplies: [
                "Awesome! Let me know when you publish new layouts.",
                "Designing in HSL colors makes customization so fun."
            ]
        }
    ],
    notifications: [
        { id: 1, type: "like", actor: "CyberVibe", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80", text: "liked your post 'Abstract Composition'", time: "4m ago", unread: true },
        { id: 2, type: "comment", actor: "CodeArchitect", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80", text: "commented: 'Excellent responsive code!'", time: "18m ago", unread: true },
        { id: 3, type: "follow", actor: "PixelNinja", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80", text: "started following you", time: "2h ago", unread: true },
        { id: 4, type: "like", actor: "NeonArt", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80", text: "liked your post 'Setup Showcase'", time: "5h ago", unread: false },
        { id: 5, type: "comment", actor: "CyberVibe", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80", text: "commented: 'Need this setup ASAP!'", time: "1d ago", unread: false }
    ],
    suggestions: [
        { name: "CodeArchitect", handle: "codearchitect", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80", followed: false },
        { name: "PixelNinja", handle: "pixelninja", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80", followed: false }
    ]
};
