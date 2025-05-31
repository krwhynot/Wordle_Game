import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import './NameEntryModal.scss';

/**
 * NameEntryModal Component
 * 
 * Displays a modal for collecting the player's name before starting the game.
 * Includes validation, animations, and accessibility features.
 */
interface NameEntryModalProps {
  onSubmit: (name: string) => void;
  isOpen?: boolean;
}

const NameEntryModal: FC<NameEntryModalProps> = ({ onSubmit, isOpen = true }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [animation, setAnimation] = useState<'in' | 'out'>('in');

  // Clear error message when the user starts typing
  useEffect(() => {
    if (error && name.length > 0) {
      setError('');
    }
  }, [name, error]);
  
  // Focus the input field when the modal opens
  useEffect(() => {
    if (isOpen) {
      const inputEl = document.querySelector('.name-modal input') as HTMLInputElement;
      if (inputEl) {
        setTimeout(() => inputEl.focus(), 300); // After animation completes
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    
    if (trimmedName === '') {
      setError('Please enter your name');
      return;
    }
    
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    
    setAnimation('out');
    setTimeout(() => onSubmit(trimmedName), 250); // Match animation duration
  };

  if (!isOpen) return null;

  return (
    <div className="name-modal-overlay" data-testid="name-modal-overlay">
      <div 
        className={`name-modal ${animation === 'out' ? 'closing' : ''}`} 
        onClick={(e) => e.stopPropagation()}
        aria-labelledby="modal-title"
        role="dialog"
      >
        <h2 id="modal-title">Welcome to F&B Wordle!</h2>
        <p>Enter your name to start playing this Food & Beverage themed word game.</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="Your name"
            aria-label="Player Name"
            data-testid="name-input"
            autoComplete="nickname"
            aria-invalid={!!error}
            aria-describedby={error ? "name-error" : undefined}
          />
          
          {error && (
            <div className="error-message" id="name-error" role="alert">
              {error}
            </div>
          )}
          
          <button 
            className="btn primary" 
            type="submit"
            data-testid="start-button"
          >
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameEntryModal;
