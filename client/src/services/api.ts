/**
 * API Service Module
 * 
 * Provides core API functionality for the Wordle Game.
 * Handles communication with backend services, error handling,
 * and request/response formatting.
 */

// API configuration
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:7071';
const USE_MOCK_API = import.meta.env.VITE_APP_ENABLE_MOCK_API === 'true';

// Common headers for API requests
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * Type definitions for API responses
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Creates a full URL for an API endpoint
 * 
 * @param path - The API endpoint path
 * @returns The complete API URL
 */
export const createApiUrl = (path: string): string => {
  return `${API_URL}/api/${path}`;
};

/**
 * Generic API request function
 * 
 * @param url - The API endpoint URL
 * @param method - HTTP method
 * @param body - Optional request body
 * @returns Promise with the API response
 */
export const apiRequest = async <T>(
  url: string,
  method: string,
  body?: unknown
): Promise<ApiResponse<T>> => {
  try {
    // For GET requests with no body, don't include body in request
    const requestOptions: RequestInit = {
      method,
      headers: DEFAULT_HEADERS,
      credentials: 'include',
    };

    // Only add body for non-GET requests
    if (method !== 'GET' && body) {
      requestOptions.body = JSON.stringify(body);
    }

    // Make the fetch request
    const response = await fetch(url, requestOptions);
    
    // Parse the response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Return formatted response
    return {
      data: data as T,
      status: response.status
    };
  } catch (error) {
    console.error('API request error:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown API error',
      status: 500
    };
  }
};

/**
 * Helper functions for common HTTP methods
 */
export const get = <T>(path: string): Promise<ApiResponse<T>> => {
  return apiRequest<T>(createApiUrl(path), 'GET');
};

export const post = <T>(path: string, body: unknown): Promise<ApiResponse<T>> => {
  return apiRequest<T>(createApiUrl(path), 'POST', body);
};

export const put = <T>(path: string, body: unknown): Promise<ApiResponse<T>> => {
  return apiRequest<T>(createApiUrl(path), 'PUT', body);
};

export const del = <T>(path: string): Promise<ApiResponse<T>> => {
  return apiRequest<T>(createApiUrl(path), 'DELETE');
};
