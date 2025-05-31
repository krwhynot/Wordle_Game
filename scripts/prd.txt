# Food & Beverage Wordle - Architecture Documentation

## Launch Features (MVP)

### Core Game Engine

**Strong** The fundamental Wordle game mechanics with 5-letter word guessing, 6 attempts, and color-coded feedback system optimized for Food & Beverage industry terminology.

* Implement game board with 6 rows × 5 letter tiles
* Virtual keyboard with click/tap support
* Physical keyboard input handling
* Color feedback system: Turquoise (correct position), Tangerine (wrong position), Grey (not in word)
* Tile flip animation on guess submission
* Session-based game state management
* Word validation against F&B dictionary

#### Tech Involved

* React 18+ with TypeScript for game logic
* SCSS with CSS animations for tile flips
* React Context API for state management
* Local storage for session persistence

#### Main Requirements

* Sub-200ms interaction response time
* Smooth 60fps animations
* Keyboard accessibility compliance

### Player Identification System

**Strong** Lightweight name entry modal that captures player name before game start, storing it in session for personalization without requiring authentication.

* Modal overlay with name input field
* Session storage for name persistence
* Skip option for returning players
* Name display in game interface
* No database storage (privacy-first)

#### Tech Involved

* React modal component
* Session storage API
* Material 3 Expressive form styling

#### Main Requirements

* Name validation (2-20 characters)
* Auto-focus on modal open
* Graceful handling of no-name entry

### Word Import & Management

**Strong** One-time import system for 3000 F&B industry words with validation, indexing, and storage in Cosmos DB for efficient retrieval.

* Node.js import script for text file processing
* Word validation (5 letters, alphabetic only)
* Cosmos DB bulk import with indexing
* Metadata addition (difficulty, category)
* Version control for word list updates

#### Tech Involved

* Node.js import script
* Azure Cosmos DB SDK
* Git for word list versioning
* TypeScript for type safety

#### Main Requirements

* One-time setup process
* Import completion < 5 minutes
* Validation error reporting

### Daily Word System

**Strong** Deterministic daily word generation where all players receive the same word, using date-based seeding with UTC midnight reset.

* Crypto-based seed generation from date
* UTC midnight boundary handling
* No scheduling required (calculated on-demand)
* Countdown timer to next word
* Previous day navigation

#### Tech Involved

* Azure Functions HTTP trigger
* Crypto module for seeding
* Moment.js for timezone handling
* In-memory caching

#### Main Requirements

* Consistent word across all players
* Sub-100ms generation time
* Accurate timezone display

### 30-Day Historical Access

**Strong** Calendar-based interface allowing players to access and play any word from the past 30 days using the same deterministic algorithm.

* Date picker component (mobile-friendly)
* Historical word generation
* Past performance tracking
* Shareable historical results
* URL-based date parameters

#### Tech Involved

* React calendar component
* URL state management
* Local storage for past games
* Share API integration

#### Main Requirements

* Instant historical lookup
* Mobile-optimized date picker
* Deep linking support

### Aggregate Statistics Dashboard

**Strong** Real-time global statistics tracking total games played, win percentage, and guess distribution across all players.

* Global stats document in Cosmos DB
* Atomic increment operations
* Win percentage calculation
* Guess distribution (1-6 attempts)
* Daily trend analysis
* Anonymous aggregation

#### Tech Involved

* Cosmos DB atomic operations
* Azure Functions for updates
* Recharts for visualization
* Efficient caching strategy

#### Main Requirements

* Thread-safe increments
* Real-time updates
* < 1 second load time

### Material 3 Expressive UI

**Strong** Android 16-inspired design system with springy animations, dynamic color theming, and responsive layouts optimized for both desktop and mobile.

* Turquoise (#06D6A0) primary color
* Tangerine (#FFA552) accent color
* Light Gray-Blue (#EFF6F5) background
* Springy animations (250ms cubic-bezier)
* Responsive breakpoints (xs to xl)
* Dark mode support
* Background blur effects

#### Tech Involved

* SCSS with CSS custom properties
* CSS animations and transitions
* React Spring for complex animations
* Responsive grid system

#### Main Requirements

* 60fps animation performance
* WCAG 2.1 AA compliance
* Touch-optimized interactions

### Azure Infrastructure Setup

**Strong** Cost-optimized cloud infrastructure using Azure free tiers to achieve <$1/month hosting while maintaining scalability for hundreds of users.

* Azure Static Web Apps (free tier) for React frontend
* Azure Functions Consumption plan for API
* Cosmos DB Free Tier (400 RU/s, 5GB)
* Application Insights free tier
* Custom domain configuration (wordle.kjrcloud.com)

#### Tech Involved

* Azure Resource Manager templates
* GitHub Actions for CI/CD
* Environment variable management
* CORS configuration

#### Main Requirements

* Zero cold start for common operations
* 99.9% uptime SLA
* Automatic HTTPS/SSL

## Future Features (Post-MVP)

### Player Profiles & Authentication

* Azure AD B2C integration
* Personal statistics tracking
* Achievement system
* Cross-device sync
* Social login options

#### Tech Involved

* Azure AD B2C
* Secure token handling
* Profile data schema

#### Main Requirements

* GDPR compliance
* Seamless migration from anonymous
* OAuth 2.0 implementation

### Competitive Leaderboards

* Daily/weekly/all-time rankings
* Friend challenges
* Tournament mode
* Speed run competitions
* Regional leaderboards

#### Tech Involved

* Redis for real-time rankings
* WebSocket for live updates
* Complex query optimization

#### Main Requirements

* Sub-second leaderboard updates
* Cheat prevention
* Fair ranking algorithm

### Food Facts & Education

* Post-game trivia about guessed words
* Recipe suggestions
* Ingredient information
* Cooking technique explanations
* Wine pairing suggestions

#### Tech Involved

* External recipe APIs
* Content management system
* Rich media storage

#### Main Requirements

* Educational content curation
* API rate limit management
* Multimedia optimization

### Difficulty Levels

* 3-letter (appetizer mode)
* 4-letter (starter mode)
* 5-letter (main course - default)
* 6-letter (chef mode)
* Adaptive difficulty

#### Tech Involved

* Extended word databases
* Difficulty algorithm
* User preference storage

#### Main Requirements

* Balanced difficulty curve
* Separate statistics per level
* Smooth transition between levels

### Industry Integration

* Restaurant POS integration
* Daily specials word selection
* Kitchen display system compatibility
* Staff training mode
* Multi-location support

#### Tech Involved

* HungerRush API integration
* Webhook system
* Enterprise SSO

#### Main Requirements

* PCI compliance
* Multi-tenant architecture
* Offline capability

### Progressive Web App

* Offline gameplay
* Push notifications
* App-like experience
* Background sync
* Install prompts

#### Tech Involved

* Service Worker
* Web App Manifest
* IndexedDB
* Push API

#### Main Requirements

* Offline-first architecture
* 50KB service worker limit
* Update strategy

## System Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Frontend<br/>Material 3 UI] --> B[Service Worker<br/>PWA Cache]
        B --> C[Local Storage<br/>Game State]
    end
    
    subgraph "CDN Layer"
        D[Azure Static Web Apps<br/>Global CDN]
        E[Custom Domain<br/>wordle.kjrcloud.com]
    end
    
    subgraph "API Layer"
        F[Azure Functions<br/>Consumption Plan]
        G[In-Memory Cache<br/>Daily Word]
    end
    
    subgraph "Data Layer"
        H[Cosmos DB Free Tier<br/>400 RU/s]
        I[Word Collection<br/>3000 words]
        J[Stats Collection<br/>Aggregates]
    end
    
    subgraph "Monitoring"
        K[Application Insights<br/>Free Tier]
    end
    
    A -->|HTTPS| D
    D --> E
    D -->|API Calls| F
    F --> G
    F -->|Read/Write| H
    H --> I
    H --> J
    F --> K
    
    style A fill:#06D6A0,stroke:#333,stroke-width:2px
    style D fill:#FFA552,stroke:#333,stroke-width:2px
    style H fill:#EFF6F5,stroke:#333,stroke-width:2px
```

## Questions & Clarifications

* **Word Rotation Scope**: Should the 30-word rotation be per-player (stored in session) or global across all players? Per-player provides better variety but requires session tracking.

* **Name Persistence**: Should player names persist across browser sessions using localStorage, or reset each session for privacy?

* **Word Categories**: Do you have specific F&B term categories in mind (ingredients, techniques, equipment), or should we use the full 3000-word list randomly?

* **Historical Gameplay**: Should past games be fully playable with stats tracking, or view-only for reference?

* **Stats Granularity**: Do we need individual player statistics, or is aggregate-only sufficient for MVP?

* **Offline Support**: Should the game support offline play with synchronization when reconnected?

* **Compliance Requirements**: Any specific data privacy regulations (GDPR, CCPA) we need to consider for the 10-user scope?

* **Domain Integration**: Is kjrcloud.com already configured with Namecheap? Any existing DNS records to preserve?

## List of Architecture Consideration Questions

* **Scaling Strategy**: Should we architect for potential viral growth beyond 10 users from day one, or optimize purely for cost and refactor if needed?

* **Caching Aggressiveness**: How aggressive should client-side caching be? Cache everything possible or maintain some server-side control?

* **API Versioning**: Should we implement API versioning from the start for future backwards compatibility?

* **Monitoring Depth**: What level of Application Insights tracking? Basic availability or detailed user behavior analytics?

* **Deployment Strategy**: Simple push-to-main deployments or full blue-green with staging environment?

* **Data Retention**: How long should we retain game history? 30 days, 90 days, or indefinite?

* **Rate Limiting**: Even with 10 users, should we implement rate limiting to prevent abuse?

* **CDN Configuration**: Use default Azure CDN settings or optimize for specific geographic regions?

* **Disaster Recovery**: For <$1/month budget, what's the acceptable recovery time objective (RTO)?

* **CI/CD Complexity**: Minimal GitHub Actions or comprehensive testing pipeline with quality gates?

* **Session Management**: Browser session only or implement proper session tokens for future authentication?

* **Error Handling**: User-friendly error messages or detailed technical errors for debugging?

* **Internationalization**: Prepare architecture for future multi-language support or keep English-only?

* **Accessibility**: WCAG 2.1 AA compliance from start or plan for future accessibility audit?

* **Performance Budgets**: Specific targets for Time to Interactive (TTI) and First Contentful Paint (FCP)?
