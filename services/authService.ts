import type { User } from '../types';

interface LoginCredentials {
  username?: string;
  password?: string;
}

export const login = async ({ username, password }: LoginCredentials): Promise<User> => {
  if (!username || !password) {
    throw new Error('Username and password are required.');
  }

  // This now calls a backend API endpoint instead of reading a local file.
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Re-throw the error message from the backend API.
    throw new Error(data.error || 'Invalid username or password.');
  }

  // The backend API is expected to return the user object (without password).
  return data as User;
};
