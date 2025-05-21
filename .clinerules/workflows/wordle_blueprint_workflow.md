
# Workflow: Mobile-First Wordle Game - Comprehensive Blueprint Understanding

**Objective**: To provide Cline with a structured understanding of the "Mobile-First Wordle Game" project, enabling it to assist with development, documentation, and planning tasks effectively. This workflow will break down the project's blueprint into digestible sections for Cline to process.

**## NO SERIOUSLY, DO NOT SKIP STEPS**

**If you try to implement everything at once:**
**IT WILL FAIL**
**YOU WILL WASTE TIME**
**THE HUMAN WILL GET ANGRY**

---

## Initial Confirmation and Confidence

To ensure you understand my request, I need you to confirm your understanding before executing any task. Additionally, provide a confidence level (on a scale from 0 to 10) indicating how well the tool’s response is expected to meet my project's needs. After executing the task, share another confidence level based on the outcome. Repeat this every time you perform a tool action.

**Confirm your understanding of the overall objective: To process and understand the detailed blueprint of the Wordle Game project. Provide your initial confidence level.**

---

## Phase 1: Project Architecture and Structure Overview

**Goal**: Understand the foundational monorepo organization and root configurations.

**Action**: Review the following project architecture details.

### 1.1 Monorepo Organization
* **Instruction**: Acknowledge the root directory `wordle-game/` and its primary subdirectories: `packages/` (client, server, shared) and `Docs/`.
* **Key Files**: Note `package.json` (root), `.gitignore`, `Wordle.code-workspace`, and `.vscode/` (launch.json, settings.json, tasks.json).

### 1.2 Root Configuration
* `package.json` (Root):
    * Workspaces: `["packages/*"]`
    * Scripts: Parallel execution via `npm-run-all`.
    * Build Process: Sequential (shared → client/server).
    * Node.js Version: `>= 20.0.0`.
    * Shared Dev Dependencies: `eslint`, `rimraf`.
* Development Tools:
    * `npm workspaces` for package management.
    * `npm-run-all` for script execution.
    * `rimraf` for directory cleaning.
    * VSCode configured for full-stack debugging.

**Task**: Summarize the key aspects of the monorepo structure and root configuration. Confirm understanding and provide a confidence level for this section.

---

## Phase 2: Client Package (Frontend) Deep Dive

**Goal**: Understand the frontend application's technology stack, structure, and build processes.

**Action**: Analyze the Client Package details.

### 2.1 Technology Stack
* Framework: React 18+
* Build Tool: Vite
* Language: TypeScript (strict)
* Styling: SCSS with CSS custom properties
* Testing: Vitest with React Testing Library
* Path Aliases: `@/*` (src), `@shared/*` (shared package)

### 2.2 Package Structure (`packages/client/`)
* Key Files: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `public/`.
* `src/` Directory:
    * Entry: `main.tsx`, `App.tsx`.
    * Components: `game/` (GameBoard, Keyboard, Tile, Row), `layout/` (Header, Footer), `ui/` (Modal, Toast, Instructions).
    * Context: `GameContext.tsx`, `StatsContext.tsx`, `ThemeContext.tsx`.
    * Hooks: `useLocalStorage.ts`, `useKeyboard.ts`.
    * Services: `api.ts`.
    * Types: `game.ts`.
    * Utils: `gameLogic.ts`, `storage.ts`.
    * Styles: `main.scss`, `components/`, `theme/` (_variables.scss, _css-variables.scss, _animations.scss).
    * Test: `setup.ts`.

### 2.3 Build and Development
* Dev: `npm run dev` (Vite dev server, Port 3000, backend proxy).
* Build: `npm run build` (TypeScript compile, Vite build).
* Test: `npm run test` (Vitest).
* Preview: `npm run preview`.

### 2.4 Component Architecture
* Methodology: Atomic Design.
* Props: Fully typed (TypeScript interfaces).
* Logic Separation: UI and game logic are distinct.

**Task**: Describe the client package's architecture, focusing on technology choices and the `src` directory organization. Confirm understanding and provide a confidence level.

---

## Phase 3: Server Package (Backend) Deep Dive

**Goal**: Understand the backend API's technology stack, structure, and operational scripts.

**Action**: Analyze the Server Package details.

### 3.1 Technology Stack
* Runtime: Node.js 20+
* Framework: Express
* Language: TypeScript (NodeNext module resolution)
* Security: Helmet, CORS, `express-rate-limit`
* Validation: `express-validator`
* Environment: `dotenv`

### 3.2 Package Structure (`packages/server/`)
* Key Files: `package.json`, `tsconfig.json`, `.env.example`.
* `src/` Directory:
    * Entry: `index.ts`, `app.ts` (Express app config).
    * Config: `config/index.ts` (env vars).
    * Controllers: `wordController.ts`, `statsController.ts`.
    * Middleware: `errorHandler.ts`, `rateLimiter.ts`, `validation.ts`.
    * Models: `Word.ts`.
    * Routes: `index.ts`, `wordRoutes.ts`, `statsRoutes.ts`.
    * Services: `wordService.ts`, `statsService.ts`.
    * Utils: `logger.ts`, `seedGenerator.ts`.
* `test/`: `api.test.ts`.

### 3.3 Build and Development
* Dev: `npm run dev` (`nodemon` with `ts-node`).
* Build: `npm run build` (TypeScript compilation).
* Start: `npm start` (Run compiled JS).
* Test: `npm run test` (Jest).

### 3.4 API Structure
* Design: RESTful endpoints.
* Error Handling: Structured.
* Security: Rate limiting.
* Input: Validation middleware.

**Task**: Outline the server package's architecture, including middleware and service organization. Confirm understanding and provide a confidence level.

---

## Phase 4: Shared Package (Common Code) Analysis

**Goal**: Understand the purpose and contents of the shared codebase.

**Action**: Review the Shared Package details.

### 4.1 Technology Stack
* Language: TypeScript (declaration file generation).
* Modules: ES Modules with NodeNext resolution.

### 4.2 Package Structure (`packages/shared/`)
* Key Files: `package.json`, `tsconfig.json`.
* `src/` Directory:
    * Entry: `index.ts` (main exports).
    * Types: `api.ts` (API response types), `game.ts` (game-related types).
    * Utils: `validation.ts` (common validation logic).

### 4.3 Current Exports
* `ApiResponse<T>` interface.

**Task**: Explain the role of the shared package and list its current key exports. Confirm understanding and provide a confidence level.

---

## Phase 5: Styling System Deep Dive

**Goal**: Understand the design philosophy, theming, and animation system.

**Action**: Analyze the Styling System details.

### 5.1 Design System
* Philosophy: Material 3 Expressive.
* Colors:
    * Primary: Turquoise (`#06D6A0`).
    * Accent: Tangerine (`#FFA552`).
    * Background: Light Gray-Blue (`#EFF6F5`).
* Typography:
    * Primary Font: Roboto.
    * Heading Font: Montserrat.
    * Sizing: Fluid with `clamp()`.

### 5.2 Theming Implementation
* SCSS Variables: `_variables.scss`.
* CSS Custom Properties: `_css-variables.scss`.
* Dark Mode: `[data-theme="dark"]` attribute.
* Responsive Breakpoints: xs (0), sm (600px), md (960px), lg (1280px), xl (1920px).

### 5.3 Animation System
* Transition Durations: Fastest (100ms), Fast (150ms), Medium (300ms), Springy (250ms cubic-bezier).
* Animation Durations: Short (200ms), Medium (400ms), Long (600ms).
* Game Animations: Tile flip, tile pop, keyboard feedback.

**Task**: Describe the core principles of the styling system, including color palette and animation strategy. Confirm understanding and provide a confidence level.

---

## Phase 6: Game Implementation Details

**Goal**: Understand core game mechanics, state management, and user interactions.

**Action**: Review Game Implementation details.

### 6.1 Core Game Mechanics
* Objective: 5-letter word guessing, 6 attempts max.
* Feedback Colors:
    * Correct letter, correct position: Turquoise.
    * Correct letter, wrong position: Tangerine.
    * Letter not in word: Grey (`#787c7e`).

### 6.2 Game State Management
* Mechanism: React Context API.
* Persistence: Local storage.
* Typing: Typed interfaces for game state.

### 6.3 User Interaction Flows
* Input: Physical and virtual keyboard.
* Display: Game board with animated feedback.
* Tracking: Statistics tracking and display.
* Help: Instruction modal for new users.

**Task**: Summarize the key game mechanics and how user interactions are handled. Confirm understanding and provide a confidence level.

---

## Phase 7: Development Workflow Overview

**Goal**: Understand the environment setup, development process, and build pipeline.

**Action**: Analyze the Development Workflow.

### 7.1 Environment Setup
* IDE: VSCode with configured workspace.
* Debugging: Configurations for client and server.
* Scripts: `npm workspace` script commands.

### 7.2 Development Process
* Execution: Parallel development (`npm run dev`).
* Reloading: Live reloading (Vite for client, nodemon for server).
* Checks: Type checking during development.

### 7.3 Build Pipeline
1.  Clean previous builds.
2.  Build shared package.
3.  Build client and server packages.
4.  Run tests.

**Task**: Describe the typical development cycle and the steps in the build pipeline. Confirm understanding and provide a confidence level.

---

## Phase 8: Testing Strategy Review

**Goal**: Understand the testing approach for frontend, backend, and different test types.

**Action**: Review the Testing Strategy.

### 8.1 Frontend Testing
* Runner: Vitest.
* Library: React Testing Library.
* Assertions: Jest DOM.

### 8.2 Backend Testing
* Framework: Jest.
* HTTP Assertions: Supertest.

### 8.3 Test Types
* Unit tests (game logic).
* Component tests (React components).
* API integration tests (endpoints).

**Task**: Outline the testing strategy, including tools and types of tests employed. Confirm understanding and provide a confidence level.

---

## Phase 9: Azure Integration Plan Analysis

**Goal**: Understand the planned Azure resources, database schema, and environment configuration.

**Action**: Analyze the Azure Integration Plan.

### 9.1 Azure Resources
* Backend Hosting: Azure App Service (Node.js).
* Frontend Hosting: Azure Static Web Apps (React).
* Database: Azure Cosmos DB (MongoDB API).
* Secrets: Azure Key Vault.
* Monitoring: Azure Application Insights.
* Content Delivery: Azure CDN.

### 9.2 Database Schema (`Words` Collection)
* `interface Word`:
    * `word: string` (5-letter word)
    * `difficulty?: number` (Optional, 0-1)
    * `frequency?: number` (Usage frequency)
    * `lastUsed?: Date`
    * `categories?: string[]` (Optional)

### 9.3 Environment Configuration
* Files: `.env` files with Azure connection details.
* Loading: `dotenv`.

**Task**: List the key Azure services to be used and describe the planned database schema for words. Confirm understanding and provide a confidence level.

---

## Phase 10: Deployment and CI/CD Strategy

**Goal**: Understand the CI/CD pipeline and deployment process.

**Action**: Review the Deployment and CI/CD strategy.

### 10.1 GitHub Actions Pipeline
* Triggers: Automated testing on pull requests.
* Validation: Build validation before deployment.
* Deployments: Environment-specific.

### 10.2 Deployment Process
1.  Build shared package.
2.  Build client and server.
3.  Deploy server to Azure App Service.
4.  Deploy client to Azure Static Web Apps.
5.  Configure API proxying.

### 10.3 Post-Deployment
* Monitoring: Application Insights.
* Tracking: Performance tracking.
* Logging: Error logging.

**Task**: Describe the planned CI/CD pipeline using GitHub Actions and the steps for deployment. Confirm understanding and provide a confidence level.

---

## Phase 11: Current Implementation Status Assessment

**Goal**: Acknowledge the project's current state.

**Action**: Note the current status.

* Initial setup phase:
    * Monorepo structure established.
    * Basic packages configured.
    * Initial styling system implemented.
    * Server stub with health endpoint created.
    * Client build with Vite configured.
    * Shared types package initialized.

**Task**: Briefly state the current implementation status of the project. Confirm understanding and provide a confidence level.

---

## Phase 12: Next Steps (Implementation Phases) Review

**Goal**: Understand the planned sequence of development.

**Action**: Review the upcoming implementation phases.

* **Phase 1 (Current Focus)**: Core UI Components (GameBoard, Tile, Keyboard).
* **Phase 2**: Game Logic (State management, validation, persistence).
* **Phase 3**: Backend Development (API endpoints, dictionary management, Cosmos DB placeholder).
* **Phase 4**: Integration (Frontend-Backend connection, game flow, stats).
* **Phase 5**: Polish and Testing (Animations, comprehensive tests, mobile optimization).
* **Phase 6**: Azure Deployment (Resource setup, CI/CD config, production deploy).

**Task**: List the immediate next steps and subsequent high-level phases. Confirm understanding and provide a confidence level for the overall blueprint.

---

## Final Review and Task Generation

**Instruction**: Based on the processed blueprint, what are 1-3 high-priority tasks you can assist with next, considering the "Current Implementation Status" and "Next Steps"? For each suggested task, briefly explain your reasoning.

**Action**: Propose tasks and await user direction. Remember to provide confidence levels before and after any tool use if you were to execute those tasks.
