/**
 * useNotifications Hook
 * 
 * Custom hook for accessing the notification context.
 * Provides methods for showing different types of notifications.
 */
import { useContext } from 'react';
import NotificationContext from '../contexts/NotificationContext';

/**
 * Hook to access notification functionality throughout the application
 * @returns Notification context with methods for showing notifications
 */
const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
};

export default useNotifications;
