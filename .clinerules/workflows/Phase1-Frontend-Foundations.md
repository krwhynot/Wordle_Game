Phase 1: Frontend Foundations - Implementation Blueprint

## Overview

This document outlines the implementation plan for Phase 1 of our Azure-integrated Wordle clone, focusing on building the core frontend components. It accounts for the existing TypeScript monorepo structure and established styling system while providing clear guidance for implementing the essential game UI elements.

## Current Project Status

The project has established:

- TypeScript monorepo with npm workspaces (`client`, `server`, `shared` packages)
- Vite-based React frontend configuration
- SCSS styling system implementing Material 3 Expressive design principles
- Turquoise (#06D6A0) & Tangerine (#FFA552) color theme
- CSS custom properties with light/dark theme support
- Basic server setup with Express/TypeScript
- Comprehensive documentation in the `memory-bank` directory

## 1. Architectural Principles

For Phase 1 implementation, we'll adhere to these principles:

### Separation of Concerns

- UI components separate from game logic
- Style definitions separate from component behavior
- Component props clearly defined with TypeScript interfaces

### Single Responsibility Principle

- Each component should do exactly one thing well
- `GameBoard.jsx` only handles the display of the game grid
- `Keyboard.jsx` only manages key input and feedback

### DRY (Don't Repeat Yourself)

- Create reusable components (e.g., `Tile.jsx`)
- Use consistent styling patterns through CSS custom properties
- Leverage shared type definitions

### KISS (Keep It Simple, Stupid)

- Start with static components before adding interactivity
- Focus on core 5-letter word functionality
- Use established patterns in the codebase

## 2. Component Architecture

### Component Hierarchy

Following atomic design methodology:

```
packages/client/src/
├── components/
│   ├── game/           # Game-specific components
│   │   ├── GameBoard.tsx  # Container for the game grid
│   │   ├── Row.tsx        # Single row of 5 tiles
│   │   ├── Tile.tsx       # Individual letter tile
│   │   └── Keyboard.tsx   # Virtual keyboard
│   ├── layout/         # Structural components
│   │   ├── Header.tsx     # Game header with title & controls
│   │   └── Footer.tsx     # Footer with info/links
│   └── ui/             # Reusable UI components
│       ├── Modal.tsx      # Reusable modal container
│       └── Toast.tsx      # Notification component
├── types/              # TypeScript type definitions
│   └── game.ts         # Game-related interfaces
├── styles/             # Already contains theme variables
│   └── components/     # Component-specific styles (to add)
├── App.tsx             # Main application component
└── main.tsx            # Entry point
```

### Component Communication Patterns

- Props for parent-to-child communication
- Event callbacks for child-to-parent communication
- Prepare for Context API in future phases

## 3. Component Implementations

### `Tile.tsx` Component

```typescript
// packages/client/src/components/game/Tile.tsx
import React from 'react';

export type TileStatus = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

export interface TileProps {
  letter?: string;
  status: TileStatus;
  position: number;
  isRevealed?: boolean;
  'aria-label'?: string;
}

const Tile: React.FC<TileProps> = ({
  letter = '',
  status = 'empty',
  position,
  isRevealed = false,
  'aria-label': ariaLabel,
}) => {
  // Implementation details will go here
  return (
    <div
      className={`tile tile-${status} ${isRevealed ? 'revealed' : ''}`}
      aria-label={ariaLabel || `tile ${position + 1}, ${letter}, ${status}`}
      role="gridcell"
    >
      {letter}
    </div>
  );
};

export default Tile;
```

### `Row.tsx` Component

```typescript
// packages/client/src/components/game/Row.tsx
import React from 'react';
import Tile, { TileStatus } from './Tile';

export interface RowProps {
  letters: string[];
  evaluation?: TileStatus[];
  isRevealed?: boolean;
  rowIndex: number;
}

const Row: React.FC<RowProps> = ({
  letters = ['', '', '', '', ''],
  evaluation = Array(5).fill('empty'),
  isRevealed = false,
  rowIndex,
}) => {
  return (
    <div className="row" role="row">
      {letters.map((letter, i) => (
        <Tile
          key={i}
          letter={letter}
          status={evaluation[i]}
          position={i}
          isRevealed={isRevealed}
          aria-label={`tile ${i + 1}, row ${rowIndex + 1}, ${letter}, ${evaluation[i]}`}
        />
      ))}
    </div>
  );
};

export default Row;
```

### `GameBoard.tsx` Component

```typescript
// packages/client/src/components/game/GameBoard.tsx
import React from 'react';
import Row from './Row';
import { TileStatus } from './Tile';

export interface GameBoardProps {
  guesses: string[];
  evaluations: TileStatus[][];
  currentRow: number;
  currentGuess: string;
}

const GameBoard: React.FC<GameBoardProps> = ({
  guesses = [],
  evaluations = [],
  currentRow = 0,
  currentGuess = '',
}) => {
  // Create a complete rows array for rendering
  const rows = Array(6).fill('').map((_, i) => {
    // For the current row, show the current guess
    if (i === currentRow) {
      const letters = currentGuess.split('');
      while (letters.length < 5) letters.push('');

      const evaluation = letters.map(letter =>
        letter ? 'filled' : 'empty'
      ) as TileStatus[];

      return { letters, evaluation, isRevealed: false };
    }
    // For past rows, show the submitted guess and evaluation
    else if (i < currentRow && guesses[i]) {
      return {
        letters: guesses[i].split(''),
        evaluation: evaluations[i] || Array(5).fill('empty'),
        isRevealed: true
      };
    }
    // For future rows, show empty tiles
    else {
      return {
        letters: ['', '', '', '', ''],
        evaluation: Array(5).fill('empty'),
        isRevealed: false
      };
    }
  });

  return (
    <div className="game-board" role="grid" aria-label="Wordle game board">
      {rows.map((row, i) => (
        <Row
          key={i}
          letters={row.letters}
          evaluation={row.evaluation}
          isRevealed={row.isRevealed}
          rowIndex={i}
        />
      ))}
    </div>
  );
};

export default GameBoard;
```

### `Keyboard.tsx` Component

```typescript
// packages/client/src/components/game/Keyboard.tsx
import React from 'react';
import { TileStatus } from './Tile';

export interface KeyboardProps {
  onKey: (key: string) => void;
  keyStatus: Record<string, TileStatus | undefined>;
}

const Keyboard: React.FC<KeyboardProps> = ({
  onKey = () => {},
  keyStatus = {},
}) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  const handleKeyClick = (key: string) => {
    onKey(key);
  };

  return (
    <div className="keyboard" aria-label="Virtual keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const status = keyStatus[key] || 'empty';
            const isSpecialKey = key === 'ENTER' || key === 'BACKSPACE';

            return (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                className={`keyboard-key ${status !== 'empty' ? `keyboard-key-${status}` : ''} ${isSpecialKey ? 'keyboard-key-special' : ''}`}
                aria-label={isSpecialKey ? key.toLowerCase() : `key ${key}`}
              >
                {key === 'BACKSPACE' ? '←' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
```

### `Header.tsx` Component

```typescript
// packages/client/src/components/layout/Header.tsx
import React from 'react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'WORDLE' }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
    </header>
  );
};

export default Header;
```

### Main `App.tsx` Component

```typescript
// packages/client/src/App.tsx
import React, { useState } from 'react';
import Header from './components/layout/Header';
import GameBoard from './components/game/GameBoard';
import Keyboard from './components/game/Keyboard';
import { TileStatus } from './components/game/Tile';

const App: React.FC = () => {
  // For static Phase 1 UI demo only - will be replaced with Context in Phase 2
  const [guesses] = useState<string[]>(['REACT', 'CLOUD']);
  const [evaluations] = useState<TileStatus[][]>([
    ['absent', 'present', 'absent', 'correct', 'absent'],
    ['absent', 'absent', 'absent', 'correct', 'absent'],
  ]);
  const [currentRow] = useState(2);
  const [currentGuess] = useState('AZ');

  // Demo key statuses based on previous guesses
  const keyStatus: Record<string, TileStatus> = {
    'R': 'present',
    'E': 'absent',
    'A': 'absent',
    'C': 'correct',
    'T': 'absent',
    'L': 'absent',
    'O': 'absent',
    'U': 'absent',
    'D': 'absent',
  };

  // No-op function - will be implemented in Phase 2
  const handleKey = (key: string) => {
    console.log(`Key pressed: ${key}`);
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main">
        <GameBoard
          guesses={guesses}
          evaluations={evaluations}
          currentRow={currentRow}
          currentGuess={currentGuess}
        />
        <Keyboard onKey={handleKey} keyStatus={keyStatus} />
      </main>
      <footer className="footer">
        <p>Azure-Integrated Wordle Clone © 2025</p>
      </footer>
    </div>
  );
};

export default App;
```

## 4. Component-Specific Styling

### Tile Component Styles

```scss
// packages/client/src/styles/components/_tile.scss
@import '../theme/variables';

.tile {
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--tile-size-default);
  height: var(--tile-size-default);
  font-size: clamp(1.8rem, 7vw, 2.2rem);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  user-select: none;
  border: 2px solid var(--tile-border-default);
  background-color: var(--tile-background-default);
  border-radius: var(--border-radius-sm);
  transition: transform var(--transition-medium),
              background-color var(--transition-medium),
              border-color var(--transition-medium);

  // Status-specific styles
  &.tile-empty {
    border-color: var(--tile-border-default);
  }

  &.tile-filled {
    border-color: var(--tile-border-active);
  }

  &.tile-correct {
    background-color: var(--tile-background-correct);
    color: var(--tile-text-correct);
    border-color: var(--tile-border-correct);
  }

  &.tile-present {
    background-color: var(--tile-background-present);
    color: var(--tile-text-present);
    border-color: var(--tile-border-present);
  }

  &.tile-absent {
    background-color: var(--tile-background-absent);
    color: var(--tile-text-absent);
    border-color: var(--tile-border-absent);
  }

  // Animations
  &.revealed {
    animation: tileRevealFlip var(--animation-long) forwards;
    transform-style: preserve-3d;
  }

  @media (max-width: $breakpoint-sm) {
    width: var(--tile-size-sm);
    height: var(--tile-size-sm);
  }
}

// Add staggered animation for tiles in a row
@for $i from 1 through 5 {
  .row .tile:nth-child(#{$i}).revealed {
    animation-delay: calc(#{$i - 1} * 0.2s);
  }
}

@keyframes tileRevealFlip {
  0% { transform: rotateX(0deg); }
  50% { transform: rotateX(90deg); }
  100% { transform: rotateX(0deg); }
}
```

### Game Board Styles

```scss
// packages/client/src/styles/components/_gameboard.scss
@import '../theme/variables';

.game-board {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  gap: 6px;
  padding: var(--spacing-md);
  width: clamp(280px, 90vw, 350px);
  max-height: 420px;
  margin: 0 auto;
}

.row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}
```

### Keyboard Styles

```scss
// packages/client/src/styles/components/_keyboard.scss
@import '../theme/variables';

.keyboard {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: var(--spacing-md);
  margin-top: auto;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 6px;
  width: 100%;
}

.keyboard-key {
  height: var(--key-height);
  min-width: 44px; // Accessibility minimum touch target
  flex-grow: 1;
  max-width: var(--key-width-default);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: clamp(0.8rem, 3vw, 1.1rem);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  border-radius: var(--border-radius-md);
  background-color: var(--key-background-default);
  color: var(--key-text-default-color);
  transition: transform var(--transition-fast),
              background-color var(--transition-fast);
  cursor: pointer;
  user-select: none;

  &.keyboard-key-special {
    flex-grow: 1.5;
    max-width: var(--key-width-large);
    font-size: clamp(0.7rem, 2.5vw, 0.9rem);
  }

  &:active {
    transform: scale(0.92);
    background-color: var(--color-accent);
    color: var(--color-on-accent);
  }

  // Status-specific styles
  &.keyboard-key-correct {
    background-color: var(--key-background-correct);
    color: var(--key-text-correct);
    border-color: var(--key-border-correct);
  }

  &.keyboard-key-present {
    background-color: var(--key-background-present);
    color: var(--key-text-present);
    border-color: var(--key-border-present);
  }

  &.keyboard-key-absent {
    background-color: var(--key-background-absent);
    color: var(--key-text-absent);
    border-color: var(--key-border-absent);
  }

  @media (max-width: $breakpoint-sm) {
    height: clamp(50px, 12vw, 58px);
  }
}
```

### Header & Layout Styles

```scss
// packages/client/src/styles/components/_layout.scss
@import '../theme/variables';

// Header is already styled in main.scss, but can be extended here

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--spacing-md) 0;
  margin-bottom: var(--spacing-lg);
}

.footer {
  padding: var(--spacing-md) 0;
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-on-background);
  opacity: 0.7;
}
```

## 5. Style Import Management

Update the main SCSS file to import new component styles:

```scss
// packages/client/src/styles/main.scss
// Add these imports after existing imports

// Component styles
@import './components/tile';
@import './components/gameboard';
@import './components/keyboard';
@import './components/layout';
```

## 6. Accessibility Considerations

- Use appropriate ARIA attributes for components
- Ensure proper keyboard navigation
- Provide descriptive labels for screen readers
- Maintain adequate color contrast
- Ensure touch targets meet minimum size requirements (44×44px)

## 7. Mobile-First Implementation

Leverage the existing responsive foundation:

1. Use established breakpoints in `_variables.scss`
2. Implement relative units and flexible layouts
3. Test across multiple viewport sizes
4. Ensure components adapt correctly on mobile devices

## 8. Testing Strategy

1. **Component Testing**:

    - Unit tests for core components using Vitest
    - Test components with different prop combinations
2. **Accessibility Testing**:

    - Verify keyboard navigation
    - Check color contrast
    - Test with screen readers
3. **Responsive Testing**:

    - Test on various viewport sizes
    - Verify layout adjustments work correctly

## 9. Implementation Steps

1. **Set up TypeScript interfaces**
    - Define interfaces for component props
    - Set up shared game types
2. **Implement core components**
    - Create Tile component and styles
    - Build Row component
    - Develop GameBoard component
    - Implement Keyboard component
3. **Create basic layout**
    - Set up Header
    - Add static App structure
4. **Add styling and animations**
    - Implement component-specific styles
    - Add animations for tile flipping
    - Style keyboard interactions
5. **Test and refine**
    - Test across devices
    - Verify accessibility
    - Make responsive adjustments

## 10. Success Criteria

Phase 1 will be considered complete when:
1. All core UI components are implemented with TypeScript interfaces
2. Components render correctly with static data
3. Styles match the Material 3 Expressive design system
4. Layouts are responsive across device sizes
5. Basic animations (tile flip, keyboard feedback) work correctly
6. Components pass accessibility checks
