/**
 * Notification System Component
 * 
 * Displays toast notifications for game events, errors, and system messages.
 * Supports different notification types (success, error, info) and auto-dismissal.
 */
import { createPortal } from 'react-dom';
import useNotifications from '../../hooks/useNotifications';

interface NotificationSystemProps {
  position?: 'top' | 'bottom';
}

const NotificationSystem = ({ position = 'top' }: NotificationSystemProps) => {
  const { notifications, removeNotification } = useNotifications();

  // Create portal for notifications
  const notificationRoot = document.getElementById('notification-root');
  if (!notificationRoot) return null;

  return createPortal(
    <div className={`notification-container notification-${position}`} aria-live="polite">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`notification notification-${notification.type}`}
          role={notification.type === 'error' ? 'alert' : 'status'}
        >
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
          </div>
          {notification.dismissable && (
            <button 
              className="notification-close"
              onClick={() => removeNotification(notification.id)}
              aria-label="Close notification"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>,
    notificationRoot
  );
};

export default NotificationSystem;
