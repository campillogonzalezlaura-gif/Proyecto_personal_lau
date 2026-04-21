# **App Name**: Novart

## Core Features:

- Artist Profiles & Authentication: Secure user authentication and management of artist profiles including artist name, profile photo, and biography.
- Protected Artwork Upload & Display: Allow artists to upload original artwork securely. Automatically process images to embed an indelible digital watermark (author name, Novart logo) and generate an optimized public thumbnail, storing both protected and public versions. Display the watermarked public version on the feed.
- Real-time Content Feed & Discovery: Dynamically display artworks with real-time updates using Firestore's onSnapshot. Implement a discovery algorithm prioritizing 'New Artists' based on tags to ensure diverse exposure, alongside general feed browsing.
- Social Interactions: Enable users to 'like' artworks, add 'comments', and 'follow' other artists to foster community engagement.
- Client-Side IP Protection: Implement front-end mechanisms such as blocking right-click on web and disabling screenshots on mobile (LayoutMirroring or Secure Flag) to safeguard artwork display.
- Cross-Platform Notifications: Deliver push notifications via Firebase Cloud Messaging for new interactions (likes, comments, follows) to keep artists engaged and promote networking.
- Offline Persistence: Enable local data persistence to allow users to browse galleries and artworks even without an internet connection, ensuring a seamless experience.

## Style Guidelines:

- Color scheme: Dark theme, reflecting professionalism, sophistication, and allowing artworks to stand out.
- Primary color: A deep, muted purplish-blue (#4D4591) symbolizing creativity and stability, contrasting effectively with the dark background.
- Background color: A very dark, slightly desaturated purplish tone (#1A181F) from the same hue as the primary color, providing a refined backdrop for the art.
- Accent color: A vibrant sky blue (#5CA3EE), analogous to the primary color, to highlight interactive elements and call-to-actions, ensuring good contrast and visual appeal.
- Headline font: 'Space Grotesk' (sans-serif) for a modern, tech-informed and distinctive aesthetic suitable for artist-focused branding.
- Body font: 'Inter' (sans-serif) for clean readability and a neutral, objective feel across artwork descriptions and comments.
- Use minimalist, line-art style icons that are intuitive and contribute to an uncluttered interface, maintaining focus on the artwork.
- Employ a clean, grid-based layout for galleries and feeds, emphasizing artworks with ample negative space to prevent visual noise. Prioritize a responsive design for consistent experience across web and mobile.
- Incorporate subtle micro-interactions and transitions for feedback on social actions (e.g., liking, following) and smooth content loading, enhancing perceived responsiveness without distracting from the art.