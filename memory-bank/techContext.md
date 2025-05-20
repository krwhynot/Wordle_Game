# Technical Context: Azure-Integrated Wordle Clone

## Core Technologies
-   **Frontend**:
    -   React.js (v18+)
    -   Create React App (for project setup and development server)
    -   JavaScript (ES6+)
    -   HTML5
    -   CSS3 / SCSS (for styling)
    -   React Context API (for state management)
-   **Backend**:
    -   Node.js (LTS version, e.g., 18.x)
    -   Express.js (for RESTful API development)
    -   JavaScript (ES6+)
-   **Database**:
    -   Azure Cosmos DB (using MongoDB API)
-   **Cloud Platform**:
    -   Microsoft Azure

## Development Environment & Tools
-   **IDE**: Visual Studio Code (VSCode)
-   **VSCode Configurations**:
    -   `.vscode/settings.json`: Workspace-specific settings (file excludes, associations, ESLint, Jest).
    -   `.vscode/tasks.json`: Task runner for starting development servers (frontend/backend) and deployment tasks.
    -   `.vscode/launch.json`: Debugging configurations for frontend (Chrome), backend (Node), and full-stack.
-   **Version Control**: Git (repository likely on GitHub or Azure Repos)
-   **Package Management**: npm (Node Package Manager)
-   **Frontend Development Server**: Webpack Dev Server (via Create React App) with proxy to backend.
-   **Testing**:
    -   Jest (for unit testing React components and game logic).
    -   React Testing Library (for component testing).
    -   Cypress (for end-to-end testing, as suggested in best practices).
-   **Linters/Formatters**: ESLint, Prettier (implied by standard React/Node.js development).

## Azure Services Utilized
-   **Azure App Service**: Hosting for the Node.js/Express backend.
    -   Configuration: Environment variables, scaling rules, potential slot swapping for staging.
-   **Azure Static Web Apps**: Hosting for the React frontend.
    -   Configuration: `staticwebapp.config.json`, route fallbacks for SPA, CDN integration.
-   **Azure Cosmos DB (MongoDB API)**: Primary database for word lists.
    -   Configuration: Connection pooling, indexing, projections.
-   **Azure Key Vault**: Secure storage for API keys, connection strings, and other secrets.
-   **Azure Application Insights**: For application performance monitoring (APM), logging, and analytics.
-   **Azure DevOps**: For CI/CD pipelines (build, test, deploy).
    -   Configuration: `azure-pipelines.yml` for defining build and release stages.
-   **Azure CDN**: For content delivery and performance optimization of static assets.

## Key Technical Decisions & Constraints
-   **Mobile-First Design**: UI and UX must be optimized for mobile devices first.
-   **RESTful APIs**: Backend communication will be via REST.
-   **Stateless Backend**: Backend services should be designed to be stateless where possible to support scaling.
-   **Azure Ecosystem**: Prioritize Azure-native solutions for cloud services.
-   **Security**: Implement server-side word selection, input validation (client/server), rate limiting, HTTPS.
-   **Performance**: Target fast load times, responsive interactions, and efficient animations.
-   **Local Storage**: Used for client-side persistence of game state and statistics.

## Dependencies (High-Level)
-   **Frontend**: `react`, `react-dom`, `react-scripts`.
-   **Backend**: `express`, `mongodb` (or `mongoose` for Cosmos DB interaction), `dotenv` (for environment variables).
-   **Development**: `jest`, `@testing-library/react`, `eslint`, `prettier`, `cypress`.
-   **Azure SDKs/Libraries**: `applicationinsights` (for Node.js backend).

## Tool Usage Patterns
-   **VSCode Tasks**: To simplify starting the development environment (frontend and backend servers simultaneously).
-   **VSCode Debugger**: For integrated debugging of both React frontend code (in Chrome) and Node.js backend code.
-   **Azure DevOps Pipelines**: For automating the build, test, and deployment process to Azure services.
-   **Git**: For version control and collaboration.
-   **npm scripts**: For managing build, test, and development server commands within `package.json` for both client and server.

## Learning Resources (as per `wordle-azure-project.md`)
-   React Hooks & Context API documentation
-   Azure Cosmos DB with MongoDB API tutorials
-   Azure Static Web Apps deployment guides
-   Express.js RESTful API tutorials
-   Azure DevOps CI/CD pipeline setup
-   CSS Grid and Flexbox for game board layout
-   Jest testing for game logic validation
