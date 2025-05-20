// This file exports all shared types and interfaces
// We'll add actual type definitions later

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    timestamp: string;
  };
}
