# System Patterns: Azure-Integrated Wordle Clone

## Core Architecture
The Wordle clone employs a full-stack architecture:
-   **Frontend**: React.js, utilizing a component-based architecture.
-   **Backend**: Node.js with the Express framework, providing RESTful API endpoints.
-   **Database**: Azure Cosmos DB (using MongoDB API) for word storage and potentially user statistics.
-   **State Management**: React Context API for centralized game state management within the frontend.
-   **Cloud Infrastructure**: Microsoft Azure ecosystem for hosting, database, security, and CI/CD.

## Architectural Principles (Applied to Wordle)
-   **Separation of Concerns**:
    -   Game Logic (word selection, validation, scoring).
    -   UI Components (game board, keyboard, statistics display).
    -   State Management (React Context API).
    -   Backend Services (word storage, API endpoints).
-   **Single Responsibility Principle (SRP)**:
    -   React components designed for a single purpose (e.g., `GameBoard.jsx` for grid display, `Keyboard.jsx` for input).
    -   Backend services focused on specific tasks (e.g., word validation service separate from daily word selection).
-   **KISS (Keep It Simple, Stupid)**: Focus on core 5-letter Wordle functionality first. Use straightforward state management and animation systems.
-   **DRY (Don't Repeat Yourself)**:
    -   Reusable React components (e.g., `Tile.jsx`).
    -   Shared validation utilities (frontend/backend).
    -   Consistent styling patterns (CSS variables).

## Key Architectural Patterns
-   **Component-Based Architecture (React)**: UI is built from composable and reusable components (Atoms, Molecules, Organisms based on Atomic Design).
-   **Client-Server Architecture**:
    -   Client (React Frontend): Handles UI, game state, user interactions.
    -   Server (Node.js/Express Backend): Manages word dictionaries, validation logic, API endpoints.
-   **Event-Driven Interactions**: Game flow is managed through events (letter input, guess submission, game completion).
-   **RESTful API Design**: Backend exposes functionality through well-defined REST API endpoints.

## Frontend Component Structure (React)
-   **`App.js`**: Main application container, hosts Context providers.
-   **`GameBoard.jsx`**: Core game grid.
-   **`Keyboard.jsx`**: Interactive virtual keyboard.
-   **`Statistics.jsx`**: Player performance display.
-   **`Header.jsx`**: Navigation and game information.
-   **`Instructions.jsx`**: How-to-play modal.
-   **`Toast.jsx`**: Notification component for feedback.
-   **`Tile.jsx`**: Reusable component for individual letter tiles on the board and keyboard.

## State Management (React Context API)
-   **`GameContext.js`**: Manages core game state (guesses, current guess, game status, solution word).
-   **`StatsContext.js`**: Handles persistence and tracking of player statistics (games played, win streaks, guess distribution), primarily using `localStorage`.
-   **`ThemeContext.js` (Potential)**: For visual preferences like color mode and animation toggles.

## Backend API Endpoints (Express)
-   **`/api/word/daily`**: GET - Returns the daily target word.
-   **`/api/word/validate`**: POST - Checks if a guessed word is a valid dictionary word.
-   **`/api/statistics`**: POST/GET (Optional Future) - For server-side synchronization of player statistics.

## Database Schema (Azure Cosmos DB - MongoDB API)
-   **Words Collection**:
    -   `word` (string, indexed): The five-letter word.
    -   `difficulty` (number, optional): Calculated difficulty score.
    -   `frequency` (number, optional): Usage frequency of the word.
    -   `lastUsed` (date, optional): Date when the word was last used as the daily puzzle.
    -   `categories` (array of strings, optional): Word categories.

## Azure Services Integration
-   **Azure App Service**: Hosts the Node.js/Express backend.
-   **Azure Static Web Apps**: Hosts the React frontend.
-   **Azure Cosmos DB**: Provides MongoDB-compatible database for word storage.
-   **Azure Key Vault**: Securely stores API keys, connection strings, and other secrets.
-   **Azure Application Insights**: For monitoring, logging, and analytics.
-   **Azure DevOps**: Implements CI/CD pipelines for automated build and deployment.
-   **Azure CDN**: For optimal global performance of static assets.

## Key Design Patterns & Considerations
-   **Mobile-First Responsive Design**: UI/UX designed primarily for small screens, scaling gracefully.
-   **Atomic Design Methodology**: For structuring React components (Atoms, Molecules, Organisms).
-   **Stateless Backend Services**: Where possible, to facilitate horizontal scaling on Azure App Service.
-   **Connection Pooling**: For efficient database connections from the backend.
-   **Environment Configuration**: Use of environment variables for managing settings across development, staging, and production.
-   **Secure Coding Practices**: Input validation on client and server, HTTPS, rate limiting.
-   **Performance Optimization**: Memoization (`React.memo`, `useMemo`, `useCallback`), rendering optimization, virtualized lists, asset compression, CDN usage.
-   **Local Storage Strategy**: For client-side persistence of game state and statistics.
-   **CI/CD Pipeline**: Automated build, test, and deployment using Azure DevOps.
