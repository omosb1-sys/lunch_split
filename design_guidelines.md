# Design Guidelines: Korean Lunch Decision App

## Design Approach

**Hybrid Approach**: Combining Material Design's interaction patterns with food delivery app aesthetics (inspired by Uber Eats, DoorDash) to create a friendly, efficient decision-making experience. The app prioritizes quick interactions and social engagement while maintaining clean, functional design.

**Design Philosophy**: Playful functionality - make lunch decisions feel fun and effortless while maintaining clarity and speed. Mobile-first design with generous touch targets and instant visual feedback.

## Typography System

**Primary Font**: Noto Sans KR (excellent Korean character support)
**Secondary Font**: Inter for numbers/Latin characters

**Hierarchy**:
- Hero Headlines: 2.5rem (40px), Bold (700) - Page titles, menu recommendations
- Section Headers: 1.75rem (28px), SemiBold (600) - Card headers, room titles
- Body Large: 1.125rem (18px), Medium (500) - Menu items, vote options
- Body Regular: 1rem (16px), Regular (400) - Supporting text, descriptions
- Small Text: 0.875rem (14px), Regular (400) - Timestamps, metadata
- Buttons: 1rem (16px), SemiBold (600) - All CTAs

## Layout System

**Spacing Primitives**: Consistent use of Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24
- Micro spacing (gaps, padding): 2, 4
- Component spacing: 6, 8
- Section spacing: 12, 16, 20
- Page margins: 16, 20, 24

**Container Strategy**:
- Mobile (default): max-w-md (448px) centered with px-4
- Tablet: max-w-2xl (672px) with px-6
- Desktop: max-w-4xl (896px) - app stays focused, not sprawling

**Grid System**:
- Menu cards: Single column on mobile, 2 columns on tablet (md:grid-cols-2)
- Vote options: Always single column for clarity
- Bill items: Single column with responsive padding

## Component Library

### Navigation & Header
**Fixed Header Component**:
- Height: h-16 (64px) with sticky positioning
- Contains: App logo/title (left), navigation icons (right)
- Shadow: subtle bottom shadow for depth
- Padding: px-4 py-3

**Tab Navigation** (for multi-step flows):
- Horizontal pill-style tabs with indicator
- Touch target: min-h-12 (48px)
- Spacing: gap-2 between tabs

### Cards & Content Containers

**Menu Card** (primary reusable component):
- Padding: p-6 on desktop, p-4 on mobile
- Border radius: rounded-2xl (16px)
- Shadow: moderate elevation
- Structure: Food emoji/icon (top), menu name (center), action buttons (bottom)
- Min height: min-h-[200px] for consistency

**Vote Option Card**:
- Similar to MenuCard but horizontal layout on larger screens
- Include vote count badge (top-right corner)
- Progress bar showing vote percentage
- Padding: p-4 with gap-4 between elements

**Bill Item Card**:
- Compact horizontal layout: p-4
- Person name (left), amount (right), checkbox/checkmark (far right)
- Border radius: rounded-xl
- Divider lines between items

### Buttons

**Primary Action Buttons**:
- Height: h-12 (48px) minimum for touch
- Padding: px-8 py-3
- Border radius: rounded-xl
- Font: SemiBold (600), 1rem
- Full width on mobile: w-full

**Secondary Buttons**:
- Same dimensions as primary
- Outlined style with border-2
- Hover: subtle background fill

**Icon Buttons**:
- Size: w-10 h-10 (40px)
- Border radius: rounded-lg
- Used for: add/remove, share, settings

**Floating Action Button** (for "Create Vote Room"):
- Size: w-14 h-14 (56px)
- Position: fixed bottom-6 right-6
- Border radius: rounded-full
- Shadow: large elevation

### Forms & Input

**Text Input Fields**:
- Height: h-12 (48px)
- Padding: px-4 py-3
- Border radius: rounded-lg
- Border width: border-2
- Full width: w-full

**Number Input** (for bill amounts):
- Larger size: h-14 (56px)
- Right-aligned text for currency
- Prefix with currency symbol (₩)

**Checkbox/Radio Inputs**:
- Custom styled with larger touch targets: w-6 h-6 (24px)
- Border radius: rounded (4px) for checkbox, rounded-full for radio
- Visible focus states

### Interactive Elements

**Emoji/Icon Container**:
- Size: w-16 h-16 (64px) for menu cards
- Larger: w-20 h-20 (80px) for result display
- Background: subtle circular background
- Centered with flex

**Vote Result Bar**:
- Height: h-2.5 (10px)
- Border radius: rounded-full
- Animated width transition
- Full width with overflow-hidden

**Badge/Counter**:
- Padding: px-2.5 py-1
- Border radius: rounded-full
- Font size: 0.875rem (14px), Medium (500)
- Positioned absolute on cards (top-right: -right-2 -top-2)

### Page-Specific Layouts

**Home Page**:
- Centered single-column layout
- Hero section: pt-20 pb-12
- Large recommendation display with emoji: w-24 h-24
- Spacing between CTA and result: my-8
- Navigation links: mt-12

**Vote Room Page**:
- Header with room code/title: sticky top-0
- Vote options list: space-y-4
- Live update indicator: fixed top-16
- Results summary: sticky bottom-0 or floating card
- Participant avatars/count: horizontal scroll if needed

**Split Bill Page**:
- Form at top: mb-8
- Participant list: space-y-3
- Total summary card: sticky bottom-0, elevated
- Split calculation displayed prominently
- Quick split buttons: grid-cols-3 gap-2

## Animations & Interactions

**Micro-interactions** (minimal, purposeful):
- Button press: scale-95 on active
- Card hover: subtle lift (translate-y-[-2px])
- Menu selection: gentle bounce animation
- Vote submission: checkmark fade-in
- Number increment: count-up animation

**Page Transitions**:
- Slide transitions between pages (subtle, 200ms)
- No elaborate route animations

**Loading States**:
- Skeleton screens for menu cards
- Pulse animation on loading elements
- Duration: 1.5s infinite

## Mobile Optimization

**Touch Targets**:
- Minimum 44px × 44px for all interactive elements
- Spacing between tappable items: min gap-3

**Viewport Considerations**:
- Safe area padding for iOS notch: pt-safe
- Bottom navigation stays above home indicator
- Scrollable content has bottom padding: pb-20

**Gesture Support**:
- Pull-to-refresh on vote room
- Swipe to delete on bill items
- Long press for menu item details

## Accessibility

**Focus Management**:
- Visible focus rings: ring-2 ring-offset-2
- Logical tab order throughout
- Focus trap in modals

**Screen Reader Support**:
- Proper ARIA labels for all interactive elements
- Live region announcements for vote updates
- Semantic HTML structure

**Contrast & Readability**:
- Text meets WCAG AA standards minimum
- Icons paired with text labels
- Error messages clearly visible

## Images

**No hero images** for this utility app. Instead:
- Food emoji as primary visual elements (large, 64-80px)
- Optional: Small food photos in menu cards (aspect-ratio-square, rounded-lg)
- Avatar placeholders for users (32px × 32px circles)
- Empty states: illustration-style graphics (max-w-xs, centered)

Keep visuals playful with emojis rather than photography to maintain fast loading and casual feel.