/**
 * Notification Context
 * 
 * Provides a global notification system for the application.
 * Allows components to show toast notifications from anywhere.
 */
import { createContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number; // Duration in milliseconds
  dismissable?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  showSuccess: (message: string, options?: Partial<Omit<Notification, 'id' | 'message' | 'type'>>) => string;
  showError: (message: string, options?: Partial<Omit<Notification, 'id' | 'message' | 'type'>>) => string;
  showInfo: (message: string, options?: Partial<Omit<Notification, 'id' | 'message' | 'type'>>) => string;
  showWarning: (message: string, options?: Partial<Omit<Notification, 'id' | 'message' | 'type'>>) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate a unique ID for each notification
  const generateId = () => `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add a new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const newNotification = {
      id: generateId(),
      duration: 3000, // Default duration
      dismissable: true, // Default dismissable
      ...notification,
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return newNotification.id;
  }, []);

  // Remove a notification by ID
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Shorthand methods for common notification types
  const showSuccess = useCallback((message: string, options = {}) => {
    return addNotification({ message, type: 'success', ...options });
  }, [addNotification]);

  const showError = useCallback((message: string, options = {}) => {
    return addNotification({ message, type: 'error', ...options });
  }, [addNotification]);

  const showInfo = useCallback((message: string, options = {}) => {
    return addNotification({ message, type: 'info', ...options });
  }, [addNotification]);

  const showWarning = useCallback((message: string, options = {}) => {
    return addNotification({ message, type: 'warning', ...options });
  }, [addNotification]);

  // Auto-dismiss notifications based on their duration
  useEffect(() => {
    const timers: number[] = [];
    
    notifications.forEach(notification => {
      if (notification.duration && notification.duration > 0) {
        const timer = window.setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);
        
        timers.push(timer);
      }
    });
    
    return () => {
      timers.forEach(timer => window.clearTimeout(timer));
    };
  }, [notifications, removeNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
