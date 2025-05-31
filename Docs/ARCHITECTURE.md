# Azure F&B Wordle - Detailed Architecture Documentation

## System Overview

```mermaid
graph TB
    subgraph "Client Layer"
        PWA[React PWA App]
        SW[Service Worker]
        Cache[Cache API]
        PWA --> SW
        SW --> Cache
    end

    subgraph "UI Components"
        GameBoard[Game Board Component]
        Keyboard[Virtual Keyboard] 
        Stats[Statistics Modal]
        Settings[Settings Panel]
        Help[Help Screen]
    end

    subgraph "State Management"
        GameContext[Game Context]
        ThemeContext[Theme Context]
        AuthContext[Auth Context]
        LocalStorage[Browser Storage]
    end

    subgraph "Business Logic"
        GameLogic[Game Logic Hook]
        WordValidator[Word Validation]
        StatsTracker[Statistics Tracker]
        AnimationController[Animation Controller]
    end

    subgraph "Azure Cloud Infrastructure"
        direction TB
        SWA[Azure Static Web Apps]
        AF[Azure Functions]
        CosmosDB[(Cosmos DB)]
        AAD[Azure AD B2C]
        AppInsights[Application Insights]
        
        subgraph "API Functions"
            DailyWord[Daily Word Function]
            ValidateWord[Word Validation Function]
            SaveStats[Save Statistics Function]
            GetUserData[Get User Data Function]
        end
    end

    PWA --> GameBoard
    PWA --> Keyboard
    PWA --> Stats
    PWA --> Settings
    PWA --> Help

    GameBoard --> GameContext
    Keyboard --> GameContext
    Stats --> GameContext
    Settings --> ThemeContext
    PWA --> AuthContext

    GameContext --> GameLogic
    GameLogic --> WordValidator
    GameLogic --> StatsTracker
    GameBoard --> AnimationController

    GameContext --> LocalStorage
    AuthContext --> AAD
    GameLogic --> AF
    StatsTracker --> AF

    AF --> DailyWord
    AF --> ValidateWord
    AF --> SaveStats
    AF --> GetUserData

    DailyWord --> CosmosDB
    ValidateWord --> CosmosDB
    SaveStats --> CosmosDB
    GetUserData --> CosmosDB

    AF --> AppInsights
    PWA --> AppInsights
```

## Component Interaction Flow

```mermaid
sequenceDiagram
    participant User
    participant GameBoard as Game Board
    participant Keyboard as Virtual Keyboard
    participant GameLogic as Game Logic Hook
    participant WordValidator as Word Validator
    participant API as Azure Functions
    participant DB as Cosmos DB

    User->>Keyboard: Types letter
    Keyboard->>GameLogic: handleKeyPress(letter)
    GameLogic->>GameBoard: Update current guess
    GameBoard->>User: Show letter in grid
    
    User->>Keyboard: Presses Enter
    Keyboard->>GameLogic: handleSubmit()
    GameLogic->>WordValidator: validateWord(guess)
    WordValidator->>API: POST /api/validate-word
    API->>DB: Check word exists
    DB-->>API: Return validation result
    API-->>WordValidator: Return is_valid
    WordValidator-->>GameLogic: Return validation
    GameLogic->>GameBoard: Show result animation
    GameBoard->>User: Display tile colors/animations
```

## Data Flow Architecture

```mermaid
graph LR
    subgraph "Frontend State"
        LocalState[Component State]
        Context[React Context]
        LocalStorage[Browser Storage]
    end

    subgraph "API Layer"
        ServiceLayer[Service Layer]
        HTTPClient[HTTP Client]
        ErrorHandler[Error Handler]
    end

    subgraph "Azure Backend"
        Functions[Azure Functions]
        Database[(Cosmos DB)]
        Auth[Azure AD B2C]
    end

    LocalState --> Context
    Context --> LocalStorage
    Context --> ServiceLayer
    ServiceLayer --> HTTPClient
    HTTPClient --> ErrorHandler
    ServiceLayer --> Functions
    Functions --> Database
    Functions --> Auth
    Auth --> Context
```

## Security Architecture

```mermaid
graph TD
    subgraph "Client Security"
        CSP[Content Security Policy]
        HTTPS[HTTPS Only]
        SameSite[SameSite Cookies]
    end

    subgraph "Authentication Flow"
        B2C[Azure AD B2C]
        JWT[JWT Tokens]
        Refresh[Refresh Tokens]
    end

    subgraph "API Security"
        CORS[CORS Policy]
        RateLimit[Rate Limiting]
        InputVal[Input Validation]
        Sanitize[Data Sanitization]
    end

    subgraph "Data Security"
        Encryption[Data Encryption]
        TLS[TLS 1.3]
        KeyVault[Azure Key Vault]
    end

    CSP --> B2C
    HTTPS --> JWT
    B2C --> JWT
    JWT --> CORS
    CORS --> RateLimit
    RateLimit --> InputVal
    InputVal --> Sanitize
    Sanitize --> Encryption
    Encryption --> TLS
    TLS --> KeyVault
```

## Performance Architecture

```mermaid
graph TB
    subgraph "Frontend Performance"
        CodeSplit[Code Splitting]
        LazyLoad[Lazy Loading]
        Memoization[React Memoization]
        VirtualDOM[Virtual DOM]
    end

    subgraph "Caching Strategy"
        ServiceWorker[Service Worker]
        BrowserCache[Browser Cache]
        CDNCache[CDN Cache]
        APICache[API Response Cache]
    end

    subgraph "Backend Performance"
        ServerlessScale[Serverless Auto-scaling]
        DBOptimization[Database Optimization]
        FunctionWarmup[Function Warmup]
    end

    CodeSplit --> ServiceWorker
    LazyLoad --> BrowserCache
    Memoization --> VirtualDOM
    ServiceWorker --> CDNCache
    BrowserCache --> APICache
    CDNCache --> ServerlessScale
    APICache --> DBOptimization
    ServerlessScale --> FunctionWarmup
```

## Deployment Architecture

```mermaid
graph LR
    subgraph "Development"
        Dev[Local Development]
        DevDB[(Local Storage)]
    end

    subgraph "Staging"
        StagingSWA[Staging Static Web Apps]
        StagingFunc[Staging Functions]
        StagingDB[(Staging Cosmos DB)]
    end

    subgraph "Production"
        ProdSWA[Production Static Web Apps]
        ProdFunc[Production Functions]
        ProdDB[(Production Cosmos DB)]
        CDN[Azure CDN]
    end

    subgraph "CI/CD Pipeline"
        GitHub[GitHub Repository]
        Actions[GitHub Actions]
        Testing[Automated Testing]
    end

    Dev --> GitHub
    GitHub --> Actions
    Actions --> Testing
    Testing --> StagingSWA
    Testing --> StagingFunc
    StagingFunc --> StagingDB
    Actions --> ProdSWA
    Actions --> ProdFunc
    ProdFunc --> ProdDB
    ProdSWA --> CDN
```

## Component Hierarchy

```mermaid
graph TD
    App[App.tsx]
    App --> ErrorBoundary[Error Boundary]
    App --> ThemeProvider[Theme Provider]
    App --> AuthProvider[Auth Provider]
    App --> GameProvider[Game Provider]
    
    GameProvider --> Layout[Layout Component]
    Layout --> Header[Header]
    Layout --> GameContainer[Game Container]
    Layout --> Footer[Footer]
    
    GameContainer --> GameBoard[Game Board]
    GameContainer --> Keyboard[Virtual Keyboard]
    GameContainer --> GameStats[Game Statistics]
    
    GameBoard --> Row[Game Row] 
    Row --> Tile[Game Tile]
    
    Keyboard --> KeyRow[Keyboard Row]
    KeyRow --> Key[Keyboard Key]
    
    Header --> Logo[Logo]
    Header --> SettingsButton[Settings Button]
    Header --> HelpButton[Help Button]
    
    Footer --> StatsButton[Statistics Button]
    Footer --> ShareButton[Share Button]
```

## Technology Stack Details

### Frontend Technologies
- **React 18.3+**: Concurrent features, automatic batching, Suspense
- **TypeScript 5+**: Strict type checking, advanced types
- **Vite 5+**: Fast build tool, HMR, tree shaking
- **SCSS**: Modular styling with CSS custom properties
- **Framer Motion**: Complex animations and gestures
- **Material Design 3**: Expressive design system

### Backend Technologies
- **Azure Functions**: Serverless compute (Node.js 20+ runtime)
- **Azure Cosmos DB**: NoSQL database with global distribution
- **Azure Static Web Apps**: Integrated hosting and API
- **Azure AD B2C**: Identity and access management
- **Application Insights**: Monitoring and analytics

### Development Tools
- **ESLint + Prettier**: Code quality and formatting
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing
- **GitHub Actions**: CI/CD automation

### Performance Optimizations
- **Code Splitting**: Route-based and component-based
- **Tree Shaking**: Remove unused code
- **Service Worker**: Offline support and caching
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Size monitoring and optimization

### Security Features
- **Content Security Policy**: XSS protection
- **HTTPS Everywhere**: Secure communication
- **Input Validation**: Server and client-side validation
- **Rate Limiting**: API abuse prevention
- **CORS Configuration**: Cross-origin request control

## Monitoring and Analytics

### Application Insights Integration
- **Real User Monitoring**: Page load times, user interactions
- **Custom Events**: Game completion, word guesses, error tracking
- **Performance Counters**: API response times, function execution
- **Dependency Tracking**: Database queries, external API calls

### Key Metrics
- **Performance**: Page load time, time to interactive, first contentful paint
- **User Engagement**: Games played, completion rate, return visits
- **Error Tracking**: JavaScript errors, API failures, network issues
- **Business Metrics**: Daily active users, word completion rate, share rate

### Alerting
- **Performance Alerts**: Response time > 3s, error rate > 5%
- **Availability Alerts**: Service downtime, function failures
- **Usage Alerts**: Unusual traffic patterns, quota exceeded
- **Security Alerts**: Failed authentication attempts, suspicious activity
