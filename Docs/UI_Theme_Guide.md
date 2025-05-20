Infusing Your Wordle Clone with a Vibrant Material 3 Expressive Design (Turquoise & Tangerine Edition)
This guide details how to transform your Wordle clone's frontend, using your React, TypeScript, and SCSS setup, to embody Android 16's Material 3 Expressive design principles with your chosen color palette: Primary: #06D6A0 (Turquoise), Accent: #FFA552 (Tangerine), and Background: #EFF6F5.

🎨 Step 1: Establish Your Wordle Color Scheme
1.1 Define Core SCSS Color Variables (Optional but good for reference):
While we'll primarily use CSS Custom Properties for dynamic theming, defining SCSS variables first can help in your design process and for any SCSS-specific logic (like color functions).

Create/update client/src/styles/_variables.scss:

SCSS

// client/src/styles/_variables.scss
$color-primary-turquoise: #06D6A0;
$color-accent-tangerine: #FFA552;
$color-background-main: #EFF6F5;
$color-surface-white: #FFFFFF; // For cards, modals if they differ from main background
$color-on-primary-text: #FFFFFF; // Text on Turquoise
$color-on-accent-text: #000000;  // Text on Tangerine
$color-on-background-text: #1B1B1E; // Main text color

// Wordle-specific status colors (suggestions, can be adjusted)
$color-tile-correct: $color-primary-turquoise;
$color-tile-present: $color-accent-tangerine;
$color-tile-absent: #787c7e; // A neutral grey often works best for 'absent'
$color-tile-text-status: $color-on-primary-text; // Assuming white text for all statuses for simplicity
1.2 Implement CSS Custom Properties for Dynamic Theming in Wordle:
In client/src/styles/_theme.scss (or directly in App.scss after importing _variables.scss), set up CSS Custom Properties. This is key for applying themes and potential future theme switching (e.g., dark mode).

SCSS

// client/src/styles/_theme.scss (Import this into App.scss or index.scss)

:root {
  // Core Palette
  --color-primary: #06D6A0;        // Turquoise
  --color-accent: #FFA552;         // Tangerine
  --color-background: #EFF6F5;     // Light Grayish Blue/Green
  --color-surface: #FFFFFF;        // Pure White for elevated surfaces like modals, cards
  --color-on-primary: #FFFFFF;     // Text on Turquoise
  --color-on-accent: #000000;      // Text on Tangerine
  --color-on-background: #1B1B1E;   // Dark text on light background
  --color-on-surface: #1B1B1E;     // Dark text on white surface

  // Wordle UI Elements
  --header-background: var(--color-surface);
  --header-text-color: var(--color-on-surface);
  --header-border-color: #d3d6da; // Light grey border

  // Tiles
  --tile-background-default: var(--color-surface); // Before guess, or empty
  --tile-border-default: #d3d6da;                  // Border for default/empty tiles
  --tile-border-active: var(--color-primary);       // Border for current input tile (Turquoise)
  --tile-text-default-color: var(--color-on-surface);

  // Tile Statuses (using your palette)
  --tile-background-correct: var(--color-primary);      // Turquoise for correct
  --tile-text-correct: var(--color-on-primary);
  --tile-border-correct: var(--color-primary);

  --tile-background-present: var(--color-accent);       // Tangerine for present
  --tile-text-present: var(--color-on-accent);
  --tile-border-present: var(--color-accent);

  --tile-background-absent: #787c7e;                  // Neutral gray for absent
  --tile-text-absent: #FFFFFF;
  --tile-border-absent: #787c7e;

  // Keyboard
  --key-background-default: #d3d6da; // Light gray for default keys
  --key-text-default-color: var(--color-on-background);
  --key-border-default: #d3d6da;

  --key-background-correct: var(--tile-background-correct);
  --key-text-correct: var(--tile-text-correct);
  --key-border-correct: var(--tile-border-correct);

  --key-background-present: var(--tile-background-present);
  --key-text-present: var(--tile-text-present);
  --key-border-present: var(--tile-border-present);

  --key-background-absent: var(--tile-background-absent);
  --key-text-absent: var(--tile-text-absent);
  --key-border-absent: var(--tile-border-absent);

  // Modals
  --modal-background: var(--color-surface);
  --modal-text-color: var(--color-on-surface);
  --modal-backdrop-color: rgba(27, 27, 30, 0.3); // Darker overlay for backdrop
}

// Example of a dark theme structure (if you implement ThemeContext later)
/*
[data-theme='dark'] {
  --color-primary: #06D6A0; // Turquoise might need slight adjustment for dark mode if too bright
  --color-accent: #FFA552;  // Tangerine might need slight adjustment
  --color-background: #1B1B1E;
  --color-surface: #2C2C2E;
  --color-on-primary: #000000; // Or a very dark gray
  --color-on-accent: #000000;
  --color-on-background: #E4E4E6;

  // ... redefine all other variables for dark mode ...
  --header-background: var(--color-surface);
  --header-text-color: var(--color-on-surface);
  --header-border-color: #3A3A3C; // Darker border

  --tile-background-default: var(--color-surface);
  --tile-border-default: #3A3A3C;
  --tile-border-active: var(--color-primary);
  --tile-text-default-color: var(--color-on-surface);

  --tile-background-absent: #3A3A3C;
  --tile-text-absent: #E4E4E6;
  --tile-border-absent: #3A3A3C;

  --key-background-default: #4B4B4E;
  --key-text-default-color: var(--color-on-background);
  --key-border-default: #4B4B4E;

  --modal-background: var(--color-surface);
  --modal-text-color: var(--color-on-surface);
  --modal-backdrop-color: rgba(0, 0, 0, 0.5);
}
*/
1.3 Apply Colors Across Wordle Components:
Utilize the defined CSS custom properties in your SCSS files.

SCSS

// client/src/App.scss (ensure _theme.scss is imported)
body {
  background-color: var(--color-background);
  color: var(--color-on-background);
  font-family: 'Roboto', sans-serif; // Set a base font
}

// client/src/components/layout/Header.scss
.header {
  background-color: var(--header-background);
  color: var(--header-text-color);
  border-bottom: 1px solid var(--header-border-color);
  // ... other styles
}

// client/src/components/game/Tile.scss
.tile {
  background-color: var(--tile-background-default);
  color: var(--tile-text-default-color);
  border: 2px solid var(--tile-border-default);
  // ... other styles

  &.correct {
    background-color: var(--tile-background-correct);
    color: var(--tile-text-correct);
    border-color: var(--tile-border-correct);
  }
  &.present {
    background-color: var(--tile-background-present);
    color: var(--tile-text-present);
    border-color: var(--tile-border-present);
  }
  &.absent {
    background-color: var(--tile-background-absent);
    color: var(--tile-text-absent);
    border-color: var(--tile-border-absent);
  }
  &.active-input { // Example for the tile currently being typed into
    border-color: var(--tile-border-active);
    box-shadow: 0 0 0 2px var(--tile-border-active); // Outer glow
  }
}

// client/src/components/game/Keyboard.scss (or Key.scss)
.keyboard-key {
  background-color: var(--key-background-default);
  color: var(--key-text-default-color);
  border: 1px solid var(--key-border-default);
  // ... other styles

  &.correct { // Applied after a letter is confirmed correct
    background-color: var(--key-background-correct);
    color: var(--key-text-correct);
    border-color: var(--key-border-correct);
  }
  // ... .present, .absent styles for keyboard keys
}
🖼️ Step 2: Embrace Material 3 Expressive Design Principles for Wordle
2.1 Typography:
Adopt expressive typography to enhance readability for the game title, tile letters, and keyboard.

Game Title (Header.tsx): Use a bold, slightly larger, and perhaps more stylized font.
Tile/Keyboard Letters (Tile.tsx, Keyboard.tsx): Very clear, legible, and bold sans-serif font.
Feedback Messages (e.g., Toast.tsx): Standard readable body font.
Example in SCSS:

SCSS

// client/src/styles/_typography.scss (import this into App.scss or index.scss)
body {
  font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif; // Modern, clean default
  line-height: 1.6;
}

// In Header.scss
.header h1 {
  font-family: 'Montserrat', 'Roboto', sans-serif; // Example: A slightly more expressive font
  font-size: clamp(1.8rem, 5vw, 2.2rem); // Responsive font size
  font-weight: 700;
  color: var(--color-primary); // Turquoise title
  letter-spacing: 0.02em;
}

// In Tile.scss
.tile {
  font-size: clamp(1.8rem, 7vw, 2.2rem); // Large, clear letters
  font-weight: bold;
  text-transform: uppercase;
}

// In Keyboard.scss (or Key.scss)
.keyboard-key {
  font-size: clamp(0.8rem, 3vw, 1.1rem);
  font-weight: 600;
  text-transform: uppercase;
}

// In a Toast.scss for feedback messages
.toast-message {
  font-size: 0.9rem;
  line-height: 1.4;
}
2.2 Motion and Animations:
Implement spring-based or smooth ease-out animations for a fluid user experience.

Tile Reveal (Tile.tsx): Animate tiles with a flip and subtle bounce/scale effect. Stagger animations for tiles in a row.
Keyboard Interaction (Keyboard.tsx): Apply a slight scale transformation and quick background color change on key press.
Invalid Guess Shake (GameBoard.tsx -> Row.tsx): A quick, expressive shake.
Example CSS animations:

SCSS

// client/src/components/game/Tile.scss
@keyframes tileRevealFlip { // Wordle-style flip
  0% { transform: rotateX(0deg); background-color: var(--tile-background-default); }
  49% { background-color: var(--tile-background-default); } // Color changes at midpoint or end
  50% { transform: rotateX(90deg); /* Color changes here based on status class */ }
  100% { transform: rotateX(0deg); } // Flips back but shows the status color set by JS
}
@keyframes tilePopIn { // Gentle scale up for new letter input
  0% { transform: scale(0.8); }
  100% { transform: scale(1); }
}

.tile {
  &.reveal { // Class added to trigger flip for the whole row
    // The actual flip animation will be triggered by JS adding status class
    // This is more about the reveal sequence.
    // Example: JS adds .correct, .present, or .absent which sets the final bg color
    // and then the .flip class could be for the visual effect
  }
  &.pop { // When a letter is typed into a tile
    animation: tilePopIn 0.1s ease-out;
  }
}

// client/src/components/game/Keyboard.scss (or Key.scss)
.keyboard-key {
  transition: transform 0.1s ease-out, background-color 0.1s ease-out;
  &:active {
    transform: scale(0.92);
    background-color: var(--color-accent); // Tangerine flash on press
    color: var(--color-on-accent);
  }
}
The actual tile flip animation in Wordle is more complex: the tile flips, and its color changes during or after the flip to reflect its status. This is often handled by applying the status class (correct, present, absent) which sets the final background color, and an animation class (flipping) which does the rotateX.

2.3 Component Shapes (Rounded Corners):
Utilize rounded corners for a softer, more Material 3 aesthetic on tiles, keys, and modals.

SCSS

// client/src/components/game/Tile.scss
.tile {
  border-radius: 6px; // Softer rounded corners for tiles
  // box-shadow: 0 2px 4px rgba(0,0,0,0.05); // Subtle shadow for depth
}

// client/src/components/game/Keyboard.scss (or Key.scss)
.keyboard-key {
  border-radius: 8px; // Slightly more rounded for keys
  // box-shadow: 0 2px 3px rgba(0,0,0,0.1);
}

// client/src/components/ui/Modal.scss
.modal-content { // Already styled in the previous response
  border-radius: 16px; // Prominent rounding for modals
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
📱 Step 3: Enhance Wordle User Interface Components
3.1 Game Board (GameBoard.tsx):
Design with clear spacing and responsive layout. Ensure 5 columns for letters.

SCSS

// client/src/components/game/GameBoard.scss
.game-board {
  display: grid;
  grid-template-rows: repeat(6, 1fr); // 6 attempts
  gap: 6px; // Space between rows
  padding: 10px; // Padding around the board
  width: clamp(280px, 90vw, 350px); // Responsive width
  max-height: 420px; // Max height to prevent overflow
  margin: 1rem auto; // Center the board
}

.row { // Style for each row of tiles within GameBoard.tsx
  display: grid;
  grid-template-columns: repeat(5, 1fr); // ALWAYS 5 columns for Wordle
  gap: 6px; // Space between tiles in a row
}
3.2 Keyboard (Keyboard.tsx):
Style for intuitive interaction, ensuring keys are adequately sized.

SCSS

// client/src/components/game/Keyboard.scss
.keyboard {
  display: flex;
  flex-direction: column; // Rows of keys stacked vertically
  gap: 8px; // Space between keyboard rows
  padding: 8px;
  align-items: center; // Center rows if they have different widths (e.g. last row)
}
.keyboard-row {
  display: flex;
  justify-content: center; // Center keys within the row
  gap: 6px; // Space between keys in a row
  width: 100%; // Make rows take full available width for centering
}
.keyboard-key {
  padding: 0; // Remove padding if using fixed height/width and flex for content
  height: 58px;
  flex-grow: 1; // Allow keys to grow, or set a fixed width and use margin auto for Enter/Backspace
  max-width: 45px; // Max width for letter keys
  display: flex;
  justify-content: center;
  align-items: center;
  // ... border-radius, font styles from above
  cursor: pointer;
  user-select: none;

  &.special { // For Enter/Backspace keys
    flex-grow: 1.5;
    max-width: 70px;
  }
}
3.3 Modals and Overlays (e.g., Instructions.tsx, Statistics.tsx wrapped in Modal.tsx):
Incorporate backdrop blur effects.

SCSS

// client/src/components/ui/Modal.scss
.modal-overlay {
  // ... (position fixed, top, left, width, height, z-index)
  background-color: var(--modal-backdrop-color); // Use the themed backdrop color
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: var(--modal-background);
  color: var(--modal-text-color);
  padding: 24px;
  border-radius: 16px; // From Step 2.3
  // ...
}
🌐 Step 4: Ensure Responsiveness and Accessibility
4.1 Responsive Design:
Adapt tile, key, and font sizes. The Wordle game board itself should always maintain 5 columns for a 5-letter game.

SCSS

// client/src/components/game/GameBoard.scss
.game-board {
  // width and max-height already have clamp() for responsiveness
}

// client/src/components/game/Tile.scss
.tile {
  // width/height can be managed by the grid layout in .row
  // font-size already has clamp()
}

// client/src/components/game/Keyboard.scss
.keyboard-key {
  height: clamp(50px, 12vw, 58px); // Responsive key height
  // min-width also important for touch targets, adjust with clamp or media queries
  // flex-grow helps with width distribution

  &.special {
    // Adjust flex-grow or width for special keys on smaller screens if needed
  }
}

// Example media query for very small screens if needed
@media (max-width: 360px) {
  .keyboard { gap: 5px; }
  .keyboard-row { gap: 4px; }
  .keyboard-key { height: 45px; /* further reduce key height */ }
  .header h1 { font-size: 1.5rem; }
}
4.2 Accessibility Considerations:

Color Contrast: With Turquoise and Tangerine, ensure:
--color-on-primary (#FFFFFF) has enough contrast on --color-primary (#06D6A0). (Check this, white on bright turquoise can be tricky).
--color-on-accent (#000000) has enough contrast on --color-accent (#FFA552). (This should be fine).
--tile-text-absent on --tile-background-absent has good contrast.
Focus Indicators: Use the vibrant --color-accent (Tangerine) or a thickened border of --color-primary for highly visible focus states on keyboard keys and any interactive UI elements.
SCSS

.keyboard-key:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--color-accent-transparent); // transparent version of accent
}
ARIA Labels:
GameBoard.tsx: role="grid", aria-label="Wordle game board".
Each row: role="row".
Tile.tsx: role="gridcell", aria-label dynamically updated (e.g., "Tile 1, A, present"). aria-live regions for announcing row results or game status.
Keyboard.tsx keys (buttons): <button aria-label="Key Q">Q</button>, <button aria-label="Enter guess">Enter</button>.
🔧 Step 5: Integrate with React Components (Theme Management)
5.1 Context API for Theme Management (ThemeContext.tsx):
Your client/src/context/ThemeContext.tsx should allow switching between 'light' (your default Turquoise/Tangerine on light background) and a potential 'dark' theme.

TypeScript

// client/src/context/ThemeContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface ThemeContextType {
  theme: string; // 'light' or 'dark'
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('wordle-theme');
    if (storedTheme) return storedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wordle-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => { // Custom hook to use the theme context
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
Wrap your App in ThemeProvider in client/src/index.tsx or client/src/App.tsx.

5.2 Applying Themes in Components:
Most theming will be handled by the CSS custom properties reacting to the data-theme attribute. Components would primarily use useTheme() for:

Displaying a theme toggle button.
Conditionally rendering different icons or assets for light/dark mode if needed.
✅ Final Thoughts
By meticulously applying these steps, your Wordle clone will not only be functional but also a delight to use, showcasing the vibrant and playful essence of Material 3 Expressive design with your unique Turquoise and Tangerine color palette. The key is consistency in applying these styles and ensuring all interactive elements feel responsive and engaging. Remember to test thoroughly for visual appeal and accessibility!
