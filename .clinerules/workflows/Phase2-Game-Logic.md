Phase 2: Game Logic Architecture
Implement Context API State Management
File Structure/Organization

src/context/ - Primary directory for all Context providers

GameContext.tsx - Core game state (current word, guesses, game status)
KeyboardContext.tsx - Keyboard state (key status, interactions)
StatsContext.tsx - Game statistics tracking


src/hooks/ - Custom hooks that consume context

useGame.ts - Hook for accessing game state and actions
useKeyboard.ts - Hook for keyboard interactions


src/types/context.ts - TypeScript interfaces for context state and actions

Architectural Approach

Provider Pattern: Creating provider components that wrap the application
State Centralization: Moving game state from components to context
Reducer Pattern: Using reducers to handle complex state transitions
Action Creator Pattern: Defining typed action creators for state mutations
Context Composition: Structuring context hierarchy to prevent unnecessary re-renders

High-Level Methods/Functions

State initialization functions that set up default game state
Action dispatcher methods that trigger state changes (e.g., "submitGuess", "addLetter")
Game status evaluation functions that determine if game is won, lost, or in progress
Context selector methods that extract specific pieces of state
State persistence methods that save/retrieve game state from local storage

Create Guess Validation Logic
File Structure/Organization

src/utils/validation/ - Validation utility directory

wordValidator.ts - Word validation functions
dictionaryService.ts - Dictionary lookup service


src/constants/ - Game constants

gameRules.ts - Game rules including word length


src/hooks/useWordValidation.ts - Custom hook for validation logic

Architectural Approach

Service Layer Pattern: Separating API calls from validation logic
Strategy Pattern: Different validation strategies for different requirements
Chain of Responsibility: Sequential validation checks
Pure Function Approach: Implementing validation as pure functions
Error Handling Strategy: Structured approach to validation errors

High-Level Methods/Functions

Word length validation function that ensures word matches required length
Dictionary validation function that checks if word exists in dictionary
Input sanitization function that normalizes input (e.g., case normalization)
Error message generation function for different validation failures
API integration function that interfaces with backend dictionary service

Build Letter Evaluation Algorithm
File Structure/Organization

src/utils/gameLogic/ - Game logic utilities

evaluationAlgorithm.ts - Core evaluation logic
letterStatus.ts - Letter status definitions and utilities


src/types/game.ts - Type definitions for evaluation results
src/constants/statusTypes.ts - Constants for letter statuses

Architectural Approach

Two-Pass Algorithm: Separating exact matches and partial matches evaluation
Immutable State Approach: Creating new state rather than mutating
Factory Pattern: Creating evaluation result objects
Memento Pattern: Tracking historical evaluations
State Pattern: Representing letter statuses as state objects

High-Level Methods/Functions

Word comparison function that evaluates guess against solution
Letter status determination function that assigns correct/present/absent status
Duplicate letter handling function that resolves ambiguity with repeated letters
Status aggregation function that combines letter statuses for keyboard feedback
Evaluation result factory function that creates structured evaluation objects

Develop Keyboard Interaction
File Structure/Organization

src/components/game/Keyboard.tsx - Keyboard component
src/hooks/ - Custom interaction hooks

useKeyboardInput.ts - Physical keyboard event handling
useVirtualKeyboard.ts - Virtual keyboard interaction


src/utils/input/ - Input handling utilities

keyboardMapper.ts - Key mapping utilities


src/context/KeyboardContext.tsx - Keyboard state management

Architectural Approach

Observer Pattern: Listening to keyboard events
Adapter Pattern: Normalizing different input sources
Command Pattern: Translating key presses into game actions
Proxy Pattern: Mediating between physical and virtual keyboard
Pub/Sub Pattern: Broadcasting key events to interested components

High-Level Methods/Functions

Key press handler function that processes physical keyboard input
Virtual key press function that handles on-screen keyboard interaction
Input validation function that filters valid key inputs
Key mapping function that converts key codes to game actions
Key state tracking function that maintains keyboard visual feedback

Add Animations and Transitions
File Structure/Organization

src/styles/animations/ - Animation definitions

_keyframes.scss - CSS keyframe definitions
_transitions.scss - Transition utilities


src/hooks/ - Animation control hooks

useAnimationSequence.ts - Coordinated animation sequencing
useTransition.ts - Transition state management


src/utils/animation/ - Animation utilities

animationScheduler.ts - Timing and scheduling



Architectural Approach

State Machine Pattern: Managing animation states and transitions
Coordinator Pattern: Orchestrating sequences of animations
Composite Pattern: Building complex animations from simple ones
Facade Pattern: Simplifying animation API for components
Dependency Inversion: Abstracting animation implementation details

High-Level Methods/Functions

Animation state controller function that manages animation state
Sequencing function that coordinates multiple animations
Staggered animation scheduler that introduces delays between animations
Animation completion handler that manages post-animation state
Transition trigger function that initiates CSS transitions based on state

This architecture provides a foundation for implementing the game logic of a Wordle clone with maintainable, modular code organization and clear separation of concerns.
