/**
 * Settings Modal Component
 * 
 * Allows users to configure game preferences and application settings.
 */
import { useEffect } from 'react';
import Dialog from './Dialog';
import { useTheme } from '../../hooks/useTheme';
import { STORAGE_KEYS } from '../../utils/storage';
import useLocalStorage from '../../hooks/useLocalStorage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GameSettings {
  hardMode: boolean;
  highContrastMode: boolean;
  soundEffects: boolean;
  notifications: boolean;
}

const defaultSettings: GameSettings = {
  hardMode: false,
  highContrastMode: false,
  soundEffects: true,
  notifications: true
};

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useLocalStorage<GameSettings>(
    STORAGE_KEYS.SETTINGS, 
    defaultSettings
  );

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

  const handleSettingChange = (setting: keyof GameSettings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      className="settings-modal"
      aria-labelledby="settings-modal-title"
    >
      <div className="settings-list">
        <div className="settings-item">
          <div className="settings-item-text">
            <h3>Hard Mode</h3>
            <p>Any revealed hints must be used in subsequent guesses</p>
          </div>
          <div className="settings-item-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.hardMode}
                onChange={() => handleSettingChange('hardMode')}
                aria-label="Hard Mode"
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-item">
          <div className="settings-item-text">
            <h3>Dark Theme</h3>
            <p>Switch between light and dark color themes</p>
          </div>
          <div className="settings-item-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={toggleTheme}
                aria-label="Dark Theme"
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-item">
          <div className="settings-item-text">
            <h3>High Contrast Mode</h3>
            <p>For improved color vision accessibility</p>
          </div>
          <div className="settings-item-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.highContrastMode}
                onChange={() => handleSettingChange('highContrastMode')}
                aria-label="High Contrast Mode"
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-item">
          <div className="settings-item-text">
            <h3>Sound Effects</h3>
            <p>Play sounds during gameplay</p>
          </div>
          <div className="settings-item-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.soundEffects}
                onChange={() => handleSettingChange('soundEffects')}
                aria-label="Sound Effects"
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-item">
          <div className="settings-item-text">
            <h3>Notifications</h3>
            <p>Receive notifications for daily words</p>
          </div>
          <div className="settings-item-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => handleSettingChange('notifications')}
                aria-label="Notifications"
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h3>About F&B Wordle</h3>
        <p>Version 1.0.0</p>
        <p>© 2025 F&B Wordle</p>
        <div className="links">
          <a href="#" onClick={(e) => { e.preventDefault(); /* Open feedback form */ }}>
            Feedback
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); /* Open privacy policy */ }}>
            Privacy Policy
          </a>
        </div>
      </div>

      <div className="dialog-footer">
        <button className="btn btn-primary" onClick={onClose}>
          Close
        </button>
      </div>
    </Dialog>
  );
};

export default SettingsModal;
