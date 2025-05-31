import { useState } from 'react';
import type { FC, FormEvent } from 'react';

interface NameEntryModalProps {
  onSubmit: (name: string) => void;
}

const NameEntryModal: FC<NameEntryModalProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim() === '') {
      setError('Name cannot be empty');
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <div className="name-modal-overlay">
      <div className="name-modal" onClick={e => e.stopPropagation()}>
        <h2>Enter Your Name</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={20}
            placeholder="Your name"
            aria-label="Player Name"
          />
          {error && <div className="error-message">{error}</div>}
          <button className="btn" type="submit">Start Game</button>
        </form>
      </div>
    </div>
  );
};

export default NameEntryModal;
