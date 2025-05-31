/**
 * Help Modal Component
 * 
 * Displays game instructions and rules for the F&B Wordle game.
 */
import { useState, useEffect } from 'react';
import Dialog from './Dialog';
import type { TileState } from '../../types/game';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  const [activeTab, setActiveTab] = useState<'howToPlay' | 'examples' | 'about'>('howToPlay');

  // Close modal with escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Example tiles for demonstration
  const renderExampleTile = (letter: string, state: TileState) => (
    <div className={`tile tile-${state}`}>
      <span className="tile-letter">{letter}</span>
    </div>
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="How to Play"
      className="help-modal"
      aria-labelledby="help-modal-title"
    >
      <div className="help-modal-tabs">
        <button
          className={`tab-button ${activeTab === 'howToPlay' ? 'active' : ''}`}
          onClick={() => setActiveTab('howToPlay')}
        >
          How to Play
        </button>
        <button
          className={`tab-button ${activeTab === 'examples' ? 'active' : ''}`}
          onClick={() => setActiveTab('examples')}
        >
          Examples
        </button>
        <button
          className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
      </div>

      <div className="help-modal-content">
        {activeTab === 'howToPlay' && (
          <div className="how-to-play">
            <h3>Game Rules</h3>
            <ul>
              <li>Guess the F&B WORDLE in 6 tries.</li>
              <li>Each guess must be a valid 5-letter food & beverage industry term.</li>
              <li>The color of the tiles will change to show how close your guess was.</li>
              <li>A new word is available each day.</li>
            </ul>
            <h3>Food & Beverage Terms</h3>
            <p>
              All words are related to the food and beverage industry, including ingredients, 
              cooking techniques, equipment, and culinary terms.
            </p>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="examples">
            <div className="example">
              <div className="example-row">
                {renderExampleTile('S', 'correct')}
                {renderExampleTile('A', 'empty')}
                {renderExampleTile('U', 'empty')}
                {renderExampleTile('T', 'empty')}
                {renderExampleTile('E', 'empty')}
              </div>
              <p>The letter S is in the word and in the correct spot.</p>
            </div>

            <div className="example">
              <div className="example-row">
                {renderExampleTile('B', 'empty')}
                {renderExampleTile('R', 'present')}
                {renderExampleTile('I', 'empty')}
                {renderExampleTile('N', 'empty')}
                {renderExampleTile('E', 'empty')}
              </div>
              <p>The letter R is in the word but in the wrong spot.</p>
            </div>

            <div className="example">
              <div className="example-row">
                {renderExampleTile('C', 'empty')}
                {renderExampleTile('R', 'empty')}
                {renderExampleTile('E', 'empty')}
                {renderExampleTile('P', 'absent')}
                {renderExampleTile('E', 'empty')}
              </div>
              <p>The letter P is not in the word in any spot.</p>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="about">
            <h3>About F&B Wordle</h3>
            <p>
              F&B Wordle is a food and beverage industry-themed word guessing game inspired by the 
              original Wordle game. It features a curated dictionary of over 3,000 culinary terms.
            </p>
            <p>
              This game was created for food and beverage professionals to test their industry 
              knowledge while enjoying a fun word puzzle.
            </p>
            <h3>Credits</h3>
            <p>
              Developed as a progressive web application using React and TypeScript.
              Deployed on Azure cloud infrastructure.
            </p>
            <p>© 2025 F&B Wordle</p>
          </div>
        )}
      </div>

      <div className="dialog-footer">
        <button className="btn btn-primary" onClick={onClose}>
          Got it
        </button>
      </div>
    </Dialog>
  );
};

export default HelpModal;
